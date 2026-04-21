# PowerShell script to update CORS settings with Render frontend URL
# Usage: .\scripts\update-cors.ps1 "https://moodtracker-frontend.onrender.com"

param(
    [Parameter(Mandatory=$true)]
    [string]$FrontendUrl
)

Write-Host "🔧 Updating CORS settings in Program.cs..." -ForegroundColor Cyan

$programPath = ".\backend\MoodTrackerAPI\Program.cs"

if (-not (Test-Path $programPath)) {
    Write-Host "❌ Error: Program.cs not found at $programPath" -ForegroundColor Red
    exit 1
}

$content = Get-Content $programPath -Raw

# Check if URL already exists
if ($content -match [regex]::Escape($FrontendUrl)) {
    Write-Host "✅ Frontend URL already in CORS policy!" -ForegroundColor Green
    exit 0
}

# Find the CORS policy section and add the new URL
$pattern = '(policy\.WithOrigins\([^)]+)(\))'
$replacement = "`$1,`n            `"$FrontendUrl`"`$2"

$newContent = $content -replace $pattern, $replacement

if ($newContent -eq $content) {
    Write-Host "❌ Error: Could not find CORS policy in Program.cs" -ForegroundColor Red
    Write-Host "Please manually add '$FrontendUrl' to the CORS policy" -ForegroundColor Yellow
    exit 1
}

# Write the updated content
Set-Content -Path $programPath -Value $newContent

Write-Host "✅ CORS policy updated successfully!" -ForegroundColor Green
Write-Host "Frontend URL added: $FrontendUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review changes: git diff $programPath" -ForegroundColor White
Write-Host "2. Commit: git add $programPath; git commit -m 'feat: add Render frontend to CORS'" -ForegroundColor White
Write-Host "3. Push: git push" -ForegroundColor White
