# Come fare il build dell'APK — CodeLearn

## Prerequisiti

| Tool | Versione consigliata |
|------|---------------------|
| Node.js | 18+ |
| npm | 9+ |
| Java JDK | 17 (OpenJDK o Temurin) |
| Android Studio | Hedgehog o superiore |
| Android SDK | API 35 (target), API 22 (min) |

> Assicurati che le variabili d'ambiente `JAVA_HOME` e `ANDROID_HOME` (o `ANDROID_SDK_ROOT`) siano impostate correttamente.

---

## Passaggi per il build

### 1. Installa le dipendenze Node

```bash
cd CodeLearn_STABLE_V1.0.2g
npm install
```

### 2. Crea il build web (Vite)

```bash
npm run build
```

Questo genera la cartella `dist/`.

### 3. Sincronizza Capacitor con Android

```bash
npx cap sync android
```

Questo copia il build web nella cartella `android/app/src/main/assets/public/`.

### 4. Build APK Debug (senza firma)

```bash
cd android
./gradlew assembleDebug
```

L'APK si troverà in:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 4b. Build APK Release (con firma — per distribuire)

Prima di tutto genera un keystore se non ne hai già uno:

```bash
keytool -genkey -v -keystore codelearn-release.jks \
  -alias codelearn -keyalg RSA -keysize 2048 -validity 10000
```

Poi crea il file `android/keystore.properties` (NON committare questo file nel repository!):

```
storeFile=../../codelearn-release.jks
storePassword=TUA_PASSWORD
keyAlias=codelearn
keyPassword=TUA_KEY_PASSWORD
```

Aggiorna `android/app/build.gradle` aggiungendo nel blocco `android { ... }`:

```groovy
signingConfigs {
    release {
        def keystorePropertiesFile = rootProject.file("keystore.properties")
        def keystoreProperties = new Properties()
        keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

Poi esegui:

```bash
cd android
./gradlew assembleRelease
```

L'APK firmato si troverà in:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Apertura in Android Studio (alternativa)

1. Apri Android Studio
2. **File → Open** → seleziona la cartella `android/` del progetto
3. Aspetta che Gradle sync finisca
4. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
5. Trovi l'APK nel percorso indicato nella notifica in basso

---

## GitHub Actions (CI automatica)

Il file `.github/workflows/build-apk.yml` esegue automaticamente il build
dell'APK ad ogni push su `main`. L'APK viene caricato come artifact del workflow.

---

## Installare l'APK su un dispositivo Android

```bash
# Con ADB (dispositivo connesso via USB con debug USB attivo)
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Oppure copia il file `.apk` sul telefono e aprilo dal file manager
(potrebbe richiedere di abilitare "Installa da fonti sconosciute" nelle impostazioni).
