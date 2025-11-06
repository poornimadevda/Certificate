# Admin Account Credentials

## 🔑 Admin Login Credentials

```
Email:    admin@chainlearn.com
Password: Admin@123
```

## 📝 Notes

- These credentials are created by running `python create_admin.py`
- The admin account has full access to all features
- Password is hashed using SHA256 (consider using bcrypt for production)

## 🔄 To Reset Admin Password

1. Delete the admin user from MongoDB, or
2. Modify `create_admin.py` with new password and run it again

