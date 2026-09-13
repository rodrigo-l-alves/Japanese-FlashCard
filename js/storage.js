// ---------- PERSISTENCE ----------
// Saves to localStorage, tied to the browser + origin you're serving this
// app from (e.g. http://127.0.0.1:5500). Survives closing the tab/browser
// as long as you keep opening it from the same place.
//
// For a portable backup, or to move progress to another machine/browser,
// use exportJSON() / importJSON() to save/load a plain .json file.

(function () {
  var KEY = "n5-app-data";

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Storage: load failed", e);
      return null;
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Storage: save failed", e);
      return false;
    }
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function exportJSON(data) {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var d = new Date();
    var stamp = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    var a = document.createElement("a");
    a.href = url;
    a.download = "n5-flashcards-progress-" + stamp + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importJSON(file, callback) {
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var data = JSON.parse(e.target.result);
        callback(null, data);
      } catch (err) {
        callback(err);
      }
    };
    reader.onerror = function () { callback(new Error("Could not read file")); };
    reader.readAsText(file);
  }

  window.Storage = {
    load: load,
    save: save,
    exportJSON: exportJSON,
    importJSON: importJSON
  };
})();