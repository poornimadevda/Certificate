"""
Blockchain Utilities - Certificate Verification System
Python implementation matching the frontend blockchain.ts functionality
MongoDB Version
"""

from datetime import datetime
import hashlib
from database import get_db
from models import COLLECTIONS, serialize_doc

def generate_certificate_hash(certificate_data):
    """
    Generate SHA256 hash for certificate data
    Matches the frontend generateCertificateHash function
    """
    # Create a string from certificate data (same format as frontend)
    data_string = (
        str(certificate_data.get('student_name', '')) +
        str(certificate_data.get('course_name', '')) +
        str(certificate_data.get('grade', '')) +
        str(certificate_data.get('issue_date', '')) +
        str(certificate_data.get('instructor_name', ''))
    )
    
    # Generate SHA256 hash
    hash_object = hashlib.sha256(data_string.encode('utf-8'))
    hex_hash = hash_object.hexdigest()
    
    return hex_hash

def submit_to_blockchain(certificate_id, student_name, course_name, grade, issue_date, instructor_name):
    """
    Submit a certificate to the blockchain
    Returns transaction details including hash and block number
    """
    db = get_db()
    transactions_collection = db[COLLECTIONS['blockchain_transactions']]
    
    certificate_data = {
        'student_name': student_name,
        'course_name': course_name,
        'grade': grade,
        'issue_date': issue_date,
        'instructor_name': instructor_name
    }
    
    # Generate hash
    hash_value = generate_certificate_hash(certificate_data)
    
    # Get current block number
    last_transaction = transactions_collection.find_one(
        sort=[('block_number', -1)]
    )
    block_number = (last_transaction['block_number'] + 1) if last_transaction else 1
    
    # Create blockchain transaction
    transaction_data = {
        'certificate_id': certificate_id,
        'hash': hash_value,
        'block_number': block_number,
        'timestamp': datetime.utcnow(),
        'verified': True
    }
    
    transactions_collection.insert_one(transaction_data)
    
    return {
        'hash': hash_value,
        'block_number': block_number,
        'timestamp': transaction_data['timestamp'].isoformat(),
        'verified': True
    }

def verify_certificate_hash(certificate_id, expected_hash):
    """
    Verify a certificate on the blockchain
    Returns verification result matching frontend format
    """
    db = get_db()
    transactions_collection = db[COLLECTIONS['blockchain_transactions']]
    
    transaction = transactions_collection.find_one({'certificate_id': certificate_id})
    
    if not transaction:
        return {
            'isValid': False,
            'blockNumber': None,
            'timestamp': None,
            'message': 'Certificate not found on blockchain'
        }
    
    transaction = serialize_doc(transaction)
    
    if transaction['hash'] != expected_hash:
        return {
            'isValid': False,
            'blockNumber': transaction['block_number'],
            'timestamp': transaction['timestamp'] if isinstance(transaction.get('timestamp'), str) else transaction['timestamp'].isoformat() if transaction.get('timestamp') else None,
            'message': 'Certificate hash does not match - potential tampering detected'
        }
    
    return {
        'isValid': True,
        'blockNumber': transaction['block_number'],
        'timestamp': transaction['timestamp'] if isinstance(transaction.get('timestamp'), str) else transaction['timestamp'].isoformat() if transaction.get('timestamp') else None,
        'message': 'Certificate verified successfully'
    }

def get_blockchain_stats():
    """
    Get blockchain statistics
    Returns stats matching frontend format
    """
    db = get_db()
    transactions_collection = db[COLLECTIONS['blockchain_transactions']]
    
    total_certificates = transactions_collection.count_documents({})
    last_transaction = transactions_collection.find_one(
        sort=[('block_number', -1)]
    )
    
    if last_transaction:
        timestamp = last_transaction.get('timestamp')
        if timestamp and not isinstance(timestamp, str):
            timestamp = timestamp.isoformat()
    else:
        timestamp = None
    
    return {
        'totalCertificates': total_certificates,
        'totalBlocks': last_transaction['block_number'] if last_transaction else 0,
        'lastBlockTime': timestamp
    }

def get_all_certificates_from_blockchain():
    """
    Get all certificates from blockchain (for admin view)
    """
    db = get_db()
    transactions_collection = db[COLLECTIONS['blockchain_transactions']]
    
    transactions = list(transactions_collection.find())
    transactions = serialize_list(transactions)
    
    return [{
        'certificate_id': t.get('certificate_id'),
        'hash': t.get('hash'),
        'block_number': t.get('block_number'),
        'timestamp': t.get('timestamp') if isinstance(t.get('timestamp'), str) else t.get('timestamp').isoformat() if t.get('timestamp') else None,
        'verified': t.get('verified', True)
    } for t in transactions]
