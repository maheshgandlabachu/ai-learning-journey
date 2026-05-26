# Spell Bee

Spelling game for **Android**, **iPhone**, Windows, and Mac — runs in your mobile browser (no App Store needed).

## Setup

```bash
cd RealProject2
pip install -r requirements.txt
python SpellBee.py
```

## Play on mobile

1. Phone and PC must be on the **same Wi-Fi**.
2. Open the phone URL from the terminal (e.g. `http://192.168.0.199:5001`).
3. **Android (Chrome):** Menu → *Install app* or *Add to Home screen*.
4. **iPhone (Safari):** Share → *Add to Home Screen*.

## How to play

1. Pick difficulty and number of words.
2. Read the **definition** and **sentence** (blank = missing word).
3. Type the correct spelling and tap **Submit**.
4. Use **Hear** for text-to-speech (where supported).
5. Use **Hint** once per word (first letter).

## Files

| File | Purpose |
|------|---------|
| `SpellBee.py` | Server |
| `data/words.json` | Word lists (easy / medium / hard) |
| `templates/index.html` | Screens |
| `static/app.js` | Game logic |
| `static/style.css` | Mobile UI |

## Port

Uses port **5001** so it can run while Chess App uses 5000.

## Native app later?

This is a **web app** (like your Chess project). For a Play Store / App Store build later, you can wrap it with **Capacitor** or rebuild with **Kivy** / **Flet**.
