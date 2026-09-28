const humanData = window.AVENTURIAN_NAME_DATA;
const speciesData = window.AVENTURIAN_SPECIES_DATA;
const profileData = window.AVENTURIAN_PROFILE_DATA;

if (window.self !== window.top) document.body.classList.add("is-embedded");

const speciesSelect = document.querySelector("#species");
const variantSelect = document.querySelector("#variant");
const variantLabel = document.querySelector("#variant-label");
const genderInputs = [...document.querySelectorAll('input[name="gender"]')];
const genderFieldset = genderInputs[0].closest("fieldset");
const statusSelect = document.querySelector("#status");
const generatedName = document.querySelector("#generated-name");
const generatedMeta = document.querySelector("#generated-meta");
const constructionNote = document.querySelector("#construction-note");
const ruleTitle = document.querySelector("#rule-title");
const ruleDescription = document.querySelector("#rule-description");
const profileAppearance = document.querySelector("#profile-appearance");
const profileTrait = document.querySelector("#profile-trait");
const profileSpecial = document.querySelector("#profile-special");
const toast = document.querySelector(".toast");

const statusLabels = {
  simple: "einfache Namensform",
  respected: "ausführliche Namensform",
  upper: "herausgehobene Namensform"
};

const speciesRules = {
  human: {
    andergast: {
      simple: "Einfache Leute führen oft keinen festen Familiennamen. Stattdessen verweist der Name auf Herkunftsort, Hof oder Landschaft.",
      respected: "Freibauern und Stadtbewohner tragen meist einen Familiennamen.",
      upper: "Für die Oberschicht wird ein klangvoller Adelsname mit einem vorangestellten „von“ verwendet."
    },
    thorwal: {
      simple: "Der zweite Namensteil verweist auf Mutter oder Vater. Frauen erhalten die Endung -dottir, Männer die Endung -son.",
      respected: "Zum Elternnamen tritt die Zugehörigkeit zu einer Ottajasko, einer Dorf- oder Schiffsgemeinschaft.",
      upper: "Thorwal kennt keinen Adel nach mittelreichischem Vorbild. Eine herausgehobene Person trägt einen Ehrennamen und nennt ihre Ottajasko."
    },
    mittelreich: {
      simple: "Im Mittelreich sind ein Vorname mit einfachem Familiennamen oder eine Herkunftsbezeichnung die verbreitetste Form.",
      respected: "Angesehene Bürgerinnen und Bürger führen gewöhnlich einen festen Familiennamen.",
      upper: "Der Adel verwendet häufig klangvolle Vornamen und einen mit „von“ verbundenen Haus- oder Lehensnamen."
    },
    horasreich: {
      simple: "Selbst einfache Leute im Horasreich tragen häufig zwei wohlklingende Vornamen und einen Familiennamen.",
      respected: "Bürgerliche Familien schmücken ihren Namen gern mit Zusätzen wie da, de, di, della oder ter.",
      upper: "Bei Adel und Gelehrten treten lange Vornamensfolgen sowie traditionelle Prädikate und Familiennamen besonders häufig auf."
    },
    tulamiden: {
      simple: "Tulamiden nennen nach dem Vornamen meist den Vater: Männer mit „ibn“, Frauen mit „saba“ oder einer Endung wie -sunni beziehungsweise -sunya.",
      respected: "Gelehrte und Zauberkundige können zusätzlich ihre Lehrmeisterin oder ihren Lehrmeister mit „sdla“ beziehungsweise „sal“ nennen; Familiennamen sind selten.",
      upper: "Eine herausgehobene Person kann einen Ehrennamen mit al', el', abu'l, bint el' oder umm el' führen."
    },
    kalifat: {
      simple: "Novadis verwenden für Söhne gewöhnlich „ben“ statt „ibn“. Töchter führen meist einen Vaternamen; bei einem nicht rastullahgläubigen Vater kann der Muttername mit „bint el'“ erscheinen.",
      respected: "Zu Abstammungsnamen können Lehrmeister- oder seltene Familiennamen treten.",
      upper: "Ein Ehrenname hebt Rang, Ruf oder eine besondere Eigenschaft hervor und ergänzt die novadische Abstammungsform."
    },
    brabaci: {
      simple: "Im tiefen Süden sind ein oder mehrere klangvolle Vornamen üblich. Unfreie Menschen führen häufig keinen Familiennamen.",
      respected: "Freie führen einen Familiennamen; mehrere Vornamen und neu angenommene Namen sind verbreitet.",
      upper: "Macht und Wohlstand zeigen sich in langen Namen, Prädikaten und den Namen bedeutender Grandenfamilien."
    },
    aranien: {
      simple: "Aranische Männer führen meist den Vater mit „ibn“, Frauen die Mutter mit „saba“ oder einer Endung wie -sunni beziehungsweise -sunya an.",
      respected: "Neben dem Elternnamen kommen alte Sippennamen und vom Herkunftsort abgeleitete Familiennamen vor.",
      upper: "Adelsnamen werden je nach Familientradition mit „von“, „ay“ oder „ai“ verbunden."
    },
    regional: {
      simple: "Die einfache Namensform verwendet einen regionalen Vornamen mit Herkunft, Ruf- oder Familiennamen.",
      respected: "Angesehene Personen führen gewöhnlich einen festen Familiennamen oder einen bekannten Beinamen.",
      upper: "Für die Oberschicht wird ein regionaler Haus-, Adels- oder Würdenname verwendet."
    },
    ferkina: {
      simple: "Ferkina führen einen Vaternamen: Männer mit „iban“, Frauen mit „sabu“.",
      respected: "Zusätzlich wird häufig der Name des Stammes genannt.",
      upper: "Eine herausgehobene Person verbindet Abstammung, Stammeszugehörigkeit und einen Ehrennamen."
    },
    fjarninger: {
      simple: "Fjarninger kennen keine Familiennamen und führen meist nur ihren Vornamen.",
      respected: "Ein verdienter Ehrenname beschreibt Tat, Wesen oder besondere Stärke.",
      upper: "Bedeutende Fjarninger nennen Ehrennamen und die Zugehörigkeit zu ihren Leuten."
    },
    gjalsker: {
      simple: "Männer nennen ihren Vater mit „bren“, Frauen ihre Mutter mit „brai“.",
      respected: "Zur Abstammung tritt der Name des Haerads beziehungsweise der Sippe.",
      upper: "Sieger der Kraftspiele dürfen den Ehrentitel „Gon“ vor ihrem Namen führen."
    },
    tribal: {
      simple: "Im Alltag genügt häufig der Vorname oder Rufname.",
      respected: "Bei einer förmlichen Vorstellung wird die Sippe oder der Stamm ergänzt.",
      upper: "Eine bedeutende Person führt zusätzlich einen verdienten Ehren- oder Beinamen."
    },
    norbarden: {
      simple: "Norbarden führen zu ihrem Vornamen stets den gemeinsamen Namen ihrer Meschpoke.",
      respected: "Der Sippenname macht die Zugehörigkeit zur von einer Muhme geführten Gemeinschaft sichtbar.",
      upper: "Auch einflussreiche Norbarden behalten die Sippenform bei; ein zusätzlicher Beiname kann den Ruf hervorheben."
    },
    kemi: {
      simple: "In Kemi wird der Heimatort häufig mit „Ni“ an den Vornamen angehängt.",
      respected: "Einige alte Familien führen feste Namen; daneben bestehen südaventurische Mischformen.",
      upper: "Kemi kennt keinen klassischen Adel. Einflussreiche Personen tragen alte Familien- oder Herkunftsnamen."
    },
    maraskan: {
      simple: "Maraskaner nennen meist den Herkunftsort anstelle eines Familiennamens.",
      respected: "Ein wandelbarer Beiname kann Herkunft, Eigenart oder eine Lebensgeschichte beschreiben.",
      upper: "Auch angesehene Maraskaner bevorzugen Herkunft und sprechende Beinamen gegenüber klassischen Adelstiteln."
    },
    pirate: {
      simple: "Im Südmeer genügt oft ein einzelner Vorname oder Rufname.",
      respected: "Piraten und Bukanier führen markante Beinamen, die Aussehen, Schiff oder Taten beschreiben.",
      upper: "Berüchtigte Kapitäninnen und Kapitäne schmücken sich mit einem eindrucksvollen Titel."
    },
    svellttal: {
      simple: "Im Svellttal werden Namen häufig auf ein oder zwei Silben verkürzt.",
      respected: "Ein auffälliger Beiname wird dem kurzen Rufnamen vorangestellt.",
      upper: "Bekannte Persönlichkeiten führen besonders einprägsame, oft aus Taten oder Aussehen gebildete Beinamen."
    },
    thalusien: {
      simple: "Thalusier verwenden Vaternamen mit „ibn“ oder „ben“ und Mutternamen mit „saba“ oder einer entsprechenden Endung.",
      respected: "Ein Familien- oder Herkunftsname kann die Abstammungsform ergänzen.",
      upper: "Tulamidische Ehrennamen und Titel sind bei Wohlhabenden und Mächtigen verbreitet."
    },
    zyklopen: {
      simple: "Zyklopäer führen einen Familiennamen oder nennen ihren Heimatort mit einem vorangestellten „a“.",
      respected: "Gelehrte und Akademieabsolventen verbinden Herkunftsnamen mit „dyll“ oder „dylli“.",
      upper: "Der Adel verwendet aufwendige Vornamen und apostrophierte Haus- oder Ortsnamen."
    }
  },
  achaz: "Achaznamen unterscheiden nicht nach Geschlecht. Ein zusätzlicher Herkunfts- oder Gelegenamen kann genannt werden, ist aber kein Familienname.",
  elf: "Elfen führen üblicherweise einen melodischen Vornamen und einen Zweitnamen, der Sippe, Wesen oder Taten beschreibt.",
  goblin: "Stammesgoblins führen meist einen Vornamen; Verdiente erhalten einen Beinamen und nennen außerhalb ihrer Sippe auch ihre Gemeinschaft. Städtische Goblins verwenden häufig einen Familiennamen.",
  grolm: "Ein dienender Grolm stellt Namen und Funktion seines Auftraggebers vor den eigenen Namen. Mächtige oder unabhängige Grolme führen oft nur den eigenen Namen.",
  ogre: "Oger führen meist nur einen Rufnamen. Viele Namen beschreiben eine auffällige Eigenschaft oder stammen aus dem Umfeld von Orks und Menschen.",
  ork: "Orks führen gewöhnlich einen Vornamen. Ehrennamen und die Nennung von Sippe oder Stamm müssen durch Taten verdient werden.",
  troll: "Trolle verbinden ihren Vornamen mit dem Namen eines Ahnen. Sippe, Stamm und Beiname können den Namen einer bedeutenden Person erweitern.",
  dwarf: "Zwerge verbinden ihren Vornamen traditionell mit einem Vater- oder Mutternamen. Tiefzwerge haben diese Tradition weitgehend verloren."
};

