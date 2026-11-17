param([string]$Report = 'logs/evidence/wiki-check.json')
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    python scripts/check_wiki.py --report $Report
    $checkExit = $LASTEXITCODE
} finally {
    Pop-Location
}
exit $checkExit
