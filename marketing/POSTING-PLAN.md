# Moosi: TikTok- und Instagram-Plan

## Accounts

- **Name überall gleich:** `@moosi.app` (falls vergeben: `@moosi.focus` oder `@moosiapp`). Mit Doppel-o, wie die App, nicht „Musi“.
- **Profilbild:** `icons/icon-512.png`
- **Bio:** `Dein Fokus-Buddy 🌱 wächst nur, wenn du nicht aufs Handy schaust · kostenlos 👇`
- **Link in Bio:** `https://constantinmod-crypto.github.io/moosi/`
- TikTok: unter Einstellungen auf **Business-Konto** umstellen (kostenlos). Dann darf man Videos vorplanen, sieht Statistiken und bekommt die kommerziell freigegebenen Sounds.

## Die 4 Videos (Ordner `videos/`)

**Wichtig:** Die Videos haben absichtlich **keine Musik**. Füg in TikTok/Instagram beim Hochladen einen **gerade angesagten Sound** hinzu (Button „Sound hinzufügen“, dort oben die Trends). Das bringt viel mehr Reichweite als eigene Musik. Lautstärke vom Sound eher leise.
Als Titelbild (Cover) die passende `-cover.jpg` nehmen.

### 1-handy-check.mp4 (12 s), der stärkste Clip, zuerst posten
Text:
> wenn sogar deine pflanze enttäuscht von dir ist 🥺🌱 #studytok #lernen #abitur #fokus #handysucht #moosi

### 2-zeitraffer.mp4 (11 s)
Text:
> 45 min fokus = ein glückliches moosi 🌱 wer lernt heute auch noch? #studywithme #lernen #pomodoro #abi2027 #produktivität #moosi

### 3-outfit.mp4 (10 s), damit Leute kommentieren
Text:
> ehrlich jetzt, welcher hut? 1-5 👇 #moosi #cute #studytok #lernen #fokus
Auf jeden Kommentar antworten (z. B. „4 ist auch mein favorit 👑“). Kommentare pushen das Video.

### 4-story.mp4 (14 s)
Text:
> hab mir mit ki eine app gebaut, weil ich fürs abi lernen muss 💀 link in bio #abitur #ki #appentwicklung #studytok #bildschirmzeit #moosi

## Wann posten

| Woche | Mo | Mi | Fr | So |
|---|---|---|---|---|
| 1 | Video 1 | Video 2 | Video 3 | Video 4 |
| 2 | das beste Video der Woche 1 nochmal, mit anderem Sound und Text | neues Video | neues Video | neues Video |

- **Uhrzeit:** 17–19 Uhr (nach Schule und Uni) oder 20–21 Uhr. Sonntags abends lernen viele, gut für Lern-Inhalte.
- **Vorplanen:** TikTok: am Computer in TikTok Studio → „Hochladen“ → „Planen“ (bis 10 Tage im Voraus). Instagram: Meta Business Suite → „Beitrag planen“ (als Reel). So sind 4 Videos in 15 Minuten für die ganze Woche erledigt.
- Gleiche Videos auf **TikTok, Instagram Reels und YouTube Shorts**. Kostet nichts extra.

## Regeln, damit es klappt

1. **Die ersten 2 Tage nach dem Posten** selbst in die Kommentare schauen und antworten.
2. **Nicht nach 3 Videos aufgeben.** Die meisten Accounts brauchen 20–30 Videos, bis eins durchgeht. Wenn ein Video deutlich besser läuft (mehr als doppelt so viele Aufrufe): Claude Bescheid sagen, dann mache ich 3 Varianten davon.
3. Kein Spam in fremden Kommentaren, keine gekauften Follower: Das bestraft TikTok.
4. Die Videos zeigen die echte App, nichts wird versprochen, was sie nicht kann.

## Neue Videos machen

`node marketing/render.js` erzeugt alle Videos neu (braucht Node, Playwright, ffmpeg). Die Szenen stehen in `marketing/studio.html`. Neue Ideen einfach Claude sagen.

**Ideen für die nächsten Runden:**
- „Lernen mit Moosi, Tag 1 bis 30“ (Serie, Moosi wird jeden Tag größer)
- „Dinge, die Moosi traurig machen“ (Handy, Instagram, „nur noch 1 Folge“)
- „Abi in X Tagen, heute: 2 Stunden Fokus“ (Countdown-Serie bis zum Abi)
- Echte Videos von dir: Handy neben dem Lernheft, Moosi läuft, Zeitraffer (wirkt am echtesten)
