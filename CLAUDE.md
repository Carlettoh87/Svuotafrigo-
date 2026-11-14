# Svuotafrigo — istruzioni per Claude

Web app personale per iPhone (un solo file `index.html`, più `sw.js`, `manifest.webmanifest`, `icon.png`, `icon-512.png`), pubblicata con GitHub Pages su https://carlettoh87.github.io/Svuotafrigo-/.

## Regola fissa: manuale sempre allineato

Ogni volta che aggiungi, togli o cambi una funzione visibile all'utente (nuova scheda, pulsante, impostazione, messaggio di errore, comportamento):

1. Aggiorna il documento **Svuotafrigo · Manuale d'uso** (https://claude.ai/artifact/EMTLm65XApY5tSfaxjYvpB): modifica solo le sezioni toccate, nello stesso stile (frasi brevi, passaggi numerati, nomi dei pulsanti in grassetto).
2. Esporta di nuovo il manuale in PDF (A4) e consegnalo all'utente.
3. Nella risposta indica in una riga quali sezioni del manuale sono cambiate.

## Privacy

- Il repository è pubblico: niente chiavi API, nomi di persone o riferimenti a diete o salute nel codice, nei commit o in questo file.
- La chiave API sta solo nel manuale (documento privato) e nelle Impostazioni dell'app sul telefono.

## Pubblicazione

- Prima di pubblicare, prova le modifiche in automatico (jsdom o Playwright) e controlla la sintassi del JavaScript.
- Dopo il push verifica che i file online coincidano con quelli locali.
- Se cambi `sw.js` o la lista dei file in copia, aumenta il numero in `CACHE`.
