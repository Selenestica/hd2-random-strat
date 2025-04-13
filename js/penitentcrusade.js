const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const primaryAccordionBody = document.getElementById('PrimariesAccordionBody');
const secondaryAccordionBody = document.getElementById('SecondariesAccordionBody');
const stratagemAccordionBody = document.getElementById('StratagemsAccordionBody');
const throwableAccordionBody = document.getElementById('ThrowablesAccordionBody');
const armorPassiveAccordionBody = document.getElementById('ArmorsAccordionBody');
const boosterAccordionBody = document.getElementById('BoostersAccordionBody');

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

const newSecondaries = OGsecondsList.filter((sec) => {
  const starterSecNames = ['Peacemaker', 'Stun Lance', 'Stun Baton', 'Combat Hatchet'];
  return !starterSecNames.includes(sec.displayName);
});

const newThrows = OGthrowsList.filter((throwable) => {
  const starterThrowNames = ['G-12 High Explosive'];
  return !starterThrowNames.includes(throwable.displayName);
});

const newBoosts = OGboostsList;

const newArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
  const starterArmorPassiveNames = ['Extra Padding'];
  return !starterArmorPassiveNames.includes(armorPassive.displayName);
});

const generateItemCard = (item, imgDir) => {
  return `
    <div class="card d-flex col-2 pcItemCards">
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer align-items-center">
          <p class="card-title text-white">${item.displayName}</p>
      </div>
    </div>`;
};

const removeItemFromList = (list, item) => {
  const index = list.indexOf(item);
  if (index > -1) {
    list.splice(index, 1);
  }
};

// logic for rolling mission complete rewards
const rollPCMC = (type) => {
  if (type === '1') {
    const randomItem = newStrats[Math.floor(Math.random() * newStrats.length)];
    stratagemAccordionBody.innerHTML += generateItemCard(randomItem, 'svgs');
    removeItemFromList(newStrats, randomItem);
    // missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'svgs');
  }
  if (type === '2') {
    const randomItem = newPrims[Math.floor(Math.random() * newPrims.length)];
    primaryAccordionBody.innerHTML += generateItemCard(randomItem, 'equipment');
    removeItemFromList(newPrims, randomItem);
    // missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'equipment');
  }
  if (type === '3') {
    const randomItem = newBoosts[Math.floor(Math.random() * newBoosts.length)];
    boosterAccordionBody.innerHTML += generateItemCard(randomItem, 'equipment');
    removeItemFromList(newBoosts, randomItem);
    // missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'equipment');
  }
};

// logic for rolling max stars rewards
const rollPCMS = (type) => {
  if (type === '1') {
    const randomItem = newSecondaries[Math.floor(Math.random() * newSecondaries.length)];
    secondaryAccordionBody.innerHTML += generateItemCard(randomItem, 'equipment');
    removeItemFromList(newSecondaries, randomItem);
    // missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'equipment');
  }
  if (type === '2') {
    const randomItem = newThrows[Math.floor(Math.random() * newThrows.length)];
    throwableAccordionBody.innerHTML += generateItemCard(randomItem, 'equipment');
    removeItemFromList(newThrows, randomItem);
    // missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'equipment');
  }
  if (type === '3') {
    const randomItem = newArmorPassives[Math.floor(Math.random() * newArmorPassives.length)];
    armorPassiveAccordionBody.innerHTML += generateItemCard(randomItem, 'armor');
    removeItemFromList(newArmorPassives, randomItem);
    // missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'armor');
  }
};
