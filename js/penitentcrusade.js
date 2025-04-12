const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');

let OGstratsList = [...STRATAGEMS];
let OGprimsList = [...PRIMARIES];
let OGsecondsList = [...SECONDARIES];
let OGthrowsList = [...THROWABLES];
let OGboostsList = [...BOOSTERS];
let OGarmorPassivesList = [...ARMOR_PASSIVES];

// remove starter equipment from the lists
const newStrats = OGstratsList.filter((strat) => {
  const starterStratNames = [
    'Orbital EMS Strike',
    'Orbital Smoke Strike',
    'Eagle Smoke Strike',
    'EMS Mortar Sentry',
    'Shield Generator Relay',
  ];
  return !starterStratNames.includes(strat.displayName);
});

const newPrims = OGprimsList.filter((prim) => {
  const starterPrimNames = ['Constitution'];
  return !starterPrimNames.includes(prim.displayName);
});

const newSeconds = OGsecondsList.filter((sec) => {
  const starterSecNames = ['Peacemaker', 'Stun Lance', 'Stun Baton', 'Combat Hatchet'];
  return !starterSecNames.includes(sec.displayName);
});

const rollPCMC = (type) => {
  if (type === '1') {
  }
};

const rollPCMS = (type) => {
  console.log(type);
};
