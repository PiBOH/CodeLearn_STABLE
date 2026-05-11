# CodeLearn — Impara a Programmare   |   Versione 1.0.2g-13 ->  STABILE

[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![HTML5](https://img.shields.io/badge/HTML5-ffffff?logo=html5&style=flat&color=0a0808&logoColor=E34F26)](https://html.com/)
[![Java](https://img.shields.io/badge/Java-ffffff?logo=openjdk&style=flat&color=f34006&logoColor=000000)](https://www.java.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ffffff?logo=javascript&style=flat&color=000000&logoColor=F7DF1E)](https://www.javascript.com/)
![css](https://img.shields.io/badge/css-ffffff?logo=csswizardry&style=flat&color=0c0b0b&logoColor=F43059)

![Android 14+](https://img.shields.io/badge/Android%2014+-ffffff?logo=android&style=flat&color=0a0808&logoColor=3DDC84)
![Windows](https://img.shields.io/badge/Windows-ffffff?logo=windows&style=flat&color=140e0e&logoColor=0190f9)
![MacOS](https://img.shields.io/badge/MacOS-ffffff?logo=macos&style=flat&color=000000&logoColor=ff5000)
![On-line](https://img.shields.io/badge/On--line-ffffff?logo=googlechrome&style=flat&color=000000&logoColor=4285f4)

[![GitHub Release](https://img.shields.io/github/v/release/PiBOH/CodeLearn?cacheSeconds=10&link=https%3A%2F%2Fgithub.com%2FPiBOH%2FCodeLearn%2Freleases)](https://github.com/PiBOH/CodeLearn/releases)
[![GitHub Release Date](https://img.shields.io/github/release-date/PiBOH/CodeLearn?display_date=published_at&style=flat)](https://github.com/PiBOH/CodeLearn/releases)
[![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/PiBOH/CodeLearn/total?style=flat&logo=GitHub&cacheSeconds=1)](https://github.com/PiBOH/CodeLearn/releases)
![GitHub forks](https://img.shields.io/github/forks/PiBOH/CodeLearn?style=social&logo=GitHub&cacheSeconds=5)
![GitHub last commit](https://img.shields.io/github/last-commit/PiBOH/CodeLearn?style=flat)
[![GitHub project issues](https://img.shields.io/github/issues/PiBOH/CodeLearn.svg)]([https://github.com/PiBOH/CodeLearn/issues)


---

## 🚀 Caratteristiche

- **10 linguaggi di programmazione** — Python, JavaScript, Java, Kotlin, Swift, C#, C++, C, PHP, HTML
- **100+ lezioni** — teoria, esercizi pratici, quiz e progetti
- **Editor di codice integrato** — con syntax highlighting per tutti i linguaggi
- **Gamification** — XP, livelli, badge, streak giornalieri, sfide
- **Percorsi di carriera** — Frontend, Backend, Mobile, Full Stack, Systems, Game Dev
- **Classifica** — confrontati con altri studenti
- **PWA + APK Android** — installabile su iOS (via Safari -> deploy necessario per ultima versione, altrimenti usa la demo) e Android (via APK)

---

## 💽 Versione Demo (solo 1.0.2d)

L'app è deployata su Vercel e accessibile da qualsiasi browser moderno senza bisogno di installare niente, funziona su tutti i sistemi operativi (dal link)


https://codelearn-73ci.arcada.app

N.B. questa versione contiene molti bug durante l' esecuzione di vari percorsi (impossibilità di completarli). Quindi se ti interessa usarla come si deve consiglio di scaricare sempre l'ultima versione o fare da sé il deploy (sempre dell'ultima versione)

---

## 📦 Installazione (Windows/Mac/Linux)

### Prerequisiti
- Node.js 20+
- npm
- java jdk 21

### Clona e avvia

```bash
git clone <repo-url>
cd codelearn
npm install
npm run dev
```

L'app sarà disponibile all'indirizzo `http://localhost:5173`.

---

## 🤖 Build APK Android

### Prerequisiti
- JDK 21
- Android SDK (platform-tools, platform android-34, build-tools 34.0.0)

### Script rapido

```bash
chmod +x build-apk.sh
./build-apk.sh
```

### Comandi manuali

```bash
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

L'APK si troverà in `android/app/build/outputs/apk/debug/app-debug.apk`.

>se dopo queste belle istruzioni che ho scritto con fatica e impegno continui a non avere capito niente ti consuglio di usare Claude AI (gratuita) per fare tutto.

---
## 📱 APK Prebuildato (Versione 1.0.2g-13)

Trovi il file apk prebuildato con il nome CodeLearn_STABLE_V1.0.2g-13

Nel caso tu non lo riesca a trovare lascio qui l'indirizzo link diretto per il download del file:

_https://github.com/PiBOH/CodeLearn/raw/refs/heads/main/CodeLearn_STABLE_V1.0.2g-12.apk_

L'app è compatibile con android 14 o superiore, (ma forse sunziona anche su android 12 e android 13)

---
## 📁 Struttura del progetto

```
codelearn/
├── src/
│   ├── components/     # Componenti React
│   ├── context/        # Stato globale (progressi, utente)
│   ├── data/           # Dati corsi e lezioni
│   ├── lib/            # Utility e icone
│   ├── App.tsx
│   └── main.tsx
├── android/            # Progetto Android (Capacitor)
├── public/             # Asset statici
├── capacitor.config.ts
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🎯 Stack Tecnologico

| Tecnologia | Uso |
|------------|-----|
| Vite | Build tool |
| React 19 | UI framework |
| TypeScript | Tipizzazione |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animazioni |
| React Router | Navigazione |
| Lucide React | Icone |
| Capacitor | Wrapper mobile nativo |

---

## 📝 Licenza

GNU GPL v3.0
