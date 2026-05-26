"""
Spell Bee — mobile-friendly (Android & iOS via browser)

Words are fetched from the internet (random word + dictionary APIs).
Local words.json is used as backup when offline.

Run:
    pip install -r requirements.txt
    python SpellBee.py
"""

from __future__ import annotations

import json
import random
import socket
import sys
from collections import deque
from pathlib import Path

from flask import Flask, jsonify, render_template, request

from online_words import fetch_online_words

APP_DIR = Path(__file__).resolve().parent
WORDS_PATH = APP_DIR / "data" / "words.json"
KIDS_PATH = APP_DIR / "data" / "kids_words.json"

app = Flask(
    __name__,
    template_folder=str(APP_DIR / "templates"),
    static_folder=str(APP_DIR / "static"),
)

VALID_LEVELS = ("kids", "easy", "medium", "hard")
DEFAULT_COUNT = 10
RECENT_WORDS_MEMORY = 25


def load_words() -> dict:
    with open(WORDS_PATH, encoding="utf-8") as f:
        data = json.load(f)
    if KIDS_PATH.exists():
        with open(KIDS_PATH, encoding="utf-8") as f:
            data["kids"] = json.load(f)
    return data


def normalize_answer(word: str) -> str:
    return word.strip().lower()


def accepted_answers(item: dict) -> list[str]:
    alts = item.get("accept") or [item["word"]]
    return [normalize_answer(a) for a in alts]


def pick_local_words(level: str, count: int, recent_set: set[str]) -> list[dict]:
    pool = load_words().get(level, [])
    available = [w for w in pool if w["word"] not in recent_set]
    if len(available) < count:
        available = list(pool)
    return random.sample(available, min(count, len(available)))


def remember_words(level: str, words: list[str]) -> None:
    recent_by_level: dict[str, deque[str]] = app.config.setdefault(
        "recent_words", {}
    )
    recent = recent_by_level.setdefault(level, deque(maxlen=RECENT_WORDS_MEMORY))
    for w in words:
        recent.append(w)


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
        },
        source="internet",
        source_note="For children: choose Kids level (simple words, not random internet words)",
        local_backup=sum(len(words.get(l, [])) for l in VALID_LEVELS),
        recommended_for_children="kids",
    )


@app.route("/api/round")
def api_round():
    level = (request.args.get("level") or "easy").lower()
    source = (request.args.get("source") or "online").lower()

    try:
        count = int(request.args.get("count", DEFAULT_COUNT))
    except ValueError:
        count = DEFAULT_COUNT

    count = max(3, min(count, 20))

    if level not in VALID_LEVELS:
        return jsonify({"error": "Invalid level."}), 400

    recent_by_level: dict[str, deque[str]] = app.config.setdefault(
        "recent_words", {}
    )
    recent = recent_by_level.setdefault(level, deque(maxlen=RECENT_WORDS_MEMORY))
    recent_set = set(recent)

    word_source = "online"
    fetch_note = None
    picked: list[dict] = []

    # Kids: always simple local words (internet random words are too hard/obscure)
    if level == "kids":
        source = "local"
        pool = load_words().get("kids", [])
        if len(pool) < count:
            return jsonify({"error": "Not enough kids words."}), 400
        picked = pick_local_words("kids", count, recent_set)
        word_source = "kids"
        fetch_note = "Simple words for children (British-friendly)."

    elif source == "online":
        simple = level == "easy"
        picked, fetch_note = fetch_online_words(
            level, count, exclude=recent_set, simple_only=simple
        )
        if len(picked) < count:
            # Top up or fall back to local file
            need = count - len(picked)
            local = pick_local_words(level, need, recent_set | {p["word"] for p in picked})
            picked.extend(local)
            if picked and len(picked) < count:
                fetch_note = fetch_note or "Partial round — mixed online and local words."
            elif not picked:
                word_source = "local"
                picked = pick_local_words(level, count, recent_set)
                fetch_note = (
                    fetch_note
                    or "Internet unavailable — using local word list."
                )
            else:
                word_source = "mixed" if len(picked) > count - need else "online"
        else:
            picked = picked[:count]
    else:
        word_source = "local"
        pool = load_words().get(level, [])
        if len(pool) < count:
            return jsonify({"error": f"Not enough local words for '{level}'."}), 400
        picked = pick_local_words(level, count, recent_set)

    if len(picked) < count:
        return jsonify({"error": "Could not load enough words. Try again."}), 503

    remember_words(level, [item["word"] for item in picked])

    questions = [
        {
            "id": i,
            "word": item["word"],
            "definition": item["definition"],
            "sentence": item["sentence"],
        }
        for i, item in enumerate(picked)
    ]

    round_id = random.randint(100000, 999999)
    app.config.setdefault("rounds", {})[str(round_id)] = {
        "accepted": [accepted_answers(item) for item in picked],
        "words": [item["word"] for item in picked],
    }

    return jsonify(
        {
            "round_id": round_id,
            "level": level,
            "count": len(questions),
            "word_source": word_source,
            "source_note": fetch_note,
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

    accepted_lists = stored["accepted"]
    display_words = stored["words"]

    if len(answers_in) != len(accepted_lists):
        return jsonify({"error": "Answer count mismatch."}), 400

    results = []
    score = 0
    for i, (user, accepted) in enumerate(zip(answers_in, accepted_lists)):
        user_clean = normalize_answer(user or "")
        ok = user_clean in accepted
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
            "total": len(accepted_lists),
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
        print(f"Warning: local backup not found at {WORDS_PATH}")

    ip = local_ip()
    print("\n" + "=" * 50)
    print("  SPELL BEE")
    print("=" * 50)
    print(f"  On this PC/Mac:  http://127.0.0.1:{port}")
    print(f"  On your phone:   http://{ip}:{port}")
    print("  For children: Kids level + simple word list")
    print("  Voice: British or American English in the app")
    print("=" * 50 + "\n")

    app.run(host=host, port=port, debug=False)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nGoodbye!")
        sys.exit(0)
