"""
MongoDB Database Connection for ChainLearn
"""

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import certifi
import os

# MongoDB connection string
MONGODB_URI = os.environ.get(
    'MONGODB_URI',
    'mongodb+srv://tailorharsh858_db_user:AJHlaRUXyE9UvSk0@certificate.l0y0xta.mongodb.net/?appName=certificate'
)

# Database name
DB_NAME = 'chainlearn'

# Global database connection
client = None
db = None

def init_db():
    """Initialize MongoDB connection"""
    global client, db
    try:
        client = MongoClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=15000,
            tls=True,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=True,
            tlsAllowInvalidHostnames=True,
            connectTimeoutMS=15000,
            socketTimeoutMS=20000,
        )
        # Test the connection
        client.admin.command('ping')
        db = client[DB_NAME]
        print(f"[OK] Connected to MongoDB database: {DB_NAME}")
        return True
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"[ERROR] Failed to connect to MongoDB: {e}")
        return False

def get_db():
    """Get database instance"""
    global db
    if db is None:
        init_db()
    return db

def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def print_admin_debug():
    """Print admin user debug info for troubleshooting login issues"""
    db = get_db()
    user = db['users'].find_one({'email': 'admin@chainlearn.com'})
    if user:
        print("[DEBUG] Admin user found in DB:")
        print("Email:", user.get('email'))
        print("Password Hash:", user.get('password_hash'))
        print("Name:", user.get('name'))
        print("Role:", user.get('role'))
    else:
        print("[DEBUG] Admin user NOT found in DB!")