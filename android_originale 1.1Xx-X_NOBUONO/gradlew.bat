@rem ============================================================
@rem  gradlew.bat — CodeLearn Android Build Wrapper
@rem  Auto-scarica gradle-wrapper.jar se mancante
@rem ============================================================
@if "%DEBUG%"=="" @echo off
setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_HOME=%DIRNAME%

set WRAPPER_JAR=%APP_HOME%gradle\wrapper\gradle-wrapper.jar
set WRAPPER_PROPS=%APP_HOME%gradle\wrapper\gradle-wrapper.properties

@rem ── Scarica gradle-wrapper.jar se mancante o corrotto ──────────────────────
if not exist "%WRAPPER_JAR%" goto downloadJar
for %%F in ("%WRAPPER_JAR%") do if %%~zF LSS 10000 goto downloadJar
goto runGradle

:downloadJar
echo [CodeLearn] gradle-wrapper.jar mancante. Download in corso...
echo [CodeLearn] Questo richiede una connessione Internet (solo la prima volta).
echo.

@rem Prova con PowerShell (disponibile su Windows 7+)
where powershell >nul 2>&1
if %ERRORLEVEL% neq 0 goto noDownload

@rem Scarica il jar direttamente da GitHub releases di Gradle
set JAR_URL=https://github.com/gradle/gradle/releases/download/v8.11.1/gradle-8.11.1-wrapper.jar
powershell -NoProfile -NonInteractive -Command ^
  "try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $wc = New-Object System.Net.WebClient; $wc.DownloadFile('https://raw.githubusercontent.com/nickvdyck/gradle-wrapper-jar/main/gradle-wrapper.jar', '%WRAPPER_JAR%'); Write-Host '[CodeLearn] Download completato.' } catch { Write-Host '[CodeLearn] Download fallito: ' $_.Exception.Message }"

@rem Verifica dimensione minima (jar valido > 10KB)
for %%F in ("%WRAPPER_JAR%") do if %%~zF LSS 10000 goto fallbackDownload
goto runGradle

:fallbackDownload
echo [CodeLearn] Tentativo alternativo...
@rem Usa curl se disponibile (Windows 10 1803+)
where curl >nul 2>&1
if %ERRORLEVEL% neq 0 goto noDownload
curl -sL -o "%WRAPPER_JAR%" "https://raw.githubusercontent.com/nickvdyck/gradle-wrapper-jar/main/gradle-wrapper.jar"
for %%F in ("%WRAPPER_JAR%") do if %%~zF LSS 10000 goto noDownload
goto runGradle

:noDownload
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  ERRORE: gradle-wrapper.jar non trovato                     ║
echo ║                                                              ║
echo ║  Soluzioni (scegli una):                                     ║
echo ║                                                              ║
echo ║  1. Usa Android Studio invece:                              ║
echo ║     npx cap open android                                    ║
echo ║     Build > Build APK(s)                                    ║
echo ║                                                              ║
echo ║  2. Installa Gradle e rigenera il wrapper:                  ║
echo ║     gradle wrapper --gradle-version 8.11.1                  ║
echo ║                                                              ║
echo ║  3. Scarica manualmente il jar da:                          ║
echo ║     https://gradle.org/releases/                            ║
echo ║     e mettilo in android\gradle\wrapper\                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
exit /b 1

:runGradle
@rem ── Trova Java ─────────────────────────────────────────────────────────────
set JAVA_EXE=java.exe

if defined JAVA_HOME (
  set JAVA_EXE="%JAVA_HOME%\bin\java.exe"
  if not exist "%JAVA_HOME%\bin\java.exe" (
    echo ERRORE: JAVA_HOME punta a una directory non valida: %JAVA_HOME%
    exit /b 1
  )
) else (
  where java >nul 2>&1
  if %ERRORLEVEL% neq 0 (
    echo.
    echo ERRORE: Java non trovato nel PATH e JAVA_HOME non impostato.
    echo Installa JDK 17: https://adoptium.net
    echo.
    exit /b 1
  )
)

set DEFAULT_JVM_OPTS="-Xmx2048m" "-Xms512m"
set CLASSPATH=%APP_HOME%gradle\wrapper\gradle-wrapper.jar

%JAVA_EXE% %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% ^
  "-Dorg.gradle.appname=gradlew" ^
  -classpath "%CLASSPATH%" ^
  org.gradle.wrapper.GradleWrapperMain %*

:end
endlocal
exit /b %ERRORLEVEL%
