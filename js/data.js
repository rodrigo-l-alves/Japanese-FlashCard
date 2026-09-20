// ---------- DECK DATA ----------
// Two levels (n5, n4), each with a kanji deck, a vocab deck, and a grammar
// deck. Ids are content-based ("k_一", "v_ありがとう", "n4k_忙", "g_Nです",
// ...), so they stay stable no matter where a word sits in its list --
// adding, removing or reordering entries never reassigns another card's id
// or its saved progress. (Prior to v13 kanji/vocab ids were positional,
// e.g. "k0"; see LEGACY_ID_MAP_V13 further down for the one-time migration
// off that. Grammar cards are new since then and never had positional ids.)

(function () {
  // Ids used to be idPrefix + array-index ("k0", "n4v62", ...), which meant
  // inserting or reordering a word anywhere but the very end of a raw list
  // silently reassigned every id after it -- and with it, everyone's saved
  // progress for those cards. Ids are now derived from the card's own text
  // instead, so they stay put no matter how the lists are edited later.
  // POSITIONAL_IDS records the old i-based id for each card *as the lists
  // happen to be ordered right now*, purely so migrateIds (app.js) can carry
  // existing progress over one last time -- see LEGACY_ID_MAP_V13 below.
  var POSITIONAL_IDS = [];

  function withIds(rawList, idPrefix, deck, level) {
    return rawList.map(function (r, i) {
      var id = idPrefix + "_" + r[0];
      POSITIONAL_IDS.push([idPrefix + i, id]);
      return {
        id: id,
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
    ["転","ころがる・てん","roll / turn"],["野","の・や","field / plain"],["図","はかる・ず","diagram / plan"],
    ["財","ざい","wealth / property"],["布","ぬの・ふ","cloth"],["眼","がん","eye"],
    ["鏡","かがみ・きょう","mirror"],["傘","かさ・さん","umbrella"],["靴","くつ","shoes"],
    ["帽","ぼう","hat / cap"],["荷","に・か","load / cargo"],["球","たま・きゅう","ball / sphere"],
    ["園","えん","garden / park"],["猫","ねこ","cat"],["冷","つめたい・れい","cold / to cool"],
    ["蔵","くら・ぞう","storehouse"],["庫","こ","storehouse / warehouse"],["座","すわる・ざ","sit / seat"]
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
    ["食べる","たべる","to eat"],["飲む","のむ","to drink"],
    ["財布","さいふ","wallet"],["眼鏡","めがね","glasses"],["傘","かさ","umbrella"],
    ["靴","くつ","shoes"],["帽子","ぼうし","hat"],["荷物","にもつ","luggage / baggage"],
    ["音楽","おんがく","music"],["映画","えいが","movie"],["写真","しゃしん","photograph"],
    ["スポーツ","スポーツ","sport"],["野球","やきゅう","baseball"],["サッカー","サッカー","soccer"],
    ["公園","こうえん","park"],["動物","どうぶつ","animal"],["犬","いぬ","dog"],
    ["猫","ねこ","cat"],["天気","てんき","weather"],["冷蔵庫","れいぞうこ","refrigerator"],
    ["買う","かう","to buy"],["見る","みる","to see / watch"],["聞く","きく","to hear / listen / ask"],
    ["話す","はなす","to speak"],["書く","かく","to write"],["読む","よむ","to read"],
    ["分かる","わかる","to understand"],["寝る","ねる","to sleep"],["起きる","おきる","to get up"],
    ["座る","すわる","to sit"],["立つ","たつ","to stand"],["入る","はいる","to enter"],
    ["出る","でる","to exit / leave"],
    ["でも","でも","but / however","疲れました。でも、頑張ります。(I'm tired. But I'll do my best.)"],
    ["けど","けど","but (casual)","高いけど、買いました。(It was expensive, but I bought it.)"],
    ["けれど","けれど","but (a bit more formal than けど)","寒いけれど、散歩に行きます。(It's cold, but I'm going for a walk.)"],
    ["けれども","けれども","but / although (more formal still)","日本語は難しいけれども、面白いです。(Japanese is difficult, but it's interesting.)"],
    ["しかし","しかし","however (written / formal)","この店は安いです。しかし、おいしくないです。(This shop is cheap. However, it isn't tasty.)"],
    ["だから","だから","so / therefore","雨です。だから、家にいます。(It's raining. So I'm staying home.)"],
    ["それから","それから","and then / after that","朝ご飯を食べます。それから、学校へ行きます。(I eat breakfast. After that, I go to school.)"],
    ["そして","そして","and / and then","彼は優しいです。そして、頭がいいです。(He's kind. And he's smart.)"],
    ["どんな","どんな","what kind of","どんな音楽が好きですか。(What kind of music do you like?)"],
    ["どうして","どうして","why","どうして日本語を勉強しますか。(Why do you study Japanese?)"],
    ["どうやって","どうやって","how / by what means","駅までどうやって行きますか。(How do you get to the station?)"],
    ["できるだけ","できるだけ","as much as possible","できるだけ早く来てください。(Please come as early as possible.)"],
    ["一つ","ひとつ","one (thing)","りんごを一つください。(One apple, please.)"],
    ["二つ","ふたつ","two (things)","りんごを二つください。(Two apples, please.)"],
    ["三つ","みっつ","three (things)","りんごを三つください。(Three apples, please.)"],
    ["四つ","よっつ","four (things)","りんごを四つ買いました。(I bought four apples.)"],
    ["五つ","いつつ","five (things)","みかんを五つ食べました。(I ate five mandarin oranges.)"],
    ["六つ","むっつ","six (things)","卵が六つあります。(There are six eggs.)"],
    ["七つ","ななつ","seven (things)","椅子が七つあります。(There are seven chairs.)"],
    ["八つ","やっつ","eight (things)","ケーキを八つ作りました。(I made eight cakes.)"],
    ["九つ","ここのつ","nine (things)","かばんの中にりんごが九つあります。(There are nine apples in the bag.)"],
    ["とお","とお","ten (things)","クッキーが全部でとおあります。(There are ten cookies in total.)"],
    ["一日","いちにち・ついたち","one day / the 1st of the month","今日は一日中、雨でした。(It rained all day today.)"],
    ["二日","ふつか","two days / the 2nd","二日間、休みます。(I'll take two days off.)"],
    ["三日","みっか","three days / the 3rd","三日前に日本へ来ました。(I came to Japan three days ago.)"],
    ["四日","よっか","four days / the 4th","四日に会いましょう。(Let's meet on the 4th.)"],
    ["五日","いつか","five days / the 5th","五日は友達の誕生日です。(The 5th is my friend's birthday.)"],
    ["六日","むいか","six days / the 6th","六日までに返してください。(Please return it by the 6th.)"],
    ["七日","なのか","seven days / the 7th","七日は日曜日です。(The 7th is a Sunday.)"],
    ["八日","ようか","eight days / the 8th","八日に映画を見ます。(I'll watch a movie on the 8th.)"],
    ["九日","ここのか","nine days / the 9th","九日に試験があります。(There's an exam on the 9th.)"],
    ["十日","とおか","ten days / the 10th","十日、旅行します。(I'll travel for ten days.)"],
    ["何日","なんにち","what day of the month / how many days","今日は何日ですか。(What's the date today?)"],
    ["何","なに・なん","what","これは何ですか。(What is this?)"],
    ["いつ","いつ","when","いつ日本へ行きますか。(When are you going to Japan?)"],
    ["誰","だれ","who","誰が来ましたか。(Who came?)"],
    ["いくら","いくら","how much (price)","これはいくらですか。(How much is this?)"],
    ["どのくらい","どのくらい","how long / how much / how far","駅までどのくらいかかりますか。(How long does it take to get to the station?)"],
    ["ね","ね","right? / isn't it? (seeking agreement)","今日は暑いですね。(It's hot today, isn't it?)"],
    ["よ","よ","you know / I tell you (asserting new info)","この店はおいしいですよ。(This shop is good, I tell you.)"],
    ["〜人（にん）","にん","counter for people (1 = ひとり, 2 = ふたり)","学生が三人います。(There are three students.)"],
    ["〜枚（まい）","まい","counter for flat things (paper, tickets, plates)","切符を二枚買いました。(I bought two tickets.)"],
    ["〜本（ほん）","ほん・ぼん・ぽん","counter for long thin things (pens, bottles, trains)","ペンを三本ください。(Three pens, please.)"],
    ["〜個（こ）","こ","counter for small round things / general items","りんごを四個食べました。(I ate four apples.)"],
    ["〜回（かい）","かい","counter for times / occurrences","週に二回、運動します。(I exercise twice a week.)"],
    ["〜歳（さい）","さい","counter for age (20 years old = はたち)","私は十九歳です。(I am nineteen years old.)"],
    ["〜冊（さつ）","さつ","counter for bound things (books, notebooks, magazines)","本を三冊借りました。(I borrowed three books.)"],
    ["〜羽（わ）","わ・ば・ぱ","counter for birds and rabbits (三羽 さんば, 六羽 ろっぱ)","庭に鳥が二羽います。(There are two birds in the garden.)"],
    ["〜匹（ひき）","ひき・びき・ぴき","counter for small animals and fish (三匹 さんびき, 一匹 いっぴき)","猫を一匹飼っています。(I have one cat.)"],
    ["〜頭（とう）","とう","counter for large animals (cows, horses, elephants)","牧場に牛が五頭います。(There are five cows on the ranch.)"],
    ["〜足（そく）","そく","counter for pairs of footwear / socks (三足 さんぞく)","靴を二足買いました。(I bought two pairs of shoes.)"],
    ["〜台（だい）","だい","counter for machines and vehicles (cars, computers, TVs)","駐車場に車が三台あります。(There are three cars in the parking lot.)"],
    ["〜杯（はい）","はい・ばい・ぱい","counter for cups / glassfuls of drink (三杯 さんばい, 一杯 いっぱい)","コーヒーを二杯飲みました。(I drank two cups of coffee.)"]
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
    ["許","ゆるす・きょ","permit"],
    ["性","せい","nature / gender"],["格","かく","status / standard"],["態","たい","state / condition"],
    ["印","しるし・いん","seal / mark"],["象","しょう・ぞう","elephant / image"],["儀","ぎ","ceremony / rule"],
    ["努","つとめる・ど","endeavor / strive"],["成","なる・せい","become / accomplish"],["功","こう","achievement / merit"],
    ["敗","やぶれる・はい","defeat / failure"],["結","むすぶ・けつ","tie / conclude"],["婚","こん","marriage"],
    ["恋","こい・れん","romantic love"],["夫","おっと・ふ","husband / man"],["婦","ふ","married woman / wife"],
    ["値","ね・ち","price / value"],["段","だん","step / grade"],["給","きゅう","supply / wage"],
    ["税","ぜい","tax"],["貯","ちょ","savings / store"],["契","ちぎる・けい","pledge / contract"],
    ["保","たもつ・ほ","protect / guarantee"],["険","けわしい・けん","steep / risky"],["政","せい","government / politics"],
    ["済","すむ・さい","settle / finish"],["化","ばける・か","change / -ization"],["伝","つたえる・でん","transmit / legend"],
    ["統","とう","unite / govern"]
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
    ["免許","めんきょ","license"],
    ["性格","せいかく","personality"],["態度","たいど","attitude"],["印象","いんしょう","impression"],
    ["習慣","しゅうかん","habit / custom"],["礼儀","れいぎ","manners / etiquette"],["努力","どりょく","effort"],
    ["成功","せいこう","success"],["失敗","しっぱい","failure"],["大変","たいへん","tough / awful"],
    ["相手","あいて","partner / opponent"],["結婚","けっこん","marriage"],["恋人","こいびと","boyfriend / girlfriend"],
    ["夫婦","ふうふ","married couple"],["値段","ねだん","price"],["給料","きゅうりょう","salary"],
    ["税金","ぜいきん","tax"],["貯金","ちょきん","savings"],["借金","しゃっきん","debt"],
    ["契約","けいやく","contract"],["保険","ほけん","insurance"],["政治","せいじ","politics"],
    ["経済","けいざい","economy"],["社会","しゃかい","society"],["文化","ぶんか","culture"],
    ["伝統","でんとう","tradition"]
  ];

  // ---------- N5 grammar ----------
  // Each entry: [pattern, formation note, meaning, example sentence].
  // "formation" replaces the kana `reading` field for this deck -- see
  // withIds; it's shown in the same spot on the card.
  var N5_GRAMMAR_RAW = [
    ["Nです","N + です","N is ~ (polite copula)","これは本です。(This is a book.)"],
    ["Nじゃないです","N + じゃないです／ではありません","N is not ~ (polite negative copula)","これは私の傘じゃないです。(This isn't my umbrella.)"],
    ["Nでした","N + でした","N was ~ (polite past copula)","昨日は休みでした。(Yesterday was a day off.)"],
    ["Nじゃなかったです","N + じゃなかったです／ではありませんでした","N was not ~ (polite past negative copula)","テストは簡単じゃなかったです。(The test wasn't easy.)"],
    ["Nは","N + は","marks the sentence topic","私は学生です。(As for me, I'm a student.)"],
    ["Nが","N + が","marks the grammatical subject","雨が降っています。(Rain is falling.)"],
    ["Nも","N + も","also / too","私も行きます。(I'll go too.)"],
    ["Nの","N + の + N","possessive, and links two nouns","これは友達の本です。(This is my friend's book.)"],
    ["Nを","N + を","marks the direct object","パンを食べます。(I eat bread.)"],
    ["Nに (時間)","time N + に","at/on (a specific point in time)","七時に起きます。(I get up at seven.)"],
    ["Nに (行き先)","place N + に","to (a destination)","学校に行きます。(I go to school.)"],
    ["Nで (場所)","place N + で","at/in (where an action happens)","図書館で勉強します。(I study at the library.)"],
    ["Nで (手段)","means N + で","by/with (a tool or method)","バスで来ました。(I came by bus.)"],
    ["Nへ","place N + へ","toward (a direction)","駅へ行きます。(I'm heading toward the station.)"],
    ["NとN","N + と + N","and, with (people/things, exhaustive)","友達と映画を見ました。(I watched a movie with a friend.)"],
    ["NやN","N + や + N","and, among other things (partial list)","机の上にペンや本があります。(There's a pen, a book, and other things on the desk.)"],
    ["文＋か","sentence + か","turns a statement into a question","これは何ですか。(What is this?)"],
    ["Nから～Nまで","N + から～N + まで","from ~ to ~","九時から五時まで働きます。(I work from 9 to 5.)"],
    ["これ・それ・あれ・どれ","(pronoun, no noun follows)","this/that/that-over-there/which one","それは私のかばんです。(That is my bag.)"],
    ["この・その・あの・どの＋N","この/その/あの/どの + N","this/that/that/which + noun","この本は面白いです。(This book is interesting.)"],
    ["ここ・そこ・あそこ・どこ","(place pronoun)","here/there/over there/where","トイレはあそこです。(The toilet is over there.)"],
    ["Vます","verb stem + ます","polite non-past / future verb","毎日日本語を勉強します。(I study Japanese every day.)"],
    ["Vません","verb stem + ません","polite non-past negative verb","肉を食べません。(I don't eat meat.)"],
    ["Vました","verb stem + ました","polite past verb","昨日映画を見ました。(I watched a movie yesterday.)"],
    ["Vませんでした","verb stem + ませんでした","polite past negative verb","今朝、朝ご飯を食べませんでした。(I didn't eat breakfast this morning.)"],
    ["Vませんか","verb stem + ませんか","won't you...? (invitation)","一緒に行きませんか。(Won't you come with me?)"],
    ["Vましょう","verb stem + ましょう","let's ~","少し休みましょう。(Let's rest a little.)"],
    ["Vたいです","verb stem + たいです","want to do ~","日本へ行きたいです。(I want to go to Japan.)"],
    ["Vながら","verb stem + ながら","while doing ~ (two actions at once)","音楽を聞きながら勉強します。(I study while listening to music.)"],
    ["Vてください","verb て-form + ください","please do ~","ここに名前を書いてください。(Please write your name here.)"],
    ["Vています","verb て-form + います","doing ~ (in progress), or a resulting state","今、雨が降っています。(It's raining right now.)"],
    ["Vてもいいです","verb て-form + もいいです","it's okay to do ~ / may I ~?","ここに座ってもいいですか。(Is it okay if I sit here?)"],
    ["Vてはいけません","verb て-form + はいけません","must not do ~","ここでたばこを吸ってはいけません。(You mustn't smoke here.)"],
    ["Adj(い)＋です","い-adjective + です","is ~ (i-adjective, plain register kept polite by です)","この店は安いです。(This shop is cheap.)"],
    ["Adj(な)＋です","な-adjective + です","is ~ (na-adjective + です)","この町は静かです。(This town is quiet.)"],
    ["Adj(い)＋くないです","い-adjective, drop い + くないです","is not ~ (i-adjective negative)","今日は暑くないです。(It's not hot today.)"],
    ["Adj(な)＋じゃないです","な-adjective + じゃないです","is not ~ (na-adjective negative)","この問題は簡単じゃないです。(This problem isn't easy.)"],
    ["Adj(い)＋かったです","い-adjective, drop い + かったです","was ~ (i-adjective past)","映画は楽しかったです。(The movie was fun.)"],
    ["Adj(な)＋でした","な-adjective + でした","was ~ (na-adjective past)","子供のころ、元気でした。(I was energetic as a kid.)"],
    ["AのほうがBより","A + のほうが + B + より","A is more ~ than B","電車のほうがバスより速いです。(The train is faster than the bus.)"],
    ["AとBとどちらが","A + と + B + と、どちらが～","which is more, A or B?","犬と猫と、どちらが好きですか。(Which do you like more, dogs or cats?)"],
    ["Nが一番～","N + が一番 + adjective","N is the most ~ (superlative)","日本語の中で漢字が一番難しいです。(Among Japanese, kanji is the hardest.)"],
    ["Vことができます","dictionary form + ことができます","can do ~ (ability)","漢字を読むことができます。(I can read kanji.)"],
    ["Vまえに","dictionary form + まえに","before doing ~","寝るまえに歯を磨きます。(I brush my teeth before sleeping.)"],
    ["Vたあとで","た-form + あとで","after doing ~","宿題をしたあとでテレビを見ます。(I watch TV after doing homework.)"],
    ["Vとき／Adjとき／Nのとき","plain form + とき","when ~ / at the time of ~","日本へ行くとき、パスポートが要ります。(When I go to Japan, I need a passport.)"],
    ["～から (理由)","reason + から","because ~ (plain, everyday reason)","寒いから、コートを着ます。(Because it's cold, I'll wear a coat.)"],
    ["～でしょう","plain form + でしょう","probably ~ / I think ~","明日は晴れでしょう。(It will probably be sunny tomorrow.)"],
    ["Vたり Vたりします","た-form + り、た-form + り + します","do things like ~ and ~ (partial list of actions)","休みの日は本を読んだり、音楽を聞いたりします。(On days off, I do things like read and listen to music.)"],
    ["Nがあります／います","inanimate N + があります、animate N + がいます","there is/are ~ (existence)","机の上に本があります。庭に猫がいます。(There's a book on the desk. There's a cat in the garden.)"],
    ["Nをください","N + をください","please give me ~","水をください。(Please give me some water.)"],
    ["～ので","plain form + ので","because ~ (softer, more objective than から)","雨が降っているので、傘を持って行きます。(Since it's raining, I'll take an umbrella.)"],
    ["Vすぎます","verb stem／い・な-adjective stem + すぎます","do ~ too much / too ~","昨日、食べすぎました。(I ate too much yesterday.)"],
    ["Vつもりです","dictionary form + つもりです","intend to do ~ / plan to ~","来年、留学するつもりです。(I intend to study abroad next year.)"],
    ["～がります","adjective stem + がります","shows signs of feeling ~ (used for a third person)","妹は新しいゲームを欲しがっています。(My little sister seems to want the new game.)"],
    ["Nがある","inanimate N + がある","there is ~ (plain / casual form)","あそこに郵便局がある。(There's a post office over there.)"],
    ["Nがいる","animate N + がいる","there is ~ (people/animals; plain / casual form)","公園に子供がいる。(There are children in the park.)"],
    ["Nがほしいです","N + がほしいです","I want ~ (a thing)","新しいかばんがほしいです。(I want a new bag.)"],
    ["Nはどうですか","N + はどうですか","how about ~? / how is ~?","コーヒーはどうですか。(How about some coffee?)"],
    ["Nだけ","N + だけ","only ~ / just ~","水だけ飲みます。(I drink only water.)"],
    ["一人だけ","一人 + だけ","only one person / just by oneself","パーティーには一人だけ来ました。(Only one person came to the party.)"],
    ["Nまで (until)","time N / verb dictionary form + まで","until ~ / up to ~","五時まで待ちます。(I'll wait until five.)"],
    ["Nのまえに","N + のまえに","before ~ (a noun)","食事のまえに手を洗います。(I wash my hands before the meal.)"],
    ["Vましょうか","verb stem + ましょうか","shall I ~? / shall we ~?","窓を開けましょうか。(Shall I open the window?)"],
    ["Vたことがある","た-form + ことがある","have done ~ before (experience)","富士山に登ったことがあります。(I have climbed Mt. Fuji.)"],
    ["～だろう","plain form + だろう","probably ~ (plain / casual version of でしょう)","明日は雨が降るだろう。(It will probably rain tomorrow.)"],
    ["～でしょう？(確認)","plain form + でしょう (rising tone)","right? / isn't it? (seeking agreement)","明日は休みでしょう？(Tomorrow's a day off, right?)"],
    ["いいでしょう／いいでしょうか","いいでしょう(か)","that's fine / would that be all right?","この本を借りてもいいでしょうか。(Would it be all right if I borrowed this book?)"],
    ["～のです／んです","plain form + のです (な-adj/N + なのです)","it's that ~ (explaining, or asking for an explanation)","どうしたんですか。頭が痛いんです。(What's wrong? My head hurts, you see.)"],
    ["～すぎ (時間・年齢)","time / age + すぎ","past ~ (o'clock) / over ~ (years old)","今、三時すぎです。(It's just past three.)"],
    ["Vてから","て-form + から","after doing ~, and then","手を洗ってから、ご飯を食べます。(I eat after washing my hands.)"],
    ["Vないでください","ない-form + でください","please don't do ~","ここで写真を撮らないでください。(Please don't take photos here.)"],
    ["Vたほうがいい","た-form + ほうがいい","you should do ~ (advice)","早く寝たほうがいいです。(You should go to bed early.)"],
    ["Vないほうがいい","ない-form + ほうがいい","you shouldn't do ~ (advice)","夜遅く食べないほうがいいです。(You shouldn't eat late at night.)"],
    ["Adj(い)＋くなります","い-adjective, drop い + くなります","become ~ (i-adjective)","だんだん寒くなります。(It's gradually getting cold.)"],
    ["N／Adj(な)＋になります","N or な-adjective + になります","become ~ (noun / na-adjective)","来年、二十歳になります。(I'll turn twenty next year.)"],
    ["Adj(い)＋くて","い-adjective, drop い + くて","and ~ / ~ and so (links adjectives)","この部屋は広くて明るいです。(This room is spacious and bright.)"],
    ["Adj(な)＋で","な-adjective + で","and ~ (links adjectives / nouns)","この町は静かできれいです。(This town is quiet and pretty.)"],
    ["～と思います","plain form + と思います","I think that ~","明日は雨が降ると思います。(I think it will rain tomorrow.)"],
    ["～と言いました","plain form + と言いました","said that ~ (indirect quote)","先生は明日テストがあると言いました。(The teacher said there will be a test tomorrow.)"],
    ["Nが好き／上手です","N + が + 好き／きらい／上手／下手","like / dislike / good at / bad at ~ (these take が)","弟は料理が上手です。(My little brother is good at cooking.)"],
    ["Vたことがない","た-form + ことがない","have never done ~","刺身を食べたことがありません。(I've never eaten sashimi.)"],
    ["Vるな","dictionary form + な","don't ~! (blunt negative command)","動くな！(Don't move!)"],
    ["～なあ","plain form / adjective / ～たい + なあ","expresses a feeling, wish or musing (casual, often to oneself)","早く日本へ行きたいなあ。(I really want to go to Japan soon...)"],
    ["Vないで","ない-form + で (う-verbs: う→わ, e.g. 笑う→笑わないで)","please don't ~ (casual) / without doing ~","笑わないで。朝ご飯を食べないで来ました。(Don't laugh. I came without eating breakfast.)"],
    ["Vないといけない","ない-form + といけない","must do ~ / have to do ~ (casual)","もう帰らないといけない。(I have to go home now.)"],
    ["Vなくてはいけない","ない-form, drop い + くてはいけない","must do ~ (a bit more formal)","毎日、薬を飲まなくてはいけません。(I must take medicine every day.)"],
    ["Vなくちゃいけない","ない-form, drop い + くちゃいけない","must do ~ (casual contraction of なくてはいけない)","早く起きなくちゃいけない。(I have to get up early.)"],
    ["Vなくてはならない","ない-form, drop い + くてはならない","must do ~ (stronger, duty / rule)","税金を払わなくてはなりません。(You must pay taxes.)"],
    ["Vなくちゃ","ない-form, drop い + くちゃ","gotta ~ / have to ~ (casual, ending left off)","もう行かなくちゃ。(I've gotta go now.)"],
    ["Vなくてもいいです","ない-form, drop い + なくてもいいです","don't have to do ~","今日は残業しなくてもいいです。(I don't have to work overtime today.)"],
    ["Vなくてもいい","ない-form, drop い + くてもいい","don't have to do ~ (plain form)","今日は来なくてもいい。(You don't have to come today.)"],
    ["N／Adj(な)＋になる","N or な-adjective + になる","become ~ (plain form)","彼は医者になる。(He will become a doctor.)"],
    ["Vてある","transitive verb て-form + ある","has been done ~ (state left by someone's deliberate action)","窓が開けてあります。(The window has been opened [and left that way].)"],
    ["Vている／Vてる","て-form + いる (casual: てる)","doing ~ / in a state of ~ (plain form)","彼は今、本を読んでいる。(He is reading a book right now.)"],
    ["Vてはいけない","て-form + はいけない","must not do ~ (plain form)","ここで走ってはいけない。(You must not run here.)"],
    ["Vてもいい","て-form + もいい","it's okay to do ~ (plain form)","この席に座ってもいい。(You may sit in this seat.)"],
    ["Vていい","て-form + いい (も dropped)","it's okay to do ~ (casual)","先に帰っていいよ。(You can go home first.)"]
  ];

  // ---------- N4 grammar ----------
  var N4_GRAMMAR_RAW = [
    ["～のに","plain form + のに","even though ~ / despite ~","一生懸命勉強したのに、試験に落ちました。(Even though I studied hard, I failed the exam.)"],
    ["Vたら","た-form + ら","if/when ~ (conditional)","雨が降ったら、行きません。(If it rains, I won't go.)"],
    ["Vば","conditional (え-stem) + ば","if ~ (conditional, focuses on the condition itself)","安ければ、買います。(If it's cheap, I'll buy it.)"],
    ["Vと","dictionary form + と","if/when ~ (leads naturally/always to the result)","春になると、桜が咲きます。(When spring comes, the cherry blossoms bloom.)"],
    ["～なら","plain form + なら","if it's the case that ~ / if you mean ~","日本へ行くなら、パスポートが要ります。(If you're going to Japan, you'll need a passport.)"],
    ["Vなければなりません","ない-form, drop い + なければなりません","must do ~ / have to do ~","明日までにレポートを出さなければなりません。(I have to submit the report by tomorrow.)"],
    ["Vやすいです","verb stem + やすいです","easy to do ~","この本は読みやすいです。(This book is easy to read.)"],
    ["Vにくいです","verb stem + にくいです","hard to do ~","この漢字は書きにくいです。(This kanji is hard to write.)"],
    ["～そうです (様態)","verb stem／adjective stem + そうです","looks like ~ / seems ~ (based on appearance)","このケーキはおいしそうです。(This cake looks delicious.)"],
    ["～そうです (伝聞)","plain form + そうです","I heard that ~ (hearsay)","天気予報によると、明日は雨だそうです。(According to the forecast, I heard it'll rain tomorrow.)"],
    ["～ようです","plain form + ようです","it seems that ~ / looks like ~ (inference from evidence)","誰もいないようです。(It seems no one is here.)"],
    ["～みたいです","plain form + みたいです","seems like ~ (casual version of ようです)","彼は忙しいみたいです。(He seems busy.)"],
    ["～らしいです","plain form + らしいです","apparently ~ / I heard ~ (based on outside information)","田中さんは来月結婚するらしいです。(Apparently Tanaka is getting married next month.)"],
    ["受身形 (れる／られる)","verb + れる／られる","passive voice: to be done to","財布を盗まれました。(My wallet was stolen.)"],
    ["使役形 (せる／させる)","verb + せる／させる","causative: to make/let someone do","先生は学生に本を読ませました。(The teacher made the students read the book.)"],
    ["使役受身形 (させられる)","verb + させられる","causative-passive: to be made to do (against one's will)","子供のころ、野菜を食べさせられました。(As a kid, I was made to eat vegetables.)"],
    ["可能形","verb + potential form (e.g. 話す→話せる)","can do ~ (built into the verb itself)","彼は英語が話せます。(He can speak English.)"],
    ["Vてあげます","て-form + あげます","do ~ for someone (you → others)","友達に本を貸してあげました。(I lent my friend a book.)"],
    ["Vてもらいます","て-form + もらいます","have/receive someone doing ~ for you","友達に手伝ってもらいました。(I had my friend help me.)"],
    ["Vてくれます","て-form + くれます","someone does ~ for you","友達が手伝ってくれました。(My friend helped me [for my benefit].)"],
    ["Vておきます","て-form + おきます","do ~ in advance / leave it as is","会議の前に資料を準備しておきます。(I'll prepare the materials before the meeting.)"],
    ["Vてしまいます","て-form + しまいます","finish doing ~ completely / end up doing ~ (often regrettable)","宿題を全部忘れてしまいました。(I completely forgot all my homework.)"],
    ["Vてみます","て-form + みます","try doing ~","この料理を作ってみます。(I'll try making this dish.)"],
    ["Vていきます","て-form + いきます","go on doing ~ / change, moving away/forward in time","これからも日本語を勉強していきます。(I'll keep studying Japanese from now on.)"],
    ["Vてきます","て-form + きます","come to do ~ / change, moving toward now","日本語が少しずつ上手になってきました。(My Japanese has gradually gotten better.)"],
    ["Vようと思います","volitional form + と思います","I think I'll do ~ / I've decided to ~","今度、ダイエットしようと思います。(I think I'll go on a diet.)"],
    ["Vる予定です","dictionary form + 予定です","scheduled to / planning to do ~","来月、引っ越しする予定です。(I'm scheduled to move next month.)"],
    ["～まま","past-tense modifier + まま","leaving something as it is, without change","電気をつけたまま寝てしまいました。(I fell asleep leaving the light on.)"],
    ["Vるところです","dictionary form + ところです","just about to do ~","今から出かけるところです。(I'm just about to head out.)"],
    ["Vたところです","た-form + ところです","just finished doing ~","ちょうど今、着いたところです。(I just arrived right now.)"],
    ["Vているところです","ている-form + ところです","in the middle of doing ~","今、レポートを書いているところです。(I'm in the middle of writing the report right now.)"],
    ["～かもしれません","plain form + かもしれません","might ~ / maybe ~","明日は雨が降るかもしれません。(It might rain tomorrow.)"],
    ["～はずです","plain form + はずです","should be ~ / it's expected that ~","彼はもう着いているはずです。(He should have already arrived.)"],
    ["Vるべきです","dictionary form + べきです","should do ~ (obligation)","約束は守るべきです。(You should keep your promises.)"],
    ["Vるようになります","dictionary form + ようになります","come to do ~ / reach the point of being able to","漢字が読めるようになりました。(I've come to be able to read kanji.)"],
    ["Vることになります","dictionary form + ことになります","it has been decided that ~ / it turns out that ~","来月、大阪に転勤することになりました。(It's been decided that I'll transfer to Osaka next month.)"],
    ["Vることにします","dictionary form + ことにします","decide to do ~","毎朝、走ることにしました。(I've decided to run every morning.)"],
    ["Nという","N + という","called ~ / that is said to be ~","富士山という山を知っていますか。(Do you know a mountain called Mt. Fuji?)"],
    ["Vている間に","ている + 間に","while ~ is happening (something else happens within that time)","子供が寝ている間に、家事をします。(I do housework while the child is sleeping.)"],
    ["Vている間","ている + 間","the whole time while ~ (continuous, same duration)","休みの間、ずっと家にいました。(I stayed home the whole break.)"],
    ["～し","plain form + し","and moreover ~ (listing reasons)","この店は安いし、おいしいです。(This shop is cheap, and moreover, it's delicious.)"],
    ["Vております","て-form + おります","humble/polite version of ~ています (keigo)","私は東京に住んでおります。(I live in Tokyo. [polite])"],
    ["Nでございます","N + でございます","very polite version of ~です (keigo)","こちらは会議室でございます。(This is the meeting room. [very polite])"],
    ["Vずに","ない-form, drop ない + ずに","without doing ~","朝ご飯を食べずに学校へ行きました。(I went to school without eating breakfast.)"],
    ["～について","N + について","about ~ / regarding ~","日本の文化について話しましょう。(Let's talk about Japanese culture.)"]
  ];

  // Cards that moved decks / shifted position in v11. Used once by
  // storage to carry existing progress over to the new ids.
  var LEGACY_ID_MAP = {"n4v100": "n4v96","n4v101": "n4v97","n4v102": "n4v98","n4v103": "n4v99","n4v104": "n4v100","n4v105": "n4v101","n4v106": "n4v102","n4v107": "n4v103","n4v108": "n4v104","n4v109": "n4v105","n4v110": "n4v106","n4v111": "n4v107","n4v112": "n4v108","n4v113": "n4v109","n4v114": "n4v110","n4v115": "n4v111","n4v116": "n4v112","n4v117": "n4v113","n4v118": "n4v114","n4v119": "n4v115","n4v120": "n4v116","n4v121": "n4v117","n4v122": "n4v118","n4v123": "n4v119","n4v124": "n4v120","n4v125": "n4v121","n4v126": "n4v122","n4v127": "n4v123","n4v128": "n4v124","n4v129": "n4v125","n4v130": "n4v126","n4v131": "n4v127","n4v132": "n4v128","n4v133": "n4v129","n4v134": "n4v130","n4v135": "n4v131","n4v136": "n4v132","n4v137": "n4v133","n4v138": "n4v134","n4v139": "n4v135","n4v23": "n4k171","n4v24": "n4v23","n4v25": "n4v24","n4v26": "n4v25","n4v27": "n4v26","n4v28": "n4k174","n4v29": "n4k175","n4v30": "n4k56","n4v31": "n4v27","n4v32": "n4v28","n4v33": "n4v29","n4v34": "n4v30","n4v35": "n4v31","n4v36": "n4v32","n4v37": "n4v33","n4v38": "n4v34","n4v39": "n4v35","n4v40": "n4v36","n4v41": "n4v37","n4v42": "n4v38","n4v43": "n4v39","n4v44": "n4v40","n4v45": "n4v41","n4v46": "n4v42","n4v47": "n4v43","n4v48": "n4v44","n4v49": "n4v45","n4v50": "n4v46","n4v51": "n4v47","n4v52": "n4v48","n4v53": "n4v49","n4v54": "n4v50","n4v55": "n4v51","n4v56": "n4v52","n4v57": "n4v53","n4v58": "n4v54","n4v59": "n4v55","n4v60": "n4v56","n4v61": "n4v57","n4v62": "n4v58","n4v63": "n4v59","n4v64": "n4v60","n4v65": "n4v61","n4v66": "n4v62","n4v67": "n4v63","n4v68": "n4v64","n4v69": "n4v65","n4v70": "n4v66","n4v71": "n4v67","n4v72": "n4v68","n4v73": "n4v69","n4v74": "n4v70","n4v75": "n4v71","n4v76": "n4v72","n4v77": "n4v73","n4v78": "n4v74","n4v79": "n4v75","n4v80": "n4v76","n4v81": "n4v77","n4v82": "n4v78","n4v83": "n4v79","n4v84": "n4v80","n4v85": "n4v81","n4v86": "n4v82","n4v87": "n4v83","n4v88": "n4v84","n4v89": "n4v85","n4v90": "n4v86","n4v91": "n4v87","n4v92": "n4v88","n4v93": "n4v89","n4v94": "n4v90","n4v95": "n4v91","n4v96": "n4v92","n4v97": "n4v93","n4v98": "n4v94","n4v99": "n4v95","v10": "v9","v100": "v79","v101": "v80","v102": "v81","v103": "v82","v11": "v10","v12": "v11","v13": "v12","v14": "v13","v15": "v14","v16": "n4k60","v17": "v15","v18": "v16","v19": "v17","v20": "v18","v21": "v19","v22": "v20","v23": "k17","v24": "v21","v25": "v22","v26": "v23","v27": "n4k110","v28": "n4k66","v29": "v24","v30": "v25","v31": "k104","v32": "k67","v33": "v26","v34": "k106","v35": "v27","v36": "v28","v37": "v29","v38": "k108","v39": "v30","v40": "v31","v41": "v32","v42": "v33","v43": "n4k124","v44": "v34","v45": "v35","v46": "v36","v47": "v37","v48": "v38","v49": "v39","v50": "v40","v51": "v41","v52": "v42","v53": "v43","v54": "v44","v55": "v45","v56": "k114","v57": "k46","v58": "k115","v59": "n4k63","v60": "v46","v61": "v47","v62": "n4k137","v63": "n4k84","v64": "n4k138","v65": "n4k146","v66": "n4k47","v67": "n4k51","v68": "n4k150","v69": "v48","v70": "v49","v71": "v50","v72": "v51","v73": "v52","v74": "v53","v75": "v54","v76": "v55","v77": "v56","v78": "v57","v79": "v58","v8": "k69","v80": "v59","v81": "v60","v82": "v61","v83": "v62","v84": "v63","v85": "v64","v86": "v65","v87": "v66","v88": "v67","v89": "v68","v9": "v8","v90": "v69","v91": "v70","v92": "v71","v93": "v72","v94": "v73","v95": "v74","v96": "v75","v97": "v76","v98": "v77","v99": "v78"};

  // v12: kanji used by N5 vocabulary were pulled out of the N4 deck
  // into the N5 deck, which shifted the remaining N4 kanji ids.
  var LEGACY_ID_MAP_V12 = {"n4k10": "n4k9","n4k100": "n4k89","n4k101": "n4k90","n4k102": "n4k91","n4k103": "n4k92","n4k104": "n4k93","n4k105": "n4k94","n4k106": "k148","n4k107": "n4k95","n4k108": "n4k96","n4k109": "n4k97","n4k11": "n4k10","n4k110": "n4k98","n4k111": "k149","n4k112": "n4k99","n4k113": "k150","n4k114": "n4k100","n4k115": "n4k101","n4k116": "n4k102","n4k117": "n4k103","n4k118": "n4k104","n4k119": "n4k105","n4k12": "n4k11","n4k120": "n4k106","n4k121": "k151","n4k122": "n4k107","n4k123": "n4k108","n4k124": "n4k109","n4k125": "n4k110","n4k126": "n4k111","n4k127": "n4k112","n4k128": "k152","n4k129": "n4k113","n4k13": "n4k12","n4k130": "n4k114","n4k131": "n4k115","n4k132": "n4k116","n4k133": "n4k117","n4k134": "n4k118","n4k135": "n4k119","n4k136": "n4k120","n4k137": "n4k121","n4k138": "n4k122","n4k139": "n4k123","n4k14": "n4k13","n4k140": "n4k124","n4k141": "n4k125","n4k142": "k153","n4k143": "n4k126","n4k144": "n4k127","n4k145": "n4k128","n4k146": "n4k129","n4k147": "n4k130","n4k148": "n4k131","n4k149": "k154","n4k15": "n4k14","n4k150": "n4k132","n4k151": "n4k133","n4k152": "n4k134","n4k153": "n4k135","n4k154": "k155","n4k155": "n4k136","n4k156": "n4k137","n4k157": "n4k138","n4k158": "n4k139","n4k159": "n4k140","n4k16": "n4k15","n4k160": "n4k141","n4k161": "n4k142","n4k162": "n4k143","n4k163": "n4k144","n4k164": "n4k145","n4k165": "n4k146","n4k166": "n4k147","n4k167": "n4k148","n4k168": "n4k149","n4k169": "n4k150","n4k17": "n4k16","n4k170": "n4k151","n4k171": "n4k152","n4k172": "n4k153","n4k173": "n4k154","n4k174": "n4k155","n4k175": "n4k156","n4k176": "n4k157","n4k177": "n4k158","n4k178": "n4k159","n4k179": "n4k160","n4k18": "n4k17","n4k180": "n4k161","n4k181": "n4k162","n4k182": "n4k163","n4k183": "n4k164","n4k184": "n4k165","n4k185": "n4k166","n4k186": "n4k167","n4k187": "n4k168","n4k188": "n4k169","n4k189": "n4k170","n4k19": "n4k18","n4k190": "n4k171","n4k191": "n4k172","n4k192": "n4k173","n4k193": "n4k174","n4k194": "n4k175","n4k195": "n4k176","n4k196": "n4k177","n4k197": "n4k178","n4k198": "n4k179","n4k199": "n4k180","n4k20": "n4k19","n4k200": "n4k181","n4k201": "n4k182","n4k202": "n4k183","n4k203": "n4k184","n4k204": "n4k185","n4k205": "n4k186","n4k206": "n4k187","n4k207": "n4k188","n4k208": "n4k189","n4k209": "n4k190","n4k21": "n4k20","n4k210": "n4k191","n4k211": "n4k192","n4k212": "n4k193","n4k213": "n4k194","n4k214": "n4k195","n4k215": "n4k196","n4k216": "n4k197","n4k217": "n4k198","n4k218": "n4k199","n4k219": "n4k200","n4k22": "n4k21","n4k220": "n4k201","n4k221": "n4k202","n4k222": "n4k203","n4k223": "n4k204","n4k224": "n4k205","n4k225": "n4k206","n4k226": "n4k207","n4k227": "n4k208","n4k228": "n4k209","n4k229": "n4k210","n4k23": "n4k22","n4k230": "n4k211","n4k231": "n4k212","n4k232": "n4k213","n4k233": "n4k214","n4k234": "n4k215","n4k235": "n4k216","n4k236": "n4k217","n4k237": "n4k218","n4k238": "n4k219","n4k239": "n4k220","n4k24": "n4k23","n4k240": "n4k221","n4k241": "n4k222","n4k242": "n4k223","n4k243": "n4k224","n4k244": "n4k225","n4k245": "n4k226","n4k246": "n4k227","n4k247": "n4k228","n4k248": "n4k229","n4k249": "n4k230","n4k25": "n4k24","n4k250": "n4k231","n4k251": "n4k232","n4k252": "n4k233","n4k253": "n4k234","n4k254": "n4k235","n4k255": "n4k236","n4k256": "n4k237","n4k257": "n4k238","n4k258": "n4k239","n4k259": "n4k240","n4k26": "n4k25","n4k260": "n4k241","n4k261": "n4k242","n4k262": "n4k243","n4k263": "n4k244","n4k264": "n4k245","n4k265": "n4k246","n4k27": "n4k26","n4k28": "n4k27","n4k29": "n4k28","n4k30": "n4k29","n4k31": "n4k30","n4k32": "n4k31","n4k33": "n4k32","n4k34": "n4k33","n4k35": "n4k34","n4k36": "n4k35","n4k37": "n4k36","n4k38": "n4k37","n4k39": "n4k38","n4k4": "k137","n4k40": "n4k39","n4k41": "n4k40","n4k42": "n4k41","n4k43": "k138","n4k44": "k139","n4k45": "k140","n4k46": "n4k42","n4k47": "n4k43","n4k48": "n4k44","n4k49": "n4k45","n4k5": "n4k4","n4k50": "n4k46","n4k51": "n4k47","n4k52": "n4k48","n4k53": "n4k49","n4k54": "n4k50","n4k55": "n4k51","n4k56": "n4k52","n4k57": "n4k53","n4k58": "n4k54","n4k59": "n4k55","n4k6": "n4k5","n4k60": "n4k56","n4k61": "n4k57","n4k62": "n4k58","n4k63": "n4k59","n4k64": "n4k60","n4k65": "n4k61","n4k66": "n4k62","n4k67": "n4k63","n4k68": "n4k64","n4k69": "k141","n4k7": "n4k6","n4k70": "n4k65","n4k71": "n4k66","n4k72": "n4k67","n4k73": "n4k68","n4k74": "n4k69","n4k75": "n4k70","n4k76": "k142","n4k77": "k143","n4k78": "k144","n4k79": "k145","n4k8": "n4k7","n4k80": "n4k71","n4k81": "n4k72","n4k82": "n4k73","n4k83": "n4k74","n4k84": "n4k75","n4k85": "n4k76","n4k86": "n4k77","n4k87": "n4k78","n4k88": "k146","n4k89": "n4k79","n4k9": "n4k8","n4k90": "k147","n4k91": "n4k80","n4k92": "n4k81","n4k93": "n4k82","n4k94": "n4k83","n4k95": "n4k84","n4k96": "n4k85","n4k97": "n4k86","n4k98": "n4k87","n4k99": "n4k88"};

  // v19: four grammar cards moved from N4 to N5 (ids carry the level prefix,
  // so they changed). Carries existing progress across, once.
  var LEGACY_ID_MAP_V19 = {
    "n4g_～ので": "g_～ので",
    "n4g_Vすぎます": "g_Vすぎます",
    "n4g_Vつもりです": "g_Vつもりです",
    "n4g_～がります": "g_～がります"
  };

  // v20: Vてから moved from N4 to N5 (level prefix is part of the id).
  var LEGACY_ID_MAP_V20 = {
    "n4g_Vてから": "g_Vてから"
  };

  // v21: counters renamed to show the kana after the kanji, e.g. "〜人" ->
  // "〜人（にん）". Carries saved progress onto the new ids, once.
  var LEGACY_ID_MAP_V21 = {
    "v_〜人": "v_〜人（にん）", "v_〜枚": "v_〜枚（まい）", "v_〜本": "v_〜本（ほん）",
    "v_〜個": "v_〜個（こ）", "v_〜回": "v_〜回（かい）", "v_〜歳": "v_〜歳（さい）"
  };

  // v22: Vなくてもいいです moved from N4 to N5 (level prefix is in the id).
  var LEGACY_ID_MAP_V22 = {
    "n4g_Vなくてもいいです": "g_Vなくてもいいです"
  };

  var N5_KANJI = withIds(N5_KANJI_RAW, "k", "kanji", "n5");
  var N5_VOCAB = withIds(N5_VOCAB_RAW, "v", "vocab", "n5");
  var N4_KANJI = withIds(N4_KANJI_RAW, "n4k", "kanji", "n4");
  var N4_VOCAB = withIds(N4_VOCAB_RAW, "n4v", "vocab", "n4");
  // Grammar cards are brand new, so unlike kanji/vocab their ids never had
  // an older positional form -- no legacy map entry needed for them.
  var N5_GRAMMAR = withIds(N5_GRAMMAR_RAW, "g", "grammar", "n5");
  var N4_GRAMMAR = withIds(N4_GRAMMAR_RAW, "n4g", "grammar", "n4");

  // v13: ids switched from positional ("k0", "n4v62", ...) to content-based
  // ("k_一", "n4v_..."), which stay correct no matter how these lists get
  // reordered or added to later. This map (built from POSITIONAL_IDS above)
  // is only ever needed once, to carry existing progress over.
  var LEGACY_ID_MAP_V13 = {};
  POSITIONAL_IDS.forEach(function (pair) { LEGACY_ID_MAP_V13[pair[0]] = pair[1]; });

  // Attach onyomi/kunyomi/example-word detail (from kanji-info.js, keyed by
  // the character itself) onto each kanji card. Cards without an entry just
  // keep the plain combined `reading` field they already had.
  (function attachKanjiInfo() {
    var info = window.KanjiInfo || {};
    N5_KANJI.concat(N4_KANJI).forEach(function (c) {
      var i = info[c.front];
      if (!i) return;
      c.onyomi = i.onyomi;
      c.kunyomi = i.kunyomi;
      c.examples = i.examples;
    });
  })();

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
  N5_KANJI.concat(N5_VOCAB).concat(N5_GRAMMAR).concat(N4_KANJI).concat(N4_VOCAB).concat(N4_GRAMMAR).forEach(function (c) { BY_ID[c.id] = c; });

  window.FlashcardData = {
    levels: {
      n5: { kanji: N5_KANJI, vocab: N5_VOCAB, grammar: N5_GRAMMAR, all: N5_KANJI.concat(N5_VOCAB).concat(N5_GRAMMAR) },
      n4: { kanji: N4_KANJI, vocab: N4_VOCAB, grammar: N4_GRAMMAR, all: N4_KANJI.concat(N4_VOCAB).concat(N4_GRAMMAR) }
    },
    BY_ID: BY_ID,
    LEGACY_ID_MAP: LEGACY_ID_MAP,
    LEGACY_ID_MAP_V12: LEGACY_ID_MAP_V12,
    LEGACY_ID_MAP_V13: LEGACY_ID_MAP_V13,
    LEGACY_ID_MAP_V19: LEGACY_ID_MAP_V19,
    LEGACY_ID_MAP_V20: LEGACY_ID_MAP_V20,
    LEGACY_ID_MAP_V21: LEGACY_ID_MAP_V21,
    LEGACY_ID_MAP_V22: LEGACY_ID_MAP_V22
  };
})();