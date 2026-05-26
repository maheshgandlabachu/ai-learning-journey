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

## Word sources

| Mode | Description |
|------|-------------|
| **Internet (default)** | Random English words + definitions from free global dictionary APIs |
| **Local backup** | `data/words.json` on your PC (120 words) |
| **Auto fallback** | Uses local list if the internet is down |

Your **PC must be online** when you start a round. The phone only needs Wi-Fi to reach the PC.

## How to play (real Spell Bee style)

1. Pick difficulty, word source, and number of words.
2. **Hear the word** — it plays automatically (tap again to repeat).
3. **Type the spelling** and tap **Submit**.
4. Optional: tap **Definition** or **Use in a sentence** only if you need help (like a real bee).
5. See your score at the end.

## Files

| File | Purpose |
|------|---------|
| `SpellBee.py` | Server |
| `online_words.py` | Fetches words from the internet |
| `data/words.json` | Local backup word lists |
| `templates/index.html` | Screens |
| `static/app.js` | Game logic |
| `static/style.css` | Mobile UI |

## Port

Uses port **5001** so it can run while Chess App uses 5000.

## Native app later?

This is a **web app** (like your Chess project). For a Play Store / App Store build later, you can wrap it with **Capacitor** or rebuild with **Kivy** / **Flet**.
