# Istruzioni per Windows

## Problema: "npm" non è riconosciuto

Questo significa che **Node.js non è installato** sul tuo PC. Segui questi passaggi per installarlo.

---

## 🔋 Passo 1: Installa Node.js (include npm)

1. Vai su https://nodejs.org/
2. Scarica la versione **LTS** (quella consigliata, con il pulsante verde)
3. Esegui il file `.msi` scaricato
4. Segui la procedura guidata:
   - Clicca **Next** fino alla fine
   - **IMPORTANTE**: spunta la casella "Automatically install the necessary tools" se presente
   - Clicca **Install**
5. Al termine, clicca **Finish**

---

## ✅ Passo 2: Verifica l'installazione

Apri il **Prompt dei comandi** (cmd) o **PowerShell** e digita:

```cmd
node --version
npm --version
```

Dovresti vedere qualcosa come:
```
v22.14.0
10.9.2
```

Se vedi i numeri di versione, l'installazione è riuscita!

---

## 🚀 Passo 3: Avvia CodeLearn

1. Estrai il file `codelearn.zip` in una cartella (es. `C:\codelearn`)
2. Apri il Prompt dei comandi in quella cartella:
   - Tasto destro nella cartella → "Apri nel terminale" (Windows 11)
   - Oppure: digita `cmd` nella barra degli indirizzi di Esplora risorse
3. Esegui questi comandi:

```cmd
npm install
npm run dev
```

4. Apri il browser e vai su: **http://localhost:5173**

---

## 📱 Build APK Android (opzionale)

Per generare il file APK serve anche:
- **JDK 21** → https://adoptium.net/ (scarica "Eclipse Temurin JDK 21")
- **Android Studio** → https://developer.android.com/studio

Dopo averli installati:

```cmd
npm run build
npx cap sync android
```

Poi apri la cartella `android` in Android Studio e fai **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

---

## 💡 Problemi comuni

| Problema | Soluzione |
|----------|-----------|
| "npm" non trovato anche dopo installazione | Riavvia il PC, poi riprova |
| Errore durante `npm install` | Aggiorna npm: `npm install -g npm` |
| Porta 5173 occupata | Cambia porta: `npm run dev -- --port 3000` |
| Build molto lenta | Chiudi altri programmi, serve almeno 4GB RAM libera |

---

## 📚 Documentazione utile

- Node.js: https://nodejs.org/
- npm: https://docs.npmjs.com/
- Vite: https://vitejs.dev/guide/
- Capacitor: https://capacitorjs.com/docs
