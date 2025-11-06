"""
Flask Backend API for ChainLearn - Blockchain Certificate Management System
MongoDB Version - NAYA WORKFLOW (Auto-issue/verify)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
import os
import hashlib

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Enable CORS for Next.js frontend
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# Initialize MongoDB
from database import init_db, get_db, close_db
from models import COLLECTIONS, serialize_doc, serialize_list
from blockchain_utils import generate_certificate_hash, submit_to_blockchain, verify_certificate_hash, get_blockchain_stats

# Initialize database on startup
init_db()


# --- UPDATED SEED FUNCTION ---
def seed_database():
    """Checks if DB is empty and adds demo data if it is."""
    db = get_db()
    users_collection = db[COLLECTIONS['users']]
    courses_collection = db[COLLECTIONS['courses']]
    
    teacher_id = None
    
    # Step 1: Seed Users (if empty)
    if users_collection.count_documents({}) == 0:
        print("[INFO] No users found. Seeding database with demo data...")
        
        # Hash passwords
        admin_pass = hashlib.sha256("admin123".encode()).hexdigest()
        teacher_pass = hashlib.sha256("teacher123".encode()).hexdigest()
        student_pass = hashlib.sha256("student123".encode()).hexdigest()
        
        # Create Users
        admin_user = {
            'email': 'admin@chainlearn.com', 'name': 'Admin User', 'role': 'admin', 
            'password_hash': admin_pass, 'created_at': datetime.utcnow()
        }
        teacher_user = {
            'email': 'teacher@chainlearn.com', 'name': 'Dr. Sarah Smith', 'role': 'teacher', 
            'password_hash': teacher_pass, 'created_at': datetime.utcnow()
        }
        student_user = {
            'email': 'student@chainlearn.com', 'name': 'Alice Johnson', 'role': 'student', 
            'password_hash': student_pass, 'created_at': datetime.utcnow()
        }
        
        users_result = users_collection.insert_many([admin_user, teacher_user, student_user])
        teacher_id = users_result.inserted_ids[1] # Get the ObjectId of the teacher
        print("[INFO] Database seeded with 3 users.")
    else:
        print("[INFO] Users found. Skipping user seed.")
        # Find existing teacher to link courses
        teacher = users_collection.find_one({'role': 'teacher'})
        if teacher:
            teacher_id = teacher['_id']

    # Step 2: Seed Courses (if empty)
    if courses_collection.count_documents({}) == 0:
        print("[INFO] No courses found. Seeding courses...")
        
        if not teacher_id:
            print("[WARN] No teacher found to assign courses. Seeding courses without instructor.")
            teacher_id_str = None
        else:
            teacher_id_str = str(teacher_id)

        course1 = {
            'name': 'Blockchain 101', 'description': 'Introduction to blockchain.', 
            'instructor_id': teacher_id_str, 'created_at': datetime.utcnow()
        }
        course2 = {
            'name': 'Web Development', 'description': 'Learn HTML, CSS, and React.', 
            'instructor_id': teacher_id_str, 'created_at': datetime.utcnow()
        }
        
        courses_collection.insert_many([course1, course2])
        print("[INFO] Database seeded with 2 courses.")
    else:
        print("[INFO] Courses found. Skipping course seed.")

# Call the seed function on startup
seed_database()
# --- END OF UPDATED SEED FUNCTION ---


# Helper functions
def get_collection(name):
    """Get MongoDB collection"""
    db = get_db()
    return db[COLLECTIONS[name]]

def to_object_id(id_str):
    """Convert string to ObjectId"""
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None

# ==================== Authentication Routes ====================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    users_collection = get_collection('users')
    user = users_collection.find_one({'email': email})
    
    if not user:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    if user['password_hash'] != password_hash:
        return jsonify({'error': 'Invalid email or password'}), 401
    
    user = serialize_doc(user)
    
    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role']
        },
        'token': 'demo_token_' + user['id']
    }), 200

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'student')
    
    if not email or not password or not name:
        return jsonify({'error': 'Email, password, and name are required'}), 400
    
    if '@' not in email:
        return jsonify({'error': 'Invalid email format'}), 400
    
    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    if role not in ['admin', 'teacher', 'student']:
        role = 'student'
    
    users_collection = get_collection('users')
    
    existing_user = users_collection.find_one({'email': email})
    if existing_user:
        return jsonify({'error': 'Email already registered'}), 400
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    user_data = {
        'email': email,
        'name': name,
        'role': role,
        'password_hash': password_hash,
        'created_at': datetime.utcnow()
    }
    
    result = users_collection.insert_one(user_data)
    user_data['_id'] = result.inserted_id
    user = serialize_doc(user_data)
    
    return jsonify({
        'success': True,
        'message': 'Registration successful',
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'role': user['role']
        }
    }), 201

# ==================== User Routes ====================

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users, optionally filter by role"""
    users_collection = get_collection('users')
    
    query = {}
    role = request.args.get('role')
    if role:
        query['role'] = role
        
    users = list(users_collection.find(query))
    users = serialize_list(users)
    
    return jsonify([{
        'id': u['id'],
        'email': u['email'],
        'name': u['name'],
        'role': u['role']
    } for u in users]), 200

