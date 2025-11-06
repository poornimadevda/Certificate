# Test Script for ChainLearn API
# Run this script while the Flask server is running

Write-Host "Testing ChainLearn API Endpoints..." -ForegroundColor Green
Write-Host ""

# Test Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/health" -Method GET
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test Blockchain Stats
Write-Host "2. Testing Blockchain Stats..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/blockchain/stats" -Method GET
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test Get Courses
Write-Host "3. Testing Get Courses..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/courses" -Method GET
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test Login
Write-Host "4. Testing Login..." -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@chainlearn.com"
        password = "demo"
        role = "admin"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing Complete!" -ForegroundColor Green

