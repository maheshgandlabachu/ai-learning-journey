# Chess App

A two-player chess game that runs in your **web browser** on Windows, Mac, and mobile (phone/tablet).

## Setup

```bash
cd RealProject
pip install -r requirements.txt
python ChessApp.py
```

## Play

| Device | URL |
|--------|-----|
| This computer | http://127.0.0.1:5000 |
| Phone (same Wi-Fi) | http://YOUR_PC_IP:5000 (printed when you start the app) |

## Features

- Full chess rules (check, checkmate, stalemate, castling, en passant, promotion)
- Touch-friendly board for phones
- Undo last move
- New game

## How to play

1. White moves first — tap a white piece, then tap a highlighted square.
2. Black moves next — same for black pieces.
3. Pawn promotion: choose Queen, Rook, Bishop, or Knight when prompted.

## Project files

| File | Purpose |
|------|---------|
| `ChessApp.py` | Server and game logic |
| `templates/index.html` | Page layout |
| `static/style.css` | Board styling (mobile + desktop) |
| `static/app.js` | Board interaction |

## Note on “mobile app”

This is a **web app** you open in Safari/Chrome on your phone — no App Store install needed. For a native iOS/Android app later, you could wrap this with tools like Capacitor or build a Kivy version.
