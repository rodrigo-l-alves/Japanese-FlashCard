// ---------- APP ----------
(function () {
  var state = {
    progress: {},        // id -> {reps, ease, interval, due, lapses}
    dailyStats: {},       // "YYYY-MM-DD" -> {reviews, correct}
    customCards: [],
    theme: "light",        // light | dark
    studyMode: "flip",      // flip | type
    level: "n5",              // n5 | n4
    filter: "all",              // all | kanji | vocab
    view: "study",                // study | browse | add | stats
    queue: [],
    current: null,
    flipped: false,
    typedValue: "",
    typedChecked: false,
    typedCorrect: null,
    sessionSeen: 0,
    saveError: false,
    importError: "",
    addFormError: "",
    addForm: { level: "n5", deck: "vocab", front: "", reading: "", meaning: "", example: "" }
  };

  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function dateKey(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function todayStr() { return dateKey(new Date()); }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
  }

  function loadState() {
    var data = window.Storage.load();
    state.progress = (data && data.progress) || {};
    state.dailyStats = (data && data.dailyStats) || {};
    state.customCards = (data && data.customCards) || [];
    state.theme = (data && data.theme) || "light";
    state.studyMode = (data && data.studyMode) || "flip";
    applyTheme();
    buildQueue();
    render();
  }

  function persist() {
    var ok = window.Storage.save({
      progress: state.progress,
      dailyStats: state.dailyStats,
      customCards: state.customCards,
      theme: state.theme,
      studyMode: state.studyMode
    });
    state.saveError = !ok;
  }

  function poolForFilter() {
    var lvl = window.FlashcardData.levels[state.level];
    var built = state.filter === "all" ? lvl.all : lvl[state.filter];
    var custom = state.customCards.filter(function (c) {
      return c.level === state.level && (state.filter === "all" || c.deck === state.filter);
    });
    return built.concat(custom);
  }

  function buildQueue() {
    var now = Date.now();
    state.queue = window.SRS.buildQueue(poolForFilter(), state.progress, now);
    state.current = state.queue.length ? state.queue[0] : null;
    state.flipped = false;
    state.typedValue = "";
    state.typedChecked = false;
    state.typedCorrect = null;
    state.sessionSeen = 0;
  }

  function gradeCard(gradeKey) {
    if (!state.current) return;
    var id = state.current.id;
    var now = Date.now();
    state.progress[id] = window.SRS.grade(state.progress[id], gradeKey, now);

    var today = todayStr();
    if (!state.dailyStats[today]) state.dailyStats[today] = { reviews: 0, correct: 0 };
    state.dailyStats[today].reviews += 1;
    if (gradeKey === "good" || gradeKey === "easy") state.dailyStats[today].correct += 1;

    persist();

    state.sessionSeen += 1;
    state.queue.shift();
    if (gradeKey === "again") state.queue.push(state.current);
    state.current = state.queue.length ? state.queue[0] : null;
    state.flipped = false;
    state.typedValue = "";
    state.typedChecked = false;
    state.typedCorrect = null;
    render();
  }

  function setFilter(f) { state.filter = f; buildQueue(); render(); }
  function setLevel(l) { state.level = l; buildQueue(); render(); }
  function setView(v) { state.view = v; render(); }

  function setStudyMode(mode) {
    state.studyMode = mode;
    state.flipped = false;
    state.typedValue = "";
    state.typedChecked = false;
    state.typedCorrect = null;
    persist();
    render();
  }

  function flip() {
    if (!state.current || state.studyMode !== "flip") return;
    state.flipped = !state.flipped;

    // Toggle the class on the card that's already in the DOM instead of
    // calling render() (which tears down and rebuilds the whole app,
    // including a brand-new .card node). Rebuilding the node meant the CSS
    // 3D-flip transition had no "before" state to animate from, so the
    // browser snapped straight to the end pose and the old front face
    // briefly clipped/showed through the back during the swap.
    var cardEl = document.querySelector(".stage .card");
    if (cardEl) {
      cardEl.classList.toggle("flipped", state.flipped);
      updateGradeRowEnabled();
      return;
    }
    render();
  }

  // Enable/disable the grade buttons in place, mirroring what render()
  // would compute, without touching the card element.
  function updateGradeRowEnabled() {
    var showGrades = state.studyMode === "type" ? state.typedChecked : state.flipped;
    var buttons = document.querySelectorAll(".grade-row .grade-btn");
    for (var i = 0; i < buttons.length; i++) {
      if (showGrades) buttons[i].removeAttribute("disabled");
      else buttons[i].setAttribute("disabled", "disabled");
    }
  }

  function submitTypedAnswer() {
    if (!state.current || state.typedChecked) return;
    state.typedCorrect = window.Romaji.matchesReading(state.typedValue, state.current.reading);
    state.typedChecked = true;
    render();
  }

  function toggleTheme() {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
    persist();
    render();
  }

  function resetProgress() {
    if (!window.confirm("Reset all study progress? This clears every card's review history and stats. Custom cards you added will stay.")) return;
    state.progress = {};
    state.dailyStats = {};
    persist();
    buildQueue();
    render();
  }

  function doExport() {
    window.Storage.exportJSON({
      progress: state.progress,
      dailyStats: state.dailyStats,
      customCards: state.customCards,
      theme: state.theme,
      studyMode: state.studyMode
    });
  }

  function doImport(file) {
    window.Storage.importJSON(file, function (err, data) {
      if (err) { state.importError = "Couldn't read that file."; render(); return; }
      state.progress = (data && data.progress) || {};
      state.dailyStats = (data && data.dailyStats) || {};
      state.customCards = (data && data.customCards) || [];
      state.theme = (data && data.theme) || "light";
      state.studyMode = (data && data.studyMode) || "flip";
      applyTheme();
      state.importError = "";
      persist();
      buildQueue();
      render();
    });
  }

  function submitAddForm() {
    var f = state.addForm;
    if (!f.front.trim() || !f.reading.trim() || !f.meaning.trim()) {
      state.addFormError = "Front, reading and meaning are required.";
      render();
      return;
    }
    var id = "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    state.customCards.push({
      id: id, deck: f.deck, level: f.level, custom: true,
      front: f.front.trim(), reading: f.reading.trim(),
      meaning: f.meaning.trim(), example: f.example.trim() || null
    });
    state.addFormError = "";
    persist();
    state.addForm = { level: f.level, deck: f.deck, front: "", reading: "", meaning: "", example: "" };
    buildQueue();
    render();
  }

  function deleteCustomCard(id) {
    state.customCards = state.customCards.filter(function (c) { return c.id !== id; });
    delete state.progress[id];
    persist();
    buildQueue();
    render();
  }

  function countMastered() {
    var n = 0;
    poolForFilter().forEach(function (c) { var p = state.progress[c.id]; if (p && p.interval >= 21) n++; });
    return n;
  }

  function countLearned() {
    var n = 0;
    poolForFilter().forEach(function (c) { var p = state.progress[c.id]; if (p && p.reps >= 1) n++; });
    return n;
  }

  function countDueNow() {
    var now = Date.now();
    var n = 0;
    poolForFilter().forEach(function (c) { var p = state.progress[c.id]; if (p && p.due <= now) n++; });
    return n;
  }

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined) return;
      if (k === "class") e.className = attrs[k];
      else if (k === "text") e.textContent = attrs[k];
      else if (k.indexOf("on") === 0) e.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  // ---------- Tabs ----------
  function renderViewTabs() {
    var views = [["study", "Study"], ["browse", "Browse deck"], ["add", "Add card"], ["stats", "Stats"]];
    return el("div", { class: "tabs" }, views.map(function (v) {
      return el("div", { class: "tab" + (state.view === v[0] ? " active" : ""), onClick: function () { setView(v[0]); }, text: v[1] });
    }));
  }

  function renderLevelTabs() {
    return el("div", { class: "tabs" }, [
      el("div", { class: "tab" + (state.level === "n5" ? " active" : ""), onClick: function () { setLevel("n5"); }, text: "N5" }),
      el("div", { class: "tab" + (state.level === "n4" ? " active" : ""), onClick: function () { setLevel("n4"); }, text: "N4" })
    ]);
  }

  function renderFilterTabs() {
    var lvl = window.FlashcardData.levels[state.level];
    function customCount(deck) {
      return state.customCards.filter(function (c) { return c.level === state.level && (deck === "all" || c.deck === deck); }).length;
    }
    return el("div", { class: "tabs" }, [
      el("div", { class: "tab" + (state.filter === "all" ? " active" : ""), onClick: function () { setFilter("all"); }, text: "All (" + (lvl.all.length + customCount("all")) + ")" }),
      el("div", { class: "tab" + (state.filter === "kanji" ? " active" : ""), onClick: function () { setFilter("kanji"); }, text: "Kanji (" + (lvl.kanji.length + customCount("kanji")) + ")" }),
      el("div", { class: "tab" + (state.filter === "vocab" ? " active" : ""), onClick: function () { setFilter("vocab"); }, text: "Vocabulary (" + (lvl.vocab.length + customCount("vocab")) + ")" })
    ]);
  }

  function renderModeToggle() {
    return el("div", { class: "mode-toggle" }, [
      el("button", { class: "mode-btn" + (state.studyMode === "flip" ? " active" : ""), onClick: function () { setStudyMode("flip"); }, text: "Flip" }),
      el("button", { class: "mode-btn" + (state.studyMode === "type" ? " active" : ""), onClick: function () { setStudyMode("type"); }, text: "Type answer" })
    ]);
  }

  function renderStatRow() {
    var today = state.dailyStats[todayStr()] || { reviews: 0, correct: 0 };
    return el("div", { class: "stat-row" }, [
      el("div", {}, [document.createTextNode("Reviewed today "), el("b", { text: String(today.reviews) })]),
      el("div", {}, [document.createTextNode("Due now "), el("b", { text: String(countDueNow()) })]),
      el("div", {}, [document.createTextNode("Learned "), el("b", { text: countLearned() + "/" + poolForFilter().length })]),
      el("div", {}, [document.createTextNode("Mastered "), el("b", { text: String(countMastered()) })])
    ]);
  }

  function renderProgressBar() {
    var remaining = state.queue.length;
    var total = state.sessionSeen + remaining;
    var pct = total ? Math.round((state.sessionSeen / total) * 100) : 0;
    return el("div", { class: "progress-wrap" }, [
      el("div", { class: "progress-label", text: state.sessionSeen + " reviewed this session \u00b7 " + remaining + " remaining" }),
      el("div", { class: "progress-track" }, [el("div", { class: "progress-fill", style: "width:" + pct + "%" })])
    ]);
  }

  function audioButton(card) {
    if (!window.Speech.supported()) return null;
    return el("button", {
      class: "audio-btn",
      onClick: function (e) { e.stopPropagation(); window.Speech.speak(card.reading.split("\u30fb")[0]); },
      text: "\ud83d\udd0a listen"
    });
  }

  // ---------- Study ----------
  function renderStudy() {
    if (!state.current) {
      return el("div", { class: "empty-state" }, [
        el("div", { class: "big", text: "\u3088\u304f\u3067\u304d\u307e\u3057\u305f" }),
        el("p", { text: "Nothing left to review right now. Every due card is cleared \u2014 come back later, switch decks above, or add more cards." })
      ]);
    }

    var card = state.current;
    var isKanji = card.deck === "kanji";
    var pieces = [renderProgressBar()];

    pieces.push(state.studyMode === "type" ? renderTypeCard(card, isKanji) : renderFlipCard(card, isKanji));

    var showGrades = state.studyMode === "type" ? state.typedChecked : state.flipped;
    pieces.push(el("div", { class: "grade-row" }, [
      gradeBtn("again", "Again", "<1d", !showGrades),
      gradeBtn("hard", "Hard", "short", !showGrades),
      gradeBtn("good", "Good", "normal", !showGrades),
      gradeBtn("easy", "Easy", "longer", !showGrades)
    ]));

    return el("div", {}, pieces);
  }

  function renderFlipCard(card, isKanji) {
    // .face only handles 3D positioning/backface-visibility; everything
    // that's actually painted (border/background/shadow) lives on the
    // nested .face-surface — see the CSS comment for why this split
    // matters on iOS Safari.
    var frontSurface = el("div", { class: "face-surface" }, [
      el("div", { class: "corner-mark", text: isKanji ? "kanji" : "vocabulary" }),
      el("div", { class: "prompt" + (isKanji ? "" : " vocab"), text: card.front }),
      el("div", { class: "hint", text: "tap to reveal" })
    ]);
    var faceFront = el("div", { class: "face front" }, [frontSurface]);

    var backChildren = [
      el("div", { class: "corner-mark", text: isKanji ? "kanji" : "vocabulary" }),
      el("div", { class: "reading", text: card.reading }),
      el("div", { class: "meaning", text: card.meaning })
    ];
    if (card.example) backChildren.push(el("div", { class: "example", text: card.example }));
    backChildren.push(audioButton(card));

    var backSurface = el("div", { class: "face-surface" }, backChildren);
    var faceBack = el("div", { class: "face back" }, [backSurface]);
    var cardEl = el("div", { class: "card" + (state.flipped ? " flipped" : ""), onClick: flip }, [faceFront, faceBack]);
    return el("div", { class: "stage" }, [cardEl]);
  }

  function renderTypeCard(card, isKanji) {
    var promptBox = el("div", { class: "type-prompt-box" }, [
      el("div", { class: "corner-mark", text: isKanji ? "kanji" : "vocabulary" }),
      el("div", { class: "prompt" + (isKanji ? "" : " vocab"), text: card.front })
    ]);

    var input = el("input", {
      type: "text",
      class: "type-input",
      placeholder: "type the reading (kana or romaji)",
      value: state.typedValue,
      disabled: state.typedChecked ? "disabled" : null,
      onInput: function (e) { state.typedValue = e.target.value; },
      onKeydown: function (e) { if (e.key === "Enter") { e.preventDefault(); submitTypedAnswer(); } }
    });

    var children = [promptBox, input];

    if (!state.typedChecked) {
      children.push(el("button", { class: "check-btn", onClick: submitTypedAnswer, text: "Check" }));
    } else {
      children.push(el("div", {
        class: "type-verdict " + (state.typedCorrect ? "correct" : "incorrect"),
        text: state.typedCorrect ? "Correct!" : "Not quite \u2014 here's the reading"
      }));
      var reveal = el("div", { class: "type-reveal" }, [
        el("div", { class: "reading", text: card.reading }),
        el("div", { class: "meaning", text: card.meaning })
      ]);
      if (card.example) reveal.appendChild(el("div", { class: "example", text: card.example }));
      reveal.appendChild(audioButton(card));
      children.push(reveal);
    }

    return el("div", { class: "type-stage" }, children);
  }

  function gradeBtn(key, label, sub, disabled) {
    return el("button", {
      class: "grade-btn " + key,
      disabled: disabled ? "disabled" : null,
      onClick: function () { gradeCard(key); }
    }, [document.createTextNode(label), el("small", { text: sub })]);
  }

  // ---------- Browse ----------
  function renderBrowse() {
    var now = Date.now();
    var rows = poolForFilter().map(function (c) {
      var p = state.progress[c.id];
      var badge;
      if (!p) badge = el("span", { class: "badge", text: "new" });
      else if (p.due <= now) badge = el("span", { class: "badge due", text: "due" });
      else if (p.interval >= 21) badge = el("span", { class: "badge mastered", text: "mastered" });
      else badge = el("span", { class: "badge", text: "learning" });

      var rowChildren = [
        el("div", { class: "jp", text: c.front }),
        el("div", { class: "rd", text: c.reading }),
        el("div", { class: "mn", text: c.meaning }),
        badge
      ];
      if (c.custom) rowChildren.push(el("button", { class: "delete-btn", onClick: function () { deleteCustomCard(c.id); }, text: "\u2715" }));

      return el("div", { class: "browse-row" + (c.custom ? " is-custom" : "") }, rowChildren);
    });
    return el("div", { class: "browse-list" }, rows);
  }

  // ---------- Add card ----------
  function renderAddForm() {
    var f = state.addForm;
    var wrap = el("div", { class: "add-form" });

    var levelSel = el("select", { onChange: function (e) { state.addForm.level = e.target.value; } }, [
      el("option", { value: "n5", text: "N5", selected: f.level === "n5" ? "selected" : null }),
      el("option", { value: "n4", text: "N4", selected: f.level === "n4" ? "selected" : null })
    ]);
    var deckSel = el("select", { onChange: function (e) { state.addForm.deck = e.target.value; } }, [
      el("option", { value: "vocab", text: "Vocabulary", selected: f.deck === "vocab" ? "selected" : null }),
      el("option", { value: "kanji", text: "Kanji", selected: f.deck === "kanji" ? "selected" : null })
    ]);

    function field(labelText, key) {
      return el("label", { class: "form-field" }, [
        el("span", { text: labelText }),
        el("input", { type: "text", value: f[key], onInput: function (e) { state.addForm[key] = e.target.value; } })
      ]);
    }

    wrap.appendChild(el("div", { class: "form-row" }, [
      el("label", { class: "form-field" }, [el("span", { text: "Level" }), levelSel]),
      el("label", { class: "form-field" }, [el("span", { text: "Deck" }), deckSel])
    ]));
    wrap.appendChild(field("Front (word / kanji)", "front"));
    wrap.appendChild(field("Reading (kana)", "reading"));
    wrap.appendChild(field("Meaning (English)", "meaning"));
    wrap.appendChild(field("Example sentence (optional)", "example"));

    if (state.addFormError) wrap.appendChild(el("div", { class: "import-error", text: state.addFormError }));
    wrap.appendChild(el("button", { class: "check-btn", onClick: submitAddForm, text: "Add card" }));

    return wrap;
  }

  // ---------- Stats ----------
  function renderStatsView() {
    var days = [];
    for (var i = 13; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var s = state.dailyStats[dateKey(d)] || { reviews: 0, correct: 0 };
      days.push({ label: (d.getMonth() + 1) + "/" + d.getDate(), reviews: s.reviews, correct: s.correct });
    }
    var maxReviews = Math.max(1, Math.max.apply(null, days.map(function (d) { return d.reviews; })));
    var barWidth = 28, gap = 8, chartHeight = 140;
    var svgWidth = days.length * (barWidth + gap);

    var bars = days.map(function (d, i) {
      var h = Math.max(1, Math.round((d.reviews / maxReviews) * chartHeight));
      var x = i * (barWidth + gap);
      var y = chartHeight - h;
      var countLabel = d.reviews ? '<text x="' + (x + barWidth / 2) + '" y="' + (y - 4) + '" text-anchor="middle" font-size="9" fill="var(--ink)">' + d.reviews + '</text>' : '';
      return '<g>' +
        '<rect x="' + x + '" y="' + y + '" width="' + barWidth + '" height="' + h + '" fill="var(--indigo)" opacity="' + (d.reviews ? 1 : 0.2) + '"></rect>' +
        countLabel +
        '<text x="' + (x + barWidth / 2) + '" y="' + (chartHeight + 16) + '" text-anchor="middle" font-size="9" fill="var(--ink-soft)">' + d.label + '</text>' +
        '</g>';
    }).join("");

    var chartHolder = el("div", { class: "chart-holder" });
    chartHolder.innerHTML = '<svg viewBox="0 0 ' + svgWidth + ' ' + (chartHeight + 30) + '" width="100%" height="' + (chartHeight + 30) + '">' + bars + '</svg>';

    var totalReviews = days.reduce(function (sum, d) { return sum + d.reviews; }, 0);
    var totalCorrect = days.reduce(function (sum, d) { return sum + d.correct; }, 0);
    var accuracy = totalReviews ? Math.round((totalCorrect / totalReviews) * 100) : null;

    return el("div", { class: "stats-view" }, [
      el("div", { class: "stats-title", text: "Reviews \u2014 last 14 days" }),
      chartHolder,
      el("div", { class: "stats-summary" }, [
        el("div", {}, [document.createTextNode("Reviews (14d) "), el("b", { text: String(totalReviews) })]),
        el("div", {}, [document.createTextNode("Accuracy (14d) "), el("b", { text: accuracy === null ? "\u2014" : accuracy + "%" })])
      ])
    ]);
  }

  // ---------- Footer ----------
  function renderFooter() {
    var statusText = "Progress saves automatically to this browser.";
    if (state.saveError) statusText = "Couldn't save just now \u2014 check your browser's storage settings.";

    var fileInput = el("input", {
      type: "file", accept: "application/json", class: "file-input",
      onChange: function (e) { if (e.target.files && e.target.files[0]) doImport(e.target.files[0]); e.target.value = ""; }
    });

    var row = el("div", { class: "footer-row" }, [
      el("span", { text: statusText }),
      el("div", { class: "footer-actions" }, [
        el("button", { class: "link-btn", onClick: toggleTheme, text: state.theme === "dark" ? "Light mode" : "Dark mode" }),
        el("button", { class: "link-btn", onClick: doExport, text: "Export progress (.json)" }),
        el("button", { class: "link-btn", onClick: function () { fileInput.click(); }, text: "Import progress" }),
        el("button", { class: "link-btn", onClick: resetProgress, text: "Reset all progress" })
      ])
    ]);

    var wrap = el("div", {}, [row, fileInput]);
    if (state.importError) wrap.appendChild(el("div", { class: "import-error", text: state.importError }));
    return wrap;
  }

  // ---------- Root render ----------
  function render() {
    var root = document.getElementById("app-root");
    root.innerHTML = "";

    var shell = el("div", { class: "shell" });

    var today = state.dailyStats[todayStr()] || { reviews: 0 };
    shell.appendChild(el("div", { class: "masthead" }, [
      el("div", { class: "title-wrap" }, [
        el("div", { class: "jp-kicker", text: "日本語 ・ 学習帳" }),
        el("div", { class: "title" }, [el("span", { class: "mark", text: "学" }), document.createTextNode("Flashcards")])
      ]),
      el("div", { class: "sub", text: "学習記録 ・ " + today.reviews + " reviewed today" })
    ]));

    shell.appendChild(renderViewTabs());
    shell.appendChild(renderLevelTabs());
    shell.appendChild(renderFilterTabs());
    if (state.view === "study") shell.appendChild(renderModeToggle());
    if (state.view === "study" || state.view === "browse") shell.appendChild(renderStatRow());

    if (state.view === "study") shell.appendChild(renderStudy());
    else if (state.view === "browse") shell.appendChild(renderBrowse());
    else if (state.view === "add") shell.appendChild(renderAddForm());
    else if (state.view === "stats") shell.appendChild(renderStatsView());

    shell.appendChild(renderFooter());
    root.appendChild(shell);
  }

  document.addEventListener("keydown", function (e) {
    if (state.view !== "study") return;
    if (state.studyMode === "flip") {
      if (e.code === "Space") { e.preventDefault(); flip(); }
      if (state.flipped) {
        if (e.key === "1") gradeCard("again");
        if (e.key === "2") gradeCard("hard");
        if (e.key === "3") gradeCard("good");
        if (e.key === "4") gradeCard("easy");
      }
    } else if (state.typedChecked && document.activeElement.tagName !== "INPUT") {
      if (e.key === "1") gradeCard("again");
      if (e.key === "2") gradeCard("hard");
      if (e.key === "3") gradeCard("good");
      if (e.key === "4") gradeCard("easy");
    }
  });

  loadState();
})();