const selectedGender = () => genderInputs.find((input) => input.checked)?.value || "female";
const randomIndex = (length) => {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }
  return Math.floor(Math.random() * length);
};
const pick = (entries) => entries[randomIndex(entries.length)];
const possessive = (name) => /[sxzß]$/i.test(name) ? name : `${name}s`;
const prefixedNoble = (name) => /^(vom|von |zu |zur |de |di |da |d'|ay |ai |dyll|a')/i.test(name) ? name : `von ${name}`;

const buildHumanName = (variant, gender, status) => {
  const region = humanData[variant];
  const first = pick(region[gender]);
  if (variant === "andergast") {
    if (status === "simple") return { name: `${first} ${pick(region.origins)}`, construction: "Vorname + Herkunftsbezeichnung" };
    if (status === "upper") return { name: `${first} von ${pick(region.noble)}`, construction: "Vorname + Adelsname" };
    return { name: `${first} ${pick(region.family)}`, construction: "Vorname + Familienname" };
  }
  if (variant === "thorwal") {
    const parentGender = randomIndex(2) ? "female" : "male";
    const parent = possessive(pick(region[parentGender]));
    const familyName = `${parent}${gender === "female" ? "dottir" : "son"}`;
    if (status === "simple") return { name: `${first} ${familyName}`, construction: "Vorname + Elternname" };
    const community = `von der ${pick(region.ottajasko)}-Ottajasko`;
    if (status === "upper") {
      const epithet = pick(gender === "female" ? region.femaleEpithets : region.maleEpithets);
      return { name: `${first} „${epithet}“ ${familyName} ${community}`, construction: "Vorname + Ehrenname + Elternname + Ottajasko" };
    }
    return { name: `${first} ${familyName} ${community}`, construction: "Vorname + Elternname + Ottajasko" };
  }
  if (region.style === "albernia") {
    if (status === "simple" && region.origins?.length && randomIndex(2) === 0) return { name: `${first} ${pick(region.origins)}`, construction: "Vorname + Herkunftsbezeichnung" };
    if (status === "upper") return { name: `${first} ${gender === "female" ? "ni" : "ui"} ${pick(region.noble)}`, construction: "Vorname + albernischer Hausname" };
    return { name: `${first} ${pick(region.family)}`, construction: "Vorname + Familienname" };
  }
  if (region.style === "almada") {
    let second = pick(region[gender]);
    if (second === first) second = pick(region[gender]);
    if (status === "simple") return { name: `${first} ${second} ${pick(region.family)}`, construction: "zwei Vornamen + Familienname" };
    if (status === "respected") return { name: `${first} ${second} ${pick(region.prefixes)} ${pick(region.family)}`, construction: "zwei Vornamen + Namensprädikat" };
    return { name: `${first} ${second} ${pick(region.noble)}`, construction: "zwei Vornamen + Adelsname" };
  }
  if (region.style === "mittelreich") {
    if (status === "simple" && randomIndex(2) === 0) return { name: `${first} ${pick(region.origins)}`, construction: "Vorname + Herkunftsbezeichnung" };
    if (status === "upper") {
      const second = pick(region[gender]);
      const noble = pick(region.noble);
      const predicate = /^(vom|von |zu |zur )/i.test(noble) ? noble : `von ${noble}`;
      return { name: `${first} ${second} ${predicate}`, construction: "zwei Vornamen + Adelsname" };
    }
    const family = pick(region.family);
    if (region.clans?.length && status === "respected" && randomIndex(3) === 0) return { name: `${first} ${family} aus ${pick(region.clans)}s Sippe`, construction: "Vorname + Familie + Windhager Sippe" };
    return { name: `${first} ${family}`, construction: "Vorname + Familienname" };
  }
  if (variant === "horasreich") {
    let second = pick(region[gender]);
    if (second === first) second = pick(region[gender]);
    if (status === "simple") return { name: `${first} ${second} ${pick(region.family)}`, construction: "zwei Vornamen + Familienname" };
    if (status === "respected") return { name: `${first} ${second} ${pick(region.prefixes)} ${pick(region.family)}`, construction: "zwei Vornamen + bürgerliches Namensprädikat" };
    return { name: `${first} ${second} ${pick(region.noble)}`, construction: "zwei Vornamen + gehobener Familienname" };
  }
  if (region.style === "tulamiden" || region.style === "kalifat") {
    const parent = pick(region.male);
    let ancestry;
    if (gender === "male") ancestry = `${region.style === "kalifat" ? "ben" : "ibn"} ${parent}`;
    else if (region.style === "kalifat" && randomIndex(5) === 0) ancestry = `bint el'${pick(region.female)}`;
    else if (randomIndex(2) === 0) ancestry = `saba ${parent}`;
    else ancestry = `${parent}${randomIndex(2) === 0 ? "sunni" : "sunya"}`;
    if (status === "simple") return { name: `${first} ${ancestry}`, construction: "Vorname + Abstammungsname" };
    if (status === "respected") {
      if (randomIndex(2) === 0) return { name: `${first} ${ancestry} ${gender === "female" ? "sdla" : "sal"} ${pick(region.male)}`, construction: "Vorname + Abstammung + Lehrmeistername" };
      return { name: `${first} ${ancestry} ${pick(region.families)}`, construction: "Vorname + Abstammung + seltener Familienname" };
    }
    return { name: `${first} ${pick(region.honorifics)} ${ancestry}`, construction: "Vorname + Ehrenname + Abstammung" };
  }
  if (region.style === "brabaci") {
    let second = pick(region[gender]);
    if (second === first) second = pick(region[gender]);
    if (status === "simple") return { name: randomIndex(2) ? first : `${first} ${second}`, construction: "ein oder zwei Vornamen" };
    if (status === "respected") return { name: `${first} ${second} ${pick(region.family)}`, construction: "zwei Vornamen + Familienname" };
    return { name: `${first} ${second} ${pick(region.prefixes)} ${pick(region.noble)}`, construction: "Vornamen + Prädikat + Grandenname" };
  }
  if (region.style === "aranien") {
    const parent = pick(region[gender === "female" ? "female" : "male"]);
    const ancestry = gender === "male"
      ? `ibn ${parent}`
      : randomIndex(2) ? `saba ${parent}` : `${parent}${randomIndex(2) ? "sunni" : "sunya"}`;
    if (status === "simple") return { name: `${first} ${ancestry}`, construction: "Vorname + Elternname" };
    if (status === "respected") return { name: `${first} ${ancestry} ${pick(region.family)}`, construction: "Vorname + Elternname + Sippenname" };
    return { name: `${first} ${ancestry} ${pick(region.predicates)} ${pick(region.noble)}`, construction: "Vorname + Elternname + Adelsname" };
  }
  if (region.style === "ferkina") {
    const parent = pick(region.male);
    const ancestry = `${gender === "female" ? "sabu" : "iban"} ${parent}`;
    if (status === "simple") return { name: `${first} ${ancestry}`, construction: "Vorname + Vatername" };
    if (status === "respected") return { name: `${first} ${ancestry}, ${pick(region.clans)}`, construction: "Vorname + Vatername + Stamm" };
    return { name: `${first} ${pick(region.epithets)} ${ancestry}, ${pick(region.clans)}`, construction: "Vorname + Ehrenname + Vatername + Stamm" };
  }
  if (region.style === "fjarninger") {
    if (status === "simple") return { name: first, construction: "Vorname" };
    const epithet = pick(region.epithets);
    if (status === "respected") return { name: `${first} ${epithet}`, construction: "Vorname + Ehrenname" };
    return { name: `${first} ${epithet} von den ${pick(region.clans)}`, construction: "Vorname + Ehrenname + Stammeszugehörigkeit" };
  }
  if (region.style === "gjalsker") {
    const parent = pick(region[gender]);
    const ancestry = `${gender === "female" ? "brai" : "bren"} ${parent}`;
    if (status === "simple") return { name: `${first} ${ancestry}`, construction: "Vorname + Elternname" };
    const clan = `vom Haerad der ${pick(region.clans)}`;
    if (status === "respected") return { name: `${first} ${ancestry} ${clan}`, construction: "Vorname + Elternname + Sippe" };
    return { name: `Gon ${first} ${ancestry} ${clan}`, construction: "Ehrentitel + Vorname + Elternname + Sippe" };
  }
  if (region.style === "nivesen") {
    if (status === "simple") return { name: first, construction: "Vorname" };
    const clan = `von den ${pick(region.clans)}`;
    if (status === "respected") return { name: `${first} ${clan}`, construction: "Vorname + Sippe oder Stamm" };
    return { name: `${first} „${pick(region.epithets)}“ ${clan}`, construction: "Vorname + Ehrenname + Stamm" };
  }
  if (region.style === "norbarden") {
    const family = pick(region.family);
    if (status === "simple") return { name: `${first} ${family}`, construction: "Vorname + Meschpokenname" };
    if (status === "respected") return { name: `${first} ${family}`, construction: "Vorname + Meschpokenname" };
    return { name: `${first} „${pick(region.epithets)}“ ${family}`, construction: "Vorname + Beiname + Meschpokenname" };
  }
  if (region.style === "kemi") {
    if (status === "simple") return { name: `${first} Ni ${pick(region.origins)}`, construction: "Vorname + Herkunftsort" };
    if (status === "respected") return { name: `${first} ${pick(region.family)}`, construction: "Vorname + alter Familienname" };
    return { name: `${first} ${pick(region.family)} Ni ${pick(region.origins)}`, construction: "Vorname + Familie + Herkunftsort" };
  }
  if (region.style === "maraskan") {
    if (status === "simple") return { name: `${first} von ${pick(region.origins)}`, construction: "Vorname + Herkunftsort" };
    const epithet = pick(region[gender === "female" ? "femaleEpithets" : "maleEpithets"]);
    if (status === "respected") return { name: `${first} ${epithet}`, construction: "Vorname + sprechender Beiname" };
    return { name: `${first} von ${pick(region.origins)}, ${epithet}`, construction: "Vorname + Herkunft + Beiname" };
  }
  if (region.style === "pirate") {
    if (status === "simple") return { name: first, construction: "Rufname" };
    const epithet = `${pick(region.epithetStarts)}${first}`;
    if (status === "respected") return { name: epithet, construction: "Piratenbeiname + Rufname" };
    return { name: `${epithet}, ${pick(region.titles)}`, construction: "Piratenbeiname + Titel" };
  }
  if (region.style === "svellttal") {
    if (status === "simple") return { name: first, construction: "kurzer Rufname" };
    const byname = `${pick(region.epithetStarts)}${first}`;
    return { name: status === "upper" ? `${byname} vom Svellt` : byname, construction: "Beiname + Rufname" };
  }
  if (region.style === "thalusien") {
    const parent = pick(region.male);
    const ancestry = gender === "female"
      ? randomIndex(2) ? `saba ${parent}` : `${parent}${randomIndex(2) ? "sunni" : "sunya"}`
      : `${randomIndex(2) ? "ibn" : "ben"} ${parent}`;
    if (status === "simple") return { name: `${first} ${ancestry}`, construction: "Vorname + Elternname" };
    if (status === "respected") return { name: `${first} ${ancestry} ${pick(region.family)}`, construction: "Vorname + Elternname + Familienname" };
    return { name: `${first} ${pick(region.honorifics)} ${ancestry}`, construction: "Vorname + Ehrenname + Elternname" };
  }
  if (region.style === "tribal") {
    if (status === "simple") return { name: first, construction: "Vorname oder Rufname" };
    const clan = pick(region.clans);
    if (status === "respected") return { name: `${first} vom Stamm der ${clan}`, construction: "Vorname + Stamm oder Sippe" };
    return { name: `${first} „${pick(region.epithets)}“ vom Stamm der ${clan}`, construction: "Vorname + Ehrenname + Stamm" };
  }
  if (region.style === "zyklopen") {
    if (status === "simple") return randomIndex(2)
      ? { name: `${first} ${pick(region.family)}`, construction: "Vorname + Familienname" }
      : { name: `${first} a ${pick(region.origins)}`, construction: "Vorname + Heimatort" };
    const origin = pick(status === "upper" ? region.noble : region.origins);
    const predicate = /^[aeiouäöüy]/i.test(origin) ? "dyll" : "dylli";
    if (status === "respected") return { name: `${first} ${predicate} ${origin}`, construction: "Vorname + gelehrter Herkunftsname" };
    return { name: `${first} A'${origin} ${predicate} ${pick(region.origins)}`, construction: "Vorname + Adelsname + Herkunft" };
  }
  if (region.style === "regional") {
    if (status === "simple" && region.origins?.length && randomIndex(2) === 0) return { name: `${first} ${pick(region.origins)}`, construction: "Vorname + Herkunftsbezeichnung" };
    if (status === "upper" && region.noble?.length) {
      const second = region.doubleFirst ? ` ${pick(region[gender])}` : "";
      return { name: `${first}${second} ${prefixedNoble(pick(region.noble))}`, construction: `${region.doubleFirst ? "zwei Vornamen" : "Vorname"} + gehobener Name` };
    }
    if (region.epithets?.length && status === "respected" && randomIndex(3) === 0) return { name: `${first} ${pick(region.epithets)}`, construction: "Vorname + Beiname" };
    return { name: `${first} ${pick(region.family)}`, construction: "Vorname + Familienname" };
  }
  return { name: first, construction: "Vorname" };
};

