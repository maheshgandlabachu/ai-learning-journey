const $ = (id) => document.getElementById(id);

const screens = {
  home: $("screen-home"),
  game: $("screen-game"),
  results: $("screen-results"),
};

let round = null;
let index = 0;
let userAnswers = [];
let hintUsed = false;

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("active"));
  screens[name].classList.add("active");
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Speech not supported on this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

async function startRound() {
  const level = $("level").value;
  const count = $("count").value;

  const res = await fetch(`/api/round?level=${level}&count=${count}`);
  const data = await res.json();
  if (!res.ok) {
    alert(data.error || "Could not start round.");
    return;
  }

  round = data;
  index = 0;
  userAnswers = [];
  showScreen("game");
  showQuestion();
}

function showQuestion() {
  const q = round.questions[index];
  const total = round.questions.length;

  $("progress-text").textContent = `Word ${index + 1} of ${total}`;
  $("progress-fill").style.width = `${((index) / total) * 100}%`;

  $("definition").textContent = q.definition;
  $("sentence").textContent = q.sentence;
  $("length-hint").textContent = `${q.length} letters`;
  $("answer").value = "";
  hintUsed = false;
  $("answer").focus();
}

$("btn-start").addEventListener("click", startRound);

$("btn-speak").addEventListener("click", () => {
  const q = round.questions[index];
  speak(`${q.definition}. ${q.sentence.replace("___", "blank")}`);
});

$("btn-hint").addEventListener("click", () => {
  if (hintUsed) return;
  const q = round.questions[index];
  $("length-hint").textContent = `Hint: starts with "${q.first_letter.toUpperCase()}" — ${q.length} letters`;
  hintUsed = true;
});

function submitAnswer() {
  const text = $("answer").value.trim();
  if (!text) {
    $("answer").focus();
    return;
  }

  userAnswers.push(text);
  index += 1;

  if (index < round.questions.length) {
    showQuestion();
    return;
  }

  finishRound();
}

async function finishRound() {
  $("progress-fill").style.width = "100%";

  const res = await fetch("/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      round_id: round.round_id,
      answers: userAnswers,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    alert(data.error || "Could not check answers.");
    showScreen("home");
    return;
  }

  $("score-summary").textContent = `You got ${data.score} out of ${data.total}!`;

  const list = $("results-list");
  list.innerHTML = "";
  data.results.forEach((r) => {
    const li = document.createElement("li");
    li.className = r.correct ? "ok" : "bad";
    li.innerHTML = r.correct
      ? `<strong>✓ ${r.right_answer}</strong> Correct!`
      : `<strong>✗ ${r.right_answer}</strong> You wrote: ${r.your_answer || "(empty)"}`;
    list.appendChild(li);
  });

  showScreen("results");
}

$("btn-submit").addEventListener("click", submitAnswer);
$("answer").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitAnswer();
});

$("btn-quit").addEventListener("click", () => {
  if (confirm("Quit this round?")) showScreen("home");
});

$("btn-again").addEventListener("click", startRound);
$("btn-home").addEventListener("click", () => showScreen("home"));
