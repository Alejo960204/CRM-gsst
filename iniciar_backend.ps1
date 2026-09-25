# Script de arranque del backend.
# Soluciona el error "ModuleNotFoundError: No module named 'app'" que ocurre
# si uvicorn se corre desde crm-gsst-backend en vez de crm-gsst-backend\src.
#
# Uso: desde la carpeta crm-gsst-backend, ejecuta:  .\iniciar_backend.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "src")

Write-Host "Iniciando backend desde $(Get-Location)..." -ForegroundColor Cyan
python -m uvicorn app.main:app --reload --port 8000
