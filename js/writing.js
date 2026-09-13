// ---------- KANJI WRITING PRACTICE ----------
// Uses real Japanese stroke-order vector data from KanjiVG (CC BY-SA 3.0).
// Data is fetched per-character and cached locally after first use.
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var CACHE_PREFIX = "n5-kanjivg:";
  var PROGRESS_KEY = "n5-writing-progress";
  var CDN_BASE = "https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/";
  var GITHUB_BASE = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (attrs[key] === null || attrs[key] === undefined) return;
      if (key === "class") node.className = attrs[key];
      else if (key === "text") node.textContent = attrs[key];
      else if (key.indexOf("on") === 0) node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  }

  function svgEl(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    return node;
  }

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
    catch (e) { return {}; }
  }

  function saveProgress(progress) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (e) {}
  }

  function codepointFile(ch) {
    return ch.codePointAt(0).toString(16).toLowerCase().padStart(5, "0") + ".svg";
  }

  function cachedSVG(ch) {
    try { return localStorage.getItem(CACHE_PREFIX + codepointFile(ch)); }
    catch (e) { return null; }
  }

  function storeSVG(ch, text) {
    try { localStorage.setItem(CACHE_PREFIX + codepointFile(ch), text); } catch (e) {}
  }

  function fetchText(url) {
    return fetch(url, { mode: "cors" }).then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.text();
    });
  }

  function loadKanjiVG(ch) {
    var cached = cachedSVG(ch);
    if (cached) return Promise.resolve(cached);
    var file = codepointFile(ch);
    return fetchText(CDN_BASE + file).catch(function () {
      return fetchText(GITHUB_BASE + file);
    }).then(function (text) {
      storeSVG(ch, text);
      return text;
    });
  }

  function parseStrokes(svgText) {
    var doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    if (doc.querySelector("parsererror")) throw new Error("Invalid KanjiVG SVG");
    var paths = Array.prototype.slice.call(doc.querySelectorAll('g[id*="StrokePaths"] path'));
    if (!paths.length) paths = Array.prototype.slice.call(doc.querySelectorAll('path[id*="-s"]'));
    return paths.map(function (p, i) {
      return { number: i + 1, d: p.getAttribute("d") || "", type: p.getAttribute("kvg:type") || "" };
    }).filter(function (s) { return s.d; });
  }

  function stageFor(successes) {
    if (successes >= 4) return 2;
    if (successes >= 2) return 1;
    return 0;
  }

  function stageLabel(stage) {
    return stage === 0 ? "Guided tracing" : stage === 1 ? "Light guidance" : "From memory";
  }

  function modeCopy(stage) {
    if (stage === 0) return "Follow the highlighted stroke. Start at the numbered dot and move with the arrow.";
    if (stage === 1) return "The model is faded. Use the arrow and stroke number only when you need them.";
    return "Write from memory. If you miss a stroke, the app briefly reveals the next one.";
  }

  function render(options) {
    var cards = options.cards || [];
    var level = options.level || "n5";
    var wrap = el("div", { class: "writing-practice" });
    if (!cards.length) {
      wrap.appendChild(el("div", { class: "empty-state" }, [
        el("div", { class: "big", text: "書" }),
        el("p", { text: "No single-character kanji are available in this level." })
      ]));
      return wrap;
    }

    var progress = loadProgress();
    var indexKey = "lastIndex:" + level;
    var requestedIndex = -1;
    if (options.startCardId) {
      for (var ri = 0; ri < cards.length; ri++) {
        if (cards[ri].id === options.startCardId) { requestedIndex = ri; break; }
      }
    }
    var index = requestedIndex >= 0 ? requestedIndex : Math.max(0, Math.min(cards.length - 1, Number(progress[indexKey] || 0)));
    var destroyed = false;

    var header = el("div", { class: "writing-header" }, [
      el("div", { class: "writing-eyebrow", text: "指で書く ・ finger practice" }),
      el("div", { class: "writing-title", text: "Kanji writing" })
    ]);
    var body = el("div", { class: "writing-body" });
    wrap.appendChild(header);
    wrap.appendChild(body);

    function showCard(newIndex) {
      index = (newIndex + cards.length) % cards.length;
      progress[indexKey] = index;
      saveProgress(progress);
      body.innerHTML = "";
      buildCard(cards[index]);
    }

    function buildCard(card) {
      var ch = card.front;
      var stats = progress[ch] || { successes: 0, attempts: 0 };
      // Manual practice mode: any stage can be selected at any time.
      // Keep a per-kanji preference, otherwise start at the recommended stage.
      var manualStageKey = "stage:" + ch;
      var savedStage = Number(progress[manualStageKey]);
      var stage = (savedStage >= 0 && savedStage <= 2) ? savedStage : stageFor(stats.successes || 0);

      var meta = el("div", { class: "writing-meta" }, [
        el("button", { class: "write-nav", onClick: function () { showCard(index - 1); }, text: "‹" }),
        el("div", { class: "writing-kanji-info" }, [
          el("div", { class: "writing-kanji", text: ch }),
          el("div", { class: "writing-reading", text: card.reading + " · " + card.meaning })
        ]),
        el("button", { class: "write-nav", onClick: function () { showCard(index + 1); }, text: "›" })
      ]);

      var stageBar = el("div", { class: "writing-stagebar", role: "group", "aria-label": "Writing guidance mode" }, [0,1,2].map(function (s) {
        var btn = el("button", {
          type: "button",
          class: "writing-stage-chip" + (s === stage ? " active" : ""),
          "aria-pressed": s === stage ? "true" : "false",
          text: (s + 1) + " · " + (s === 0 ? "Guide" : s === 1 ? "Fade" : "Memory"),
          onClick: function () {
            if (s === stage) return;
            progress[manualStageKey] = s;
            saveProgress(progress);
            body.innerHTML = "";
            buildCard(card);
          }
        });
        return btn;
      }));

      var status = el("div", { class: "writing-status" }, [
        el("b", { text: stageLabel(stage) }),
        document.createTextNode(" — " + modeCopy(stage))
      ]);

      var loading = el("div", { class: "writing-loading", text: "Loading stroke order…" });
      var practiceShell = el("div", { class: "writing-canvas-shell" }, [loading]);
      var controls = el("div", { class: "writing-controls" });
      var attribution = el("div", { class: "writing-attribution" });
      attribution.innerHTML = 'Stroke data: <a href="https://kanjivg.tagaini.net/" target="_blank" rel="noopener">KanjiVG</a> · Japanese stroke order · CC BY-SA 3.0';

      body.appendChild(meta);
      body.appendChild(stageBar);
      body.appendChild(status);
      body.appendChild(practiceShell);
      body.appendChild(controls);
      body.appendChild(attribution);

      loadKanjiVG(ch).then(function (text) {
        if (destroyed || cards[index] !== card) return;
        var strokes = parseStrokes(text);
        if (!strokes.length) throw new Error("No stroke paths");
        setupPad(card, strokes, stage, stats, practiceShell, controls, progress);
      }).catch(function () {
        loading.textContent = "Stroke-order data couldn't load. Connect to the internet once for this kanji, then it will be cached for offline practice.";
        loading.className = "writing-loading error";
      });
    }

    showCard(index);
    wrap._destroyWriting = function () { destroyed = true; };
    return wrap;
  }

  function setupPad(card, strokes, stage, stats, shell, controls, progress) {
    shell.innerHTML = "";
    controls.innerHTML = "";

    var svg = svgEl("svg", { class: "writing-svg", viewBox: "0 0 109 109", role: "img", "aria-label": "Trace " + card.front });
    var defs = svgEl("defs", {});
    var marker = svgEl("marker", { id: "write-arrow", markerWidth: "6", markerHeight: "6", refX: "5", refY: "3", orient: "auto", markerUnits: "strokeWidth" });
    marker.appendChild(svgEl("path", { d: "M0,0 L6,3 L0,6 z", class: "write-arrow-head" }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    var grid = svgEl("g", { class: "write-grid" });
    grid.appendChild(svgEl("line", { x1: "54.5", y1: "4", x2: "54.5", y2: "105" }));
    grid.appendChild(svgEl("line", { x1: "4", y1: "54.5", x2: "105", y2: "54.5" }));
    grid.appendChild(svgEl("line", { x1: "14", y1: "14", x2: "95", y2: "95" }));
    grid.appendChild(svgEl("line", { x1: "95", y1: "14", x2: "14", y2: "95" }));
    svg.appendChild(grid);

    var guideLayer = svgEl("g", { class: "write-guides stage-" + stage });
    var completedLayer = svgEl("g", { class: "write-completed" });
    var hintLayer = svgEl("g", { class: "write-hints" });
    var inkLayer = svgEl("g", { class: "write-ink" });
    svg.appendChild(guideLayer);
    svg.appendChild(completedLayer);
    svg.appendChild(hintLayer);
    svg.appendChild(inkLayer);

    var guidePaths = strokes.map(function (stroke) {
      var p = svgEl("path", { d: stroke.d, class: "write-guide-path" });
      guideLayer.appendChild(p);
      return p;
    });

    shell.appendChild(svg);

    var current = 0;
    var drawing = false;
    var points = [];
    var userPath = null;
    var misses = 0;
    var feedback = el("div", { class: "writing-feedback", text: "Stroke 1 of " + strokes.length });
    shell.appendChild(feedback);

    var resetBtn = el("button", { class: "write-action secondary", text: "Start over" });
    var hintBtn = el("button", { class: "write-action secondary", text: "Show stroke" });
    var nextBtn = el("button", { class: "write-action primary", text: "Next kanji", disabled: "disabled" });
    controls.appendChild(resetBtn);
    controls.appendChild(hintBtn);
    controls.appendChild(nextBtn);

    function svgPoint(evt) {
      var rect = svg.getBoundingClientRect();
      return {
        x: (evt.clientX - rect.left) * 109 / rect.width,
        y: (evt.clientY - rect.top) * 109 / rect.height
      };
    }

    function pathData(pts) {
      if (!pts.length) return "";
      var d = "M" + pts[0].x.toFixed(2) + " " + pts[0].y.toFixed(2);
      for (var i = 1; i < pts.length; i++) d += " L" + pts[i].x.toFixed(2) + " " + pts[i].y.toFixed(2);
      return d;
    }

    function clearHints() { while (hintLayer.firstChild) hintLayer.removeChild(hintLayer.firstChild); }

    function currentPath() { return guidePaths[current]; }

    function updateHints(reveal) {
      clearHints();
      guidePaths.forEach(function (p, i) { p.classList.toggle("current", i === current); });
      if (current >= strokes.length) return;
      var p = currentPath();
      var len = p.getTotalLength();
      var start = p.getPointAtLength(0);
      var a = p.getPointAtLength(Math.min(len * 0.15, 7));
      var b = p.getPointAtLength(Math.min(len * 0.34, 15));

      if (stage < 2 || reveal) {
        var num = svgEl("g", { class: "write-stroke-number" });
        num.appendChild(svgEl("circle", { cx: start.x, cy: start.y, r: "4.5" }));
        var t = svgEl("text", { x: start.x, y: start.y + 1.8, "text-anchor": "middle" });
        t.textContent = String(current + 1);
        num.appendChild(t);
        hintLayer.appendChild(num);

        var arrow = svgEl("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: "write-direction", "marker-end": "url(#write-arrow)" });
        hintLayer.appendChild(arrow);
      }

      if (reveal && stage === 2) p.classList.add("memory-reveal");
    }

    function distance(a, b) {
      var dx = a.x - b.x, dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function expectedSamples(path) {
      var len = path.getTotalLength();
      var n = Math.max(12, Math.ceil(len / 2));
      var arr = [];
      for (var i = 0; i <= n; i++) arr.push(path.getPointAtLength(len * i / n));
      return arr;
    }

    function validateStroke(pts, path) {
      if (pts.length < 3) return false;
      var expected = expectedSamples(path);
      var start = expected[0], end = expected[expected.length - 1];
      var startTol = stage === 0 ? 15 : stage === 1 ? 13 : 12;
      var endTol = stage === 0 ? 17 : stage === 1 ? 15 : 14;
      if (distance(pts[0], start) > startTol || distance(pts[pts.length - 1], end) > endTol) return false;
      if (distance(pts[0], start) >= distance(pts[0], end)) return false;

      var skip = Math.max(1, Math.floor(pts.length / 24));
      var total = 0, count = 0;
      for (var i = 0; i < pts.length; i += skip) {
        var best = Infinity;
        for (var j = 0; j < expected.length; j++) best = Math.min(best, distance(pts[i], expected[j]));
        total += best;
        count++;
      }
      var avg = total / Math.max(1, count);
      var tolerance = stage === 0 ? 8.8 : stage === 1 ? 7.8 : 7.2;
      return avg <= tolerance;
    }

    function completeStroke() {
      var done = svgEl("path", { d: strokes[current].d, class: "write-completed-path" });
      completedLayer.appendChild(done);
      current++;
      misses = 0;
      if (current >= strokes.length) {
        guidePaths.forEach(function (p) { p.classList.remove("current", "memory-reveal"); });
        clearHints();
        stats.successes = (stats.successes || 0) + 1;
        stats.attempts = (stats.attempts || 0) + 1;
        progress[card.front] = stats;
        saveProgress(progress);
        feedback.className = "writing-feedback success";
        var recommendedStage = stageFor(stats.successes);
        feedback.textContent = recommendedStage > stage
          ? "Kanji complete — nice work. You can try " + stageLabel(recommendedStage) + " next, or choose any mode above."
          : "Kanji complete — stroke order correct. Choose any mode above whenever you want.";
        nextBtn.removeAttribute("disabled");
        hintBtn.setAttribute("disabled", "disabled");
        return;
      }
      feedback.className = "writing-feedback";
      feedback.textContent = "Good. Stroke " + (current + 1) + " of " + strokes.length;
      updateHints(false);
    }

    function rejectStroke() {
      misses++;
      stats.attempts = (stats.attempts || 0) + 1;
      progress[card.front] = stats;
      saveProgress(progress);
      feedback.className = "writing-feedback try-again";
      feedback.textContent = misses === 1 ? "Try that stroke again — start at the numbered point and follow the arrow." : "Almost. Here’s the next stroke again.";
      updateHints(true);
      if (stage === 2) setTimeout(function () {
        if (current < guidePaths.length) guidePaths[current].classList.remove("memory-reveal");
        updateHints(false);
      }, 1100);
    }

    function pointerDown(evt) {
      if (current >= strokes.length) return;
      evt.preventDefault();
      drawing = true;
      points = [svgPoint(evt)];
      userPath = svgEl("path", { d: pathData(points), class: "write-user-path" });
      inkLayer.appendChild(userPath);
      if (svg.setPointerCapture && evt.pointerId !== undefined) svg.setPointerCapture(evt.pointerId);
    }

    function pointerMove(evt) {
      if (!drawing) return;
      evt.preventDefault();
      var p = svgPoint(evt);
      if (!points.length || distance(points[points.length - 1], p) > 0.65) {
        points.push(p);
        userPath.setAttribute("d", pathData(points));
      }
    }

    function pointerUp(evt) {
      if (!drawing) return;
      evt.preventDefault();
      drawing = false;
      var ok = validateStroke(points, currentPath());
      if (userPath && userPath.parentNode) userPath.parentNode.removeChild(userPath);
      userPath = null;
      points = [];
      if (ok) completeStroke(); else rejectStroke();
    }

    svg.addEventListener("pointerdown", pointerDown, { passive: false });
    svg.addEventListener("pointermove", pointerMove, { passive: false });
    svg.addEventListener("pointerup", pointerUp, { passive: false });
    svg.addEventListener("pointercancel", pointerUp, { passive: false });

    resetBtn.addEventListener("click", function () {
      current = 0;
      misses = 0;
      completedLayer.innerHTML = "";
      inkLayer.innerHTML = "";
      nextBtn.setAttribute("disabled", "disabled");
      hintBtn.removeAttribute("disabled");
      feedback.className = "writing-feedback";
      feedback.textContent = "Stroke 1 of " + strokes.length;
      updateHints(false);
    });

    hintBtn.addEventListener("click", function () {
      if (current >= strokes.length) return;
      updateHints(true);
      feedback.className = "writing-feedback";
      feedback.textContent = "Start at " + (current + 1) + " and follow the arrow.";
      if (stage === 2) setTimeout(function () {
        if (current < guidePaths.length) guidePaths[current].classList.remove("memory-reveal");
        updateHints(false);
      }, 1300);
    });

    nextBtn.addEventListener("click", function () {
      var navs = document.querySelectorAll(".writing-meta .write-nav");
      if (navs[1]) navs[1].click();
    });

    updateHints(false);
  }

  window.KanjiWriting = { render: render };
})();
