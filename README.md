# Buster Keaton Film Festival 


**Grupprojekt · HTML / CSS / JavaScript · Vanilla frontend med localStorage**

 
- Repot är en lätt städad kopia av ett grupprojekt byggt 8/12 2025 - 2/1 2026. 
- README fokuserarar därför på mina delar.
- Sidan representerar den inloggade användarens vy.

🎬 **[Live demo](https://anneliejrova.github.io/BusterKeaton/)**

### Instruktion för granskning av layout
Notera: För att se herons fulla responsivitet och hur den växlar mellan portrait- och landscape-logik, rekommenderas att använda webbläsarens Device Mode (i DevTools). Eftersom layouten styrs av både orientation och specifika brytpunkter för aspect-ratio, ger en enkel minskning av fönsterbredden på en desktop inte en rättvisande bild av hur systemet anpassar sig på mobila enheter.

---

## Om projektet

Det fiktiva "The North End Picture Lounge" håller en tvådagarsfestival med 12 stumfilmsklassiker av Buster Keaton, varav två visas med livemusik. Användaren kan bläddra bland filmer, boka visningar och se sitt personliga schema.

Temavalet var mitt förslag. Buster Keatons tidiga filmer och filmpostrar är public domain, vilket gav projektet fri tillgång till autentiskt bildmaterial utan upphovsrättsliga begränsningar – ett praktiskt problem löst innan det hann bli ett.

## Tech stack

| Teknik | Användning |
|---|---|
| HTML5 | Tre sidor: `index.html`, `myscreenings.html`, `aboutkeaton.html` |
| CSS | Komponentuppdelad: `hero.css`, `card.css`, `screenings.css` m.fl. |
| Vanilla JavaScript | DOM-manipulation, `fetch`, `localStorage` |
| JSON | Datakälla för 12 filmer med visningsschema |
| Google Fonts | Lora + Roboto Condensed |
| Material Symbols | Hamburgermenyikon |


## Projektstruktur

```text
├── css/
│   ├── general.css
│   ├── header.css
│   ├── hero.css
│   ├── card.css
│   ├── screenings.css
│   ├── main.css
│   └── footer.css
├── js/
│   ├── booking.js
│   ├── screenings.js
│   └── menu.js
├── images/
├── movies.json
├── index.html
├── myscreenings.html
└── aboutkeaton.html
```

CSS är medvetet uppdelad per komponent. Det var mitt förslag för att minimera merge-konflikter – varje gruppmedlem kunde jobba i sin egen fil utan att röra andras kod.

## Mina bidrag

### Hero

Heron är byggd för att fungera i både portrait och landscape utan att textboxen tappar sin placering. Lösningen är två separata bildfiler – en per orientation – förbearbetade i Gimp med rotation och horisontell flip. CSS-klasser styr vilken som visas. En känd konsekvens är att båda filerna laddas oavsett orientation, ett avvägningsbeslut som gjordes med hänsyn till tidsramen.

Textstorleken är beroende av `vw` och `vh` när heron fyller hela viewporten och övergår till fasta mått när layouten låses – något jag idag hade löst med `clamp()` för bättre kontroll.

### Datamodell och State Management

Det här projektet var mitt första där jag använde en JSON-fil för att mocka ett backend-svar och etablera ett gemensamt datakontrakt för gruppen. Jag introducerade strukturen tidigt – innan det tagits upp på lektion – för att vi inte skulle behöva hårdkoda varje filmkort och för att ge den som jobbade med korten en tydlig mall att utgå ifrån.

Varje filmobjekt i JSON-filen fungerar som en blueprint för en visning. Här använder jag parallella arrayer för showtimes och seats för att definiera startvärden:

``` JSON
{
  "id": "9b7e5d22-1234-4567-890a-112233445566",
  "day": 1,
  "screen": 1,
  "title": "The General",
  "showtimes": ["18:30:00", "20:30:00"],
  "seats": [30, 30]
}
```

För att hantera dynamisk data (platstillgång och bokningar) implementerade jag en logik där localStorage fungerar som applikationens state. Vid initial laddning läses standardvärden från JSON, men därefter persisteras och uppdateras all data i webbläsaren för att bevara användarens val vid sidomladdning.

### Bokningssystem och Logik
Bokningssystemet (`booking.js`) är en lösning jag utvecklat helt på egen hand. Jag valde att bygga systemet iterativt för att säkerställa en stabil MVP (Minimum Viable Product) genom hela utvecklingsprocessen:

1. **Dataskikt:** Rendera filmkort dynamiskt från `movies.json` via `fetch`.
2. **Persistence:** Implementera boka-knappar som skriver till `localStorage`.
3. **Affärslogik:** Addera kollisionsdetektering och platsräkning.
4. **Presentation:** Skapa "My Screenings"-vyn som korskör data och renderar schemat.

**Tekniska höjdpunkter i min lösning:**

* **Kollisionsdetektering:** Jag byggde en algoritm som räknar om filmens längd och starttid till minuter via `timeToMinutes`. Om en användare försöker boka en film som överlappar med en befintlig bokning, triggas en varning som ger valet att avboka den gamla visningen till förmån för den nya.
* **UUID-safe Parsing:** För att hantera bokningar skapade jag en parser som extraherar `movieId`, `day` och `time` från en sammansatt strängnyckel. Genom att använda `.split("-")` och `.pop()` säkerställde jag att logiken fungerar även med komplexa UUID:n som innehåller bindestreck.
* **Dynamisk State:** Vyn "My Screenings" korskör data från `localStorage` mot JSON-datat för att rendera ett personligt schema i HTML-tabeller, med full funktionalitet för att hantera avbokningar och platsåterställning direkt i vyn.

> **Reflektion:** Att arbeta mot tydliga delleveranser var ett medvetet val. Det gjorde att jag kunde säkra och testa kärnfunktionaliteten tidigt, vilket minimerade stress vid integrationen och garanterade att jag alltid hade en fungerande produkt att visa upp.


## Vad jag skulle gjort annorlunda

- **`clamp()` för textstorlek i heron** – mer förutsägbart än `vw`/`vh` när layouten växlar mellan flytande och låst bredd.
- **Herobilden** – För att optimera prestandan och förhindra att onödig data laddas ner, skulle jag bytt ut CSS-styrda bakgrundsbilder mot ett <picture>-element med specifika media="(orientation: ...)"-attribut. Detta tillåter webbläsaren att endast ladda ner den bildresurs som faktiskt krävs för användarens nuvarande skärmläge.
- **Normalisera localStorage-schemat** – separera bokade id:n från platsstatus för att göra `screenings.js` lättare att underhålla och bygga vidare på.
- **Separera concerns** – Dela upp booking.js i mindre delar.
- **Snyggare popup** – Designa och koppla en bättre popup till varningen att man inte kan dubbelboka och måste välja vilken film man vill gå på.
---

*Övriga delar av sidan – kortdesign och layout – gjordes av andra gruppmedlemmar.*