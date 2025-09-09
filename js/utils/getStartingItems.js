let OGstratsList = [...STRATAGEMS];
let OGprimsList = [...PRIMARIES];
let OGsecondsList = [...SECONDARIES];
let OGthrowsList = [...THROWABLES];
let OGboostsList = [...BOOSTERS];
let OGarmorPassivesList = [...ARMOR_PASSIVES];
let newStrats = [];
let newPrims = [];
let newSeconds = [];
let newThrows = [];
let newArmorPassives = [];
let newBoosts = [];

let starterStratNames = [
  "Orbital EMS Strike",
  "Orbital Smoke Strike",
  "Eagle Smoke Strike",
  "EMS Mortar Sentry",
  "Shield Generator Relay",
];
let starterPrimNames = ["Constitution"];
let starterSecNames = [
  "Peacemaker",
  "Stun Lance",
  "Stun Baton",
  "Combat Hatchet",
  "Saber",
];
let starterThrowNames = ["G-12 High Explosive"];
let starterArmorPassiveNames = ["Extra Padding"];
let starterBoosterNames = [];

const getStartingArmor = (diff) => {
  if (diff === "super" || diff === "supersolo") {
    return ["Integrated Explosives"];
  } else if (diff === "bb" || diff === "dd") {
    return ["Scout"];
  }
  return ["Extra Padding"];
};

const getStartingStrats = (diff) => {
  let strats = [
    "One True Flag",
    "Orbital EMS Strike",
    "Orbital Smoke Strike",
    "Eagle Smoke Strike",
    "EMS Mortar Sentry",
    "Shield Generator Relay",
  ];

  if (diff === "super") {
    strats.push("Ballistic Shield");
  }
  if (diff === "solo" || diff === "supersolo") {
    strats.push("Orbital Precision Strike");
  }
  if (diff === "quick") {
    strats = strats.concat([
      "Ballistic Shield",
      "Orbital Precision Strike",
      "Grenadier Battlement",
      "Anti-Tank Mines",
      "Eagle 110mm Rocket Pods",
    ]);
  }
  return strats;
};

const getStartingBoosters = (diff) => {
  if (diff === "quick") {
    return ["UAV Recon", "Muscle Enhancement"];
  }
  return [];
};

const getStartingSecondaries = (diff) => {
  let secondaries = ["Stun Lance", "Stun Baton", "Combat Hatchet", "Saber"];
  if (diff !== "super") {
    secondaries.push("Peacemaker");
  }

  return secondaries;
};

const getStartingItems = (diff = null) => {
  starterStratNames = getStartingStrats(diff);
  starterPrimNames = ["Constitution"];
  starterSecNames = getStartingSecondaries(diff);
  starterThrowNames =
    diff === "bb" || diff === "dd"
      ? ["G-3 Smoke", "K-2 Throwing Knife"]
      : ["G-12 High Explosive"];
  starterArmorPassiveNames = getStartingArmor(diff);
  starterBoosterNames = getStartingBoosters(diff);
  if (specialist === null || specialist === undefined) {
    return {
      starterStratNames,
      starterPrimNames,
      starterSecNames,
      starterThrowNames,
      starterArmorPassiveNames,
      starterBoosterNames,
    };
  }
  starterPrimNames =
    SPECIALISTS[specialist].primaries.length > 0
      ? SPECIALISTS[specialist].primaries
      : ["Constitution"];
  starterStratNames = starterStratNames.concat(
    SPECIALISTS[specialist].stratagems
  );
  starterSecNames =
    SPECIALISTS[specialist].secondaries.length > 0
      ? SPECIALISTS[specialist].secondaries
      : starterSecNames;
  starterThrowNames =
    SPECIALISTS[specialist].throwables.length > 0
      ? SPECIALISTS[specialist].throwables
      : starterThrowNames;
  starterArmorPassiveNames =
    SPECIALISTS[specialist].armorPassives.length > 0
      ? SPECIALISTS[specialist].armorPassives
      : starterArmorPassiveNames;
  starterBoosterNames = SPECIALISTS[specialist].boosters;
};