const buildProfile = (species, variantKey, status) => {
  const appearance = `${pick(profileData.age)}, ${pick(profileData.build[species])}; ${pick(profileData.clothing[status])}.`;
  const trait = pick(profileData.traits);
  const contextual = species === "human"
    ? profileData.regionalSpecials[variantKey] || profileData.regionalSpecials[humanData[variantKey]?.style] || []
    : profileData.speciesSpecials[species] || [];
  const special = pick([...profileData.specials, ...contextual, ...contextual]);
  return { appearance, trait, special };
};

const buildSpeciesName = (species, variantKey, gender, status) => {
  if (species === "human") return buildHumanName(variantKey, gender, status);
  const variant = speciesData[species].variants[variantKey];
  const first = pick(variant.unisex || variant[gender] || variant.male || variant.female);

  if (species === "achaz") {
    if (status === "simple") return { name: first, construction: "geschlechtsunabhängiger Vorname" };
    return { name: `${first} aus ${pick(variant.origins)}`, construction: "Vorname + Herkunft oder Gelege" };
  }
  if (species === "elf") return { name: `${first} ${pick(variant.bynames)}`, construction: "Vorname + sprechender Zweitname" };
  if (species === "goblin") {
    if (variantKey === "urban") return { name: `${first} ${pick(variant.surnames)}`, construction: "Vorname + städtischer Familienname" };
    if (status === "simple") return { name: first, construction: "Vorname" };
    const byname = pick(variant.bynames);
    if (status === "upper") return { name: `${first} ${byname} von den ${pick(variant.clans)}`, construction: "Vorname + Beiname + Sippe" };
    return { name: `${first} ${byname}`, construction: "Vorname + verdienter Beiname" };
  }
  if (species === "grolm") {
    if (status === "upper") return { name: first, construction: "eigenständiger Name" };
    const patron = pick([...variant.female, ...variant.male]);
    const role = pick(variant.functions);
    if (status === "simple") return { name: `${possessive(patron)} ${role} ${first}`, construction: "Auftraggeber + Funktion + Vorname" };
    return { name: `${role} ${first}`, construction: "Funktion + Vorname" };
  }
  if (species === "ogre") return { name: first, construction: "Rufname" };
  if (species === "ork") {
    if (status === "simple") return { name: first, construction: "Vorname" };
    const byname = pick(variant.bynames);
    if (status === "upper") return { name: `${first} ${byname} Riak ${pick(variant.clans)}`, construction: "Vorname + Ehrenname + Sippe" };
    return { name: `${first} ${byname}`, construction: "Vorname + Kriegs- oder Ehrenname" };
  }
  if (species === "troll") {
    const parent = pick(variant.male);
    const ancestry = `${gender === "female" ? "Tochter" : "Sohn"} des ${parent}`;
    if (status === "simple") return { name: `${first} ${ancestry}`, construction: "Vorname + Ahnenname" };
    if (status === "upper") return { name: `${first} ${ancestry}, ${pick(variant.bynames)} vom Stamm der ${pick(variant.tribes)}`, construction: "Vorname + Ahne + Beiname + Stamm" };
    return { name: `${first} ${ancestry} von den ${pick(variant.clans)}`, construction: "Vorname + Ahne + Sippe" };
  }
  if (species === "dwarf") {
    if (variantKey === "deep") return { name: first, construction: "Vorname ohne überlieferten Ahnenname" };
    const parent = pick(gender === "female" ? variant.female : variant.male);
    const ancestor = `${gender === "female" ? "groschna" : "groscho"} ${parent}`;
    if (status === "upper" && variant.bynames?.length) return { name: `${first} ${ancestor}, ${pick(variant.bynames)}`, construction: "Vorname + Ahnenname + Beiname" };
    return { name: `${first} ${ancestor}`, construction: "Vorname + Mutter- oder Vatername" };
  }
  return { name: first, construction: "Vorname" };
};

