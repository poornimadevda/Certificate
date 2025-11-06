"""
MongoDB Collections for ChainLearn
Note: MongoDB is schemaless, but we define collection structures here for reference
"""

from datetime import datetime
from bson import ObjectId

# Collection names
COLLECTIONS = {
    'users': 'users',
    'courses': 'courses',
    'certificates': 'certificates',
    'grades': 'grades',
    'blockchain_transactions': 'blockchain_transactions'
}

def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    
    if isinstance(doc, dict):
        # Convert ObjectId to string
        if '_id' in doc and isinstance(doc['_id'], ObjectId):
            doc['id'] = str(doc['_id'])
            del doc['_id']
        
        # Convert datetime to ISO format string
        for key, value in doc.items():
            if isinstance(value, datetime):
                doc[key] = value.isoformat()
            elif isinstance(value, ObjectId):
                doc[key] = str(value)
        
        return doc
    
    return doc

def serialize_list(docs):
    """Convert list of MongoDB documents to JSON-serializable format"""
    return [serialize_doc(doc) for doc in docs]

# Collection schemas (for reference - MongoDB is schemaless)
"""
User Collection Schema:
{
    "_id": ObjectId,
    "email": str (unique),
    "name": str,
    "role": str,  # 'admin', 'teacher', 'student'
    "password_hash": str,
    "created_at": datetime
}

Course Collection Schema:
{
    "_id": ObjectId,
    "name": str,
    "description": str,
    "instructor_id": str (ObjectId reference to users),
    "created_at": datetime
}

Certificate Collection Schema:
{
    "_id": ObjectId,
    "certificate_id": str (unique),
    "student_id": str (ObjectId reference to users),
    "course_id": str (ObjectId reference to courses),
    "grade": str,
    "score": int,
    "instructor_name": str,
    "issue_date": datetime,
    "blockchain_hash": str,
    "blockchain_block_number": int,
    "status": str,  # 'pending', 'issued', 'verified'
    "created_at": datetime
}

Grade Collection Schema:
{
    "_id": ObjectId,
    "student_id": str (ObjectId reference to users),
    "course_id": str (ObjectId reference to courses),
    "grade": str,
    "score": int,
    "feedback": str,
    "submission_date": datetime,
    "certificate_issued": bool,
    "created_at": datetime,
    "updated_at": datetime
}

BlockchainTransaction Collection Schema:
{
    "_id": ObjectId,
    "certificate_id": str,
    "hash": str (unique),
    "block_number": int,
    "timestamp": datetime,
    "verified": bool
}
"""
