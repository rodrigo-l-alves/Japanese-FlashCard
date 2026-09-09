// ---------- SPACED REPETITION LOGIC ----------
// Pure functions: given progress + a grade, return the next schedule.
// No DOM, no storage — easy to test or swap out on its own.

(function () {
  function initProgress(now) {
    return { reps: 0, ease: 2.5, interval: 0, due: now, lapses: 0 };
  }

  function grade(p, gradeKey, now) {
    if (!p) p = initProgress(now);

    if (gradeKey === "again") {
      p.lapses += 1;
      p.reps = 0;
      p.ease = Math.max(1.3, p.ease - 0.2);
      p.interval = 0;
      p.due = now + 5 * 60 * 1000;
    } else if (gradeKey === "hard") {
      p.reps += 1;
      p.ease = Math.max(1.3, p.ease - 0.15);
      p.interval = Math.max(1, p.interval > 0 ? p.interval * 1.2 : 1);
      p.due = now + p.interval * 86400000;
    } else if (gradeKey === "good") {
      p.reps += 1;
      p.interval = p.interval > 0 ? p.interval * p.ease : 1;
      p.due = now + p.interval * 86400000;
    } else if (gradeKey === "easy") {
      p.reps += 1;
      p.ease = p.ease + 0.15;
      p.interval = p.interval > 0 ? p.interval * p.ease * 1.3 : 2;
      p.due = now + p.interval * 86400000;
    }

    return p;
  }

  // No cap on how many new cards enter the queue — every due card plus
  // every not-yet-seen card in the pool is included.
  function buildQueue(pool, progress, now) {
    var due = [];
    var fresh = [];

    pool.forEach(function (c) {
      var p = progress[c.id];
      if (p) {
        if (p.due <= now) due.push(c);
      } else {
        fresh.push(c);
      }
    });

    due.sort(function (a, b) { return progress[a.id].due - progress[b.id].due; });

    return due.concat(fresh);
  }

  window.SRS = {
    initProgress: initProgress,
    grade: grade,
    buildQueue: buildQueue
  };
})();