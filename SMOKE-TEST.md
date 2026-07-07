# Manueller Smoke-Test

Sicherheitsnetz für den DOM-/UI-lastigen Code (`Controller.js`, `View.js`), der
nicht automatisiert getestet ist. Vor und nach Änderungen durchgehen.

**Vorbereitung:** `index.html` im Browser öffnen.

## A. Grundfunktionen (Verhalten muss unverändert bleiben)

| #   | Schritt                                      | Erwartetes Ergebnis                                                        |
| --- | -------------------------------------------- | -------------------------------------------------------------------------- |
| A1  | `z1 = 3+4i`, Button **Betrag**               | Ergebnisfeld zeigt `5`, roter Zeiger zu (3,4)                              |
| A2  | `z1 = 1+1i`, Button **Zeigerwinkel**         | `45°`                                                                      |
| A3  | `z1 = 3+4i`, Button **konjugieren**          | `3 - 4i`, Zeiger zu (3,-4)                                                 |
| A4  | `z1 = 2`, Button **Kehrwert**                | `0.5`                                                                      |
| A5  | `z1 = 1+2i`, `z2 = 3+4i`, **addieren**       | `4 + 6i`                                                                   |
| A6  | `z1 = 1+2i`, `z2 = 0`, **dividieren**        | `Nicht definiert!` (kein Zeiger)                                           |
| A7  | ungültige Eingabe `abc`, beliebige Operation | `ungültige Eingabe`                                                        |
| A8  | **zurücksetzen**                             | Ergebnisfeld unsichtbar, Eingaben leer, nur Koordinatensystem              |
| A9  | Maßstab **+/−** mehrfach                     | `scaleLabel` ändert sich, vorhandene Zeiger werden neu skaliert gezeichnet |

## B. Bugfix W4b — mehrfaches Komma als Dezimaltrenner

Reproduktion des behobenen Fehlers (Eingaben mit Komma in Real- **und** Imaginärteil).

| #   | Eingabe                                        | Vorher (Bug)        | Nachher (Fix)               |
| --- | ---------------------------------------------- | ------------------- | --------------------------- |
| B1  | `z1 = 1,5+2,5i`, **Betrag**                    | `ungültige Eingabe` | korrekter Betrag (`≈ 2.92`) |
| B2  | `z1 = 1,5`, **Betrag**                         | `1.5`               | `1.5` (unverändert)         |
| B3  | `z1 = 1,5+2,5i`, `z2 = 0,5+0,5i`, **addieren** | `ungültige Eingabe` | `2 + 3i`                    |

Hintergrund: `String.replace(",", ".")` ersetzt nur das **erste** Komma. Bei zwei
Kommas blieb das zweite stehen, sodass `math.complex(...)` warf. Fix: `replace(/,/g, ".")`.
