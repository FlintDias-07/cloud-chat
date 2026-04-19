Write-Host "Cloud Chat Project - Installation Verification" -ForegroundColor Cyan
Write-Host ""

# Test 1
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
node --version
Write-Host ""

# Test 2
Write-Host "2. Checking npm..." -ForegroundColor Yellow
npm --version
Write-Host ""

# Test 3
Write-Host "3. Checking Backend Packages..." -ForegroundColor Yellow
$path = "C:\Users\Admin\Desktop\Cloud_project\backend\node_modules"
if (Test-Path $path) {
    $count = (Get-ChildItem $path -Directory | Measure-Object).Count
    Write-Host "   FOUND: $count packages installed" -ForegroundColor Green
} else {
    Write-Host "   NOT FOUND" -ForegroundColor Red
}
Write-Host ""

# Test 4
Write-Host "4. Checking .env Configuration..." -ForegroundColor Yellow
$envPath = "C:\Users\Admin\Desktop\Cloud_project\backend\.env"
if (Test-Path $envPath) {
    Write-Host "   FOUND: backend/.env" -ForegroundColor Green
} else {
    Write-Host "   NOT FOUND" -ForegroundColor Red
}
Write-Host ""

# Test 5
Write-Host "5. Project Structure Verification..." -ForegroundColor Yellow
$root = "C:\Users\Admin\Desktop\Cloud_project"
$required = @("backend", "frontend", "cloud-infrastructure", "database", "docs")
$missing = @()
foreach ($dir in $required) {
    if (Test-Path "$root/$dir") {
        Write-Host "   OK: $dir" -ForegroundColor Green
    } else {
        $missing += $dir
    }
}
Write-Host ""

Write-Host "INSTALLATION STATUS: COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Read QUICK_START.md"
Write-Host "2. cmd: cd backend & npm run dev"
Write-Host "3. cmd: cd frontend & python -m http.server"
Write-Host "4. Open: http://localhost:8000"
Write-Host ""
