# Fix Frontend Lock Issues - ChainLearn
# This script kills processes and removes lock files to allow Next.js to start

Write-Host "🔧 Fixing frontend lock issues..." -ForegroundColor Yellow
Write-Host ""

# Kill processes on port 3000
Write-Host "1. Checking for processes on port 3000..." -ForegroundColor Cyan
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $port3000 | ForEach-Object {
        $processId = $_.OwningProcess
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Killed process $processId" -ForegroundColor Green
    }
} else {
    Write-Host "   ℹ️  No processes found on port 3000" -ForegroundColor Gray
}

# Kill Node.js processes
Write-Host "2. Checking for Node.js processes..." -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Killed Node.js process $($_.Id)" -ForegroundColor Green
    }
} else {
    Write-Host "   ℹ️  No Node.js processes found" -ForegroundColor Gray
}

# Remove lock file and clean .next/dev folder
Write-Host "3. Removing lock files..." -ForegroundColor Cyan
if (Test-Path ".next\dev") {
    Remove-Item ".next\dev" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ Removed .next\dev folder (includes lock file)" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  No .next\dev folder found" -ForegroundColor Gray
}

# Optional: Clean .next folder (uncomment if needed)
# Write-Host "4. Cleaning .next folder..." -ForegroundColor Cyan
# if (Test-Path ".next") {
#     Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
#     Write-Host "   ✅ Cleaned .next folder" -ForegroundColor Green
# }

Write-Host ""
Write-Host "✅ Done! You can now run: pnpm dev" -ForegroundColor Green
Write-Host ""

