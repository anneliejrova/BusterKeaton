# Buster Keaton Film Festival

**Grupprojekt · HTML / CSS / JavaScript · Vanilla frontend med localStorage**

> Repot är en kopia av gruppens repo efter lätt städning därav fokuserar README på mina delar av ett grupprojekt.  
> Sidan representerar den inloggade användarens vy.

🎬 **[Live demo](https://anneliejrova.github.io/BusterKeaton/)**

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

CSS är medvetet uppdelad per komponent. Det var mitt förslag för att minimera merge-konflikter – varje gruppmedlem kunde jobba i sin egen fil utan att röra andras kod.

## Mina bidrag

### Hero

Heron är byggd för att fungera i både portrait och landscape utan att textboxen tappar sin placering. Lösningen är två separata bildfiler – en per orientation – förbearbetade i Gimp med rotation och horisontell flip. CSS-klasser styr vilken som visas. En känd konsekvens är att båda filerna laddas oavsett orientation, ett avvägningsbeslut som gjordes med hänsyn till tidsramen.

Textstorleken är beroende av `vw` och `vh` när heron fyller hela viewporten och övergår till fasta mått när layouten låses – något jag idag hade löst med `clamp()` för bättre kontroll.

### Datamodell och rendering

Det här projektet var mitt första där jag använde en JSON-fil för att mocka ett backend-svar och etablera ett gemensamt datakontrakt för gruppen. Jag introducerade strukturen tidigt – innan det tagits upp på lektion – för att vi inte skulle behöva hårdkoda varje filmkort och för att ge den som jobbade med korten en tydlig mall att utgå ifrån.

Varje objekt modellerar en visning med `id` (UUID) som nyckel mot `localStorage`, `day` och `screen` för schemaläggning, samt `showtimes` och `seats` som parallella arrayer – ett värde per visning:

    { "id": "9b7e5d22-...", "day": 1, "screen": 1, "title": "The General",
      "showtimes": ["18:30:00", "20:30:00"], "seats": [30, 30] }

Jag valde specifikt 12 filmer för att ge gruppen layoutmässig flexibilitet. Rendering mot DOM skrevs när heron var klar.

### Bokningssystem och My Screenings

Bokningssystemet byggdes iterativt med tydliga delleveranser längs vägen:

1. Rendera filmkort från `movies.json` via `fetch`
2. Boka-knappar som sparar bokningens `id` och vald tid till `localStorage`
3. Kollisionsdetektering – blockerar överlappande visningar
4. Platsspårning – räknar ned tillgängliga platser per visning och persisterar i `localStorage`
5. My Screenings (där jag även tog hand om design) – korsar `localStorage` med JSON-data och renderar ett schema uppdelat per dag som HTML-tabeller, med möjlighet att avboka direkt från schemat

Att alltid ha en fungerande produkt att visa var ett medvetet val under hela arbetet.

## Vad jag skulle gjort annorlunda

- **`clamp()` för textstorlek i heron** – mer förutsägbart än `vw`/`vh` när layouten växlar mellan flytande och låst bredd.
- **Normalisera localStorage-schemat** – separera bokade id:n från platsstatus för att göra `screenings.js` lättare att underhålla och bygga vidare på.
- **Separera concerns** – Dela upp booking.js i mindre delar.
- **Snyggare poppup** – Designa och koppla en bättre popup till varningen att man inte kan dubbelboka och måste välja vilken film man vill gå på.
---

*Övriga delar av sidan – kortdesign och layout – gjordes av andra gruppmedlemmar.*