const populateVariants = () => {
  const species = speciesData[speciesSelect.value];
  variantLabel.textContent = species.variantLabel;
  variantSelect.replaceChildren(...Object.entries(species.variants).map(([value, variant]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = variant.label;
    return option;
  }));
  const isUnisex = speciesSelect.value === "achaz";
  genderFieldset.classList.toggle("is-disabled", isUnisex);
  genderInputs.forEach((input) => { input.disabled = isUnisex; });
};

const updateRule = () => {
  const speciesKey = speciesSelect.value;
  const variantKey = variantSelect.value;
  const species = speciesData[speciesKey];
  const variant = species.variants[variantKey];
  ruleTitle.textContent = `${species.label} · ${variant.label}`;
  const ruleKey = variant.rule || variantKey;
  ruleDescription.textContent = speciesKey === "human" ? speciesRules.human[ruleKey][statusSelect.value] : speciesRules[speciesKey];
};

const fitGeneratedName = () => {
  generatedName.style.fontSize = "64px";
  const minSize = 22;
  const maxHeight = 132;
  let size = 64;
  while (size > minSize && (generatedName.scrollHeight > maxHeight || generatedName.scrollWidth > generatedName.clientWidth + 1)) {
    size -= 1;
    generatedName.style.fontSize = `${size}px`;
  }
  generatedName.classList.toggle("is-compact", size < 38);
};

