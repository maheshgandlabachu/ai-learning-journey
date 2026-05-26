const PIECES = {
  K: "\u2654",
  Q: "\u2655",
  R: "\u2656",
  B: "\u2657",
  N: "\u2658",
  P: "\u2659",
  k: "\u265A",
  q: "\u265B",
  r: "\u265C",
  b: "\u265D",
  n: "\u265E",
  p: "\u265F",
};

const FILES = "abcdefgh";

let state = null;
let selected = null;
let pendingPromotion = null;

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const promoModal = document.getElementById("promo-modal");

function squareId(file, rankIndex) {
  return FILES[file] + (8 - rankIndex);
}

function parseSquare(name) {
  return { file: FILES.indexOf(name[0]), rank: 8 - parseInt(name[1], 10) };
}

async function fetchState() {
  const res = await fetch("/api/state");
  state = await res.json();
  render();
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

function movesFromSquare(sq) {
  if (!state || !sq) return [];
  return state.legal_moves.filter((m) => m.startsWith(sq));
}

function targetSquares(fromSq) {
  return movesFromSquare(fromSq).map((m) => m.slice(2, 4));
}

function renderStatus() {
  if (!state) return;

  statusEl.classList.remove("check", "over");

  if (state.is_game_over && state.outcome) {
    statusEl.textContent = state.outcome;
    statusEl.classList.add("over");
    return;
  }

  const turn = state.turn === "white" ? "White" : "Black";
  let text = `${turn} to move`;
  if (state.is_check) {
    text += " — Check!";
    statusEl.classList.add("check");
  }
  statusEl.textContent = text;
}

function renderBoard() {
  boardEl.innerHTML = "";
  if (!state) return;

  const last = state.last_move;
  const legalTargets = selected ? new Set(targetSquares(selected)) : new Set();
  const legalMoves = selected ? movesFromSquare(selected) : [];

  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const id = squareId(file, rank);
      const piece = state.grid[rank][file];
      const isLight = (file + rank) % 2 === 0;

      const cell = document.createElement("div");
      cell.className = `square ${isLight ? "light" : "dark"}`;
      cell.dataset.square = id;

      if (selected === id) cell.classList.add("selected");
      if (last && (last.from === id || last.to === id)) cell.classList.add("last-move");

      if (legalTargets.has(id)) {
        cell.classList.add("legal");
        const move = legalMoves.find((m) => m.slice(2, 4) === id);
        if (move && move.length === 4 && state.grid[rank][file]) {
          cell.classList.add("capture");
        }
      }

      if (piece) {
        const span = document.createElement("span");
        span.className = "piece";
        span.textContent = PIECES[piece] || "";
        cell.appendChild(span);
      }

      cell.addEventListener("click", () => onSquareClick(id));
      boardEl.appendChild(cell);
    }
  }

  document.getElementById("btn-undo").disabled = state.move_count === 0 || state.is_game_over;
}

function render() {
  renderStatus();
  renderBoard();
}

function pieceColor(symbol) {
  return symbol === symbol.toUpperCase() ? "white" : "black";
}

function onSquareClick(sq) {
  if (!state || state.is_game_over) return;

  const rank = 8 - parseInt(sq[1], 10);
  const file = FILES.indexOf(sq[0]);
  const piece = state.grid[rank][file];

  if (!selected) {
    if (piece && pieceColor(piece) === state.turn) {
      selected = sq;
      renderBoard();
    }
    return;
  }

  if (sq === selected) {
    selected = null;
    renderBoard();
    return;
  }

  if (piece && pieceColor(piece) === state.turn) {
    selected = sq;
    renderBoard();
    return;
  }

  const moves = movesFromSquare(selected).filter((m) => m.slice(2, 4) === sq);
  if (moves.length === 0) {
    selected = null;
    renderBoard();
    return;
  }

  const needsPromo = moves.some((m) => m.length === 5);
  if (needsPromo) {
    pendingPromotion = { from: selected, to: sq, moves };
    promoModal.classList.remove("hidden");
    return;
  }

  submitMove(moves[0]);
}

async function submitMove(uci) {
  selected = null;
  promoModal.classList.add("hidden");
  pendingPromotion = null;

  try {
    const data = await postJson("/api/move", { uci });
    state = data;
    render();
  } catch (err) {
    alert(err.message);
    await fetchState();
  }
}

document.querySelectorAll(".promo-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!pendingPromotion) return;
    const piece = btn.dataset.piece;
    const uci =
      pendingPromotion.moves.find((m) => m.length === 5 && m[4] === piece) ||
      pendingPromotion.from + pendingPromotion.to + piece;
    submitMove(uci);
  });
});

document.getElementById("btn-new").addEventListener("click", async () => {
  if (!confirm("Start a new game?")) return;
  selected = null;
  try {
    const data = await postJson("/api/reset", {});
    state = data;
    render();
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById("btn-undo").addEventListener("click", async () => {
  selected = null;
  try {
    const data = await postJson("/api/undo", {});
    state = data;
    render();
  } catch (err) {
    alert(err.message);
  }
});

fetchState().catch(() => {
  statusEl.textContent = "Could not connect to server. Run: python ChessApp.py";
});
