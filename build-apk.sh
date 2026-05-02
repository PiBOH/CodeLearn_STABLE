#!/bin/bash
set -e

echo "=== CodeLearn APK Builder ==="

# Check Node
if ! command -v node &> /dev/null; then
    echo "Errore: Node.js non trovato. Installalo da https://nodejs.org/"
    exit 1
fi

# Check Java
if ! command -v java &> /dev/null; then
    echo "Errore: Java non trovato. Scarica JDK 21 da https://adoptium.net/"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d. -f1)
if [ "$JAVA_VERSION" != "21" ]; then
    echo "Attenzione: Java 21 consigliato. Versione attuale: $JAVA_VERSION"
fi

# Check Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "Errore: ANDROID_HOME non impostato."
    echo "Scarica Android SDK Command Line Tools e imposta ANDROID_HOME."
    exit 1
fi

# Install dependencies
echo "[1/4] Installazione dipendenze npm..."
npm install

# Build web app
echo "[2/4] Build app web..."
npm run build

# Sync Capacitor
echo "[3/4] Sync Capacitor Android..."
npx cap sync android

# Build APK
echo "[4/4] Build APK Android..."
cd android
./gradlew assembleDebug

echo ""
echo "=== BUILD COMPLETATO ==="
echo "APK disponibile in:"
echo "  android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Per installare su Android:"
echo "  adb install android/app/build/outputs/apk/debug/app-debug.apk"
