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
    ["一","いち","one"],["二","に","two"],["三","さん","three"],
    ["四","し・よん","four"],["五","ご","five"],["六","ろく","six"],
    ["七","しち・なな","seven"],["八","はち","eight"],["九","きゅう・く","nine"],
    ["十","じゅう","ten"],["百","ひゃく","hundred"],["千","せん","thousand"],
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
    ["少","すこし・しょう","few / little"],["飛","とぶ・ひ","fly"],["機","き","machine / opportunity"],
    ["菜","な・さい","vegetable / greens"],["果","くだ・か","fruit / result"],["卵","たまご・らん","egg"],
    ["部","ぶ","part / section"],["窓","まど・そう","window"],["椅","い","chair"],
    ["本","ほん","book / origin"],["雑","ざつ","miscellaneous"],["誌","し","magazine / journal"],
    ["鉛","なまり・えん","lead (metal)"],["筆","ふで・ひつ","writing brush"],["符","ふ","token / tally"],
    ["薬","くすり・やく","medicine"],["雪","ゆき・せつ","snow"],["晴","はれる・せい","clear up / fine weather"],
    ["季","き","season"],["節","ふし・せつ","node / season / occasion"],["昨","さく","previous / last"],
    ["毎","まい","every"],["全","まったく・ぜん","all / whole"],["然","ぜん・ねん","so / thus"],
    ["大","おおきい・だい","big / large"],["小","ちいさい・しょう","small"],["悪","わるい・あく","bad / evil"],
    ["面","おもて・めん","face / surface"],["難","むずかしい・なん","difficult"],["優","やさしい・ゆう","gentle / superior"],
    ["忙","いそがしい・ぼう","busy"],["嬉","うれしい","glad / happy"],["悲","かなしい・ひ","sad"],
    ["好","すき・こう","like / fond of"],["嫌","きらい・けん","dislike"],["欲","ほしい・よく","want / desire"],
    ["頑","がん","stubborn / persist"],["張","はる・ちょう","stretch / stick"],["動","うご・どう","move"],
    ["物","もの・ぶつ","thing"],["病","やまい・びょう","illness"],["茶","ちゃ・さ","tea"],
    ["飯","めし・はん","meal / cooked rice"],["員","いん","member / employee"],["院","いん","institution"],
    ["事","こと・じ","matter / thing"],["自","じ・し","self"],["館","かん","building / hall"],
    ["計","はかる・けい","measure / plan"],["明","あかるい・めい","bright / light"],["屋","や・おく","shop / roof"],
    ["楽","たのしい・らく","fun / music"],["切","きる・せつ","cut"],["仕","し","serve / attend to"],
    ["転","ころがる・てん","roll / turn"],["野","の・や","field / plain"],["図","はかる・ず","diagram / plan"]
  ];

  var N5_VOCAB_RAW = [
    ["こんにちは","こんにちは","hello"],["ありがとう","ありがとう","thank you"],["すみません","すみません","excuse me / sorry"],
    ["おはようございます","おはようございます","good morning"],["こんばんは","こんばんは","good evening"],["さようなら","さようなら","goodbye"],
    ["はい","はい","yes"],["いいえ","いいえ","no"],["あなた","あなた","you"],
    ["学生","がくせい","student"],["先生","せんせい","teacher"],["会社員","かいしゃいん","office worker"],
    ["病院","びょういん","hospital"],["学校","がっこう","school"],["図書館","としょかん","library"],
    ["電車","でんしゃ","train"],["飛行機","ひこうき","airplane"],["自動車","じどうしゃ","car"],
    ["自転車","じてんしゃ","bicycle"],["食べ物","たべもの","food"],["飲み物","のみもの","drink"],
    ["お茶","おちゃ","tea"],["ご飯","ごはん","rice / meal"],["パン","パン","bread"],
    ["野菜","やさい","vegetable"],["果物","くだもの","fruit"],["部屋","へや","room"],
    ["ドア","ドア","door"],["テーブル","テーブル","table"],["椅子","いす","chair"],
    ["雑誌","ざっし","magazine"],["新聞","しんぶん","newspaper"],["ペン","ペン","pen"],
    ["鉛筆","えんぴつ","pencil"],["かばん","かばん","bag"],["時計","とけい","watch / clock"],
    ["電話","でんわ","phone"],["テレビ","テレビ","television"],["コンピューター","コンピューター","computer"],
    ["カメラ","カメラ","camera"],["お金","おかね","money"],["切符","きっぷ","ticket"],
    ["仕事","しごと","work / job"],["会社","かいしゃ","company"],["電気","でんき","electricity / light"],
    ["病気","びょうき","illness"],["晴れ","はれ","clear weather"],["季節","きせつ","season"],
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
    ["同","おな・どう","same"],["国","くに・こく","country"],["近","ちか・きん","near"],
    ["建","た・けん","build"],["集","あつ・しゅう","gather"],["決","き・けつ","decide"],
    ["開","あ・かい","open"],["閉","し・へい","close"],["始","はじ・し","begin"],
    ["終","お・しゅう","end"],["続","つづ・ぞく","continue"],["使","つか・し","use"],
    ["働","はたら・どう","work"],["作","つく・さく","make"],["住","す・じゅう","live / reside"],
    ["持","も・じ","hold / have"],["乗","の・じょう","ride"],["降","お・こう","get off / fall (rain)"],
    ["歩","ある・ほ","walk"],["走","はし・そう","run"],["着","き・ちゃく","wear / arrive"],
    ["洗","あら・せん","wash"],["待","ま・たい","wait"],["貸","か・たい","lend"],
    ["借","か・しゃく","borrow"],["返","かえ・へん","return (something)"],["送","おく・そう","send"],
    ["受","う・じゅ","receive"],["渡","わた・と","hand over / cross"],["教","おし・きょう","teach"],
    ["習","なら・しゅう","learn"],["覚","おぼ・かく","memorize"],["忘","わす・ぼう","forget"],
    ["知","し・ち","know"],["思","おも・し","think"],["考","かんが・こう","consider"],
    ["神","かみ・しん","god"],["別","わか・べつ","separate / different"],["場","ば・じょう","place"],
    ["売","うる・ばい","sell"],["勉","べん","study hard"],["文","ぶん・もん","sentence / writing"],
    ["地","ち・じ","ground / earth"],["朝","あさ・ちょう","morning"],["町","まち・ちょう","town"],
    ["鳥","とり・ちょう","bird"],["注","そそぐ・ちゅう","pour / pay attention"],["昼","ひる・ちゅう","noon / daytime"],
    ["代","かわる・だい","substitute / generation"],["題","だい","topic / subject"],["台","だい","platform / stand"],
    ["度","たび・ど","degree / times"],["道","みち・どう","road / path"],["堂","どう","hall"],
    ["映","うつる・えい","reflect / be projected"],["英","えい","England / excellent"],["駅","えき","station"],
    ["不","ふ","not / un-"],["服","ふく","clothing"],["風","かぜ・ふう","wind / style"],
    ["元","もと・げん","origin / former"],["銀","ぎん","silver"],["魚","さかな・ぎょ","fish"],
    ["業","ぎょう","business / vocation"],["牛","うし・ぎゅう","cow"],["発","はつ","departure / emit"],
    ["品","しな・ひん","goods / item"],["方","かた・ほう","direction / person"],["意","い","idea / meaning"],
    ["以","い","by means of / than"],["医","い","medicine / doctor"],["字","じ","character / letter"],
    ["重","おもい・じゅう","heavy / important"],["歌","うた・か","song"],["花","はな・か","flower"],
    ["夏","なつ・か","summer"],["界","かい","world / boundary"],["海","うみ・かい","sea"],
    ["画","が・かく","picture / stroke"],["漢","かん","China / Sino-"],["犬","いぬ・けん","dog"],
    ["研","けん","study / polish"],["験","けん","test / effect"],["黒","くろ・こく","black"],
    ["公","こう","public"],["口","くち・こう","mouth"],["広","ひろい・こう","wide"],
    ["工","こう・く","craft / construction"],["空","そら・くう","sky / empty"],["去","さる・きょ","leave / past"],
    ["京","きょう","capital"],["強","つよい・きょう","strong"],["急","いそぐ・きゅう","hurry / sudden"],
    ["究","きゅう","research"],["味","あじ・み","taste"],["目","め・もく","eye"],
    ["問","とう・もん","question / ask"],["無","ない・む","nothing / without"],["肉","にく","meat"],
    ["音","おと・おん","sound"],["理","り","logic / reason"],["旅","たび・りょ","trip"],
    ["料","りょう","fee / materials"],["力","ちから・りょく","power"],["世","よ・せい","world / generation"],
    ["正","ただしい・せい","correct"],["夕","ゆう・せき","evening"],["者","もの・しゃ","person"],
    ["写","うつす・しゃ","copy / photograph"],["紙","かみ・し","paper"],["死","しぬ・し","death"],
    ["止","とまる・し","stop"],["試","こころみる・し","try / test"],["心","こころ・しん","heart / mind"],
    ["真","ま・しん","true / reality"],["親","おや・しん","parent / intimate"],["質","しつ","quality / substance"],
    ["室","しつ","room"],["色","いろ・しょく","color"],["手","て・しゅ","hand"],
    ["主","おも・しゅ","main / master"],["春","はる・しゅん","spring"],["秋","あき・しゅう","autumn"],
    ["足","あし・そく","leg / foot / enough"],["早","はやい・そう","early"],["体","からだ・たい","body"],
    ["店","みせ・てん","shop"],["特","とく","special"],["答","こたえる・とう","answer"],
    ["冬","ふゆ・とう","winter"],["通","とおる・つう","pass through / commute"],["運","はこぶ・うん","carry / luck"],
    ["夜","よる・や","night"],["用","もちいる・よう","use"],["洋","よう","ocean / Western"],
    ["有","ある・ゆう","possess / exist"],["遠","とおい・えん","far / distant"],["便","べん・びん","convenience / mail"],
    ["利","り","advantage / profit"],["危","あぶない・き","dangerous"],["必","かならず・ひつ","certainly / must"],
    ["要","いる・よう","need / essential"],["例","たとえ・れい","example"],["最","もっとも・さい","most"],
    ["初","はじめ・しょ","first / beginning"],["緒","しょ","together / cord"],["供","とも・きょう","companion / offer"],
    ["若","わかい・じゃく","young"],["具","ぐ","tool / condition"],["合","あう・ごう","fit / join"],
    ["怪","あやしい・かい","suspicious / injury"],["我","われ・が","I / self"],["熱","あつい・ねつ","hot / fever"],
    ["局","きょく","bureau / office"],["郵","ゆう","mail / post"],["港","みなと・こう","port / harbour"],
    ["橋","はし・きょう","bridge"],["予","よ","beforehand"],["定","さだめる・てい","fix / decide"],
    ["約","やく","promise / approximately"],["束","たば・そく","bundle / promise"],["準","じゅん","standard / prepare"],
    ["備","そなえる・び","prepare / equip"],["説","とく・せつ","explain / theory"],["練","ねる・れん","practice / knead"],
    ["宿","やど・しゅく","lodging"],["授","さずける・じゅ","grant / teach"],["経","へる・けい","pass through / undergo"],
    ["興","きょう","interest / entertainment"],["趣","おもむき・しゅ","taste / gist"],["招","まねく・しょう","invite"],
    ["都","みやこ・と","capital / metropolis"],["相","あい・そう","mutual / aspect"],["談","だん","discuss / talk"],
    ["慢","まん","pride / idleness"],["配","くばる・はい","distribute"],["残","のこる・ざん","remain"],
    ["念","ねん","thought / wish"],["邪","じゃ","wicked"],["魔","ま","demon / obstacle"],
    ["迷","まよう・めい","be lost / astray"],["惑","まどう・わく","be perplexed"],["失","うしなう・しつ","lose"],
    ["礼","れい","courtesy / thanks"],["丁","ちょう","block / exact"],["寧","ねい","polite / quiet"],
    ["簡","かん","simple / brief"],["単","たん","single / simple"],["複","ふく","double / compound"],
    ["呼","よぶ・こ","call"],["選","えらぶ・せん","choose"],["比","くらべる・ひ","compare"],
    ["育","そだてる・いく","raise / grow"],["違","ちがう・い","differ"],["慣","なれる・かん","get used to"],
    ["信","しんじる・しん","believe / trust"],["喜","よろこぶ・き","rejoice"],["怒","おこる・ど","get angry"],
    ["泣","なく・きゅう","cry"],["笑","わらう・しょう","laugh"],["驚","おどろく・きょう","be surprised"],
    ["困","こまる・こん","be troubled"],["疲","つかれる・ひ","get tired"],["治","なおる・じ","heal / govern"],
    ["壊","こわす・かい","break"],["直","なおす・ちょく","fix / direct"],["包","つつむ・ほう","wrap"],
    ["並","ならぶ・へい","line up"],["落","おちる・らく","fall"],["増","ふえる・ぞう","increase"],
    ["減","へる・げん","decrease"],["変","かわる・へん","change / strange"],["到","とう","arrive"],
    ["席","せき","seat"],["欠","かける・けつ","lack / absent"],["卒","そつ","graduate"],
    ["就","つく・しゅう","take up / assume"],["職","しょく","job / occupation"],["引","ひく・いん","pull"],
    ["越","こす・えつ","cross over / move"],["留","とめる・りゅう","stop / stay"],["参","まいる・さん","go / participate"],
    ["加","くわえる・か","add"],["案","あん","plan / idea"],["連","つれる・れん","take along / connect"],
    ["絡","らく","entwine / contact"],["議","ぎ","deliberation"],["表","あらわす・ひょう","express / surface"],
    ["報","むくいる・ほう","report / reward"],["告","つげる・こく","tell / announce"],["由","ゆう","reason / cause"],
    ["的","まと・てき","target / -ical"],["法","ほう","law / method"],["容","よう","contain / form"],
    ["所","ところ・しょ","place"],["震","ふるえる・しん","tremble / quake"],["故","ゆえ・こ","reason / the late"],
    ["件","けん","matter / case"],["警","けい","warn / guard"],["察","さつ","guess / police"],
    ["救","すくう・きゅう","rescue"],["交","まじる・こう","mix / exchange"],["渋","しぶ・じゅう","astringent / hesitate"],
    ["滞","とどこおる・たい","stagnate"],["号","ごう","number / signal"],["免","まぬかれる・めん","exempt / license"],
    ["許","ゆるす・きょ","permit"]
  ];

  var N4_VOCAB_RAW = [
    ["遠い","とおい","far"],["近く","ちかく","nearby"],["便利","べんり","convenient"],
    ["不便","ふべん","inconvenient"],["危ない","あぶない","dangerous"],["安全","あんぜん","safe"],
    ["大切","たいせつ","important"],["必要","ひつよう","necessary"],["十分","じゅうぶん","enough"],
    ["特に","とくに","especially"],["例えば","たとえば","for example"],["最近","さいきん","recently"],
    ["最初","さいしょ","first / beginning"],["最後","さいご","last / end"],["全部","ぜんぶ","all / everything"],
    ["一緒に","いっしょに","together"],["自分","じぶん","oneself"],["大人","おとな","adult"],
    ["子供","こども","child"],["若い","わかい","young"],["元気","げんき","healthy / energetic"],
    ["具合","ぐあい","condition"],["怪我","けが","injury"],["薬局","やっきょく","pharmacy"],
    ["銀行","ぎんこう","bank"],["郵便局","ゆうびんきょく","post office"],["空港","くうこう","airport"],
    ["地図","ちず","map"],["予定","よてい","plan / schedule"],["約束","やくそく","promise"],
    ["用事","ようじ","errand / business"],["準備","じゅんび","preparation"],["説明","せつめい","explanation"],
    ["質問","しつもん","question"],["答え","こたえ","answer"],["練習","れんしゅう","practice"],
    ["試験","しけん","exam"],["宿題","しゅくだい","homework"],["授業","じゅぎょう","class / lesson"],
    ["経験","けいけん","experience"],["興味","きょうみ","interest"],["趣味","しゅみ","hobby"],
    ["予約","よやく","reservation"],["招待","しょうたい","invitation"],["都合","つごう","circumstances / convenience"],
    ["相談","そうだん","consultation"],["我慢","がまん","patience / endurance"],["心配","しんぱい","worry"],
    ["残念","ざんねん","regrettable"],["邪魔","じゃま","hindrance / nuisance"],["迷惑","めいわく","trouble / annoyance"],
    ["失礼","しつれい","rudeness"],["丁寧","ていねい","polite"],["簡単","かんたん","simple / easy"],
    ["複雑","ふくざつ","complicated"],["続ける","つづける","to continue"],["始める","はじめる","to begin"],
    ["終わる","おわる","to end / finish"],["決める","きめる","to decide"],["呼ぶ","よぶ","to call"],
    ["選ぶ","えらぶ","to choose"],["比べる","くらべる","to compare"],["育てる","そだてる","to raise / grow"],
    ["育つ","そだつ","to grow up"],["間違える","まちがえる","to make a mistake"],["気をつける","きをつける","to be careful"],
    ["慣れる","なれる","to get used to"],["信じる","しんじる","to believe"],["喜ぶ","よろこぶ","to be glad"],
    ["怒る","おこる","to get angry"],["泣く","なく","to cry"],["笑う","わらう","to laugh"],
    ["驚く","おどろく","to be surprised"],["困る","こまる","to be troubled"],["疲れる","つかれる","to get tired"],
    ["治る","なおる","to heal / be cured"],["壊れる","こわれる","to break (itself)"],["壊す","こわす","to break (something)"],
    ["直す","なおす","to fix / repair"],["運ぶ","はこぶ","to carry"],["包む","つつむ","to wrap"],
    ["並べる","ならべる","to line up (things)"],["並ぶ","ならぶ","to line up (people)"],["通う","かよう","to commute"],
    ["集まる","あつまる","to gather (itself)"],["集める","あつめる","to gather (something)"],["見つける","みつける","to find"],
    ["見つかる","みつかる","to be found"],["落ちる","おちる","to fall"],["落とす","おとす","to drop"],
    ["上がる","あがる","to rise / go up"],["上げる","あげる","to raise"],["下がる","さがる","to go down"],
    ["下げる","さげる","to lower"],["増える","ふえる","to increase"],["減る","へる","to decrease"],
    ["変わる","かわる","to change (itself)"],["変える","かえる","to change (something)"],["続く","つづく","to continue (itself)"],
    ["出発","しゅっぱつ","departure"],["到着","とうちゃく","arrival"],["出席","しゅっせき","attendance"],
    ["欠席","けっせき","absence"],["卒業","そつぎょう","graduation"],["入学","にゅうがく","school enrollment"],
    ["就職","しゅうしょく","getting a job"],["引っ越し","ひっこし","moving (house)"],["留学","りゅうがく","study abroad"],
    ["旅行","りょこう","travel"],["出張","しゅっちょう","business trip"],["参加","さんか","participation"],
    ["案内","あんない","guidance / information"],["連絡","れんらく","contact / communication"],["会議","かいぎ","meeting"],
    ["発表","はっぴょう","presentation"],["報告","ほうこく","report"],["意見","いけん","opinion"],
    ["理由","りゆう","reason"],["目的","もくてき","purpose"],["方法","ほうほう","method"],
    ["内容","ないよう","content"],["場合","ばあい","case / situation"],["場所","ばしょ","place"],
    ["天気予報","てんきよほう","weather forecast"],["台風","たいふう","typhoon"],["地震","じしん","earthquake"],
    ["火事","かじ","fire (disaster)"],["事故","じこ","accident"],["事件","じけん","incident"],
    ["警察","けいさつ","police"],["救急車","きゅうきゅうしゃ","ambulance"],["交通","こうつう","traffic"],
    ["渋滞","じゅうたい","traffic jam"],["信号","しんごう","traffic light"],["運転","うんてん","driving"],
    ["免許","めんきょ","license"]
  ];

  // Cards that moved decks / shifted position in v11. Used once by
  // storage to carry existing progress over to the new ids.
  var LEGACY_ID_MAP = {"n4v100": "n4v96","n4v101": "n4v97","n4v102": "n4v98","n4v103": "n4v99","n4v104": "n4v100","n4v105": "n4v101","n4v106": "n4v102","n4v107": "n4v103","n4v108": "n4v104","n4v109": "n4v105","n4v110": "n4v106","n4v111": "n4v107","n4v112": "n4v108","n4v113": "n4v109","n4v114": "n4v110","n4v115": "n4v111","n4v116": "n4v112","n4v117": "n4v113","n4v118": "n4v114","n4v119": "n4v115","n4v120": "n4v116","n4v121": "n4v117","n4v122": "n4v118","n4v123": "n4v119","n4v124": "n4v120","n4v125": "n4v121","n4v126": "n4v122","n4v127": "n4v123","n4v128": "n4v124","n4v129": "n4v125","n4v130": "n4v126","n4v131": "n4v127","n4v132": "n4v128","n4v133": "n4v129","n4v134": "n4v130","n4v135": "n4v131","n4v136": "n4v132","n4v137": "n4v133","n4v138": "n4v134","n4v139": "n4v135","n4v23": "n4k171","n4v24": "n4v23","n4v25": "n4v24","n4v26": "n4v25","n4v27": "n4v26","n4v28": "n4k174","n4v29": "n4k175","n4v30": "n4k56","n4v31": "n4v27","n4v32": "n4v28","n4v33": "n4v29","n4v34": "n4v30","n4v35": "n4v31","n4v36": "n4v32","n4v37": "n4v33","n4v38": "n4v34","n4v39": "n4v35","n4v40": "n4v36","n4v41": "n4v37","n4v42": "n4v38","n4v43": "n4v39","n4v44": "n4v40","n4v45": "n4v41","n4v46": "n4v42","n4v47": "n4v43","n4v48": "n4v44","n4v49": "n4v45","n4v50": "n4v46","n4v51": "n4v47","n4v52": "n4v48","n4v53": "n4v49","n4v54": "n4v50","n4v55": "n4v51","n4v56": "n4v52","n4v57": "n4v53","n4v58": "n4v54","n4v59": "n4v55","n4v60": "n4v56","n4v61": "n4v57","n4v62": "n4v58","n4v63": "n4v59","n4v64": "n4v60","n4v65": "n4v61","n4v66": "n4v62","n4v67": "n4v63","n4v68": "n4v64","n4v69": "n4v65","n4v70": "n4v66","n4v71": "n4v67","n4v72": "n4v68","n4v73": "n4v69","n4v74": "n4v70","n4v75": "n4v71","n4v76": "n4v72","n4v77": "n4v73","n4v78": "n4v74","n4v79": "n4v75","n4v80": "n4v76","n4v81": "n4v77","n4v82": "n4v78","n4v83": "n4v79","n4v84": "n4v80","n4v85": "n4v81","n4v86": "n4v82","n4v87": "n4v83","n4v88": "n4v84","n4v89": "n4v85","n4v90": "n4v86","n4v91": "n4v87","n4v92": "n4v88","n4v93": "n4v89","n4v94": "n4v90","n4v95": "n4v91","n4v96": "n4v92","n4v97": "n4v93","n4v98": "n4v94","n4v99": "n4v95","v10": "v9","v100": "v79","v101": "v80","v102": "v81","v103": "v82","v11": "v10","v12": "v11","v13": "v12","v14": "v13","v15": "v14","v16": "n4k60","v17": "v15","v18": "v16","v19": "v17","v20": "v18","v21": "v19","v22": "v20","v23": "k17","v24": "v21","v25": "v22","v26": "v23","v27": "n4k110","v28": "n4k66","v29": "v24","v30": "v25","v31": "k104","v32": "k67","v33": "v26","v34": "k106","v35": "v27","v36": "v28","v37": "v29","v38": "k108","v39": "v30","v40": "v31","v41": "v32","v42": "v33","v43": "n4k124","v44": "v34","v45": "v35","v46": "v36","v47": "v37","v48": "v38","v49": "v39","v50": "v40","v51": "v41","v52": "v42","v53": "v43","v54": "v44","v55": "v45","v56": "k114","v57": "k46","v58": "k115","v59": "n4k63","v60": "v46","v61": "v47","v62": "n4k137","v63": "n4k84","v64": "n4k138","v65": "n4k146","v66": "n4k47","v67": "n4k51","v68": "n4k150","v69": "v48","v70": "v49","v71": "v50","v72": "v51","v73": "v52","v74": "v53","v75": "v54","v76": "v55","v77": "v56","v78": "v57","v79": "v58","v8": "k69","v80": "v59","v81": "v60","v82": "v61","v83": "v62","v84": "v63","v85": "v64","v86": "v65","v87": "v66","v88": "v67","v89": "v68","v9": "v8","v90": "v69","v91": "v70","v92": "v71","v93": "v72","v94": "v73","v95": "v74","v96": "v75","v97": "v76","v98": "v77","v99": "v78"};

  // v12: kanji used by N5 vocabulary were pulled out of the N4 deck
  // into the N5 deck, which shifted the remaining N4 kanji ids.
  var LEGACY_ID_MAP_V12 = {"n4k10": "n4k9","n4k100": "n4k89","n4k101": "n4k90","n4k102": "n4k91","n4k103": "n4k92","n4k104": "n4k93","n4k105": "n4k94","n4k106": "k148","n4k107": "n4k95","n4k108": "n4k96","n4k109": "n4k97","n4k11": "n4k10","n4k110": "n4k98","n4k111": "k149","n4k112": "n4k99","n4k113": "k150","n4k114": "n4k100","n4k115": "n4k101","n4k116": "n4k102","n4k117": "n4k103","n4k118": "n4k104","n4k119": "n4k105","n4k12": "n4k11","n4k120": "n4k106","n4k121": "k151","n4k122": "n4k107","n4k123": "n4k108","n4k124": "n4k109","n4k125": "n4k110","n4k126": "n4k111","n4k127": "n4k112","n4k128": "k152","n4k129": "n4k113","n4k13": "n4k12","n4k130": "n4k114","n4k131": "n4k115","n4k132": "n4k116","n4k133": "n4k117","n4k134": "n4k118","n4k135": "n4k119","n4k136": "n4k120","n4k137": "n4k121","n4k138": "n4k122","n4k139": "n4k123","n4k14": "n4k13","n4k140": "n4k124","n4k141": "n4k125","n4k142": "k153","n4k143": "n4k126","n4k144": "n4k127","n4k145": "n4k128","n4k146": "n4k129","n4k147": "n4k130","n4k148": "n4k131","n4k149": "k154","n4k15": "n4k14","n4k150": "n4k132","n4k151": "n4k133","n4k152": "n4k134","n4k153": "n4k135","n4k154": "k155","n4k155": "n4k136","n4k156": "n4k137","n4k157": "n4k138","n4k158": "n4k139","n4k159": "n4k140","n4k16": "n4k15","n4k160": "n4k141","n4k161": "n4k142","n4k162": "n4k143","n4k163": "n4k144","n4k164": "n4k145","n4k165": "n4k146","n4k166": "n4k147","n4k167": "n4k148","n4k168": "n4k149","n4k169": "n4k150","n4k17": "n4k16","n4k170": "n4k151","n4k171": "n4k152","n4k172": "n4k153","n4k173": "n4k154","n4k174": "n4k155","n4k175": "n4k156","n4k176": "n4k157","n4k177": "n4k158","n4k178": "n4k159","n4k179": "n4k160","n4k18": "n4k17","n4k180": "n4k161","n4k181": "n4k162","n4k182": "n4k163","n4k183": "n4k164","n4k184": "n4k165","n4k185": "n4k166","n4k186": "n4k167","n4k187": "n4k168","n4k188": "n4k169","n4k189": "n4k170","n4k19": "n4k18","n4k190": "n4k171","n4k191": "n4k172","n4k192": "n4k173","n4k193": "n4k174","n4k194": "n4k175","n4k195": "n4k176","n4k196": "n4k177","n4k197": "n4k178","n4k198": "n4k179","n4k199": "n4k180","n4k20": "n4k19","n4k200": "n4k181","n4k201": "n4k182","n4k202": "n4k183","n4k203": "n4k184","n4k204": "n4k185","n4k205": "n4k186","n4k206": "n4k187","n4k207": "n4k188","n4k208": "n4k189","n4k209": "n4k190","n4k21": "n4k20","n4k210": "n4k191","n4k211": "n4k192","n4k212": "n4k193","n4k213": "n4k194","n4k214": "n4k195","n4k215": "n4k196","n4k216": "n4k197","n4k217": "n4k198","n4k218": "n4k199","n4k219": "n4k200","n4k22": "n4k21","n4k220": "n4k201","n4k221": "n4k202","n4k222": "n4k203","n4k223": "n4k204","n4k224": "n4k205","n4k225": "n4k206","n4k226": "n4k207","n4k227": "n4k208","n4k228": "n4k209","n4k229": "n4k210","n4k23": "n4k22","n4k230": "n4k211","n4k231": "n4k212","n4k232": "n4k213","n4k233": "n4k214","n4k234": "n4k215","n4k235": "n4k216","n4k236": "n4k217","n4k237": "n4k218","n4k238": "n4k219","n4k239": "n4k220","n4k24": "n4k23","n4k240": "n4k221","n4k241": "n4k222","n4k242": "n4k223","n4k243": "n4k224","n4k244": "n4k225","n4k245": "n4k226","n4k246": "n4k227","n4k247": "n4k228","n4k248": "n4k229","n4k249": "n4k230","n4k25": "n4k24","n4k250": "n4k231","n4k251": "n4k232","n4k252": "n4k233","n4k253": "n4k234","n4k254": "n4k235","n4k255": "n4k236","n4k256": "n4k237","n4k257": "n4k238","n4k258": "n4k239","n4k259": "n4k240","n4k26": "n4k25","n4k260": "n4k241","n4k261": "n4k242","n4k262": "n4k243","n4k263": "n4k244","n4k264": "n4k245","n4k265": "n4k246","n4k27": "n4k26","n4k28": "n4k27","n4k29": "n4k28","n4k30": "n4k29","n4k31": "n4k30","n4k32": "n4k31","n4k33": "n4k32","n4k34": "n4k33","n4k35": "n4k34","n4k36": "n4k35","n4k37": "n4k36","n4k38": "n4k37","n4k39": "n4k38","n4k4": "k137","n4k40": "n4k39","n4k41": "n4k40","n4k42": "n4k41","n4k43": "k138","n4k44": "k139","n4k45": "k140","n4k46": "n4k42","n4k47": "n4k43","n4k48": "n4k44","n4k49": "n4k45","n4k5": "n4k4","n4k50": "n4k46","n4k51": "n4k47","n4k52": "n4k48","n4k53": "n4k49","n4k54": "n4k50","n4k55": "n4k51","n4k56": "n4k52","n4k57": "n4k53","n4k58": "n4k54","n4k59": "n4k55","n4k6": "n4k5","n4k60": "n4k56","n4k61": "n4k57","n4k62": "n4k58","n4k63": "n4k59","n4k64": "n4k60","n4k65": "n4k61","n4k66": "n4k62","n4k67": "n4k63","n4k68": "n4k64","n4k69": "k141","n4k7": "n4k6","n4k70": "n4k65","n4k71": "n4k66","n4k72": "n4k67","n4k73": "n4k68","n4k74": "n4k69","n4k75": "n4k70","n4k76": "k142","n4k77": "k143","n4k78": "k144","n4k79": "k145","n4k8": "n4k7","n4k80": "n4k71","n4k81": "n4k72","n4k82": "n4k73","n4k83": "n4k74","n4k84": "n4k75","n4k85": "n4k76","n4k86": "n4k77","n4k87": "n4k78","n4k88": "k146","n4k89": "n4k79","n4k9": "n4k8","n4k90": "k147","n4k91": "n4k80","n4k92": "n4k81","n4k93": "n4k82","n4k94": "n4k83","n4k95": "n4k84","n4k96": "n4k85","n4k97": "n4k86","n4k98": "n4k87","n4k99": "n4k88"};

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
    BY_ID: BY_ID,
    LEGACY_ID_MAP: LEGACY_ID_MAP,
    LEGACY_ID_MAP_V12: LEGACY_ID_MAP_V12
  };
})();