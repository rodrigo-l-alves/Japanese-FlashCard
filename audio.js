// ---------- AUDIO (speechSynthesis) ----------
// Free, built into the browser — no external service or API key needed.
// Voice quality/availability depends on the OS and browser.

(function () {
  var cachedVoices = [];

  function refreshVoices() {
    if ("speechSynthesis" in window) cachedVoices = window.speechSynthesis.getVoices();
  }

  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function supported() {
    return "speechSynthesis" in window;
  }

  // Kept outside speak() on purpose: some browsers (Chrome in particular)
  // will silently garbage-collect a SpeechSynthesisUtterance — and drop the
  // audio with no error — if nothing outside the function still references it.
  var activeUtterance = null;

  function pickJapaneseVoice() {
    // Voices can still be an empty list the first time this runs on some
    // browsers even after onvoiceschanged has fired once, so re-fetch here
    // rather than trusting only the cached copy.
    var voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) cachedVoices = voices;
    return cachedVoices.filter(function (v) { return v.lang && v.lang.indexOf("ja") === 0; })[0] || null;
  }

  function speak(text) {
    if (!supported() || !text) return false;

    window.speechSynthesis.cancel(); // stop anything already playing

    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ja-JP";
    var jaVoice = pickJapaneseVoice();
    if (jaVoice) utter.voice = jaVoice;
    utter.onerror = function (e) {
      console.warn("Speech synthesis failed:", e.error);
    };
    activeUtterance = utter;

    // Queuing speak() in the same tick as cancel() is a known Chrome race
    // condition that can drop the utterance silently. A short delay avoids it.
    setTimeout(function () {
      window.speechSynthesis.speak(utter);
    }, 30);

    return true;
  }

  window.Speech = { speak: speak, supported: supported };
})();