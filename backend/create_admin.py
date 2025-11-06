"""
Script to create admin account
Run this once to create the admin user
"""

from database import init_db, get_db
from models import COLLECTIONS
from datetime import datetime
import hashlib

# Admin credentials
ADMIN_EMAIL = "admin@chainlearn.com"
ADMIN_PASSWORD = "Admin@123"
ADMIN_NAME = "Admin User"

def create_admin():
    """Create admin account"""
    # Initialize database connection
    if not init_db():
        print("[ERROR] Failed to connect to database")
        return False
    
    db = get_db()
    users_collection = db[COLLECTIONS['users']]
    
    # Check if admin already exists
    existing_admin = users_collection.find_one({'email': ADMIN_EMAIL})
    if existing_admin:
        print("=" * 60)
        print("ADMIN ACCOUNT ALREADY EXISTS!")
        print("=" * 60)
        print(f"Email:    {ADMIN_EMAIL}")
        print(f"Password: {ADMIN_PASSWORD}")
        print(f"Name:     {ADMIN_NAME}")
        print(f"Role:     admin")
        print("=" * 60)
        print("\nUse these credentials to login.")
        print("=" * 60)
        return True
    
    # Hash password
    password_hash = hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()
    
    # Create admin user
    admin_data = {
        'email': ADMIN_EMAIL,
        'name': ADMIN_NAME,
        'role': 'admin',
        'password_hash': password_hash,
        'created_at': datetime.utcnow()
    }
    
    result = users_collection.insert_one(admin_data)
    
    print("=" * 60)
    print("ADMIN ACCOUNT CREATED SUCCESSFULLY!")
    print("=" * 60)
    print(f"Email:    {ADMIN_EMAIL}")
    print(f"Password: {ADMIN_PASSWORD}")
    print(f"Name:     {ADMIN_NAME}")
    print(f"Role:     admin")
    print("=" * 60)
    print("\n[IMPORTANT] Save these credentials securely!")
    print("=" * 60)
    
    return True

if __name__ == '__main__':
    create_admin()

