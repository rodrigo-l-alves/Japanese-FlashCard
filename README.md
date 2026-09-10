FlashCard application for Japanese studies for N4/N5.

Includes mobile Kanji writing practice with finger/stylus input, stroke-order validation, direction arrows, and three progressive guidance levels (guided tracing, light guidance, and writing from memory).

Stroke-order data is loaded from KanjiVG (https://kanjivg.tagaini.net/), copyright Ulrich Apel, licensed CC BY-SA 3.0. Each character is cached locally after first load so it can be practiced offline afterwards.


## v5 cache fix
The app shell URLs are versioned and the service worker uses network-first for HTML/JS/CSS so an older installed PWA cannot mix a new index.html with an old app.js.


## Browse selection
Browse deck is now a practice picker. Tap a vocabulary item to open it directly in Flip mode. Tap a single-character kanji to open Writing practice, or use the inline **Flip** / **Write** buttons to choose explicitly.


## v7 writing-mode update
The Guide, Fade, and Memory stages are now real buttons. They can be selected manually at any time with no success prerequisite. The app still tracks successful completions and may suggest a next stage, but it never locks a mode.


## v8 — useful SRS rating groups

Hard / Good / Easy now persist as the card's latest SRS rating. Browse deck shows counts and per-card rating badges. Tap a rating group to start a flip-only session containing just cards currently in that group. Existing progress created before v8 has no saved last-rating value, so those cards show Unrated until they receive a new Hard / Good / Easy / Again review.
