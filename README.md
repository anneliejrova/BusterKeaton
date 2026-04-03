# Buster Keaton Filmfestival

Projektet gjordes i en ny gruppkonstellation under jul och nyår. Valet av Buster Keaton som tema var strategiskt – hans tidigaste filmer är i public domain, vilket även gäller filmposterna, och vi slapp därmed problem med upphovsrätt.

## Mina bidrag till projektet

### Hero
Jag ville skapa en hero som fungerade lika bra i portrait som i landscape-läge. Jag hade turen att hitta en bild som jag kunde rotera 90 grader och flippa horisontellt och ändå behålla en placering som passade för textboxen. Eftersom det var tidigt i utbildningen valde jag att låta textstorleken vara beroende av `vw` och `vh` så att heron alltid fyller skärmen – något jag skulle lösa annorlunda idag.

### JSON-fil och rendering
Jag skapade JSON-filen tidigt för att visa gruppen att vi inte behövde koda varje kort för sig – det hade inte tagits upp på lektion än. Jag byggde strukturen och lät Claude fylla filen med information efter min mall.

Medan jag jobbade på heron designade en gruppmedlem korten baserat på min JSON-fil. När heron var klar kunde jag snabbt skriva renderingen.

### Bokningssystem och schema
Detta byggde jag iterativt, ett steg i taget: rendera kort → fungerande knappar → blockera överlappande bokningar → hålla räkning på platser. Sedan lade jag till "My Screenings" och renderade ett schema från localStorage och JSON-filen. Jag såg till att ha delleveranser längs vägen så att en fungerande produkt alltid fanns att redovisa.
