# Guida Build APK su Windows 11

Questa guida ti spiega passo dopo passo come buildare il file APK di CodeLearn sul tuo PC Windows 11.

> ⚠️ **Nota:** Nel progetto che hai scaricato è già presente un APK pre-buildato in `android/app/build/outputs/apk/debug/app-debug.apk`. Se vuoi solo installare l'app, copia quel file sul telefono e aprilo. Se invece vuoi buildare da zero, segui questa guida.

---

## 📝 Prerequisiti

Devi installare 3 cose sul tuo PC:

### 1. Node.js 20+ (LTS)

1. Vai su https://nodejs.org/
2. Clicca sul pulsante verde **"LTS"** (Long Term Support)
3. Scarica e installa con tutte le opzioni di default
4. Verifica aprendo **PowerShell** o **Prompt dei comandi** e scrivendo:
   ```
   node --version
   npm --version
   ```
   Dovresti vedere numeri di versione (es. `v20.x.x`)

### 2. Java JDK 21

1. Vai su https://adoptium.net/
2. Seleziona **Eclipse Temurin**, versione **21**, tipo **JDK**
3. Scarica il file `.msi` per Windows x64
4. Installa con tutte le opzioni di default
5. **Importante:** aggiungi JAVA_HOME alle variabili d'ambiente:
   - Cerca "Variabili d'ambiente" nel menu Start
   - Clicca su "Variabili d'ambiente..."
   - In "Variabili di sistema" clicca "Nuova..."
   - Nome: `JAVA_HOME`
   - Valore: `C:\Program Files\Eclipse Adoptium\jdk-21...` (il percorso dove è stato installato)
   - Trova la variabile `Path`, selezionala e clicca "Modifica..."
   - Aggiungi: `%JAVA_HOME%\bin`
6. Verifica riaprendo PowerShell:
   ```
   java -version
   ```
   Deve mostrare "openjdk version 21.x.x"

### 3. Android SDK

Il modo più semplice è tramite **Android Studio**:

1. Vai su https://developer.android.com/studio
2. Scarica e installa Android Studio
3. Al primo avvio, Android Studio ti chiederà di scaricare l'SDK — accetta tutto
4. Se hai già Android Studio, apri **SDK Manager** (icona ingranaggio → SDK Manager)
5. Nella scheda **SDK Platforms**, spunta:
   - ☑ Android 14.0 ("UpsideDownCake") — API Level 34
6. Nella scheda **SDK Tools**, spunta:
   - ☑ Android SDK Build-Tools 34
   - ☑ Android SDK Platform-Tools
   - ☑ Android SDK Command-line Tools
7. Clicca **Apply** e aspetta il download

8. **Imposta ANDROID_HOME** nelle variabili d'ambiente:
   - Nome: `ANDROID_HOME`
   - Valore: `C:\Users\TUO_NOME_UTENTE\AppData\Local\Android\Sdk`
   - (sostituisci TUO_NOME_UTENTE con il tuo nome utente Windows)

---

## 🚀 Build dell'APK

### Metodo facile: doppio click

1. Apri la cartella del progetto `codelearn/`
2. Fai doppio click su **`build-apk.bat`**
3. Aspetta che finisca (può richiedere 5-15 minuti al primo avvio)
4. L'APK si troverà in:
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

### Metodo manuale: riga di comando

Apri **PowerShell** o **Prompt dei comandi** nella cartella del progetto e esegui uno alla volta:

```bash
# 1. Installa le dipendenze
npm install

# 2. Builda l'app web
npm run build

# 3. Sincronizza Capacitor con Android
npx cap sync android

# 4. Builda l'APK
cd android
.\gradlew.bat assembleDebug
cd ..
```

---

## 📱 Installazione sul telefono

### Metodo 1: Copia diretta
1. Collega il telefono al PC con cavo USB
2. Copia `app-debug.apk` nel telefono
3. Sul telefono, apri **Impostazioni → Sicurezza → Installazione da origini sconosciute** e abilitala per il tuo file manager
4. Trova il file APK nel telefono e aprilo
5. Clicca **Installa**

### Metodo 2: ADB (più veloce)
1. Abilita **Opzioni sviluppatore** sul telefono:
   - Impostazioni → Info sul telefono → clicca 7 volte su "Numero build"
2. In Opzioni sviluppatore, abilita **Debug USB**
3. Collega il telefono al PC
4. Apri PowerShell nella cartella del progetto:
   ```bash
   adb install android\app\build\outputs\apk\debug\app-debug.apk
   ```

---

## ❌ Troubleshooting

### "java non è riconosciuto come comando"
- JDK non installato o JAVA_HOME non impostato correttamente
- Riavvia PowerShell dopo aver modificato le variabili d'ambiente

### "ANDROID_HOME non impostato"
- Verifica che la cartella `C:\Users\TUO_NOME\AppData\Local\Android\Sdk` esista
- Se non esiste, apri Android Studio e scarica l'SDK

### "gradlew.bat non trovato"
- Devi essere nella cartella `android/` prima di lanciare il comando
- Il percorso corretto è: `cd android` poi `.\gradlew.bat assembleDebug`

### Build molto lenta
- La prima build scarica molte dipendenze da internet — è normale
- Le build successive saranno molto più veloci

### "Duplicate class kotlin..."
- Questo errore è già risolto nel progetto
- Se ricompare, modifica `android/app/build.gradle` aggiungendo:
  ```gradle
  configurations.all {
      exclude group: 'org.jetbrains.kotlin', module: 'kotlin-stdlib-jdk7'
      exclude group: 'org.jetbrains.kotlin', module: 'kotlin-stdlib-jdk8'
  }
  ```
