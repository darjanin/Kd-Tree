# Kd-Tree
Kd-Strom implementácia na predmet Diskrétne geometrické štruktúry na Matfyze.
Autor: Milan Darjanin

## Online verzia

Online verzia sa nachádza na týchto URL adresách

- [github.milandarjanin.com/Kd-Tree](http://github.milandarjanin.com/Kd-Tree/ )
- [kdtree.milandarjanin.com](http://kdtree.milandarjanin.com/)

Zdrojový kód je aj v repozitári na [github.com/darjanin/Kd-Tree](https://github.com/darjanin/Kd-Tree).

## Spustenie

Táto aplikácia sa spúšťa otvorením `index.html` v prehliadači. Aplikácia bola vyvíjaná na OS X Yosemite, Safari 8. Funkčnosť bola otestovaná pre prehliadače Firefox a Chrome na OS X a na platforme Windows 8 bola aplikácia testovaná v Google Chrome a Internet Explorer 11. Podpora v starých verziách Internet Exploreru nie je možná kvôli chýbajúcim API rozhraniam pre prácu s HTML5 a elementom Canvas. Na platforme Windows odporúčam použitie prehliadača Google Chrome (alebo Opera najnovšia, keďže majú rovnaké jadro).

## Funkcionalita

Implementovaná funkcionalita je vytvorenie Kd stromu po pridaní nového bodu ľavým tlačidlom myši. Bod sa vykreslí a aj deliace úsečky. Tlačidlami v ľavom paneli sa da prepnúť medzi spôsobom rátania *split value*. Východzie nastavenie je medián.

Pravým klikom na pridaný bod sa tento bod zvýrazní, vykreslí sa kružnica v ktorej sa nachádza jeho *k* najbližších susedov. Títo susedia sa vyznačia inou farbou ako je farba vybraného bodu.

Stredným tlačidlom na myši a následnym nakreslením obdlžníka (za stáleho držania stredného tlačidla) sa označia všetky body, ktoré sa nachádzajú v tomto obdlžníku.

## Externé knižnice a zdroje

Jediná externá knižnica použitá je `jQuery` a aj to iba na inicializáciu aplikácie po načítaní dokumentu.

Zdrojový kód pre `Vincent`a - vykresľovanie na `canvas` - bol napísaný s pomocou voľných tutoriálov a dokumentácii k Javascriptovým volaniam pre `canvas`.

Samotný algoritmus kd-stromu (resp. 2D stromu v tomto prípade, keďže sa pohybujeme v 2D) bol napísaný s pomocou prednášok z predmetu **Diskrétne geometrické štruktúry.**