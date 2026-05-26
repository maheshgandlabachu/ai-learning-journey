"""
Chess App — cross-platform (Windows, Mac, mobile browser)

Run:
    pip install -r requirements.txt
    python ChessApp.py

Then open http://localhost:5000 on this computer.
On phone (same Wi-Fi): use the URL printed in the terminal (http://YOUR_IP:5000).
"""

from __future__ import annotations

import socket
import sys
from pathlib import Path

import chess
from flask import Flask, jsonify, render_template, request

APP_DIR = Path(__file__).resolve().parent
app = Flask(
    __name__,
    template_folder=str(APP_DIR / "templates"),
    static_folder=str(APP_DIR / "static"),
)

# One shared game (two players on the same device / screen)
board = chess.Board()
move_history: list[str] = []


def square_name(square: int) -> str:
    return chess.square_name(square)


def board_grid() -> list[list[str | None]]:
    """8x8 grid, rank 8 at top (index 0), file a at left."""
    grid: list[list[str | None]] = []
    for rank in range(7, -1, -1):
        row: list[str | None] = []
        for file in range(8):
            piece = board.piece_at(chess.square(file, rank))
            row.append(piece.symbol() if piece else None)
        grid.append(row)
    return grid


def game_state() -> dict:
    last = move_history[-1] if move_history else None
    last_from = last[:2] if last and len(last) >= 4 else None
    last_to = last[2:4] if last and len(last) >= 4 else None

    outcome = None
    if board.is_checkmate():
        winner = "black" if board.turn == chess.WHITE else "white"
        outcome = f"Checkmate! {winner.capitalize()} wins."
    elif board.is_stalemate():
        outcome = "Stalemate — draw."
    elif board.is_insufficient_material():
        outcome = "Draw — insufficient material."
    elif board.can_claim_threefold_repetition():
        outcome = "Draw can be claimed (threefold repetition)."
    elif board.can_claim_fifty_moves():
        outcome = "Draw can be claimed (fifty-move rule)."

    return {
        "grid": board_grid(),
        "turn": "white" if board.turn == chess.WHITE else "black",
        "is_check": board.is_check(),
        "is_game_over": board.is_game_over(),
        "outcome": outcome,
        "legal_moves": [m.uci() for m in board.legal_moves],
        "last_move": {"from": last_from, "to": last_to} if last_from and last_to else None,
        "move_count": len(move_history),
        "fen": board.fen(),
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/state")
def api_state():
    return jsonify(game_state())


@app.route("/api/move", methods=["POST"])
def api_move():
    global board, move_history

    data = request.get_json(silent=True) or {}
    uci = (data.get("uci") or "").strip().lower()

    if len(uci) not in (4, 5):
        return jsonify({"ok": False, "error": "Invalid move format."}), 400

    try:
        move = chess.Move.from_uci(uci)
    except ValueError:
        return jsonify({"ok": False, "error": "Invalid move."}), 400

    if move not in board.legal_moves:
        return jsonify({"ok": False, "error": "Illegal move."}), 400

    board.push(move)
    move_history.append(uci)
    return jsonify({"ok": True, **game_state()})


@app.route("/api/undo", methods=["POST"])
def api_undo():
    global board, move_history

    if not move_history:
        return jsonify({"ok": False, "error": "No moves to undo."}), 400

    board.pop()
    move_history.pop()
    return jsonify({"ok": True, **game_state()})


@app.route("/api/reset", methods=["POST"])
def api_reset():
    global board, move_history

    board.reset()
    move_history.clear()
    return jsonify({"ok": True, **game_state()})


def local_ip() -> str:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"


def main() -> None:
    host = "0.0.0.0"
    port = 5000
    ip = local_ip()

    print("\n" + "=" * 50)
    print("  CHESS APP")
    print("=" * 50)
    print(f"  On this PC/Mac:  http://127.0.0.1:{port}")
    print(f"  On your phone:   http://{ip}:{port}")
    print("  (Phone must be on the same Wi-Fi network)")
    print("=" * 50 + "\n")

    app.run(host=host, port=port, debug=False)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nGoodbye!")
        sys.exit(0)
