const $ = (id) => document.getElementById(id);

const screens = {
  home: $("screen-home"),
  game: $("screen-game"),
  results: $("screen-results"),
};

let round = null;
let index = 0;
let userAnswers = [];

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("active"));
  screens[name].classList.add("active");
}

function englishLang() {
  return $("english")?.value || "en-GB";
}

function isClearSound() {
  return ($("sound-mode")?.value || "clear") === "clear";
}

function pickBestVoice(lang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const isGB = lang === "en-GB";
  const pool = voices.filter((v) => {
    if (isGB) {
      return v.lang === "en-GB" || /UK|British|GB/i.test(v.name + v.lang);
    }
    return v.lang === "en-US" || /US|American/i.test(v.name + v.lang);
  });

  const prefer = isGB
    ? [/Google UK English/i, /Sonia/i, /Libby/i, /Daniel/i, /Serena/i, /Martha/i, /Kate/i]
    : [/Google US English/i, /Samantha/i, /Zira/i, /Jenny/i, /Aria/i, /Google UK English/i];

  for (const pattern of prefer) {
    const hit = pool.find((v) => pattern.test(v.name));
    if (hit) return hit;
  }

  const notRobot = pool.filter((v) => !/eSpeak|espeak|Microsoft David Desktop/i.test(v.name));
  return notRobot[0] || pool[0] || voices.find((v) => v.lang.startsWith("en"));
}

function setSpeakingUI(active, message = "") {
  const btn = $("btn-hear-word");
  const status = $("speaking-status");
  if (btn) btn.classList.toggle("speaking", active);
  if (status) status.textContent = message;
}

function speak(text, { forWord = false, onDone = null } = {}) {
  if (!("speechSynthesis" in window)) {
    alert("Speech not supported. Use Chrome or Safari and turn volume up.");
    return;
  }

  const clear = isClearSound();
  const lang = englishLang();
  const repeat = forWord && clear ? 2 : 1;
  const rate = forWord ? (clear ? 0.65 : 0.85) : clear ? 0.75 : 0.9;

  window.speechSynthesis.cancel();

  let times = 0;

  function sayNext() {
    if (times >= repeat) {
      setSpeakingUI(false, "");
      if (onDone) onDone();
      return;
    }
    times += 1;
    const label =
      repeat > 1 ? `Speaking… (${times} of ${repeat})` : "Speaking…";
    setSpeakingUI(true, label);

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.volume = 1;
    u.pitch = clear ? 1.05 : 1;

    const voice = pickBestVoice(lang);
    if (voice) u.voice = voice;

    u.onend = () => {
      if (times < repeat) {
        setTimeout(sayNext, 700);
      } else {
        setSpeakingUI(false, "");
        if (onDone) onDone();
      }
    };
    u.onerror = () => {
      setSpeakingUI(false, "");
      if (onDone) onDone();
    };

    window.speechSynthesis.speak(u);
  }

  sayNext();
}

function loadVoices() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

function currentQuestion() {
  return round.questions[index];
}

function speakWord() {
  const q = currentQuestion();
  const clear = isClearSound();
  const text = clear ? `The word is: ${q.word}` : q.word;
  speak(text, { forWord: true });
}

function hideClue() {
  $("clue-panel").classList.add("hidden");
  $("clue-text").textContent = "";
}

function showClue(label, text) {
  $("clue-label").textContent = label;
  $("clue-text").textContent = text;
  $("clue-panel").classList.remove("hidden");
}

async function startRound() {
  const level = $("level").value;
  const count = $("count").value;
  const source = $("source").value;

  const btn = $("btn-start");
  btn.disabled = true;
  btn.textContent =
    source === "online" ? "Fetching words online…" : "Loading words…";

  try {
    const res = await fetch(
      `/api/round?level=${level}&count=${count}&source=${source}`
    );
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Could not start round.");
      return;
    }

    round = data;
    index = 0;
    userAnswers = [];

    if (data.source_note) {
      console.info(data.source_note);
    }

    const srcLabel =
      data.word_source === "online"
        ? "Words from the internet"
        : data.word_source === "mixed"
          ? "Mixed: internet + local backup"
          : "Local word list";

    $("word-bank-info").textContent = srcLabel;

    showScreen("game");
    showQuestion();
  } finally {
    btn.disabled = false;
    btn.textContent = "Start round";
  }
}

function showQuestion() {
  const total = round.questions.length;

  $("progress-text").textContent = `Word ${index + 1} of ${total}`;
  $("progress-fill").style.width = `${(index / total) * 100}%`;

  $("answer").value = "";
  hideClue();

  // Auto-play the word like a pronouncer (short delay so screen is ready)
  setTimeout(speakWord, 400);
  $("answer").focus();
}

async function loadWordCounts() {
  try {
    const res = await fetch("/api/levels");
    const data = await res.json();
    $("word-bank-info").textContent =
      `Kids list: ${data.kids} words · ${data.source_note || ""}`;
  } catch {
    $("word-bank-info").textContent = "Use Kids level for young children.";
  }
}

loadWordCounts();

$("btn-start").addEventListener("click", startRound);
$("btn-hear-word").addEventListener("click", speakWord);
$("btn-repeat").addEventListener("click", speakWord);

$("btn-definition").addEventListener("click", () => {
  const q = currentQuestion();
  showClue("Definition", q.definition);
  speak(`Definition: ${q.definition}`, { forWord: false });
});

$("btn-sentence").addEventListener("click", () => {
  const q = currentQuestion();
  const sentence = q.sentence.replace("___", "blank");
  showClue("Use in a sentence", sentence);
  speak(sentence, { forWord: false });
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

  $("score-summary").textContent = `You spelled ${data.score} out of ${data.total} correctly!`;

  const list = $("results-list");
  list.innerHTML = "";
  data.results.forEach((r) => {
    const li = document.createElement("li");
    li.className = r.correct ? "ok" : "bad";
    li.innerHTML = r.correct
      ? `<strong>✓ ${r.right_answer}</strong> Correct spelling!`
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