# ==================== Course Routes ====================

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get all courses"""
    courses_collection = get_collection('courses')
    users_collection = get_collection('users')
    
    courses = list(courses_collection.find())
    courses_data = []
    
    for course in courses:
        course = serialize_doc(course)
        instructor = None
        if course.get('instructor_id'):
            instructor_id_obj = to_object_id(course['instructor_id'])
            if instructor_id_obj:
                instructor = users_collection.find_one({'_id': instructor_id_obj})
                instructor = serialize_doc(instructor) if instructor else None
        
        courses_data.append({
            'id': course['id'],
            'name': course['name'],
            'description': course.get('description', ''),
            'instructor_id': course.get('instructor_id'),
            'instructor_name': instructor['name'] if instructor else 'Unassigned',
        })
    
    return jsonify(courses_data), 200

# ==================== Grade Routes (UPDATED) ====================

def _auto_issue_and_verify_certificate(student_id_str, course_id_str, grade, score):
    """Internal function to issue and verify a certificate"""
    certificates_collection = get_collection('certificates')
    users_collection = get_collection('users')
    courses_collection = get_collection('courses')

    # Check if certificate already exists
    existing_cert = certificates_collection.find_one({
        'student_id': student_id_str,
        'course_id': course_id_str
    })

    certificate_id_obj = None
    certificate_data = {}
    
    student = users_collection.find_one({'_id': to_object_id(student_id_str)})
    course = courses_collection.find_one({'_id': to_object_id(course_id_str)})
    
    if not student or not course:
        return {'error': 'Student or Course not found'}

    student_name = student.get('name', 'N/A')
    course_name = course.get('name', 'N/A')
    
    # Get instructor name
    instructor_name = "Dr. Sarah Smith" # Default
    if course.get('instructor_id'):
        instructor_id_obj = to_object_id(course.get('instructor_id'))
        if instructor_id_obj:
            instructor = users_collection.find_one({'_id': instructor_id_obj})
            if instructor:
                instructor_name = instructor.get('name', 'Dr. Sarah Smith')

    issue_date = datetime.utcnow()

    if existing_cert:
        # Update existing certificate
        certificate_id_obj = existing_cert['_id']
        certificate_data = {
            'grade': grade,
            'score': score,
            'issue_date': issue_date,
            'status': 'issued' # Re-issue
        }
        certificates_collection.update_one({'_id': certificate_id_obj}, {'$set': certificate_data})
        certificate_data['certificate_id'] = existing_cert['certificate_id']
    else:
        # Create new certificate
        count = certificates_collection.count_documents({})
        cert_id_str = f"CERT-{datetime.now().year}-{str(count + 1).zfill(4)}-{course_name.upper()[:5]}"
        
        certificate_data = {
            'certificate_id': cert_id_str,
            'student_id': student_id_str,
            'course_id': course_id_str,
            'grade': grade,
            'score': score,
            'instructor_name': instructor_name,
            'issue_date': issue_date,
            'status': 'issued',
            'created_at': datetime.utcnow()
        }
        result = certificates_collection.insert_one(certificate_data)
        certificate_id_obj = result.inserted_id

    # --- Step 2: Auto-Verify on Blockchain ---
    
    # Re-fetch certificate data for hashing
    cert_to_hash = {
        'student_name': student_name,
        'course_name': course_name,
        'grade': grade,
        'issue_date': issue_date.isoformat(),
        'instructor_name': instructor_name
    }

    hash_result = submit_to_blockchain(
        certificate_id=certificate_data['certificate_id'],
        **cert_to_hash
    )
    
    # Update certificate with hash and verified status
    certificates_collection.update_one(
        {'_id': certificate_id_obj},
        {'$set': {
            'blockchain_hash': hash_result['hash'],
            'blockchain_block_number': hash_result['block_number'],
            'status': 'verified'
        }}
    )
    
    return {'success': True, 'hash': hash_result['hash']}

@app.route('/api/grades', methods=['POST'])
def create_or_update_grade():
    """
    Create or update a grade.
    NEW: This endpoint now AUTOMATICALLY issues and verifies the certificate.
    """
    data = request.json
    grades_collection = get_collection('grades')
    
    student_id_str = str(to_object_id(data.get('student_id')))
    course_id_str = str(to_object_id(data.get('course_id')))
    grade_val = data.get('grade')
    score_val = data.get('score')
    
    if not student_id_str or not course_id_str or not grade_val or score_val is None:
        return jsonify({'error': 'Student, Course, Grade, and Score are required'}), 400

    # --- Step 1: Create or Update Grade ---
    existing_grade = grades_collection.find_one({
        'student_id': student_id_str,
        'course_id': course_id_str
    })
    
    grade_data = {
        'student_id': student_id_str,
        'course_id': course_id_str,
        'grade': grade_val,
        'score': score_val,
        'feedback': data.get('feedback', ''),
        'certificate_issued': True, # Set to true as we are auto-issuing
        'updated_at': datetime.utcnow()
    }

    if existing_grade:
        grades_collection.update_one({'_id': existing_grade['_id']}, {'$set': grade_data})
    else:
        grade_data['created_at'] = datetime.utcnow()
        grade_data['submission_date'] = datetime.utcnow()
        grades_collection.insert_one(grade_data)

    # --- Step 2: Auto-Issue and Verify Certificate ---
    verification_result = _auto_issue_and_verify_certificate(
        student_id_str, 
        course_id_str, 
        grade_val, 
        score_val
    )
    
    if 'error' in verification_result:
        return jsonify({'error': f'Grade saved, but certificate issue failed: {verification_result["error"]}'}), 500

    return jsonify({
        'success': True,
        'message': f'Grade submitted and certificate verified with hash: {verification_result["hash"]}'
    }), 201

@app.route('/api/grades', methods=['GET'])
def get_grades():
    """Get all grades, with student and course names"""
    grades_collection = get_collection('grades')
    users_collection = get_collection('users')
    courses_collection = get_collection('courses')
    
    query = {}
    course_id = request.args.get('course_id')
    student_id = request.args.get('student_id')
    
    if course_id:
        query['course_id'] = str(to_object_id(course_id))
    if student_id:
        query['student_id'] = str(to_object_id(student_id))
    
    grades = list(grades_collection.find(query))
    grades_data = []
    
    for grade in grades:
        grade = serialize_doc(grade)
        
        student = users_collection.find_one({'_id': to_object_id(grade.get('student_id'))})
        course = courses_collection.find_one({'_id': to_object_id(grade.get('course_id'))})
        
        grades_data.append({
            'id': grade['id'],
            'student_id': grade.get('student_id'),
            'student_name': student.get('name') if student else 'N/A',
            'student_email': student.get('email') if student else 'N/A',
            'course_id': grade.get('course_id'),
            'course_name': course.get('name') if course else 'N/A',
            'grade': grade.get('grade'),
            'score': grade.get('score'),
            'feedback': grade.get('feedback'),
            'certificate_issued': grade.get('certificate_issued', False)
        })
    
    return jsonify(grades_data), 200

# ==================== Certificate Routes (Read-Only) ====================

@app.route('/api/certificates', methods=['GET'])
def get_certificates():
    """Get all certificates, with student and course names"""
    certificates_collection = get_collection('certificates')
    users_collection = get_collection('users')
    courses_collection = get_collection('courses')
    
    query = {}
    student_id = request.args.get('student_id')
    
    if student_id:
        student_id_obj = to_object_id(student_id)
        if student_id_obj:
            query['student_id'] = str(student_id_obj)
    
    certificates = list(certificates_collection.find(query))
    certificates_data = []
    
    for cert in certificates:
        cert = serialize_doc(cert)
        
        student = users_collection.find_one({'_id': to_object_id(cert.get('student_id'))})
        course = courses_collection.find_one({'_id': to_object_id(cert.get('course_id'))})
        
        certificates_data.append({
            'id': cert['id'],
            'certificate_id': cert.get('certificate_id'),
            'student_id': cert.get('student_id'),
            'student_name': student.get('name') if student else 'N/A',
            'student_email': student.get('email') if student else 'N/A',
            'course_id': cert.get('course_id'),
            'course_name': course.get('name') if course else 'N/A',
            'grade': cert.get('grade'),
            'score': cert.get('score'),
            'issue_date': cert.get('issue_date'),
            'blockchain_hash': cert.get('blockchain_hash'),
            'blockchain_block_number': cert.get('blockchain_block_number'),
            'status': cert.get('status', 'pending'),
            'instructor_name': cert.get('instructor_name')
        })
    
    return jsonify(certificates_data), 200

# ==================== Blockchain Routes ====================

@app.route('/api/blockchain/stats', methods=['GET'])
def get_blockchain_statistics():
    stats = get_blockchain_stats()
    return jsonify(stats), 200

@app.route('/api/blockchain/transactions', methods=['GET'])
def get_blockchain_transactions():
    transactions_collection = get_collection('blockchain_transactions')
    transactions = list(transactions_collection.find())
    transactions = serialize_list(transactions)
    
    return jsonify([{
        'certificate_id': t.get('certificate_id'),
        'hash': t.get('hash'),
        'block_number': t.get('block_number'),
        'timestamp': t.get('timestamp'),
        'verified': t.get('verified', True)
    } for t in transactions]), 200

# ==================== Health Check ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        db = get_db()
        db.command('ping')
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'database': db_status
    }), 200

# ==================== Main ====================

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)