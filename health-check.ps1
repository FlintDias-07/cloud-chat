# Health Check Script - Verify All Installations

$host.ui.RawUI.WindowTitle = "Cloud Chat Project - Health Check"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Cloud Chat Project - Installation Health Check       ║" -ForegroundColor Cyan
Write-Host "║   Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$results = @()

# Helper function to add result
function Add-Result($name, $status, $version, $note) {
    $results += [PSCustomObject]@{
        Component = $name
        Status = $status
        Version = $version
        Note = $note
    }
}

# Test 1: Node.js
Write-Host "[1/8] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version 2>&1
    Add-Result "Node.js" "✓ PASS" $nodeVersion "JavaScript runtime"
    Write-Host "      ✓ $nodeVersion" -ForegroundColor Green
} catch {
    Add-Result "Node.js" "✗ FAIL" "-" "Not installed"
    Write-Host "      ✗ Not installed" -ForegroundColor Red
}

# Test 2: npm
Write-Host "[2/8] Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = & npm --version 2>&1
    Add-Result "npm" "✓ PASS" "v$npmVersion" "Node Package Manager"
    Write-Host "      ✓ v$npmVersion" -ForegroundColor Green
} catch {
    Add-Result "npm" "✗ FAIL" "-" "Not installed"
    Write-Host "      ✗ Not installed" -ForegroundColor Red
}

# Test 3: Backend Dependencies
Write-Host "[3/8] Checking Backend Dependencies..." -ForegroundColor Yellow
$nodeModulesPath = Join-Path $projectRoot "backend" "node_modules"
if (Test-Path $nodeModulesPath) {
    $packageCount = (Get-ChildItem $nodeModulesPath -Directory).Count
    Add-Result "Backend Packages" "✓ PASS" "$packageCount packages" "npm install completed"
    Write-Host "      ✓ $packageCount packages installed" -ForegroundColor Green
} else {
    Add-Result "Backend Packages" "✗ FAIL" "-" "Run: npm install in backend/"
    Write-Host "      ✗ Not found. Run: npm install in backend/" -ForegroundColor Red
}

# Test 4: .env Configuration
Write-Host "[4/8] Checking Configuration Files..." -ForegroundColor Yellow
$envFile = Join-Path $projectRoot "backend" ".env"
if (Test-Path $envFile) {
    Add-Result ".env File" "✓ PASS" "Found" "backend/.env"
    Write-Host "      ✓ backend/.env exists" -ForegroundColor Green
} else {
    Add-Result ".env File" "⚠ WARN" "Missing" "Create from .env.example"
    Write-Host "      ⚠ backend/.env not found" -ForegroundColor Yellow
}

# Test 5: Project Structure
Write-Host "[5/8] Checking Project Structure..." -ForegroundColor Yellow
$requiredDirs = @("backend", "frontend", "cloud-infrastructure", "database", "docs")
$allDirExists = $true
foreach ($dir in $requiredDirs) {
    if (!(Test-Path (Join-Path $projectRoot $dir))) {
        $allDirExists = $false
        break
    }
}

if ($allDirExists) {
    Add-Result "Project Structure" "✓ PASS" "Complete" "All directories present"
    Write-Host "      ✓ All required directories found" -ForegroundColor Green
} else {
    Add-Result "Project Structure" "✗ FAIL" "Incomplete" "Missing directories"
    Write-Host "      ✗ Some directories missing" -ForegroundColor Red
}

# Test 6: Git
Write-Host "[6/8] Checking Git..." -ForegroundColor Yellow
try {
    $gitVersion = & git --version 2>&1
    Add-Result "Git" "✓ PASS" $gitVersion "Version control"
    Write-Host "      ✓ $gitVersion" -ForegroundColor Green
} catch {
    Add-Result "Git" "⚠ WARN" "Not found" "Optional - install if needed"
    Write-Host "      ⚠ Not installed (optional)" -ForegroundColor Yellow
}

# Test 7: Terraform
Write-Host "[7/8] Checking Terraform..." -ForegroundColor Yellow
try {
    $tfVersion = & terraform --version 2>&1 | Select-Object -First 1
    Add-Result "Terraform" "✓ PASS" $tfVersion "Infrastructure as Code"
    Write-Host "      ✓ $tfVersion" -ForegroundColor Green
} catch {
    Add-Result "Terraform" "⚠ WARN" "Not found" "Optional - for AWS deployment"
    Write-Host "      ⚠ Not installed (optional - needed for AWS)" -ForegroundColor Yellow
}

# Test 8: AWS CLI
Write-Host "[8/8] Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = & aws --version 2>&1
    Add-Result "AWS CLI" "✓ PASS" $awsVersion "AWS Management"
    Write-Host "      ✓ $awsVersion" -ForegroundColor Green
} catch {
    Add-Result "AWS CLI" "⚠ WARN" "Not found" "Optional - for AWS deployment"
    Write-Host "      ⚠ Not installed (optional - needed for AWS)" -ForegroundColor Yellow
}

# Summary created successfully

# Results Summary
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   HEALTH CHECK RESULTS                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$results | Format-Table -Property @{
    Label = "Component"
    Expression = { $_.Component }
    Width = 20
}, @{
    Label = "Status"
    Expression = { $_.Status }
    Width = 10
}, @{
    Label = "Version/Info"
    Expression = { $_.Version }
    Width = 20
}, @{
    Label = "Notes"
    Expression = { $_.Note }
    Width = 25
}

Write-Host ""

# Overall Status
$failCount = ($results | Where-Object { $_.Status -like "*FAIL*" }).Count
$warnCount = ($results | Where-Object { $_.Status -like "*WARN*" }).Count
$passCount = ($results | Where-Object { $_.Status -like "*PASS*" }).Count

Write-Host "SUMMARY:" -ForegroundColor Cyan
Write-Host "  ✓ Passed: $passCount" -ForegroundColor Green
Write-Host "  ⚠ Warnings: $warnCount" -ForegroundColor Yellow
Write-Host "  ✗ Failed: $failCount" -ForegroundColor Red

Write-Host ""

if ($failCount -eq 0) {
    Write-Host "✓ System is ready for development!" -ForegroundColor Green
} else {
    Write-Host "✗ Some components need installation. See REQUIREMENTS.md" -ForegroundColor Red
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. cd backend" -ForegroundColor Gray
Write-Host "  2. npm run dev" -ForegroundColor Gray
Write-Host "  3. Open frontend/index.html in browser" -ForegroundColor Gray
Write-Host ""
Write-Host "DOCUMENTATION:" -ForegroundColor Cyan
Write-Host "  • INSTALLATION_GUIDE.md - Step-by-step setup" -ForegroundColor Gray
Write-Host "  • REQUIREMENTS.md - System requirements" -ForegroundColor Gray
Write-Host "  • docs/QUICK_REFERENCE.md - Common commands" -ForegroundColor Gray
Write-Host ""

# Save results to file
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = Join-Path $projectRoot "health-check-$timestamp.log"

$reportContent = @"
Cloud Chat Project - Health Check Report
Generated: $(Get-Date)
=====================================

COMPONENT STATUS:
"@

foreach ($result in $results) { 
    $reportContent += "`n  $($result.Component): $($result.Status) ($($result.Version))"
}

$reportContent += @"


SUMMARY:
  Passed: $passCount
  Warnings: $warnCount
  Failed: $failCount

"@

$reportContent | Out-File $logFile -Encoding UTF8

Write-Host "Report saved to: $logFile" -ForegroundColor Gray
Write-Host ""
