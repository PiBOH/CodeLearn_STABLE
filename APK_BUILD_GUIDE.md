# Guida: Come Buildare l'APK Android di CodeLearn

Questa guida ti spiega passo dopo passo come trasformare il progetto CodeLearn in un file `.apk` installabile su Android.

---

## 📋 Prerequisiti

| Strumento | Versione minima | Come ottenerlo |
|-----------|-----------------|----------------|
| **Node.js** | 20.x | [nodejs.org](https://nodejs.org/) |
| **npm** | incluso con Node.js | viene installato automaticamente |
| **JDK** (Java Development Kit) | 21 | [adoptium.net](https://adoptium.net/) → scarica **Eclipse Temurin JDK 21** |
| **Android SDK** | API 34 | vedi sezione sotto |

---

## 🔧 Passaggio 1: Installare Android SDK

### 1.1 Scarica i Command Line Tools

Vai su [developer.android.com/studio#command-tools](https://developer.android.com/studio#command-tools) e scarica:

> **"Command line tools only"** per il tuo sistema operativo (Windows/Mac/Linux)

### 1.2 Estrai e configura

Estrai la cartella in una posizione permanente, ad esempio:

- **Windows**: `C:\Users\TUO_NOME\Android\Sdk`
- **Mac/Linux**: `~/Android/Sdk`

### 1.3 Installa i pacchetti necessari

Apri un terminale nella cartella `cmdline-tools/bin` ed esegui:

```bash
sdkmanager "platform-tools" "build-tools;34.0.0" "platforms;android-34"
```

Accetta tutte le licenze quando richiesto.

### 1.4 Imposta le variabili d'ambiente

Aggiungi queste variabili al tuo sistema:

**Windows** (Pannello di controllo → Sistema → Variabili d'ambiente):
```
JAVA_HOME = C:\Percorso\Del\JDK21
ANDROID_HOME = C:\Users\TUO_NOME\Android\Sdk
Path += %JAVA_HOME%\bin
Path += %ANDROID_HOME%\cmdline-tools\latest\bin
Path += %ANDROID_HOME%\platform-tools
```

**Mac/Linux** (aggiungi a `~/.bashrc`, `~/.zshrc` o `~/.bash_profile`):
```bash
export JAVA_HOME=/percorso/del/jdk21
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH
```

> ⚠️ **Importante**: chiudi e riapri il terminale dopo aver modificato le variabili.

### 1.5 Verifica l'installazione

```bash
java -version        # deve mostrare "21"
echo $ANDROID_HOME   # (Mac/Linux) o echo %ANDROID_HOME% (Windows)
sdkmanager --list    # deve mostrare i pacchetti installati
```

---

## 📦 Passaggio 2: Installare le dipendenze del progetto

Apri il terminale nella cartella del progetto `codelearn/`:

```bash
cd /percorso/del/progetto/codelearn
npm install
```

Questo installerà tutte le librerie necessarie (React, Capacitor, ecc.).

---

## 🎨 Passaggio 3: Buildare l'app web

```bash
npm run build
```

Questo comando compila il progetto React nella cartella `dist/`. Questa cartella conterrà l'app ottimizzata per la produzione.

---

## 📱 Passaggio 4: Sincronizzare con Android (Capacitor)

```bash
npx cap sync android
```

Questo comando:
1. Copia i file dalla cartella `dist/` nel progetto Android
2. Aggiorna le configurazioni native
3. Sincronizza eventuali plugin

---

## 🔨 Passaggio 5: Buildare l'APK

### 5.1 Entra nella cartella Android

```bash
cd android
```

### 5.2 Esegui la build

**Su Mac/Linux:**
```bash
./gradlew assembleDebug
```

**Su Windows:**
```bash
gradlew.bat assembleDebug
```

> ⏳ La prima build richiede **5-15 minuti** perché Gradle scarica le dipendenze necessarie. Le build successive saranno molto più veloci (1-2 minuti).

---

## 🎉 Passaggio 6: Trova il tuo APK

Al termine della build, l'APK si trova in:

```
codelearn/android/app/build/outputs/apk/debug/app-debug.apk
```

Il file è pronto per essere:
- **Trasferito** sul telefono via USB, email, o cloud
- **Installato** con `adb install app-debug.apk`
- **Condiviso** con chi vuoi

---

## 📱 Installare l'APK sul telefono

### Metodo A: ADB (più veloce per sviluppatori)

1. Abilita **"Opzioni sviluppatore"** sul telefono:
   - Impostazioni → Info sul telefono → tocca "Numero build" 7 volte
2. Abilita **"Debug USB"** in Opzioni sviluppatore
3. Collega il telefono al PC con un cavo USB
4. Esegui:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Metodo B: Trasferimento file (più semplice)

1. Copia `app-debug.apk` sul telefono (email, WhatsApp, Google Drive, cavo USB)
2. Sul telefono, apri il file APK
3. Se richiesto, abilita **"Installa da fonti sconosciute"** per il browser/file manager
4. Tocca **Installa**

---

## 🚀 Script automatico (opzionale)

Ho incluso uno script che esegue tutti i passaggi in sequenza:

```bash
chmod +x build-apk.sh
./build-apk.sh
```

Lo script:
1. Verifica che Java, Node e Android SDK siano installati
2. Installa le dipendenze npm
3. Builda l'app web
4. Sincronizza Capacitor
5. Builda l'APK
6. Mostra il percorso del file finale

---

## ❌ Risoluzione problemi

### "java: command not found"
- JDK non installato o `JAVA_HOME` non configurato correttamente
- Soluzione: reinstalla JDK 21 e verifica le variabili d'ambiente

### "sdkmanager: command not found"
- Android SDK non nel PATH
- Soluzione: aggiungi `$ANDROID_HOME/cmdline-tools/latest/bin` al PATH

### "error: invalid source release: 21"
- Stai usando una versione di Java diversa dalla 21
- Soluzione: imposta `JAVA_HOME` per puntare a JDK 21

### Build fallisce con "Duplicate class kotlin..."
- Conflitto tra versioni di Kotlin
- Soluzione: già risolto nel progetto con `exclude group` in `android/app/build.gradle`

### Gradle si blocca o è lento
- La prima build scarica molte dipendenze
- Soluzione: attendi pazientemente (può richiedere 10-15 minuti la prima volta)

---

## 📝 Note

- **minSdkVersion**: 23 (Android 6.0 Marshmallow) — l'app funziona su Android 6.0+
- **targetSdkVersion**: 34 (Android 14)
- **Dimensione APK**: circa 4.2 MB
- L'APK generato è un **debug APK** — per pubblicare sul Play Store serve un **release APK** firmato con un keystore

---

## 🌐 Pubblicare sul Play Store (futuro)

Per pubblicare l'app sul Google Play Store:

1. Crea un **keystore** (firma digitale)
2. Builda un **release APK** o **AAB** (Android App Bundle)
3. Firma l'APK con il keystore
4. Carica sul Google Play Console

Questi passaggi richiedono un account Google Developer (costo: $25 una tantum).
