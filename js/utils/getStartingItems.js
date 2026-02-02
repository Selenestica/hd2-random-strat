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
  'One True Flag',
  'Defoliation Tool',
  'Orbital EMS Strike',
  'Orbital Smoke Strike',
  'Eagle Smoke Strike',
  'EMS Mortar Sentry',
  'Shield Generator Relay',
];
let starterPrimNames = ['Constitution'];
let starterSecNames = [
  'Peacemaker',
  'Stun Lance',
  'Stun Baton',
  'Combat Hatchet',
  'Saber',
  'Machete',
];
let starterThrowNames = ['G-12 High Explosive'];
let starterArmorPassiveNames = ['Extra Padding'];
let starterBoosterNames = [];

const getStartingArmor = (diff) => {
  if (diff === 'super' || diff === 'supersolo') {
    return ['Integrated Explosives'];
  } else if (diff === 'bb' || diff === 'dd') {
    return ['Scout'];
  }
  return ['Extra Padding'];
};

const getStartingStrats = (diff) => {
  let strats = [
    'One True Flag',
    'Defoliation Tool',
    'Orbital EMS Strike',
    'Orbital Smoke Strike',
    'Eagle Smoke Strike',
    'EMS Mortar Sentry',
    'Shield Generator Relay',
  ];

  if (diff === 'super' || diff === 'supersolo') {
    strats.push('Ballistic Shield');
  }
  if (diff === 'solo' || diff === 'supersolo') {
    strats.push('Orbital Precision Strike');
  }
  if (diff === 'quick') {
    strats = strats.concat([
      'Ballistic Shield',
      'Orbital Precision Strike',
      'Grenadier Battlement',
      'Anti-Tank Mines',
      'Eagle 110mm Rocket Pods',
    ]);
  }
  return strats;
};

const getStartingBoosters = (diff) => {
  if (diff === 'quick') {
    return ['UAV Recon', 'Muscle Enhancement'];
  }
  return [];
};

const getStartingSecondaries = (diff) => {
  let secondaries = ['Stun Lance', 'Stun Baton', 'Combat Hatchet', 'Saber', 'Machete'];
  if (diff !== 'super' && diff !== 'supersolo') {
    secondaries.push('Peacemaker');
  }

  return secondaries;
};

const getStartingThrowables = (diff) => {
  let throwables = ['G-3 Smoke', 'K-2 Throwing Knife', 'G-12 High Explosive', 'G-89 Smokescreen'];
  if (diff === 'bb' || diff === 'dd') {
    return ['G-3 Smoke', 'K-2 Throwing Knife', 'G-89 Smokescreen'];
  }
  return throwables;
};

const getStartingItems = (diff = null) => {
  starterStratNames = getStartingStrats(diff);
  starterPrimNames = ['Constitution'];
  starterSecNames = getStartingSecondaries(diff);
  starterThrowNames = getStartingThrowables(diff);
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
      : ['Constitution'];
  starterStratNames = starterStratNames.concat(SPECIALISTS[specialist].stratagems);
  if (specialist === '22') {
    starterStratNames = [
      'Guard Dog Bullets',
      'Guard Dog Laser',
      'Guard Dog Breath',
      'Guard Dog Arc',
      'Guard Dog Flames',
    ];
  }
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
