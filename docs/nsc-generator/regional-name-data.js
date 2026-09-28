const waldmenschenNames = [
  "Anhe", "Bahene", "Cankuna", "Cante-Tinza", "Catka", "Cepua", "Chya-Tapa", "Hahatonwan",
  "Hayatepe", "He-Sehe", "Hiyuhana", "Ho-Yaya", "Huka", "Istima-Tonko", "Jebato", "Kauka-He",
  "Kehala", "Ketaqua", "Miniwatu", "Nimu-Poto", "Pahaha", "Panhahe", "Sica", "Takate", "Tapam-Wah",
  "Tapo", "Teh-Yo", "Tetaka", "Tiki-Ta", "Tokahe", "Tonkowan", "Tonku", "Udu", "Wapiya", "Yako"
];

const utuluNames = [
  "Akuma", "Apiye", "Boadi", "Bodongo", "Bolotongo", "Cazembe", "Epamwa", "Hwamba", "Imaro",
  "Kalalu", "Kalimba", "Kibwa", "Kingombo", "Kirabo", "Kubesi", "Kukula", "Kweli", "Labiwasene",
  "Lutu", "Mangabe", "Monebu", "Mopane", "Mpemba", "Mulga", "Mwasego", "Nutombi", "Obada",
  "Ombawa", "Oweso", "Petani", "Ranabo", "Rumari", "Schegabe", "Schenumba", "Shasiwatu",
  "Shimenege", "Takate", "Tangawizi", "Tauu", "Tenkile", "Tuhemba", "Udonka", "Umbele", "Umpaba",
  "Unabo", "Usuthu", "Zainabu"
];

