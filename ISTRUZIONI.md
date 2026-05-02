# ISTRUZIONI PER USARE CODELEARN
## (Scritte per chi non ha mai usato un computer)

---

## PARTE 1: COME VEDERE L'APP SUL COMPUTER

### Passo 1: Scarica Node.js
1. Apri il tuo browser (Chrome, Firefox, Edge)
2. Vai su questo sito: https://nodejs.org
3. Cerca il pulsante verde grande che dice "LTS" o "20.x.x LTS"
4. Clicca sul pulsante verde per scaricare
5. Apri il file scaricato e installa cliccando "Avanti" fino alla fine
6. Riavvia il computer

### Passo 2: Apri il terminale
- Se hai Windows: premi il tasto Windows, scrivi "cmd" e premi Invio
- Se hai Mac: premi Command + Spazio, scrivi "terminale" e premi Invio
- Se hai Linux: cerca "terminale" nel menu applicazioni

### Passo 3: Entra nella cartella del progetto
1. Trova la cartella "codelearn" sul tuo computer
2. Copia il percorso completo della cartella (esempio: C:\Users\Mario\Desktop\codelearn)
3. Nel terminale scrivi: cd poi incolla il percorso e premi Invio
   Esempio:
   ```
   cd C:\Users\Mario\Desktop\codelearn
   ```

### Passo 4: Installa i componenti necessari
Nel terminale scrivi esattamente questo:
```
npm install
```
Poi premi Invio.
Aspetta che finisca (puo' richiedere alcuni minuti).

### Passo 5: Avvia l'app
Nel terminale scrivi esattamente questo:
```
npm run dev
```
Poi premi Invio.

### Passo 6: Apri l'app nel browser
1. Aspetta che compaia un indirizzo tipo: http://localhost:5173
2. Clicca su quell'indirizzo con il mouse, oppure
3. Apri il browser e scrivi nella barra degli indirizzi: localhost:5173
4. L'app si aprira'!

### Passo 7: Per chiudere l'app
Torna nel terminale e premi i tasti CTRL e C insieme.

---

## PARTE 2: COME CREARE IL FILE APK PER ANDROID

### Passo 1: Installa Java (JDK 21)
1. Apri il browser
2. Vai su: https://adoptium.net
3. Cerca "Temurin 21"
4. Scarica la versione per il tuo sistema operativo
5. Installa cliccando "Avanti" fino alla fine

### Passo 2: Installa Android Studio
1. Vai su: https://developer.android.com/studio
2. Scarica Android Studio
3. Installa cliccando "Avanti" fino alla fine
4. Quando si apre, clicca su "More Actions" poi "SDK Manager"
5. Nella scheda "SDK Platforms", spunta "Android 14.0 (API 34)"
6. Nella scheda "SDK Tools", spunta "Android SDK Build-Tools 34"
7. Clicca "Apply" e aspetta che finisca il download

### Passo 3: Prepara l'app
1. Apri il terminale
2. Entra nella cartella "codelearn" (come spiegato prima)
3. Scrivi questo e premi Invio:
   ```
   npm install
   ```
4. Poi scrivi questo e premi Invio:
   ```
   npm run build
   ```
5. Poi scrivi questo e premi Invio:
   ```
   npx cap sync android
   ```

### Passo 4: Builda l'APK
1. Nel terminale, entra nella cartella "android":
   ```
   cd android
   ```
2. Poi scrivi questo e premi Invio:
   - Su Windows:
     ```
     gradlew.bat assembleDebug
     ```
   - Su Mac o Linux:
     ```
     ./gradlew assembleDebug
     ```
3. Aspetta molto tempo (anche 10-15 minuti la prima volta)
4. Quando finisce, il file APK si trova in:
   ```
   codelearn/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Passo 5: Installa l'APK sul telefono
1. Collega il telefono Android al computer con il cavo USB
2. Sul telefono, vai in Impostazioni > Info sul telefono > clicca 7 volte su "Numero build"
3. Torna indietro, entra in "Opzioni sviluppatore" e attiva "Debug USB"
4. Nel terminale scrivi:
   ```
   adb install app-debug.apk
   ```
   (adb si trova nella cartella platform-tools di Android SDK)
5. Oppure copia il file APK sul telefono e aprilo con un file manager

---

## PARTE 3: COME AGGIUNGERE L'APP ALLA SCHERMATA HOME (SENZA APK)

### Su iPhone (iOS 14+)
1. Apri Safari
2. Vai all'indirizzo dell'app (quello che ti da' npm run dev, oppure l'URL online)
3. Tocca il pulsante "Condividi" (il quadrato con la freccia in alto)
4. Scorri in basso e tocca "Aggiungi a schermata Home"
5. Tocca "Aggiungi"

### Su Android (6.0+)
1. Apri Chrome
2. Vai all'indirizzo dell'app
3. Tocca i tre puntini in alto a destra
4. Tocca "Aggiungi a schermata Home" o "Installa app"
5. Conferma

---

## PARTE 4: COME PUBBLICARE SU GITHUB

### Passo 1: Crea un account
1. Vai su https://github.com
2. Clicca "Sign up"
3. Segui le istruzioni per creare l'account

### Passo 2: Crea un nuovo repository
1. Clicca sul pulsante verde "New" o "Nuovo"
2. Scrivi "codelearn" come nome
3. Clicca "Create repository"

### Passo 3: Carica i file
1. Nella pagina del repository, cerca la sezione "...or push an existing repository"
2. Copia i comandi che ti mostra
3. Apri il terminale nella cartella "codelearn"
4. Incolla e esegui questi comandi uno alla volta:
   ```
   git init
   git add .
   git commit -m "Primo commit"
   git branch -M main
   git remote add origin https://github.com/TUO_NOME_UTENTE/codelearn.git
   git push -u origin main
   ```
5. Quando ti chiede username e password, usa il tuo username GitHub e una "Personal Access Token" (non la password normale)

---

## DOMANDE FREQUENTI

**Q: Cosa e' npm?**
A: E' un programma che scarica i componenti necessari per far funzionare l'app.

**Q: Perche' ci mette tanto?**
A: Perche' deve scaricare molti file da internet. La prima volta e' normale che ci metta 5-10 minuti.

**Q: Cosa faccio se vedo errori?**
A: Copia l'errore e cerca su Google, oppure chiedi aiuto. Gli errori piu' comuni sono:
- "node not found" = Node.js non e' installato correttamente
- "permission denied" = prova a chiudere e riaprire il terminale

**Q: Posso modificare i corsi?**
A: Si! Apri il file src/data/courses.ts con un editor di testo (VS Code, Notepad++) e modifica i testi.

**Q: Posso aggiungere un nuovo linguaggio?**
A: Si! Devi:
1. Aggiungere il corso in src/data/courses.ts
2. Aggiungere le lezioni nello stesso file
3. Aggiungere l'icona in src/lib/icons.ts
4. Aggiornare la lista in src/components/LessonView.tsx
