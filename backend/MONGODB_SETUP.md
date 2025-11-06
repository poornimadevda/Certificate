# MongoDB Setup Guide

## ✅ Migration Complete!

Your ChainLearn backend has been successfully migrated from SQLite to MongoDB!

## Connection Details

- **Connection String**: `MONGO_URI=mongodb+srv://chain_user:MyNewPw2025@cluster0.p6cz6zi.mongodb.net/?appName=Cluster0`
- **Database Name**: `chainlearn`
- **Status**: Connected ✅

## What Changed

### Dependencies
- ✅ Removed: `Flask-SQLAlchemy`
- ✅ Added: `pymongo`, `dnspython`

### Files Modified
1. **requirements.txt** - Updated dependencies
2. **database.py** - NEW: MongoDB connection module
3. **models.py** - Converted to MongoDB collection schemas
4. **app.py** - Rewritten to use MongoDB operations
5. **blockchain_utils.py** - Updated for MongoDB

## Database Structure

### Collections (Tables)
- `users` - User accounts (admin, teacher, student)
- `courses` - Course information
- `certificates` - Certificate records
- `grades` - Student grades
- `blockchain_transactions` - Blockchain transaction records

## Running the Server

1. **Install dependencies** (if not already done):
   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the server**:
   ```powershell
   python app.py
   ```

3. **Test connection**:
   - Health check: http://localhost:5000/api/health
   - The health endpoint will show database connection status

## Demo Data

On first run, the server automatically creates demo data:
- 1 Admin user
- 1 Teacher user
- 3 Student users
- 2 Courses
- Sample grades and certificates

## MongoDB Features Used

- ✅ Document-based storage
- ✅ Automatic ObjectId generation
- ✅ Flexible schema (schemaless)
- ✅ Indexed queries
- ✅ Connection pooling

## Environment Variables (Optional)

You can set a custom MongoDB URI via environment variable:

```powershell
$env:MONGODB_URI="mongodb+srv://tailorharsh858_db_user:AJHlaRUXyE9UvSk0@certificate.l0y0xta.mongodb.net/?appName=certificate"
python app.py
```

Or create a `.env` file in the backend folder (requires python-dotenv).

## Troubleshooting

### Connection Issues
- Check your internet connection (MongoDB Atlas requires internet)
- Verify connection string is correct
- Check MongoDB Atlas network access settings

### Import Errors
```powershell
pip install pymongo dnspython
```

### Data Migration
The old SQLite database (`instance/chainlearn.db`) is no longer used. All data is now in MongoDB.

## API Compatibility

All API endpoints remain the same - no frontend changes needed!

- `/api/auth/login`
- `/api/courses`
- `/api/certificates`
- `/api/grades`
- `/api/blockchain/stats`
- etc.

## Next Steps

1. Test the API endpoints
2. Verify data is being stored in MongoDB Atlas
3. Check MongoDB Atlas dashboard for your data

