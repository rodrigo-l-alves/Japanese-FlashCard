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

  function speak(text) {
    if (!supported() || !text) return false;
    var utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ja-JP";
    var jaVoice = cachedVoices.filter(function (v) { return v.lang && v.lang.indexOf("ja") === 0; })[0];
    if (jaVoice) utter.voice = jaVoice;
    window.speechSynthesis.cancel(); // stop anything already playing
    window.speechSynthesis.speak(utter);
    return true;
  }

  window.Speech = { speak: speak, supported: supported };
})();