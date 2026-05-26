"""
Spell Bee — mobile-friendly (Android & iOS via browser)

Run:
    pip install -r requirements.txt
    python SpellBee.py

Open on phone (same Wi-Fi): use the URL printed in the terminal.
Add to Home Screen in Safari/Chrome for an app-like icon.
"""

from __future__ import annotations

import json
import random
import socket
import sys
from pathlib import Path

from flask import Flask, jsonify, render_template, request

APP_DIR = Path(__file__).resolve().parent
WORDS_PATH = APP_DIR / "data" / "words.json"

app = Flask(
    __name__,
    template_folder=str(APP_DIR / "templates"),
    static_folder=str(APP_DIR / "static"),
)

VALID_LEVELS = ("easy", "medium", "hard")
DEFAULT_COUNT = 10


def load_words() -> dict:
    with open(WORDS_PATH, encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/levels")
def api_levels():
    words = load_words()
    return jsonify(
        {
            level: len(words.get(level, []))
            for level in VALID_LEVELS
        }
    )


@app.route("/api/round")
def api_round():
    level = (request.args.get("level") or "easy").lower()
    try:
        count = int(request.args.get("count", DEFAULT_COUNT))
    except ValueError:
        count = DEFAULT_COUNT

    count = max(3, min(count, 20))

    if level not in VALID_LEVELS:
        return jsonify({"error": "Invalid level. Use easy, medium, or hard."}), 400

    pool = load_words().get(level, [])
    if len(pool) < count:
        return jsonify({"error": f"Not enough words for level '{level}'."}), 400

    picked = random.sample(pool, count)
    # Send definition and sentence only — not the answer word
    questions = [
        {
            "id": i,
            "definition": item["definition"],
            "sentence": item["sentence"],
            "length": len(item["word"]),
            "first_letter": item["word"][0],
        }
        for i, item in enumerate(picked)
    ]

    # Answers kept server-side in session would need sessions;
    # For a learning app, return hashed round id with answers for client check via API
    round_id = random.randint(100000, 999999)
    app.config.setdefault("rounds", {})[str(round_id)] = {
        "answers": [item["word"].lower() for item in picked],
        "words": [item["word"] for item in picked],
    }

    return jsonify(
        {
            "round_id": round_id,
            "level": level,
            "count": count,
            "questions": questions,
        }
    )


@app.route("/api/check", methods=["POST"])
def api_check():
    data = request.get_json(silent=True) or {}
    round_id = str(data.get("round_id", ""))
    answers_in = data.get("answers", [])

    rounds = app.config.get("rounds", {})
    stored = rounds.get(round_id)
    if not stored:
        return jsonify({"error": "Round expired. Start a new game."}), 400

    correct_words = stored["answers"]
    display_words = stored["words"]

    if len(answers_in) != len(correct_words):
        return jsonify({"error": "Answer count mismatch."}), 400

    results = []
    score = 0
    for i, (user, correct) in enumerate(zip(answers_in, correct_words)):
        user_clean = (user or "").strip().lower()
        ok = user_clean == correct
        if ok:
            score += 1
        results.append(
            {
                "correct": ok,
                "your_answer": user_clean,
                "right_answer": display_words[i],
            }
        )

    del rounds[round_id]

    return jsonify(
        {
            "score": score,
            "total": len(correct_words),
            "results": results,
        }
    )


def local_ip() -> str:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"


def main() -> None:
    host = "0.0.0.0"
    port = 5001

    if not WORDS_PATH.exists():
        print(f"Error: word list not found at {WORDS_PATH}")
        sys.exit(1)

    ip = local_ip()
    print("\n" + "=" * 50)
    print("  SPELL BEE")
    print("=" * 50)
    print(f"  On this PC/Mac:  http://127.0.0.1:{port}")
    print(f"  On your phone:   http://{ip}:{port}")
    print("  Tip: Add to Home Screen for app-like icon")
    print("=" * 50 + "\n")

    app.run(host=host, port=port, debug=False)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nGoodbye!")
        sys.exit(0)
