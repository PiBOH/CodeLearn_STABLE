# CodeLearn — Impara a Programmare   |   Versione 1.0.2f  -> STABILE

[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)

| la versione `1.0.2g-NUMEROTEST` è in fase di sviluppo -> sono previste importanti correzioni ad alcuni corsi che al momento si "interrompono" e ti impediscono di finirli |

---

## 🚀 Caratteristiche

- **10 linguaggi di programmazione** — Python, JavaScript, Java, Kotlin, Swift, C#, C++, C, PHP, HTML
- **100+ lezioni** — teoria, esercizi pratici, quiz e progetti
- **Editor di codice integrato** — con syntax highlighting per tutti i linguaggi
- **Gamification** — XP, livelli, badge, streak giornalieri, sfide
- **Percorsi di carriera** — Frontend, Backend, Mobile, Full Stack, Systems, Game Dev
- **Classifica** — confrontati con altri studenti
- **PWA + APK Android** — installabile su iOS (via Safari) e Android (via APK)

---

## 💽 Versione Demo (solo 1.0.2d)

L'app è deployata su Vercel e accessibile da qualsiasi browser moderno senza bisogno di installare niente, funziona su tutti i sistemi operativi (dal link)


https://codelearn-73ci.arcada.app

N.B. questa versione contiene molti bug durante l' esecuzione di vari percorsi (impossibilità di completarli). Quindi se ti interessa usarla come si deve consiglio di scaricare sempre l'ultima versione o fare da sé il deploy (sempre dell'ultima versione)

---

## 📦 Installazione

### Prerequisiti
- Node.js 20+
- npm

### Clona e avvia

```bash
git clone <repo-url>
cd codelearn
npm install
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`.

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
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

L'APK si troverà in `android/app/build/outputs/apk/debug/app-debug.apk`.


>se dopo queste belle istruzioni che ho scritto con fatica e impegno continui a non avere capito niente ti consuglio di usare Claude AI (gratuita) per fare tutto.

---
## 📱 APK Prebuildato (Versione 1.0.2f)

Trovi il file apk prebuildato con il nome CodeLearn_STABLE_V1.0.2f

Nel caso tu non lo riesca a trovare lascio qui l'indirizzo link diretto per il download del file:
[https://github.com/PiBOH/CodeLearn_STABLE/raw/refs/heads/main/CodeLearn_STABLE_V1.0.2f.apk)

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
