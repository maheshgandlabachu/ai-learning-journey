"""Fetch spelling words and definitions from free public APIs on the internet."""

from __future__ import annotations

import json
import random
import re
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

# Word length ranges by difficulty
LEVEL_LENGTH: dict[str, tuple[int, int]] = {
    "easy": (4, 5),
    "medium": (6, 8),
    "hard": (9, 15),
}

# Common words safe for children and learners (not random obscure words)
COMMON_SIMPLE_WORDS: frozenset[str] = frozenset(
    """
    cat dog sun mum mom dad red blue ball book fish bird cake milk hand foot
    tree rain star moon bed cup hat egg leg pig cow bee ant toy car bus pen map
    box rug jam ice sea sand wind frog duck lamp door shop park home love happy
    colour color water apple banana pizza school friend run jump play walk talk
    eat drink sing dance read write draw swim fly open close big small hot cold
    good bad new old day night yes no one two three four five six seven eight
    nine ten boy girl baby house room food bread rice soup tea shoe sock dress
    coat rain snow cloud sky grass flower river lake hill rock chair table window
    garden kitchen animal people family brother sister uncle aunt baby happy sad
    angry tired hungry thirsty clean dirty fast slow loud quiet kind help share
    wait stop go come give take find look listen think know learn teach spell
    word letter name place world country city town village street road field farm
    horse sheep goat chicken mouse rat snake spider worm owl eagle bear lion tiger
    elephant monkey zebra giraffe rabbit turtle crab snail whale shark dolphin
    """.split()
)

USER_AGENT = "SpellBee-Learning-App/1.0"
VALID_WORD = re.compile(r"^[a-z]+$")


def _get_json(url: str, timeout: int = 10) -> Any:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _fetch_random_batch(count: int, length: int | None = None) -> list[str]:
    """Try public random-word APIs (no API key)."""
    urls: list[str] = []
    n = min(count + 5, 50)

    if length is not None:
        urls.append(f"https://random-word-api.vercel.app/api?words={n}&length={length}")
        urls.append(
            f"https://random-word-api.herokuapp.com/word?number={n}&length={length}"
        )
    else:
        urls.append(f"https://random-word-api.vercel.app/api?words={n}")
        urls.append(f"https://random-word-api.herokuapp.com/word?number={n}")

    for url in urls:
        try:
            data = _get_json(url)
            if isinstance(data, list):
                words = [w.lower().strip() for w in data if isinstance(w, str)]
                return [w for w in words if VALID_WORD.match(w)]
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, ValueError):
            continue
    return []


def _collect_candidates(level: str, need: int) -> list[str]:
    min_len, max_len = LEVEL_LENGTH[level]
    seen: set[str] = set()
    candidates: list[str] = []

    # Request specific lengths for easy/medium; for hard use long words
    lengths = list(range(min_len, max_len + 1))
    random.shuffle(lengths)

    for length in lengths:
        batch = _fetch_random_batch(need * 2, length=length)
        for w in batch:
            if min_len <= len(w) <= max_len and w not in seen:
                seen.add(w)
                candidates.append(w)
        if len(candidates) >= need * 3:
            break

    if len(candidates) < need:
        batch = _fetch_random_batch(need * 4, length=None)
        for w in batch:
            if min_len <= len(w) <= max_len and w not in seen:
                seen.add(w)
                candidates.append(w)

    random.shuffle(candidates)
    return candidates


def _simplify_definition(text: str, max_len: int = 90) -> str:
    """Short, kid-friendly definition (first part only)."""
    text = text.split(";")[0].split("(")[0].strip()
    if len(text) > max_len:
        text = text[:max_len].rsplit(" ", 1)[0] + "."
    return text


def _lookup_dictionary(word: str, simple: bool = False) -> dict[str, str] | None:
    """Free Dictionary API — definitions used worldwide (Wiktionary-based)."""
    encoded = urllib.parse.quote(word.lower())
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{encoded}"
    try:
        data = _get_json(url, timeout=8)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, ValueError):
        return None

    if not data or not isinstance(data, list):
        return None

    entry = data[0]
    meanings = entry.get("meanings") or []
    definition = ""
    example = ""

    for meaning in meanings:
        defs = meaning.get("definitions") or []
        for d in defs:
            if d.get("definition"):
                definition = d["definition"]
                example = d.get("example") or ""
                break
        if definition:
            break

    if not definition:
        return None

    if simple:
        definition = _simplify_definition(definition)

    if example:
        sentence = re.sub(re.escape(word), "___", example, flags=re.IGNORECASE)
        if "___" not in sentence:
            sentence = f"... {example} ..."
    else:
        sentence = f"Can you spell the word ___? It means: {definition[:80]}."

    return {
        "word": word,
        "definition": definition,
        "sentence": sentence,
    }


def fetch_online_words(
    level: str,
    count: int,
    exclude: set[str] | None = None,
    simple_only: bool = False,
) -> tuple[list[dict[str, str]], str | None]:
    """
    Return (word_entries, error_message).
    word_entries is empty on failure.
    """
    exclude = exclude or set()
    candidates = [w for w in _collect_candidates(level, count) if w not in exclude]

    if simple_only:
        candidates = [w for w in candidates if w in COMMON_SIMPLE_WORDS]

    if not candidates:
        return [], "Could not reach random word API. Check your internet connection."

    results: list[dict[str, str]] = []
    errors = 0
    max_tries = min(len(candidates), count * 5)

    for word in candidates[:max_tries]:
        if len(results) >= count:
            break
        details = _lookup_dictionary(word, simple=simple_only)
        if details:
            results.append(details)
        else:
            errors += 1

    if len(results) < count:
        return results, (
            f"Only found {len(results)} words online "
            f"(dictionary lookups failed for some random words)."
        )

    return results, None