Object.assign(window.AVENTURIAN_NAME_DATA, {
  al_anfa_tiefer_sueden: {
    style: "brabaci",
    female: ["Adaque", "Alara", "Amira", "Avessandra", "Balatravis", "Baniatella", "Blanca", "Boronaya", "Calmora", "Carimina", "Cessandra", "Consuela", "Cortessa", "Desiderya", "Desmonda", "Diantha", "Dolorita", "Dominga", "Doriana", "Elodia", "Emerencia", "Emiglia", "Esmeralda", "Estrella", "Fiara", "Fiona", "Fiorella", "Galindia", "Heliantha", "Imelde", "Imperya", "Inares", "Jesabela", "Katalinya", "Leona", "Luisina", "Marchesca", "Maryarita", "Mercara", "Phelicitas", "Rahjades", "Ramira", "Rosinia", "Santilia", "Saranya", "Simiona", "Valerfa", "Violanda", "Ximena", "Zephirina"],
    male: ["Adario", "Agusto", "Alondro", "Alriego", "Alveron", "Amato", "Amir", "Armado", "Assanto", "Boromeo", "Cascador", "Calmano", "Coragon", "Corvo", "Damiano", "Deredan", "Desiderio", "Diago", "Domingo", "Dorio", "Egiliano", "Ellio", "Emano", "Emilio", "Enrisco", "Fiorenzo", "Firunando", "Flaminio", "Ghonzo", "Hesindiego", "Iago", "Imperioso", "Irato", "Jesidoro", "Kalman", "Kamillio", "Lirobal", "Lucan", "Lucio", "Mandolo", "Marbido", "Marlo", "Massino", "Micirio", "Morisys", "Nestario", "Nostromo", "Orelio", "Pedresco", "Praíopio", "Quintilian", "Rahjadan", "Ramin", "Ramon", "Rondrigan", "Sandro", "Thiago", "Vittorio", "Zurbaran"],
    family: ["Acostez", "Albahir", "Almanzar", "Alvarez", "Anthos", "Arragenos", "Barrera", "Belafloros", "Beratas", "Boronez", "Botero", "Brabaker", "Casarez", "Charazzar", "Comitez", "Cornio", "Delazar", "Dominguez", "Erabenas", "Fontanez", "Fiovarez", "Golgarez", "Gorodez", "Gorralas", "Inezano", "Kalando", "Lanistos", "Lupinez", "Madarez", "Malagro", "Marquez", "Monterey", "Montez", "Morales", "Olibantin", "Phelipez", "Queseda", "Ramirez", "Rondriguez", "Santana", "Sylvaron", "Tiamartin", "Uludaz", "Zaldahan"],
    noble: ["Bonareth", "Florios", "Honak", "Karinor", "Kugres", "Paligan", "Ulfhart", "Wilmaan", "Zornbrecht", "Sylphur", "Charazzar"],
    prefixes: ["d'", "da", "de", "di", "du", "von", "von und zu", "ya"]
  },
  aranien: {
    style: "aranien",
    female: ["Aischanka", "Alisanya", "Arjunna", "Ashina", "Asleika", "Aylalind", "Ayshira", "Azizelis", "Banazira", "Belizath", "Damara", "Dassareth", "Dilhabeth", "Dunjanild", "Elaisha", "Eleonora", "Emerbeth", "Farissa", "Fayrieke", "Feruja", "Gazalinde", "Halimyanis", "Hamide", "Iphemia", "Ishannah", "Jasina", "Jushiberta", "Kalashra", "Khedrine", "Khelbara", "Khorena", "Lailalinde", "Leushanya", "Manjula", "Merishja", "Nedimsira", "Neraidane", "Peranshaya", "Rahjadane", "Rahjana", "Rashpatane", "Rhayadaque", "Rondiray", "Shanya", "Sherizeth", "Shilaldara", "Shulamunde", "Sulamin", "Tsabine", "Yathilda", "Zulhaminai"],
    male: ["Abdulon", "Abdulrik", "Abubrecht", "Aliban", "Amaryd", "Amirwolf", "Arkos", "Arras", "Assaban", "Beyhelm", "Djafardeon", "Djemilassar", "Dschadirfried", "Dscheridan", "Farukol", "Hamarbald", "Harunian", "Hassanfried", "Jashan", "Jikhbald", "Kashban", "Korwan", "Leomar", "Machmud", "Marwamir", "Melekhelm", "Merkan", "Muhalla", "Mukarribald", "Nabur", "Narebold", "Nezahet", "Omjaralf", "Peranjador", "Rahjabert", "Rahjadan", "Rashdan", "Rassan", "Rasulan", "Retoban", "Rondrador", "Rondramir", "Selimdor", "Shafirio", "Shamar", "Sulhamid", "Taref", "Tariq", "Tuleffried", "Yassirman", "Yussufried"],
    family: ["Aimaristani", "ak'Shahbra", "Alahjan", "al'Akhdar", "al'Awan", "al'Barad", "Alhazir", "al'Keshal'Kharash", "al'Kitab", "as'Ahlan", "as'Najaras", "as'Sarjabaran", "as'Sherchem", "as'Tahan", "Bishar", "Elburumi", "Elyeshinnah", "Kahraman", "Terekandi", "Tiltenbrugger", "Turshem", "Zorgahani"],
    noble: ["al'Nabab", "Ankrabad", "Awallakand", "Bakrachal", "Barbrück", "Bensunni Dassareth", "Farukand", "Nasiradbad", "Ras Abris", "Ras Surya", "Revennis", "Tasilimpfort", "Tebahan", "Tebanfurt", "Terchabbrück", "Untersternheim", "Veharis", "Yakshabar", "Yasirabad", "Yerkesh"],
    predicates: ["von", "ay", "ai"]
  },
  bornland: {
    style: "regional",
    doubleFirst: true,
    female: ["Agnita", "Algrid", "Alrike", "Alwine", "Anjescha", "Barinja", "Birgit", "Brinuschka", "Danika", "Darina", "Elga", "Elkwine", "Firnja", "Gerlinde", "Gritta", "Hesindja", "Ilke", "Irinja", "Jadviga", "Jelena", "Karinja", "Katarinja", "Leudara", "Ludmilla", "Marja", "Nadjescha", "Olja", "Perainja", "Rowena", "Sulja", "Tjeika", "Uljana", "Valeska", "Yelena", "Zelmira"],
    male: ["Alrik", "Arvid", "Boris", "Brin", "Dragan", "Erlan", "Firunian", "Gerbald", "Gero", "Grimm", "Halmar", "Herdan", "Igor", "Iwan", "Janko", "Juri", "Kalmir", "Leomar", "Mikail", "Miron", "Nikita", "Norwin", "Odil", "Pjotr", "Rondrik", "Sewerin", "Stane", "Tassilo", "Ugo", "Vito", "Wlad", "Yarik", "Zordan"],
    family: ["Alatzer", "Bornski", "Brückner", "Elkwinter", "Festumer", "Firunjew", "Gernotski", "Ilmenstein", "Karenow", "Korswandt", "Meskinnes", "Norburger", "Olbenow", "Rabenmund", "Seweritz", "Stoerrebrandt", "Tannhaus", "Uslenried", "Walsareff", "Zolipantessa"],
    noble: ["von Ilmenstein", "von Notmark", "von Ouvenmas", "von Salderkeim", "von Seweritz", "von Stoerrebrandt", "von Uspiaunen", "von Walsareff", "von Zolipantessa"],
    origins: ["aus Festum", "aus Norburg", "aus Neersand", "aus Sewerien", "aus dem Bornland"]
  },
  ferkina: {
    style: "ferkina",
    female: ["Ashu", "Azrubat", "Begum", "Belkhara", "Chanum", "Chatun", "Chizuran", "Chorjan", "Chorshilan", "Dscheridocht", "Duncha", "Farah", "Faroshte", "Farsha", "Farzandeh", "Golbanu", "Golsban", "Harshan", "Hulya", "Jeleyin", "Khalila", "Khullat", "Laal", "Lahileh", "Massudeh", "Mehrshan", "Mirhay", "Nadam", "Nazrin", "Nuraya", "Nurjahan", "Peribanu", "Rashadocht", "Rohila", "Rushan", "Shiringol", "Shmahba", "Sulefin", "Tamra", "Tarshabet", "Tebay", "Tulamin", "Zarbanu", "Zuleycha"],
    male: ["Abtuul", "Ardavan", "Ardesh", "Azad", "Bashur", "Burshuk", "Chosraw", "Devlekh", "Djershar", "Dschafur", "Dschalf", "Durjin", "Faruch", "Farzand", "Feridun", "Fervez", "Gulbad", "Hafiz", "Harnar", "Haydar", "Jikhab", "Kaszan", "Kazh", "Kazum", "Kherim", "Khordad", "Madawan", "Mharbal", "Mirlam", "Muyanshir", "Nashrath", "Rachwan", "Rashni", "Rasuul", "Rustam", "Sharkhan", "Tsharik", "Tugril", "Tulsani", "Uchrab", "Umar", "Waqran", "Yabman", "Yistarrech", "Zakhaban", "Zhandur"],
    clans: ["Ban Anghrachan", "Ban Awallakh", "Ban Farkash", "Ban Gassarah", "Ban Hadarri", "Ban Khalil", "Ban Kherash", "Ban Malya", "Ban Mhadjaduri", "Ban Sharida", "Ban Tirghufa", "Ban Uludh", "Bern Chalif", "Bern Yashkar", "Shai'Aian", "Ulad Asuban", "Ulad Barshirn", "Ulad Yerkash"],
    epithets: ["Berglöwe", "Blutklinge", "Felsherz", "Himmelsfalke", "Khoramzahn", "Narbenträger", "Sturmreiter", "Wüstenfalke"]
  },
  fjarninger: {
    style: "fjarninger",
    female: ["Angveig", "Arnthrudir", "Asgora", "Baska", "Björga", "Blotsaxa", "Dandagard", "Draumirga", "Fenrissa", "Frunvirga", "Funudara", "Fyrveig", "Gimmahalra", "Gunnlaug", "Halfga", "Halstakkara", "Hellgard", "Hildur", "Hoelgjirda", "Ifnirga", "Irngrid", "Isjarda", "Jaldrud", "Karherga", "Lotgara", "Lykvuda", "Lyrveig", "Ordruna", "Rangra", "Rannveig", "Sigrundra", "Sirngrid", "Skarda", "Skirngard", "Snorja", "Svallveig", "Svannlaug", "Svellgra", "Ulfgard", "Varrag", "Walgrid", "Walgrimdra", "Wyrmtrud", "Ylwa", "Yngheldir"],
    male: ["Angardur", "Asgold", "Askleivir", "Balkur", "Banibeorn", "Bardagimur", "Baskir", "Blotgrim", "Blotulfur", "Bodvar", "Darnlaugr", "Darkir", "Engur", "Felldur", "Fenrissir", "Fjallgart", "Frungrim", "Frunibrandt", "Frunobar", "Frunwulf", "Gjallur", "Greimdrur", "Harsthor", "Havgrimur", "Heffnard", "Herfnir", "Hjanir", "Hjant", "Hjort", "Hjorvard", "Ilkjart", "Ilvnir", "Isgrinur", "Jölmi", "Kargrim", "Kladogant", "Mjösgur", "Pandur", "Raluf", "Sigrindur", "Skarbeorn", "Skjoldur", "Snallnard", "Snarkir", "Songrimur", "Steinthor", "Surthor", "Svartbanir", "Tjuntart", "Torgrim", "Tronthor", "Valbrandar", "Waleif"],
    epithets: ["Allesesser", "Bärenzwinger", "Bluträcher", "Donnerschrei", "Eisenschwinger", "Eisläufer", "Fellreißer", "Feuerbringer", "Frostherz", "Frostzunge", "Grimmauge", "Keulenbrecher", "Schneeschleicher", "Stoßzahnbrecher", "Todesaxt", "Wildherz"],
    clans: ["Bluttrinker-Leute", "Doppelaxt-Leute", "Eisbrecher-Leute", "Eisfuchs-Leute", "Firnklippen-Leute", "Frostfeuer-Leute", "Funkenglut-Leute", "Grimmfrost-Leute", "Schreiende-Schwerter-Leute", "Sturmbrüller-Leute"]
  },
  freie_staedte_norden: {
    style: "regional",
    female: ["Adilgunde", "Adlanga", "Aldare", "Alfianna", "Baerhild", "Baernja", "Bilhildis", "Carissima", "Damaris", "Dorell", "Elftraute", "Elfwyn", "Elkwine", "Elslin", "Farnlieb", "Fianna", "Firnwild", "Gerlin", "Griseldis", "Heleona", "Heronda", "Holdtraude", "Ifirnja", "Ila", "Jascham", "Kajani", "Leleth", "Lidwina", "Linnea", "Lyncordia", "Madagund", "Mandlin", "Minnegard", "Nadjescha", "Nanna", "Nirka", "Norgard", "Olja", "Riana", "Rodegard", "Rondrine", "Rowena", "Saari", "Sibille", "Svea", "Swangard", "Thalia", "Tjeika", "Ulfhild", "Valariel", "Valborga", "Vanjescha", "Waidgunde", "Widogard", "Wisgard", "Wulfhild", "Yrme"],
    male: ["Adhelm", "Adoran", "Aeldereth", "Albuin", "Anshag", "Baerjan", "Bosjew", "Branwyn", "Curathan", "Dietrad", "Dunarth", "Ealdawin", "Elfert", "Elko", "Enolf", "Farnion", "Firunjan", "Firutin", "Gerlin", "Gerwulf", "Grimjan", "Hanko", "Heleon", "Herodan", "Ifirnion", "Imion", "Isenbard", "Jorinen", "Lanthir", "Leoderich", "Lorion", "Marnion", "Mew", "Nurian", "Olean", "Orschin", "Ortwin", "Oswin", "Patril", "Pettar", "Rodegar", "Rondril", "Thalion", "Thorolf", "Tuljew", "Waidhart", "Wolforn"],
    family: ["Arlin", "Bergwacht", "Bogner", "Frantischek", "Gerstenschröter", "Grünfelde", "Kolenbrander", "Mandelaug", "Rohtkop", "Schmied", "Sewerin", "Stiewick", "Waldner", "Waidmann", "Wangelwilder", "Wolfhein"],
    noble: ["von Donnerbach", "von Enqui", "von Lowangen", "von Riva", "von Tjolmar", "von Uhdenberg"],
    origins: ["aus Donnerbach", "aus Enqui", "aus Lowangen", "aus Riva", "aus Tjolmar", "aus Uhdenberg"]
  },
  gjalsker: {
    style: "gjalsker",
    female: ["Aesa", "Andraga", "Aruleyd", "Bebann", "Blotulind", "Borrgach", "Brona", "Brucha", "Caltha", "Cirnach", "Corrja", "Dairdra", "Dundana", "Dunyabra", "Durrcha", "Eirnird", "Frunira", "Froya", "Gardrha", "Gharya", "Gjayka", "Grainne", "Griadhra", "Grimheyd", "Griwer", "Hachwa", "Hagwa", "Harwa", "Hiltli", "Hjalbeth", "Hjurrgat", "Hulgä", "Ifnar", "Ifrunna", "Irdath", "Irfraid", "Keirnath", "Lurga", "Madhreth", "Margraidh", "Marthai", "Marrwen", "Marzagh", "Megrim", "Milbeth", "Miharra", "Moirya", "Mordag", "Morrga", "Murraya", "Oighred", "Rachnaid", "Saryja", "Savai", "Sidheag", "Shindarr", "Shinnath", "Skrayana", "Sorcha", "Thorhalla", "Thorra", "Throna", "Uthra", "Yrrwa", "Yuchgard", "Yurrgira", "Ywen", "Zurakka"],
    male: ["Anargh", "Anchas", "Artach", "Balfoch", "Bartakh", "Barwad", "Bearach", "Bradruch", "Braighdan", "Branchan", "Branduch", "Breac", "Brein", "Caerfynh", "Cainnoch", "Cammrur", "Cianu", "Cormach", "Daragh", "Derwech", "Druan", "Donnachadh", "Dundoch", "Etzel", "Firnwär", "Friedur", "Gabran", "Gaschnig", "Gedwed", "Hagwar", "Haru", "Harveg", "Hjalldur", "Ifrunndoch", "Islogh", "Kazan", "Lannach", "Lurasch", "Madadhskoth", "Madhru", "Marzagh", "Meku", "Mjesgold", "Morghinach", "Morro", "Morved", "Murchad", "Murdoch", "Ohdru", "Orunu", "Partach", "Rastar", "Roslagh", "Siegmoch", "Struan", "Strunlogh", "Tormud", "Turdoch", "Tsharbak", "Ulf", "Ulraigh", "Wartech", "Wladuch", "Wuran", "Yahrrad", "Yarrodh", "Yorged", "Yuchdan", "Yurrgold"],
    clans: ["Alrudh", "Dhartaech", "Lyrgach", "Mortakh", "Niellyn", "Rayyadh", "Arryach-Mur", "Benbhälur", "Benskoth", "Cregg-Yolir", "Ishtar-Barr", "Oshthar-Sloch"]
  },
  hoher_norden: {
    style: "regional",
    female: ["Alrika", "Dascha", "Durinja", "Elwinja", "Erdgerda", "Fennja", "Frenja", "Galande", "Geldana", "Gunbritt", "Hauka", "Hedjascha", "Hitta", "Hjalda", "Immentraud", "Jädra", "Joraja", "Juminke", "Kattlinka", "Kela", "Leivka", "Letta", "Minka", "Norhild", "Olja", "Selinja", "Solva", "Svänna", "Swafgard", "Swandje", "Talja", "Tatjascha", "Thorfinnja", "Torgritt", "Vatjascha", "Vedaju", "Vlada", "Wolfgarda", "Wolfhild", "Wolflinde", "Yasmara"],
    male: ["Arnbold", "Asgrimmjef", "Coljew", "Däbbart", "Degold", "Dostmann", "Foggman", "Friedjew", "Gerbald", "Gerbaldjew", "Grimmjost", "Hanko", "Hänno", "Heimuk", "Hokku", "Jaakon", "Jakkonush", "Januk", "Jasper", "Jeesko", "Jöstov", "Juchoi", "Kalkuk", "Keinjo", "Kervö", "Pannek", "Peltje", "Praiofried", "Simjok", "Starre", "Swaffnach", "Thorwolf", "Torbanjeff", "Ulfried", "Uribert", "Valjok", "Wolfgärdoff", "Wolfgrimm", "Woltan", "Wulfen", "Yagu", "Yngvar", "Yorrajew", "Zurbaran"],
    family: ["Arnboldsson", "Arnboldsdottir", "Bernsteinfinder", "Brecheisner", "Doltjeff", "Durjolew", "Einauge", "Eisläufer", "Elkski", "Firnläufer", "Goldnase", "Irgjeloff", "Janukson", "Januksdottir", "Karenski", "Leivkasson", "Leivkasdottir", "Mogoljeff", "Neunfinger", "Orkentoht", "Reusenholer", "Robbenschlächter", "Schneehaar", "Yngvarsson", "Yngvarsdottir"],
    noble: ["von Frisov", "von Glyndhaven", "von Paavi", "von Bjaldorn", "von Oblarasim"],
    origins: ["aus Bjaldorn", "aus Frisov", "aus Glyndhaven", "aus Paavi", "aus Oblarasim", "vom Yeti-Land"],
    epithets: ["Eisblick", "Firunstreu", "Nordwind", "Schneeläufer", "Winterherz"]
  },
  kemi: {
    style: "kemi",
    female: ["Ä'meset", "Ankhsa", "Djer'kem", "Mar'bonefer", "Men'kare", "Merit'ka", "Merut'sat", "Me'wehem", "Neferi", "Quenadya", "Ta'meri", "Uneb'nemes"],
    male: ["Abet-ut'yar", "Djer'kem", "Hati'hesa", "Henem'iwen", "Kemet'nechet", "Nebib", "Pet'nehem", "Sekem'kutary", "Sekem'veser", "Setepen", "Shepses'ka", "Veser'htep"],
    family: ["al'Plane", "Chesal'ret", "Me'kath", "Mehyem'ka", "Mes'kha-re", "Nebmes", "Paestumai", "Sa'kurat", "Sekemat", "Setepen", "Tem'kat", "Ze'emkha"],
    origins: ["Biazzan", "Djaset", "Ireth", "Jem'ka", "Khefu", "Naareb", "Qinsay", "Setepen", "Yleha"]
  },
  maraskan: {
    style: "maraskan",
    female: ["Achtevsabu", "Alrikjida", "Alryscha", "Aylajida", "Birseljida", "Boronjida", "Brinjida", "Cassimasab", "Debrasab", "Delilahsab", "Denderajida", "Duchenijida", "Elgojida", "Emirasab", "Endijida", "Erisabu", "Esmeraldjida", "Firrejida", "Frijida", "Garasab", "Glennajida", "Haranisab", "Hesindasab", "Hjelgirasab", "Idrajid", "Ishajid", "Jamilhajida", "Karhimasab", "Madahajida", "Milhibethjida", "Minkajida", "Mirasab", "Mylenjida", "Nandurijida", "Nedimajida", "Olgajida", "Perizelasab", "Phelicijida", "Prajyscha", "Rahjajida", "Ramelusab", "Reijida", "Renajida", "Rondrasab", "Rurasab", "Rurijida", "Ruryscha", "Sefirajida", "Shilajida", "Sulabethjida", "Sumujida", "Tsabinajida", "Umrajida", "Viderajida", "Wladyscha", "Xanjida", "Yasindajida", "Zajida", "Zitajida"],
    male: ["Achmedziber", "Alrech", "Alrijian", "Boraneran", "Dajin", "Denderan", "Frumold", "Haran", "Keideran", "Korrasmold", "Lirobaljin", "Littjewziber", "Loziber", "Madajin", "Marajian", "Marechziber", "Marjiamold", "Maurech", "Mujiajian", "Mulziber", "Murakziber", "Ornibijian", "Perjin", "Praiosziber", "Quinziber", "Rurech", "Scheideran", "Thorbaldjian", "Ugoziber", "Ulrechziber", "Ungolfziber", "Vegsziber", "Welfmold", "Xanderan", "Zendijin", "Zifermold"],
    origins: ["Tuzak", "Boran", "Sinoda", "Jergan", "Andalkan", "Maraskan", "Khunchom"],
    femaleEpithets: ["die die Schönheit sieht", "die den Diskus wirft", "die Rurs Fragen hört", "die auf Gror wartet", "die mit den Schmetterlingen spricht"],
    maleEpithets: ["der die Schönheit sieht", "der den Diskus wirft", "der Rurs Fragen hört", "der auf Gror wartet", "der mit den Schmetterlingen spricht"]
  },
  nivesen: {
    style: "nivesen",
    female: ["Aikku", "Airiksela", "Amuri", "Aukaju", "Baituri", "Beri", "Bjanju", "Dakauju", "Dana", "Duri", "Eikaju", "Emela", "Eskola", "Falkja", "Guaäna", "Hallvi", "Hauka", "Helja", "Hikia", "Janaha", "Jokela", "Jonuri", "Kajani", "Kantala", "Karenju", "Kelva", "Kisa", "Kuopi", "Lauka", "Leenja", "Lieskaju", "Lojmaa", "Mido", "Murula", "Myrra", "Naäni", "Naij", "Näljavena", "Neli", "Nirka", "Nivilaukaju", "Ojakalla", "Olu", "Peltju", "Pori", "Rauma", "Roika", "Saari", "Taiini", "Terhi", "Tiali", "Tiensu", "Tolsa", "Ulu", "Usi", "Valla", "Viala", "Vieki", "Ylista", "Zurti"],
    male: ["Aatto", "Abjo", "Adjok", "Altanan", "Arjuk", "Banuk", "Beranen", "Berko", "Binjok", "Danjuk", "Ebnan", "Eikaljok", "Eiko", "Eirkir", "Enan", "Enko", "Enuk", "Erm Sen", "Finjhon", "Garnuk", "Genko", "Gurjinen", "Hanko", "Hautanan", "Heimanuk", "Hietanen", "Honuk", "Horganan", "Iivarr", "Janjuk", "Jasu", "Jorinen", "Jurtanan", "Kaikanuk", "Karuukijo", "Kauno", "Keinjo", "Kervo", "Kiamu", "Kilhijo", "Kinajo", "Kintanan", "Kylänjak", "Lanan", "Latu", "Lieto", "Loschim", "Madanan", "Maenan", "Miko", "Neajo", "Nejhan", "Nurmjo", "Poukai", "Rakjo", "Rasjuk", "Rikiju", "Seinjuk", "Toljok", "Uljok", "Valen", "Valjok", "Zeino"],
    clans: ["Auka-Lie", "Hokke", "Kaiku", "Kaiyakuu-Lie", "Kettu-Lie", "Kylänjak", "Lieska-Jaärna", "Lieska-Kangerluk", "Lieska-Leddu", "Lieska-Lie", "Lieska-Madukju", "Majava-Lie", "Navalauki", "Rika-Lie", "Takku", "Toivoa", "Uusipauki", "Villikauka"],
    epithets: ["Karenhüter", "Madaruf", "Schneeläufer", "Steppenwolf", "Wolfsfreund"]
  },
  norbarden: {
    style: "norbarden",
    female: ["Abra", "Agnitha", "Aikulja", "Akilja", "Argja", "Banja", "Barina", "Berilja", "Besga", "Bilkis", "Birgat", "Bisminka", "Bitescha", "Bogja", "Chrenja", "Dagris", "Dalkeshja", "Darka", "Dascha", "Datescha", "Derja", "Dirgisa", "Durscha", "Eborja", "Eika", "Elkja", "Etris", "Fagrisa", "Fanja", "Felja", "Fetanka", "Finja", "Frankja", "Ganris", "Gerja", "Girtinka", "Gulja", "Haka", "Hanija", "Hashandra", "Hedja", "Helna", "Hetinka", "Hirja", "Huldja", "Hurtja", "Ibra", "Imjaschala", "Ischa", "Ismenka", "Jalinka", "Jalna", "Jaminka", "Janka", "Jascha", "Jaunava", "Jelena", "Julenka", "Juminke", "Kalinka", "Karena", "Katjenka", "Kerja", "Kitinka", "Kolja", "Koscha", "Kurja", "Lenija", "Lexaja", "Liminka", "Lorsija", "Mascha", "Merischja", "Minka", "Mischala", "Mokascha", "Murja", "Nunja", "Obanja", "Olgadja", "Olja", "Orinka", "Otja", "Pawla", "Pidescha", "Polita", "Potinka", "Radinka", "Radra", "Rasescha", "Reska", "Rika", "Rischinka", "Ruschane", "Sanja", "Slanka", "Soscha", "Talja", "Tatja", "Terlaja", "Thesija", "Titanka", "Turninka", "Umerike", "Upra", "Vesanka", "Wlada", "Yilbakis", "Zerinka"],
    male: ["Adrej", "Ahani", "Aikul", "Aleks", "Alriksej", "Amrun", "Arej", "Arljew", "Akhtaw", "Banjew", "Barins", "Beril", "Bjuro", "Bogul", "Boril", "Bradrik", "Burgej", "Dagri", "Danilew", "Darbin", "Darjew", "Daswadan", "Dergej", "Dirgis", "Dorkow", "Ebranj", "Elkman", "Erdoj", "Ergjew", "Etril", "Fadril", "Fagris", "Fargej", "Fenew", "Fjedril", "Fjinko", "Fogutil", "Fradrik", "Fredoj", "Ganew", "Ganri", "Glawnaj", "Gojelno", "Gossudjar", "Guri", "Hamakil", "Ibron", "Irgoi", "Janko", "Jaslaw", "Jenko", "Juchow", "Kargemil", "Kaspaj", "Kaspron", "Kergaj", "Kergil", "Kolaj", "Lankej", "Lari", "Laromir", "Leguslaw", "Lexej", "Lorsij", "Malmodir", "Matajew", "Mermadin", "Mija", "Mikail", "Mischajil", "Mjesko", "Mokosch", "Okil", "Okjadir", "Olboj", "Parel", "Patril", "Perun", "Pjatril", "Radul", "Raswedj", "Respo", "Rogoff", "Rurtin", "Sajud", "Samjon", "Sergej", "Sildrojan", "Swantew", "Swiat", "Tassil", "Tatjan", "Teskisch", "Thundjar", "Tuljew", "Upraw", "Uriel", "Watelno", "Wlad", "Zanisch"],
    family: ["Abrinken", "Aljeff", "Arlin", "Arrastin", "Attranzig", "Bagoltin", "Bartineff", "Barvedis", "Bilenzig", "Bolscheff", "Burtinen", "Butanjeff", "Chadjeff", "Choprutin", "Daginen", "Dagoneff", "Dallentin", "Daprusek", "Dimrinen", "Dogeljeff", "Dubej", "Dukatajeff", "Elin", "Emaneff", "Erginen", "Etajeff", "Eugoltin", "Fagjeff", "Fantinen", "Ferjeff", "Filajeff", "Firnin", "Fogil", "Fogujeff", "Frantischeff", "Fruginen", "Gamajeff", "Garkinen", "Gerjeleff", "Gertainig", "Gorening", "Hardering", "Helajeff", "Horminen", "Hurlemaneff", "Ibrajeff", "Ijineff", "Imonin", "Irgjeloff", "Itolojeff", "Janeff", "Janig", "Jantareff", "Jeninen", "Jikajeff", "Jonkjeff", "Jurgavist", "Jataneff", "Kereling", "Koranzig", "Kowalejeff", "Lenejeff", "Linerajeff", "Loranin", "Lugoltin", "Mandragjeff", "Marginen", "Mogoljeff", "Nogil", "Nurkajeff", "Olscheff", "Otaninen", "Porgajeff", "Ragaschoff", "Reschgin", "Sewerin", "Sievening", "Surjeloff", "Tsirkevist", "Tureljeff", "Ugradin", "Walsajew", "Wodjadeff"],
    epithets: ["Fuchsschlau", "Silberzunge", "Vielgereist", "Warenkundig", "Weitfahrer"]
  },
  nostria: {
    style: "regional",
    doubleFirst: true,
    female: ["Brealetha", "Caristhea", "Delusia", "Elida", "Elysmine", "Elysthea", "Firunette", "Franiane", "Helasine", "Ingvaline", "Islavia", "Jelspeth", "Jolantha", "Kasmyra", "Linai", "Lynia", "Noraletha", "Nostriane", "Ronaya", "Satuwina", "Selma", "Senebiane", "Thalania", "Tommeliane", "Triumfina", "Urmeline", "Yasmina", "Zanya"],
    male: ["Alrik", "Berynn", "Brendan", "Carolan", "Darian", "Eolan", "Firunian", "Hjalwin", "Ingval", "Jolan", "Kasimir", "Lynar", "Nostrian", "Rondrian", "Saldor", "Tommel", "Travin", "Wendel", "Ywain"],
    family: ["Andrafall", "Bärenklamm", "Eichental", "Fischersfarn", "Ingvalsruh", "Lindholz", "Nostria", "Salzareth", "Sevenwind", "Tommelstein", "Waldborn", "Wellenbruch"],
    noble: ["von Andrafall", "von Salza", "von Sappenstiel", "von Sevenwind", "von Tommelsfurt", "von Thurana"],
    origins: ["aus Nostria", "aus Salza", "aus Salzerhaven", "vom Tommel", "vom Ingval", "von der Siebenwindküste"]
  },
  schattenlande: {
    style: "regional",
    female: ["Alrike", "Azaril", "Boroniane", "Daria", "Dimiona", "Elvena", "Hesindiane", "Irmina", "Kordula", "Lugina", "Marbide", "Nagra", "Perainiane", "Rondriga", "Sefira", "Tsaiane", "Yasinthe"],
    male: ["Alrik", "Boronin", "Darian", "Eslam", "Firunian", "Geron", "Herdan", "Korobar", "Lucardus", "Marbidan", "Nagrach", "Praiodan", "Rondrigan", "Silem", "Travin", "Wulf"],
    family: ["Aschenfeld", "Bleichanger", "Dunkelwald", "Finsterkamm", "Graustein", "Knochenbruch", "Nebelfeld", "Rabenflug", "Schwarzquell", "Totenmoor"],
    noble: ["von Aschenfeld", "von Darpat", "von Mendena", "von Warunk", "von Yol-Ghurmak"],
    origins: ["aus Mendena", "aus Transysilien", "aus Warunk", "aus Yol-Ghurmak", "vom Darpat"]
  },
  selem: {
    style: "regional",
    female: ["Amazeroth", "Balatravis", "Chanya", "Dschamira", "Elida", "Fermina", "Hesinde", "Khemeda", "Lamea", "Madayana", "Nerissa", "Perhita", "Rahjina", "Sefira", "Thalusa", "Yasmina"],
    male: ["Abu", "Alrik", "Boromeo", "Chalid", "Dschelef", "Eslam", "Hamar", "Koromar", "Mherwed", "Nasreddin", "Rashid", "Salim", "Selo", "Tarik", "Umar", "Zurbaran"],
    family: ["al'Selem", "Dschadir", "Echsenblut", "Khemed", "Maraskan", "Mhanadi", "Rashdul", "Szinto", "Thalusim", "Yasamir"],
    noble: ["al'Selem", "von Hot-Alem", "vom Szintofluss", "zu Khemed"],
    origins: ["aus Selem", "aus Hot-Alem", "aus den Sümpfen", "vom Szintofluss"]
  },
  suedmeer_bukanier: {
    style: "pirate",
    female: ["Alina", "Beka", "Calissa", "Daria", "Esmeralda", "Fiona", "Hila", "Jana", "Kari", "Lina", "Marita", "Nera", "Phexa", "Rika", "Sela", "Tara", "Yala"],
    male: ["Alrik", "Brabak", "Corvo", "Dario", "Efferdo", "Fero", "Goncho", "Hakon", "Jago", "Kari", "Lucio", "Marlo", "Nemo", "Ramon", "Sandro", "Tito", "Vito"],
    epithetStarts: ["Abtakel-", "Brabacuda-", "Einaugen-", "Goldzahn-", "Hakenhand-", "Kielwasser-", "Muränen-", "Planken-", "Rum-", "Säbel-", "Wogen-"],
    titles: ["Geißel des Südmeers", "Schrecken von Charypso", "Fluch der Waldinseln", "Herrschaft über die Planken", "Sturm der Zyklopensee"]
  },
  svellttal: {
    style: "svellttal",
    female: ["Aila", "Beka", "Dara", "Eila", "Fira", "Gesa", "Hela", "Ira", "Jana", "Kaja", "Lina", "Mara", "Nira", "Ola", "Rika", "Sela", "Tara", "Yara"],
    male: ["Al", "Bren", "Derk", "Eil", "Firn", "Gern", "Hark", "Ing", "Jost", "Korr", "Linn", "Mik", "Norb", "Ork", "Rik", "Sten", "Tarn", "Wulf"],
    epithetStarts: ["Bären-", "Blut-", "Eisen-", "Falken-", "Gold-", "Klingen-", "Ork-", "Raben-", "Silber-", "Svellt-", "Wolfs-"]
  },
  thalusien: {
    style: "thalusien",
    female: ["Aischa", "Azila", "Bastrabun", "Djamilla", "Elif", "Farah", "Hamide", "Jasmina", "Khelbara", "Laila", "Maha", "Nedime", "Perhija", "Rahjana", "Samira", "Shanja", "Tulamina", "Yasmina", "Zuleycha"],
    male: ["Abbas", "Chalid", "Dschelef", "Eslam", "Faruk", "Hamar", "Jamil", "Kasim", "Mharbal", "Nadim", "Omar", "Rashid", "Selim", "Tarik", "Umar", "Yussuf"],
    family: ["al'Chaluk", "al'Kebir", "al'Mhanad", "al'Rashdul", "al'Thalus", "ben Beshir", "Khunchomer", "Mhanadistani", "Rashduler", "Thalusim"],
    honorifics: ["al'Ankhra", "abu'l Hikma", "Bint el'Leila", "el'Mahir", "Khadim al'Rahja", "Sahib al'Saif"]
  },
  trollzacker: {
    style: "tribal",
    female: ["Achteshta", "Amadhcha", "Ash'mudran", "Dachta'al'zul", "Grima", "Iffri'macha", "Kcharra", "Kchodima", "Khordha", "Lahl'a", "Makatta", "Manlochla", "Marchune", "Moqtah", "Perchi", "R'Hana", "Rôhaschta", "Rôhila", "Shochzila", "Shulmacha", "Tash'ahra", "Ter'acha", "Uchazu", "Zerta'zul", "Zul'artun", "Zul'rachta"],
    male: ["Arzuch", "Bragd", "Dagrim", "Drasch", "Ghrak", "Hord", "Kcharr", "Khoram", "Marn", "Mordai", "Rascht", "Rochan", "Sharak", "Tarr", "Uchram", "Zulgar"],
    clans: ["Ahnensucher", "Bärenhäute", "Felsenblüter", "Knochenbrecher", "Raschtulskinder", "Steinwölfe", "Sturmhauer", "Zackenträger"],
    epithets: ["Bärenfaust", "Blutstein", "Felsenbrecher", "Knochenzahn", "Raschtulszorn", "Sturmherz"]
  },
  waldmenschen: {
    style: "tribal",
    female: waldmenschenNames,
    male: waldmenschenNames,
    clans: ["Anhepa-Ha", "Anoiha", "Chirakah", "Darna", "Ganaq-Si", "Haipu", "Keke-Wanaq", "Lupamnu-Wanaq", "Miniwatu", "Mohaha", "Mumbana", "Napewanha", "Nimu-Wanaq", "Oijanih", "Panaq-Si", "Para-Pek-Tapam", "Piri-Scho", "Potuwa", "Rakwacan", "Rutini", "Schela-Nipam", "Tinzameha", "Tocamuyac", "Tschopukikuha", "Yakosh-Dey"],
    epithets: ["Blütenhüter", "Dschungelläufer", "Jaguarblick", "Regenrufer", "Sonnenkind", "Waldherz"]
  },
  utulu: {
    style: "tribal",
    female: utuluNames,
    male: utuluNames,
    clans: ["Angwasi", "Bewange", "Bujonapi-Hu", "Ibonkosi", "Kwahabunga", "Mawambe", "Ongbasi", "Rololo", "Ruwangi", "Sagambu", "Shokubunga", "Tepebe-Ha", "Tscholuq", "Vodunga", "Yoru-He", "Zamango"],
    epithets: ["Feuerauge", "Meereskind", "Palmenläufer", "Sonnenherz", "Wellenrufer", "Windtänzer"]
  },
  zahori: {
    style: "tribal",
    female: ["Avaris", "Bisfira", "Caleya", "Daya", "Esfera", "Esmeralda", "Fara", "Farishal", "Gushim", "Hasfira", "Ippolita", "Jadira", "Korima", "Layana", "Madalena", "Madalya", "Madayana", "Morona", "Nuerta", "Oya", "Phelica", "Pherica", "Pirana", "Qitana", "Rahjessa", "Raistfa", "Shayla", "Ta'ira", "Tsaverra", "Uviala", "Verrugia", "Virashida", "Xafal", "Yala'say", "Zaella", "Zafira", "Zalina", "Zarpa", "Ziqati"],
    male: ["Ayano", "Bahilo", "Boronardo", "Burso", "Carryo", "Diego", "Diluvio", "Ehin", "Fahi", "Garroti", "Hanshi", "Hartiss", "Ippolito", "Jamin", "Ka'hashan", "Lumiro", "Madajuelo", "Nadir", "Oatir", "Pashkir", "Phedorigo", "Phedro", "Qamal", "Rahjacomo", "Rahjaele", "Rahyad", "Ramon", "Rastafan", "Razin", "Serpet", "Shafiro", "Ta'ir", "Tsafiro", "Uovolo", "Vadiro", "Verrugito", "Xamal", "Ysfadir", "Zaelo", "Zarrigo", "Zavero"],
    clans: ["Alfahan", "Alhamar", "Cruento", "Danzaro", "Espadín", "Facundía", "Nevasca", "Pelagatos", "Qantarah", "Sfaraldo", "Silfide", "Soleado", "Vaharada", "Ventarha", "Zhulhamor", "Zurriaga"],
    epithets: ["Feuerblick", "Lachender Wind", "Rahjas Gunst", "Silberzunge", "Sternentänzer", "Weitgereist"]
  },
  zyklopeninseln: {
    style: "zyklopen",
    female: ["Aglaya", "Aldara", "Alrike", "Apogea", "Arakne", "Aurike", "Avesinna", "Belenike", "Boronike", "Borothea", "Chysalis", "Efferdiana", "Garafania", "Harika", "Ingerydike", "Insina", "Iokaste", "Iolanthe", "Korina", "Kyklania", "Lanike", "Leonore", "Liaiella", "Menkirdes", "Mira", "Myrtale", "Nautika", "Nemekathe", "Nermaka", "Odenia", "Peraina", "Phaylionya", "Phylinna", "Phyllis", "Pra'iope", "Rahjanidis", "Rahjamandra", "Rondrike", "Sape'idra", "Telemache", "Thalassandra", "Tsaedra", "Tsaladne", "Xelena", "Yppodamea", "Zoira", "Zyraste"],
    male: ["Aisyphan", "Alrikos", "Amenelaos", "Andrios", "Avasios", "Avessander", "Belemanias", "Berytos", "Chysos", "Dariyon", "Dirimethos", "Efferda'ios", "Horakles", "Ingerydos", "Kalchas", "Karyd'ios", "Kykeon", "Kyklanos", "Mada'ion", "Meneander", "Mermydion", "Mironos", "Odenios", "Okeandros", "Peleiston", "Pelmides", "Peraistos", "Pra'iokles", "Pydihon", "Rahjenysios", "Rahjoros", "Rondragoras", "Rondrakles", "Seneb", "Sidor", "Stoellios", "Thalanios", "Thyndarios", "Tykates", "Tyndareos", "Xeledonios", "Ximater", "Yidayion", "Zephyros", "Zesrad"],
    family: ["Amranthis", "Antonomos", "Armedos", "Atholios", "Beunerys", "Bupheistos", "Bythrios", "Calakis", "Chyrikos", "Daneios", "Darostis", "Doriandros", "Dorikeikos", "Egorythios", "Ertholis", "Garothis", "Gaumanthis", "Grapheios", "Gryphilos", "Hethmanios", "Kenkaukis", "Kolemaistos", "Kyrkandros", "Laikis", "Lorkis", "Lythalis", "Memnathis", "Merogios", "Moilusios", "Myiabulos", "Naumachis", "Nestriotis", "Olemanios", "Ozyreios", "Phyrikos", "Praiopoulos", "Pydoktis", "Sphareios", "Sphyritis", "Stygmalion", "Styrnikos", "Tantalias", "Thorgantas", "Tymemdios", "Tyrakis", "Ulyios", "Xanthalias", "Ykladis", "Zaturias"],
    origins: ["Akidos", "Arkis", "Baltrea", "Dubar", "Heliopolos", "Hylailos", "Hylpia", "Kethas Kethenis", "Kutaki", "Lardos", "Mylamas", "Pailos", "Phenos", "Phrygaios", "Putras", "Tenos", "Teremon", "Tyllos", "Tyrakis"],
    noble: ["Aleïstos", "Aralthis", "Cosseïra", "Garen", "Lyios", "Thaliyin", "Uyos"]
  }
});
