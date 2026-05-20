# Guida Build APK su Windows — CodeLearn BETA V1.1.1a-5

## ❓ Perché `.\gradlew` non funziona in PowerShell?

Su Windows PowerShell, `.\gradlew` non funziona perché è uno script shell Unix (`.sh`).  
Su Windows devi usare **`.\gradlew.bat`**.

Inoltre, `gradlew.bat` richiede il file `gradle-wrapper.jar` per avviarsi.  
Questo file **non è incluso nel zip** (è troppo grande e viene rigenerato automaticamente).

---

## ✅ Flusso completo consigliato (PowerShell)

```powershell
# 1. Dalla ROOT del progetto
npm install
npm run build
npx cap sync android

# 2. Prima build: scarica gradle-wrapper.jar (solo la prima volta)
cd android
.\SETUP_WRAPPER.ps1   # ← esegui UNA SOLA VOLTA

# 3. Builda l'APK
.\gradlew.bat assembleDebug
```

**APK output:** `android\app\build\outputs\apk\debug\app-debug.apk`

---

## 🔁 Dalla seconda build in poi

```powershell
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```

---

## 🎯 Alternativa: Android Studio (più semplice)

```powershell
npm install
npm run build
npx cap sync android
npx cap open android
```

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

Android Studio gestisce tutto automaticamente, incluso il download di Gradle.

---

## 🔧 Prerequisiti

| Strumento | Versione | Download |
|-----------|----------|----------|
| Node.js | 18+ | https://nodejs.org |
| Java JDK | 17 | https://adoptium.net |
| Android Studio | Latest | https://developer.android.com/studio |

### JAVA_HOME su Windows
Assicurati che `JAVA_HOME` punti al JDK 17:
```
Variabili d'ambiente di sistema → JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot
```
