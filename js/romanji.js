// ---------- ROMAJI / KANA HELPERS ----------
// Lets "type the answer" accept either kana (if you have a JP keyboard/IME)
// or plain romaji typed on a normal keyboard.

(function () {
  var TABLE = {
    "kya":"きゃ","kyu":"きゅ","kyo":"きょ","sha":"しゃ","shu":"しゅ","sho":"しょ",
    "cha":"ちゃ","chu":"ちゅ","cho":"ちょ","nya":"にゃ","nyu":"にゅ","nyo":"にょ",
    "hya":"ひゃ","hyu":"ひゅ","hyo":"ひょ","mya":"みゃ","myu":"みゅ","myo":"みょ",
    "rya":"りゃ","ryu":"りゅ","ryo":"りょ","gya":"ぎゃ","gyu":"ぎゅ","gyo":"ぎょ",
    "ja":"じゃ","ju":"じゅ","jo":"じょ","bya":"びゃ","byu":"びゅ","byo":"びょ",
    "pya":"ぴゃ","pyu":"ぴゅ","pyo":"ぴょ",
    "ka":"か","ki":"き","ku":"く","ke":"け","ko":"こ",
    "sa":"さ","shi":"し","su":"す","se":"せ","so":"そ",
    "ta":"た","chi":"ち","tsu":"つ","te":"て","to":"と",
    "na":"な","ni":"に","nu":"ぬ","ne":"ね","no":"の",
    "ha":"は","hi":"ひ","fu":"ふ","he":"へ","ho":"ほ",
    "ma":"ま","mi":"み","mu":"む","me":"め","mo":"も",
    "ya":"や","yu":"ゆ","yo":"よ",
    "ra":"ら","ri":"り","ru":"る","re":"れ","ro":"ろ",
    "wa":"わ","wo":"を",
    "ga":"が","gi":"ぎ","gu":"ぐ","ge":"げ","go":"ご",
    "za":"ざ","ji":"じ","zu":"ず","ze":"ぜ","zo":"ぞ",
    "da":"だ","di":"ぢ","du":"づ","de":"で","do":"ど",
    "ba":"ば","bi":"び","bu":"ぶ","be":"べ","bo":"ぼ",
    "pa":"ぱ","pi":"ぴ","pu":"ぷ","pe":"ぺ","po":"ぽ",
    "a":"あ","i":"い","u":"う","e":"え","o":"お"
  };

  function toHiragana(input) {
    var s = input.toLowerCase().replace(/[^a-z]/g, "");
    var out = "";
    var i = 0;
    while (i < s.length) {
      // doubled consonant -> small tsu (e.g. "kitte" -> "きって")
      if (s[i] === s[i + 1] && "bcdfghjklmpqrstvwxyz".indexOf(s[i]) !== -1) {
        out += "っ";
        i += 1;
        continue;
      }
      // "n" not followed by a vowel or y -> ん
      if (s[i] === "n" && !/[aeiouy]/.test(s[i + 1] || "")) {
        out += "ん";
        i += 1;
        continue;
      }
      var matched = false;
      for (var len = 3; len >= 1; len--) {
        var chunk = s.substr(i, len);
        if (TABLE[chunk]) {
          out += TABLE[chunk];
          i += len;
          matched = true;
          break;
        }
      }
      if (!matched) i += 1; // unknown character, skip it
    }
    return out;
  }

  function normalizeKana(s) {
    return s.split("").map(function (ch) {
      var code = ch.charCodeAt(0);
      if (code >= 0x30A1 && code <= 0x30F6) return String.fromCharCode(code - 0x60); // katakana -> hiragana
      return ch;
    }).join("").trim();
  }

  function looksLikeKana(s) {
    return /^[\u3040-\u30FF\u30FC・ー\s]+$/.test(s);
  }

  // Returns true if `input` matches any of the ・-separated readings in `readingStr`.
  function matchesReading(input, readingStr) {
    var trimmed = (input || "").trim();
    if (!trimmed) return false;
    var candidate = normalizeKana(looksLikeKana(trimmed) ? trimmed : toHiragana(trimmed));
    var variants = readingStr.split("・").map(function (v) { return normalizeKana(v); });
    return variants.indexOf(candidate) !== -1;
  }

  window.Romaji = {
    toHiragana: toHiragana,
    normalizeKana: normalizeKana,
    matchesReading: matchesReading
  };
})();