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
  if (diff === "super") {
    return ["Integrated Explosives"];
  } else if (diff === "bb") {
    return ["Scout"];
  }
  return ["Extra Padding"];
};

const getStartingItems = (diff = null) => {
  starterStratNames = [
    "One True Flag",
    "Orbital EMS Strike",
    "Orbital Smoke Strike",
    "Eagle Smoke Strike",
    "EMS Mortar Sentry",
    "Shield Generator Relay",
  ];
  diff === "super" ? starterStratNames.push("Ballistic Shield") : null;
  starterPrimNames = ["Constitution"];
  starterSecNames = ["Stun Lance", "Stun Baton", "Combat Hatchet", "Saber"];
  diff !== "super" ? starterSecNames.push("Peacemaker") : null;
  starterThrowNames =
    diff === "bb"
      ? ["G-3 Smoke", "K-2 Throwing Knife"]
      : ["G-12 High Explosive"];
  starterArmorPassiveNames = getStartingArmor(diff);
  starterBoosterNames = [];
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
