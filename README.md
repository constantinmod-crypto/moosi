# Moosi – Fokus-Buddy 🌱

Moosi ist ein kleines Moos-Wesen im Blumentopf. Es wächst, solange du dich konzentrierst.
Du startest einen Fokus-Block (15, 25, 45 oder 60 Minuten), legst das Handy weg, und Moosi wächst.
Gehst du in eine andere App, wird Moosi traurig. Für fertige Blöcke gibt es Münzen, damit kaufst du Hüte und Welten.

## Warum gerade diese Idee (Trend-Check, November 2026)

- **Fokus-Apps gegen Handy-Ablenkung sind gerade gefragt.** „Focus Friend“ wurde App des Jahres bei Google Play und stand ganz oben im App Store, mit genau dieser Idee: ein süßer Begleiter, der dich vom Handy fernhält.
- **Produktivität war 2025 die Kategorie mit dem stärksten Umsatzwachstum** (laut AppTweak fast +80 % zum Vorjahr), Nicht-Spiele-Apps wachsen weiter, Spiele schrumpfen (Sensor Tower, Q2 2026).
- **Abo-Müdigkeit:** Fast alle Apps verlangen Abos. Moosi Pro kostet **einmalig 4,99 €**, das ist ein Verkaufsargument.
- **Eingebaute Werbung durch Nutzer:** Der „Teilen“-Knopf macht ein Story-Bild (Moosi + deine Minuten + Streak) für TikTok und Instagram. Jedes geteilte Bild ist Gratis-Werbung.
- **Du bist die Zielgruppe:** Schüler und Studenten vor Prüfungen (Abi!), Menschen mit ADHS. Du weißt, wie die ticken.

Ehrlich: Niemand kann garantieren, dass eine App Geld bringt. Die App ist fertig und verkaufsbereit, der Erfolg hängt fast nur davon ab, ob Leute sie sehen (siehe „Bekannt machen“).

## Was die App kann

| Kostenlos | Pro (4,99 € einmalig) |
|---|---|
| Fokus-Blöcke 15/25/45/60 Min | Eigene Zeit von 5 bis 180 Min |
| Moosi wächst in 5 Stufen | Exklusive Sachen: Krone, Ozean-Welt, Weltall-Welt |
| Münzen, Shop mit Hüten und Welten | 30-Tage-Statistik |
| Streak (Tage am Stück) | Export der Statistik als CSV-Datei |
| 7-Tage-Statistik, Teilen-Bild | |
| Deutsch und Englisch, offline nutzbar, als App installierbar | |

Keine Konten, kein Tracking, keine Werbung. Alles bleibt auf dem Gerät des Nutzers. Dadurch: kein Server, keine laufenden Kosten, kaum Datenschutz-Aufwand.

## So bringst du Moosi online (kostenlos, 1 Klick)

1. Im Repo **Settings → Pages → Source: „Deploy from a branch“, Branch: `main`, Ordner `/ (root)` → Save.**
2. Nach 1–2 Minuten ist die App unter `https://constantinmod-crypto.github.io/moosi/` erreichbar.
3. Auf dem Handy öffnen → „Zum Home-Bildschirm“ (iPhone: Teilen-Symbol; Android: Menü → „App installieren“).

## Geld verdienen: Pro verkaufen über Gumroad

Gumroad übernimmt Bezahlung, Rechnungen, Mehrwertsteuer in der EU und schickt Käufern automatisch einen Lizenzschlüssel. Kosten: nur eine Gebühr pro Verkauf, keine Grundgebühr.

1. Konto auf gumroad.com erstellen, Auszahlung aufs Bankkonto einrichten.
2. Neues Produkt: „Digital product“, Name **Moosi Pro**, Preis **4,99 €**.
3. Im Produkt „**License key**“ einschalten („Generate a unique license key per sale“). Dort steht die **Produkt-ID**.
4. In `config.js` eintragen:
   - `gumroadProductId:` die Produkt-ID
   - `buyUrl:` der Link zur Verkaufsseite (z. B. `https://DEINNAME.gumroad.com/l/moosi-pro`)
5. Hochladen, fertig. Käufer tippen in der App auf „✨ Pro“, kaufen, kopieren den Schlüssel aus der Mail und schalten frei. Erstattete Käufe werden automatisch wieder gesperrt.

**Vorher Pflicht (Deutschland):**
- `impressum.html`: echten Namen, Adresse, E-Mail eintragen (die Platzhalter in eckigen Klammern ersetzen).
- **Gewerbe anmelden** beim Gewerbeamt deiner Gemeinde (ca. 20–40 €, geht oft online), bevor du verkaufst. Als Kleinunternehmer (§ 19 UStG) bis 25.000 € Umsatz im Jahr meist ohne Umsatzsteuer-Aufwand. Bei Unsicherheit kurz beim Finanzamt oder einem Steuerberater nachfragen.

## Bekannt machen (das ist der wichtigste Teil)

1. **TikTok / Instagram Reels**, 3–4 Videos pro Woche, Hochformat:
   - „POV: Du lernst fürs Abi und dein Moos-Freund passt auf, dass du nicht aufs Handy schaust“
   - Zeitraffer: 45 Minuten lernen, Moosi wächst von klein zu groß mit Blume
   - „Ich hab mir mit 19 meine eigene Fokus-App gebaut“ (Entwickler-Story zieht gut)
   - Hashtags: #studytok #lernen #abitur #adhd #fokus #productivity
2. **Reddit:** r/GetStudying, r/ADHD (Regeln lesen, ehrlich als eigenes Projekt vorstellen).
3. **Schule / Freunde:** Lerngruppen vor Prüfungen, Abi-WhatsApp-Gruppen.
4. **Product Hunt** (englisch), sobald die ersten 20–50 Nutzer da sind.
5. **Später: Google Play.** Mit PWABuilder (pwabuilder.com) aus der Web-App eine Android-App machen. Google verlangt dann Googles eigenes Bezahlsystem für Pro-Käufe in der App. Die Schritte kennst du schon aus `trading-hub/docs/STORES.md`.

## Ideen für später

- Lern-Räume: zusammen mit Freunden fokussieren (braucht einen Server)
- Mehr Moosi-Arten zum Freischalten, saisonale Hüte (Weihnachten, Halloween)
- Widget / Benachrichtigung, wenn der Block fertig ist

## Technik (für Neugierige)

Reine Web-App ohne Installation: `index.html`, `style.css`, `app.js` (die ganze Logik), `config.js` (deine Verkaufs-Einstellungen), `sw.js` (offline), `manifest.webmanifest` (installierbar).
Lokal ausprobieren: im Ordner `python3 -m http.server` starten und `http://localhost:8000` öffnen.
Nach Änderungen an den Dateien in `sw.js` die `VERSION` hochzählen, damit Handys das Update bekommen.

Quellen zum Trend-Check: Sensor Tower (Q2 2026, Nicht-Spiele +14,6 %), AppTweak „App market size by category“, 9to5Mac (11.08.2026), Berichte zu „Focus Friend“ als Google-Play-App des Jahres.
