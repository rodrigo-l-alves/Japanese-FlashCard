// ---------- DECK DATA ----------
// Two levels (n5, n4), each with a kanji deck and a vocab deck.
// N5 ids are unchanged from the original version ("k0", "v0", ...) so
// existing saved progress keeps working. N4 cards use "n4k"/"n4v" ids.

(function () {
  function withIds(rawList, idPrefix, deck, level) {
    return rawList.map(function (r, i) {
      return {
        id: idPrefix + i,
        deck: deck,
        level: level,
        front: r[0],
        reading: r[1],
        meaning: r[2],
        example: r[3] || null
      };
    });
  }

  // ---------- N5 ----------
  var N5_KANJI_RAW = [
    ["一","いち","one"],["二","に","two"],["三","さん","three"],["四","し・よん","four"],
    ["五","ご","five"],["六","ろく","six"],["七","しち・なな","seven"],["八","はち","eight"],
    ["九","きゅう・く","nine"],["十","じゅう","ten"],["百","ひゃく","hundred"],["千","せん","thousand"],
    ["万","まん","ten thousand"],["円","えん","yen / circle"],["日","ひ・にち","day / sun"],
    ["月","つき・げつ","month / moon"],["火","ひ・か","fire"],["水","みず・すい","water"],
    ["木","き・もく","tree"],["金","かね・きん","money / gold"],["土","つち・ど","earth / soil"],
    ["曜","よう","day of the week"],["年","ねん・とし","year"],["時","じ・とき","time / hour"],
    ["分","ふん・ぶん","minute / part"],["半","はん","half"],["週","しゅう","week"],
    ["間","あいだ・かん","interval / between"],["上","うえ","up / above"],["下","した","down / below"],
    ["中","なか","inside / middle"],["左","ひだり","left"],["右","みぎ","right"],
    ["前","まえ","before / front"],["後","あと・ご","after / behind"],["外","そと・がい","outside"],
    ["内","うち・ない","inside"],["東","ひがし・とう","east"],["西","にし・せい","west"],
    ["南","みなみ・なん","south"],["北","きた・ほく","north"],["山","やま・さん","mountain"],
    ["川","かわ","river"],["田","た","rice field"],["天","てん","heaven / sky"],
    ["気","き","spirit / air"],["雨","あめ","rain"],["電","でん","electricity"],
    ["車","くるま・しゃ","car"],["話","はなし・わ","talk / story"],["語","ご","language"],
    ["学","がく","study"],["校","こう","school"],["生","せい・なま","life / birth / raw"],
    ["先","せん","previous / ahead"],["名","な・めい","name"],["人","ひと・じん","person"],
    ["子","こ","child"],["女","おんな・じょ","woman"],["男","おとこ・だん","man"],
    ["父","ちち・ふ","father"],["母","はは・ぼ","mother"],["兄","あに・けい","older brother"],
    ["姉","あね・し","older sister"],["弟","おとうと・だい","younger brother"],["妹","いもうと・まい","younger sister"],
    ["友","とも・ゆう","friend"],["家","いえ・か","house"],["族","ぞく","family / clan"],
    ["私","わたし・し","I / private"],["今","いま・こん","now"],["何","なに・なん","what"],
    ["見","みる・けん","see"],["聞","きく・ぶん","hear / ask"],["言","いう・げん","say"],
    ["読","よむ・どく","read"],["書","かく・しょ","write"],["買","かう","buy"],
    ["食","たべる・しょく","eat"],["飲","のむ・いん","drink"],["行","いく・こう","go"],
    ["来","くる・らい","come"],["帰","かえる・き","return"],["立","たつ・りつ","stand"],
    ["休","やすむ・きゅう","rest"],["会","あう・かい","meet"],["社","しゃ","company"],
    ["出","でる・しゅつ","exit / leave"],["入","はいる・にゅう","enter"],["起","おきる・き","get up"],
    ["寝","ねる・しん","sleep"],["白","しろ・はく","white"],["赤","あか・せき","red"],
    ["青","あお・せい","blue"],["高","たかい・こう","high / expensive"],["安","やすい・あん","cheap / safe"],
    ["新","あたらしい・しん","new"],["古","ふるい・こ","old"],["多","おおい・た","many"],
    ["少","すこし・しょう","few / little"]
  ];

  var N5_VOCAB_RAW = [
    ["こんにちは","こんにちは","hello"],["ありがとう","ありがとう","thank you"],
    ["すみません","すみません","excuse me / sorry"],["おはようございます","おはようございます","good morning"],
    ["こんばんは","こんばんは","good evening"],["さようなら","さようなら","goodbye"],
    ["はい","はい","yes"],["いいえ","いいえ","no"],["私","わたし","I"],["あなた","あなた","you"],
    ["学生","がくせい","student"],["先生","せんせい","teacher"],["会社員","かいしゃいん","office worker"],
    ["病院","びょういん","hospital"],["学校","がっこう","school"],["図書館","としょかん","library"],
    ["駅","えき","station"],["電車","でんしゃ","train"],["飛行機","ひこうき","airplane"],
    ["自動車","じどうしゃ","car"],["自転車","じてんしゃ","bicycle"],["食べ物","たべもの","food"],
    ["飲み物","のみもの","drink"],["水","みず","water"],["お茶","おちゃ","tea"],
    ["ご飯","ごはん","rice / meal"],["パン","パン","bread"],["肉","にく","meat"],
    ["魚","さかな","fish"],["野菜","やさい","vegetable"],["果物","くだもの","fruit"],
    ["卵","たまご","egg"],["家","いえ","house"],["部屋","へや","room"],["窓","まど","window"],
    ["ドア","ドア","door"],["テーブル","テーブル","table"],["椅子","いす","chair"],
    ["本","ほん","book"],["雑誌","ざっし","magazine"],["新聞","しんぶん","newspaper"],
    ["ペン","ペン","pen"],["鉛筆","えんぴつ","pencil"],["紙","かみ","paper"],["かばん","かばん","bag"],
    ["時計","とけい","watch / clock"],["電話","でんわ","phone"],["テレビ","テレビ","television"],
    ["コンピューター","コンピューター","computer"],["カメラ","カメラ","camera"],["お金","おかね","money"],
    ["切符","きっぷ","ticket"],["仕事","しごと","work / job"],["会社","かいしゃ","company"],
    ["電気","でんき","electricity / light"],["病気","びょうき","illness"],["薬","くすり","medicine"],
    ["雨","あめ","rain"],["雪","ゆき","snow"],["風","かぜ","wind"],["晴れ","はれ","clear weather"],
    ["季節","きせつ","season"],["春","はる","spring"],["夏","なつ","summer"],["秋","あき","autumn"],
    ["冬","ふゆ","winter"],["朝","あさ","morning"],["昼","ひる","noon / daytime"],["夜","よる","night"],
    ["今日","きょう","today"],["明日","あした","tomorrow"],["昨日","きのう","yesterday"],
    ["毎日","まいにち","every day"],["いつも","いつも","always"],["たまに","たまに","rarely"],
    ["時々","ときどき","sometimes"],["全然","ぜんぜん","not at all"],["とても","とても","very"],
    ["少し","すこし","a little"],["たくさん","たくさん","a lot"],["大きい","おおきい","big"],
    ["小さい","ちいさい","small"],["新しい","あたらしい","new"],["古い","ふるい","old"],
    ["高い","たかい","expensive / tall"],["安い","やすい","cheap"],["いい","いい","good"],
    ["悪い","わるい","bad"],["面白い","おもしろい","interesting"],["つまらない","つまらない","boring"],
    ["難しい","むずかしい","difficult"],["優しい","やさしい","easy / kind"],["忙しい","いそがしい","busy"],
    ["楽しい","たのしい","fun"],["嬉しい","うれしい","happy"],["悲しい","かなしい","sad"],
    ["好きです","すきです","to like"],["嫌いです","きらいです","to dislike"],["欲しい","ほしい","to want"],
    ["頑張る","がんばる","to try hard"],["行く","いく","to go"],["来る","くる","to come"],
    ["食べる","たべる","to eat"],["飲む","のむ","to drink"]
  ];

  // ---------- N4 ----------
  var N4_KANJI_RAW = [
    ["同","おな・どう","same"],["国","くに・こく","country"],
    ["近","ちか・きん","near"],["建","た・けん","build"],["動","うご・どう","move"],
    ["集","あつ・しゅう","gather"],["決","き・けつ","decide"],["開","あ・かい","open"],
    ["閉","し・へい","close"],["始","はじ・し","begin"],["終","お・しゅう","end"],
    ["続","つづ・ぞく","continue"],["使","つか・し","use"],["働","はたら・どう","work"],
    ["作","つく・さく","make"],["住","す・じゅう","live / reside"],["持","も・じ","hold / have"],
    ["乗","の・じょう","ride"],["降","お・こう","get off / fall (rain)"],["歩","ある・ほ","walk"],
    ["走","はし・そう","run"],["着","き・ちゃく","wear / arrive"],["洗","あら・せん","wash"],
    ["待","ま・たい","wait"],["貸","か・たい","lend"],["借","か・しゃく","borrow"],
    ["返","かえ・へん","return (something)"],["送","おく・そう","send"],["受","う・じゅ","receive"],
    ["渡","わた・と","hand over / cross"],["教","おし・きょう","teach"],["習","なら・しゅう","learn"],
    ["覚","おぼ・かく","memorize"],["忘","わす・ぼう","forget"],["知","し・ち","know"],
    ["思","おも・し","think"],["考","かんが・こう","consider"],["神","かみ・しん","god"],
    ["別","わか・べつ","separate / different"],
    // ---- additional N4 kanji (bringing the deck up to standard N4 coverage) ----
    ["場","ば・じょう","place"],["売","うる・ばい","sell"],["勉","べん","study hard"],
    ["文","ぶん・もん","sentence / writing"],["物","もの・ぶつ","thing"],["病","やまい・びょう","illness"],
    ["茶","ちゃ・さ","tea"],["地","ち・じ","ground / earth"],["朝","あさ・ちょう","morning"],
    ["町","まち・ちょう","town"],["鳥","とり・ちょう","bird"],["注","そそぐ・ちゅう","pour / pay attention"],
    ["昼","ひる・ちゅう","noon / daytime"],["代","かわる・だい","substitute / generation"],
    ["題","だい","topic / subject"],["台","だい","platform / stand"],["度","たび・ど","degree / times"],
    ["道","みち・どう","road / path"],["堂","どう","hall"],["映","うつる・えい","reflect / be projected"],
    ["英","えい","England / excellent"],["駅","えき","station"],["不","ふ","not / un-"],
    ["服","ふく","clothing"],["風","かぜ・ふう","wind / style"],["元","もと・げん","origin / former"],
    ["銀","ぎん","silver"],["魚","さかな・ぎょ","fish"],["業","ぎょう","business / vocation"],
    ["牛","うし・ぎゅう","cow"],["飯","めし・はん","meal / cooked rice"],["発","はつ","departure / emit"],
    ["品","しな・ひん","goods / item"],["方","かた・ほう","direction / person"],["意","い","idea / meaning"],
    ["以","い","by means of / than"],["医","い","medicine / doctor"],["員","いん","member / employee"],
    ["院","いん","institution"],["事","こと・じ","matter / thing"],["自","じ・し","self"],
    ["字","じ","character / letter"],["重","おもい・じゅう","heavy / important"],["歌","うた・か","song"],
    ["花","はな・か","flower"],["夏","なつ・か","summer"],["界","かい","world / boundary"],
    ["海","うみ・かい","sea"],["画","が・かく","picture / stroke"],["館","かん","building / hall"],
    ["漢","かん","China / Sino-"],["計","はかる・けい","measure / plan"],["犬","いぬ・けん","dog"],
    ["研","けん","study / polish"],["験","けん","test / effect"],["黒","くろ・こく","black"],
    ["公","こう","public"],["口","くち・こう","mouth"],["広","ひろい・こう","wide"],
    ["工","こう・く","craft / construction"],["空","そら・くう","sky / empty"],["去","さる・きょ","leave / past"],
    ["京","きょう","capital"],["強","つよい・きょう","strong"],["急","いそぐ・きゅう","hurry / sudden"],
    ["究","きゅう","research"],["味","あじ・み","taste"],["明","あかるい・めい","bright / light"],
    ["目","め・もく","eye"],["問","とう・もん","question / ask"],["無","ない・む","nothing / without"],
    ["肉","にく","meat"],["屋","や・おく","shop / roof"],["音","おと・おん","sound"],
    ["楽","たのしい・らく","fun / music"],["理","り","logic / reason"],["旅","たび・りょ","trip"],
    ["料","りょう","fee / materials"],["力","ちから・りょく","power"],["世","よ・せい","world / generation"],
    ["正","ただしい・せい","correct"],["夕","ゆう・せき","evening"],["切","きる・せつ","cut"],
    ["者","もの・しゃ","person"],["写","うつす・しゃ","copy / photograph"],["紙","かみ・し","paper"],
    ["死","しぬ・し","death"],["止","とまる・し","stop"],["試","こころみる・し","try / test"],
    ["仕","し","serve / attend to"],["心","こころ・しん","heart / mind"],["真","ま・しん","true / reality"],
    ["親","おや・しん","parent / intimate"],["質","しつ","quality / substance"],["室","しつ","room"],
    ["色","いろ・しょく","color"],["手","て・しゅ","hand"],["主","おも・しゅ","main / master"],
    ["春","はる・しゅん","spring"],["秋","あき・しゅう","autumn"],["足","あし・そく","leg / foot / enough"],
    ["早","はやい・そう","early"],["体","からだ・たい","body"],["転","ころがる・てん","roll / turn"],
    ["店","みせ・てん","shop"],["特","とく","special"],["答","こたえる・とう","answer"],
    ["冬","ふゆ・とう","winter"],["通","とおる・つう","pass through / commute"],["運","はこぶ・うん","carry / luck"],
    ["野","の・や","field / plain"],["夜","よる・や","night"],["用","もちいる・よう","use"],
    ["洋","よう","ocean / Western"],["有","ある・ゆう","possess / exist"],["図","はかる・ず","diagram / plan"]
  ];

  var N4_VOCAB_RAW = [
    ["遠い","とおい","far"],["近く","ちかく","nearby"],["便利","べんり","convenient"],
    ["不便","ふべん","inconvenient"],["危ない","あぶない","dangerous"],["安全","あんぜん","safe"],
    ["大切","たいせつ","important"],["必要","ひつよう","necessary"],["十分","じゅうぶん","enough"],
    ["特に","とくに","especially"],["例えば","たとえば","for example"],["最近","さいきん","recently"],
    ["最初","さいしょ","first / beginning"],["最後","さいご","last / end"],["全部","ぜんぶ","all / everything"],
    ["一緒に","いっしょに","together"],["自分","じぶん","oneself"],["大人","おとな","adult"],
    ["子供","こども","child"],["若い","わかい","young"],["元気","げんき","healthy / energetic"],
    ["具合","ぐあい","condition"],["怪我","けが","injury"],["熱","ねつ","fever"],
    ["薬局","やっきょく","pharmacy"],["銀行","ぎんこう","bank"],["郵便局","ゆうびんきょく","post office"],
    ["空港","くうこう","airport"],["港","みなと","port"],["橋","はし","bridge"],
    ["道","みち","road / way"],["地図","ちず","map"],["予定","よてい","plan / schedule"],
    ["約束","やくそく","promise"],["用事","ようじ","errand / business"],["準備","じゅんび","preparation"],
    ["説明","せつめい","explanation"],["質問","しつもん","question"],["答え","こたえ","answer"],
    ["練習","れんしゅう","practice"],["試験","しけん","exam"],["宿題","しゅくだい","homework"],
    ["授業","じゅぎょう","class / lesson"],["経験","けいけん","experience"],["興味","きょうみ","interest"],
    ["趣味","しゅみ","hobby"],["予約","よやく","reservation"],["招待","しょうたい","invitation"],
    ["都合","つごう","circumstances / convenience"],["相談","そうだん","consultation"],
    ["我慢","がまん","patience / endurance"],["心配","しんぱい","worry"],["残念","ざんねん","regrettable"],
    ["邪魔","じゃま","hindrance / nuisance"],["迷惑","めいわく","trouble / annoyance"],
    ["失礼","しつれい","rudeness"],["丁寧","ていねい","polite"],["簡単","かんたん","simple / easy"],
    ["複雑","ふくざつ","complicated"],
    // ---- additional N4 vocab (bringing the deck up to standard N4 coverage) ----
    ["続ける","つづける","to continue"],["始める","はじめる","to begin"],["終わる","おわる","to end / finish"],
    ["決める","きめる","to decide"],["呼ぶ","よぶ","to call"],["選ぶ","えらぶ","to choose"],
    ["比べる","くらべる","to compare"],["育てる","そだてる","to raise / grow"],["育つ","そだつ","to grow up"],
    ["間違える","まちがえる","to make a mistake"],["気をつける","きをつける","to be careful"],
    ["慣れる","なれる","to get used to"],["信じる","しんじる","to believe"],["喜ぶ","よろこぶ","to be glad"],
    ["怒る","おこる","to get angry"],["泣く","なく","to cry"],["笑う","わらう","to laugh"],
    ["驚く","おどろく","to be surprised"],["困る","こまる","to be troubled"],["疲れる","つかれる","to get tired"],
    ["治る","なおる","to heal / be cured"],["壊れる","こわれる","to break (itself)"],
    ["壊す","こわす","to break (something)"],["直す","なおす","to fix / repair"],["運ぶ","はこぶ","to carry"],
    ["包む","つつむ","to wrap"],["並べる","ならべる","to line up (things)"],["並ぶ","ならぶ","to line up (people)"],
    ["通う","かよう","to commute"],["集まる","あつまる","to gather (itself)"],
    ["集める","あつめる","to gather (something)"],["見つける","みつける","to find"],
    ["見つかる","みつかる","to be found"],["落ちる","おちる","to fall"],["落とす","おとす","to drop"],
    ["上がる","あがる","to rise / go up"],["上げる","あげる","to raise"],["下がる","さがる","to go down"],
    ["下げる","さげる","to lower"],["増える","ふえる","to increase"],["減る","へる","to decrease"],
    ["変わる","かわる","to change (itself)"],["変える","かえる","to change (something)"],
    ["続く","つづく","to continue (itself)"],["出発","しゅっぱつ","departure"],["到着","とうちゃく","arrival"],
    ["出席","しゅっせき","attendance"],["欠席","けっせき","absence"],["卒業","そつぎょう","graduation"],
    ["入学","にゅうがく","school enrollment"],["就職","しゅうしょく","getting a job"],
    ["引っ越し","ひっこし","moving (house)"],["留学","りゅうがく","study abroad"],["旅行","りょこう","travel"],
    ["出張","しゅっちょう","business trip"],["参加","さんか","participation"],["案内","あんない","guidance / information"],
    ["連絡","れんらく","contact / communication"],["会議","かいぎ","meeting"],["発表","はっぴょう","presentation"],
    ["報告","ほうこく","report"],["意見","いけん","opinion"],["理由","りゆう","reason"],
    ["目的","もくてき","purpose"],["方法","ほうほう","method"],["内容","ないよう","content"],
    ["場合","ばあい","case / situation"],["場所","ばしょ","place"],["天気予報","てんきよほう","weather forecast"],
    ["台風","たいふう","typhoon"],["地震","じしん","earthquake"],["火事","かじ","fire (disaster)"],
    ["事故","じこ","accident"],["事件","じけん","incident"],["警察","けいさつ","police"],
    ["救急車","きゅうきゅうしゃ","ambulance"],["交通","こうつう","traffic"],["渋滞","じゅうたい","traffic jam"],
    ["信号","しんごう","traffic light"],["運転","うんてん","driving"],["免許","めんきょ","license"]
  ];

  var N5_KANJI = withIds(N5_KANJI_RAW, "k", "kanji", "n5");
  var N5_VOCAB = withIds(N5_VOCAB_RAW, "v", "vocab", "n5");
  var N4_KANJI = withIds(N4_KANJI_RAW, "n4k", "kanji", "n4");
  var N4_VOCAB = withIds(N4_VOCAB_RAW, "n4v", "vocab", "n4");

  // ---------- Auto-generated example sentences (vocab only) ----------
  var GREETING_WORDS = ["こんにちは","ありがとう","すみません","おはようございます","こんばんは","さようなら","はい","いいえ"];

  function autoExample(card) {
    if (card.example) return card.example;
    if (card.deck !== "vocab") return null;

    if (GREETING_WORDS.indexOf(card.front) !== -1) {
      return "会話で「" + card.front + "」と言います。";
    }
    if (/^to /.test(card.meaning)) {
      // verb (or a "to like / to want" style adjective phrase) — usable on its own
      return card.front + "。";
    }
    if (/い$/.test(card.front)) {
      // i-adjective
      return "とても" + card.front + "です。";
    }
    // noun fallback
    return "これは" + card.front + "です。";
  }

  N5_VOCAB.concat(N4_VOCAB).forEach(function (c) { c.example = autoExample(c); });

  var BY_ID = {};
  N5_KANJI.concat(N5_VOCAB).concat(N4_KANJI).concat(N4_VOCAB).forEach(function (c) { BY_ID[c.id] = c; });

  window.FlashcardData = {
    levels: {
      n5: { kanji: N5_KANJI, vocab: N5_VOCAB, all: N5_KANJI.concat(N5_VOCAB) },
      n4: { kanji: N4_KANJI, vocab: N4_VOCAB, all: N4_KANJI.concat(N4_VOCAB) }
    },
    BY_ID: BY_ID
  };
})();