const generate = () => {
  const speciesKey = speciesSelect.value;
  const species = speciesData[speciesKey];
  const variantKey = variantSelect.value;
  const variant = species.variants[variantKey];
  const gender = selectedGender();
  const status = statusSelect.value;
  const result = buildSpeciesName(speciesKey, variantKey, gender, status);
  const profile = buildProfile(speciesKey, variantKey, status);
  generatedName.textContent = result.name;
  const genderLabel = speciesKey === "achaz" ? "geschlechtsunabhängig" : gender === "female" ? "weiblich" : "männlich";
  generatedMeta.textContent = `${species.label} · ${variant.label} · ${genderLabel} · ${statusLabels[status]}`;
  constructionNote.textContent = result.construction;
  profileAppearance.textContent = profile.appearance;
  profileTrait.textContent = profile.trait;
  profileSpecial.textContent = profile.special;
  updateRule();
  requestAnimationFrame(fitGeneratedName);
  generatedName.animate([{ opacity: .2, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 260, easing: "ease-out" });
};

let toastTimer;
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
};

document.querySelector("#generate").addEventListener("click", generate);
document.querySelector("#copy-name").addEventListener("click", async () => {
  const name = generatedName.textContent;
  if (!name || name === "–") return;
  const text = `${name}\nAussehen: ${profileAppearance.textContent}\nEigenart: ${profileTrait.textContent}\nBesonderheit: ${profileSpecial.textContent}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Name und Profil kopiert.");
  } catch {
    window.prompt("Name und Profil kopieren:", text);
  }
});

speciesSelect.addEventListener("change", () => { populateVariants(); generate(); });
variantSelect.addEventListener("change", generate);
genderInputs.forEach((input) => input.addEventListener("change", generate));
statusSelect.addEventListener("change", generate);
window.addEventListener("resize", fitGeneratedName);
if (window.ResizeObserver) new ResizeObserver(fitGeneratedName).observe(generatedName.parentElement);

populateVariants();
generate();
