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
  'Orbital EMS Strike',
  'Orbital Smoke Strike',
  'Eagle Smoke Strike',
  'EMS Mortar Sentry',
  'Shield Generator Relay',
];
let starterPrimNames = ['Constitution'];
let starterSecNames = ['Peacemaker', 'Stun Lance', 'Stun Baton', 'Combat Hatchet'];
let starterThrowNames = ['G-12 High Explosive'];
let starterArmorPassiveNames = ['Extra Padding'];
let starterBoosterNames = [];
// let getStartingItems = () => {
//   //
// }

// create default item lists for later use
const defaultStrats = OGstratsList.filter((strat) => {
  return starterStratNames.includes(strat.displayName);
});
const defaultPrims = OGprimsList.filter((prim) => {
  return starterPrimNames.includes(prim.displayName);
});
const defaultSeconds = OGsecondsList.filter((sec) => {
  return starterSecNames.includes(sec.displayName);
});
const defaultThrows = OGthrowsList.filter((throwable) => {
  return starterThrowNames.includes(throwable.displayName);
});
const defaultArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
  return starterArmorPassiveNames.includes(armorPassive.displayName);
});
const defaultBoosters = OGboostsList.filter((booster) => {
  return starterBoosterNames.includes(booster.displayName);
});
