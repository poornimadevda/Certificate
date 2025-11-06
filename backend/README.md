# ChainLearn Backend API

Flask-based REST API backend for the ChainLearn blockchain certificate management system.

## Features

- **Authentication**: User login with role-based access (admin, teacher, student)
- **Course Management**: CRUD operations for courses
- **Certificate Management**: Issue, verify, and manage certificates
- **Blockchain Integration**: SHA256 hash-based certificate verification
- **Grade Management**: Track and manage student grades
- **RESTful API**: Full REST API with JSON responses

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Or if using Python 3, use `pip3`:

```bash
pip3 install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

Or:

```bash
python3 app.py
```

The API will be available at `http://localhost:5000`

### 3. Test the API

Check if the server is running:

```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
  ```json
  {
    "email": "admin@chainlearn.com",
    "password": "demo",
    "role": "admin"
  }
  ```

### Courses

- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/<id>` - Get course by ID
- `PUT /api/courses/<id>` - Update course
- `DELETE /api/courses/<id>` - Delete course

### Certificates

- `GET /api/certificates` - Get all certificates (optional: `?course_id=<id>&student_id=<id>`)
- `POST /api/certificates` - Create/issue a new certificate
- `GET /api/certificates/<id>` - Get certificate by ID
- `POST /api/certificates/<id>/verify` - Verify certificate on blockchain
- `POST /api/certificates/verify` - Verify certificate by ID or hash

### Grades

- `GET /api/grades` - Get all grades (optional: `?course_id=<id>&student_id=<id>`)
- `POST /api/grades` - Create or update a grade
- `PUT /api/grades/<id>` - Update grade
- `DELETE /api/grades/<id>` - Clear grade

### Blockchain

- `GET /api/blockchain/stats` - Get blockchain statistics
- `GET /api/blockchain/transactions` - Get all blockchain transactions

### Users

- `GET /api/users` - Get all users
- `GET /api/users/<id>` - Get user by ID

### Health Check

- `GET /api/health` - Health check endpoint

## Database

The application uses SQLite database (`chainlearn.db`) which will be created automatically on first run. The database includes demo data:

### Demo Users

- **Admin**: admin@chainlearn.com
- **Teacher**: teacher@chainlearn.com (Dr. Sarah Smith)
- **Students**: 
  - alice@student.com (Alice Johnson)
  - bob@student.com (Bob Smith)
  - carol@student.com (Carol Davis)

### Demo Courses

- Web Development 101
- Blockchain Basics

## Environment Variables

Optional environment variables:

- `SECRET_KEY`: Flask secret key (default: 'dev-secret-key-change-in-production')
- `SQLALCHEMY_DATABASE_URI`: Database URI (default: 'sqlite:///chainlearn.db')

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (Next.js default port)
- `http://127.0.0.1:3000`

To modify CORS settings, edit the `CORS` configuration in `app.py`.

## Project Structure

```
backend/
├── app.py              # Main Flask application
├── models.py           # Database models
├── blockchain_utils.py # Blockchain utility functions
├── requirements.txt    # Python dependencies
├── README.md          # This file
└── chainlearn.db      # SQLite database (created on first run)
```

## Development Notes

- The backend runs on port 5000 by default
- Debug mode is enabled for development
- Database tables are created automatically on first run
- Demo data is seeded if the database is empty

## Next Steps

1. Update the frontend to connect to this backend API
2. Replace demo authentication with proper JWT tokens
3. Add password hashing for user passwords
4. Add input validation and error handling
5. Add unit tests

