# ============================================================
# SETUP_WRAPPER.ps1 — Scarica gradle-wrapper.jar
# Esegui UNA VOLTA dalla cartella android/ prima di buildare.
# ============================================================

$ErrorActionPreference = "Stop"
$wrapperDir = Join-Path $PSScriptRoot "gradle\wrapper"
$jarPath    = Join-Path $wrapperDir "gradle-wrapper.jar"

Write-Host "=== CodeLearn — Setup Gradle Wrapper ===" -ForegroundColor Cyan

# Controlla se già valido
if ((Test-Path $jarPath) -and ((Get-Item $jarPath).Length -gt 10000)) {
    Write-Host "gradle-wrapper.jar già presente e valido." -ForegroundColor Green
    exit 0
}

Write-Host "gradle-wrapper.jar mancante. Download in corso..." -ForegroundColor Yellow

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$client = New-Object System.Net.WebClient

# Lista URL da provare in ordine
$urls = @(
    "https://github.com/gradle/gradle/raw/v8.7.0/gradle/wrapper/gradle-wrapper.jar",
    "https://raw.githubusercontent.com/nickvdyck/gradle-wrapper-jar/main/gradle-wrapper.jar",
    "https://services.gradle.org/distributions/gradle-8.11.1-wrapper.jar"
)

$downloaded = $false
foreach ($url in $urls) {
    try {
        Write-Host "  Provo: $url" -ForegroundColor Gray
        $client.DownloadFile($url, $jarPath)
        $size = (Get-Item $jarPath).Length
        if ($size -gt 10000) {
            Write-Host "  Scaricato! ($([math]::Round($size/1024))KB)" -ForegroundColor Green
            $downloaded = $true
            break
        }
    } catch {
        Write-Host "  Fallito: $_" -ForegroundColor Red
    }
}

if (-not $downloaded) {
    Write-Host ""
    Write-Host "DOWNLOAD FALLITO. Soluzioni alternative:" -ForegroundColor Red
    Write-Host ""
    Write-Host "  OPZIONE 1 (consigliata) — usa Android Studio:" -ForegroundColor Yellow
    Write-Host "    cd .."
    Write-Host "    npx cap open android"
    Write-Host "    poi in Android Studio: Build > Build APK(s)"
    Write-Host ""
    Write-Host "  OPZIONE 2 — se hai Gradle installato globalmente:" -ForegroundColor Yellow
    Write-Host "    gradle wrapper --gradle-version 8.11.1"
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Setup completato! Ora puoi buildare:" -ForegroundColor Green
Write-Host "  .\gradlew.bat assembleDebug" -ForegroundColor Cyan
