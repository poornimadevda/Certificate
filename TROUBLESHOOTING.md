# Troubleshooting Guide - ChainLearn

## Frontend Issues

### ❌ Error: "Unable to acquire lock at E:\major\.next\dev\lock"

**Problem:** Another instance of Next.js dev server is running, or a stale lock file exists.

**Solution 1: Quick Fix Script**
```powershell
.\fix-frontend.ps1
pnpm dev
```

**Solution 2: Manual Fix**
```powershell
# Kill processes on port 3000
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Kill Node.js processes
Get-Process -Name "node" | Stop-Process -Force

# Remove lock file
Remove-Item ".next\dev\lock" -Force -ErrorAction SilentlyContinue

# Now start the server
pnpm dev
```

**Solution 3: Use Different Port**
```powershell
pnpm dev -- -p 3001
```
Then access at: http://localhost:3001

---

### ❌ Error: "Port 3000 is already in use"

**Solution:**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F

# Or use different port
pnpm dev -- -p 3001
```

---

### ❌ Error: "Module not found"

**Solution:**
```powershell
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

---

### ❌ Frontend won't compile

**Solution:**
```powershell
# Clean build cache
Remove-Item -Recurse -Force .next
pnpm install
pnpm dev
```

---

## Backend Issues

### ❌ Error: "Port 5000 is already in use"

**Solution:**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or change port in backend/app.py
# Change: app.run(debug=True, host='0.0.0.0', port=5000)
# To: app.run(debug=True, host='0.0.0.0', port=5001)
```

---

### ❌ Error: "Module not found" (Python)

**Solution:**
```powershell
cd backend
pip install -r requirements.txt
```

---

### ❌ Database errors

**Solution:**
```powershell
cd backend
# Delete database (will recreate on next run)
Remove-Item instance\chainlearn.db -ErrorAction SilentlyContinue

# Restart server
python app.py
```

---

## General Issues

### Both servers need to run simultaneously

You need **TWO terminal windows**:

**Terminal 1 - Backend:**
```powershell
cd E:\major\backend
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd E:\major
pnpm dev
```

---

### Connection between frontend and backend fails

1. **Check backend is running:** http://localhost:5000/api/health
2. **Check frontend is running:** http://localhost:3000
3. **Check CORS:** Backend should allow `http://localhost:3000`
4. **Check API calls:** Make sure frontend uses `http://localhost:5000/api` as base URL

---

### Quick Reset Everything

```powershell
# Kill all Node.js processes
Get-Process -Name "node" | Stop-Process -Force

# Kill Python processes (if needed)
Get-Process -Name "python" | Stop-Process -Force

# Clean frontend
cd E:\major
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item ".next\dev\lock" -Force -ErrorAction SilentlyContinue

# Reinstall frontend dependencies (if needed)
# pnpm install

# Restart servers
```

---

## Need More Help?

1. Check terminal output for specific error messages
2. Verify Node.js is installed: `node --version`
3. Verify Python is installed: `python --version`
4. Check if ports are accessible: `netstat -ano | findstr ":3000\|:5000"`

