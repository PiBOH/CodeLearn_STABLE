@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo   CodeLearn - Build APK Android
echo   Versione automatica
echo ==========================================
echo.

REM Salva la cartella del progetto
set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

REM -------------------------------------------------------
REM STEP 0: Controlla Node.js / npm
REM -------------------------------------------------------
echo [0/5] Controllo prerequisiti...
npm --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERRORE] Node.js/npm NON trovato!
    echo Scarica e installa Node.js da: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo   [OK] Node.js trovato

REM -------------------------------------------------------
REM STEP 0b: Controlla Java 21+
REM -------------------------------------------------------
java -version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERRORE] Java NON trovato!
    echo Scarica JDK 21 da: https://adoptium.net/temurin/releases/?version=21
    echo Scegli: Windows - x64 - JDK - .msi
    echo Riavvia questo script dopo l'installazione.
    echo.
    pause
    exit /b 1
)

REM Controlla versione Java >= 21
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
    set JAVA_VER=%%g
)
set JAVA_VER=%JAVA_VER:"=%
for /f "delims=." %%a in ("%JAVA_VER%") do set JAVA_MAJOR=%%a
if %JAVA_MAJOR% LSS 21 (
    echo.
    echo [ERRORE] Java %JAVA_VER% trovato, ma serve Java 21+!
    echo Scarica JDK 21 da: https://adoptium.net/temurin/releases/?version=21
    echo Scegli: Windows - x64 - JDK - .msi
    echo Riavvia questo script dopo l'installazione.
    echo.
    pause
    exit /b 1
)
echo   [OK] Java %JAVA_VER% trovato

REM -------------------------------------------------------
REM STEP 0c: Crea local.properties se non esiste
REM -------------------------------------------------------
set "LOCAL_PROPS=%PROJECT_DIR%\android\local.properties"
set "ANDROID_SDK=%LOCALAPPDATA%\Android\Sdk"

if not exist "%LOCAL_PROPS%" (
    if exist "%ANDROID_SDK%" (
        set "SDK_PATH=%ANDROID_SDK:\=\\%"
        echo sdk.dir=!SDK_PATH!> "%LOCAL_PROPS%"
        echo   [OK] local.properties creato automaticamente
    ) else (
        echo.
        echo [ERRORE] Android SDK non trovato in: %ANDROID_SDK%
        echo Apri Android Studio, vai in SDK Manager e installa l'SDK.
        echo.
        pause
        exit /b 1
    )
) else (
    echo   [OK] local.properties gia' presente
)

echo.

REM -------------------------------------------------------
REM STEP 1: npm install
REM -------------------------------------------------------
echo [1/5] Installazione dipendenze npm...
cd /d "%PROJECT_DIR%"
npm install
if errorlevel 1 (
    echo.
    echo [ERRORE] npm install fallito!
    pause
    exit /b 1
)
echo   [OK] Dipendenze installate
echo.

REM -------------------------------------------------------
REM STEP 2: npm run build
REM -------------------------------------------------------
echo [2/5] Build app web...
npm run build
if errorlevel 1 (
    echo.
    echo [ERRORE] Build web fallita!
    pause
    exit /b 1
)
echo   [OK] Build web completata
echo.

REM -------------------------------------------------------
REM STEP 3: cap sync android
REM -------------------------------------------------------
echo [3/5] Sync Capacitor Android...
npx cap sync android
if errorlevel 1 (
    echo.
    echo [ERRORE] Capacitor sync fallito!
    pause
    exit /b 1
)
echo   [OK] Sync completato
echo.

REM -------------------------------------------------------
REM STEP 4: gradlew assembleDebug
REM -------------------------------------------------------
echo [4/5] Build APK Android...
cd /d "%PROJECT_DIR%\android"
call gradlew.bat assembleDebug
if errorlevel 1 (
    echo.
    echo [ERRORE] Build APK fallita!
    cd /d "%PROJECT_DIR%"
    pause
    exit /b 1
)
cd /d "%PROJECT_DIR%"
echo   [OK] APK compilato
echo.

REM -------------------------------------------------------
REM STEP 5: Copia APK sul Desktop
REM -------------------------------------------------------
echo [5/5] Copia APK sul Desktop...
set "APK_SRC=%PROJECT_DIR%\android\app\build\outputs\apk\debug\app-debug.apk"
set "APK_DST=%USERPROFILE%\Desktop\CodeLearn_V1.0.2f.apk"

if exist "%APK_SRC%" (
    copy /y "%APK_SRC%" "%APK_DST%" >nul
    echo   [OK] APK copiato sul Desktop come: CodeLearn_V1.0.2f.apk
) else (
    echo   [ATTENZIONE] APK non trovato nel percorso atteso.
    echo   Cercalo manualmente in: android\app\build\outputs\apk\debug\
)

echo.
echo ==========================================
echo   BUILD COMPLETATA CON SUCCESSO!
echo ==========================================
echo.
echo   APK sul Desktop: CodeLearn_V1.0.2f.apk
echo.
echo   Per installarlo su Android:
echo   1. Copia l'APK sul telefono
echo   2. Aprilo e abilita "Fonti sconosciute"
echo   3. Installa e avvia!
echo.
pause
