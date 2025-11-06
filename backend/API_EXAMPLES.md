# API Usage Examples

## Using PowerShell (Invoke-WebRequest)

### 1. Health Check
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/health" -Method GET
```

### 2. Login
```powershell
$body = @{
    email = "admin@chainlearn.com"
    password = "demo"
    role = "admin"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

### 3. Get All Courses
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/courses" -Method GET
```

### 4. Get All Certificates
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/certificates" -Method GET
```

### 5. Create a Course
```powershell
$body = @{
    name = "Python Programming"
    description = "Learn Python from scratch"
    instructor_id = 2
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/courses" -Method POST -Body $body -ContentType "application/json"
```

### 6. Issue a Certificate
```powershell
$body = @{
    student_id = 3
    course_id = 1
    grade = "A"
    score = 95
    instructor_name = "Dr. Sarah Smith"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/certificates" -Method POST -Body $body -ContentType "application/json"
```

### 7. Verify Certificate
```powershell
$body = @{
    certificate_id = "CERT-2024-0001-WEB10"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/certificates/verify" -Method POST -Body $body -ContentType "application/json"
```

## Using curl (if available)

```bash
# Health check
curl http://127.0.0.1:5000/api/health

# Login
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chainlearn.com","password":"demo","role":"admin"}'

# Get courses
curl http://127.0.0.1:5000/api/courses
```

## Using JavaScript/Fetch (for frontend integration)

```javascript
// Health check
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@chainlearn.com',
    password: 'demo',
    role: 'admin'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Get courses
fetch('http://localhost:5000/api/courses')
  .then(res => res.json())
  .then(data => console.log(data));
```

## Testing with the Test Script

Run the PowerShell test script while the server is running:

```powershell
cd backend
.\test_api.ps1
```

