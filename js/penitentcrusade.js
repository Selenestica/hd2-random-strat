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

const starterStratNames = [
  'Orbital EMS Strike',
  'Orbital Smoke Strike',
  'Eagle Smoke Strike',
  'EMS Mortar Sentry',
  'Shield Generator Relay',
];
const starterPrimNames = ['Constitution'];
const starterSecNames = ['Peacemaker', 'Stun Lance', 'Stun Baton', 'Combat Hatchet'];
const starterThrowNames = ['G-12 High Explosive'];
const starterArmorPassiveNames = ['Extra Padding'];

// remove starter items from the lists
// create default item lists for later use
const newStrats = OGstratsList.filter((strat) => {
  return !starterStratNames.includes(strat.displayName);
});
const defaultStrats = OGstratsList.filter((strat) => {
  return starterStratNames.includes(strat.displayName);
});

const newPrims = OGprimsList.filter((prim) => {
  return !starterPrimNames.includes(prim.displayName);
});
const defaultPrims = OGprimsList.filter((prim) => {
  return starterPrimNames.includes(prim.displayName);
});

const newSecondaries = OGsecondsList.filter((sec) => {
  return !starterSecNames.includes(sec.displayName);
});
const defaultSeconds = OGsecondsList.filter((sec) => {
  return starterSecNames.includes(sec.displayName);
});

const newThrows = OGthrowsList.filter((throwable) => {
  return !starterThrowNames.includes(throwable.displayName);
});
const defaultThrows = OGthrowsList.filter((throwable) => {
  return starterThrowNames.includes(throwable.displayName);
});

const newArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
  return !starterArmorPassiveNames.includes(armorPassive.displayName);
});
const defaultArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
  return starterArmorPassiveNames.includes(armorPassive.displayName);
});

const newBoosts = OGboostsList;

const generateItemCard = (item, inModal, imgDir) => {
  let modalStyle = '';
  let modalTextStyle = 'pcItemCardText';
  if (inModal) {
    modalStyle = 'pcModalItemCards';
    modalTextStyle = '';
  }
  return `
    <div class="card d-flex col-2 ${modalStyle} pcItemCards">
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer align-items-center">
          <p class="card-title text-white ${modalTextStyle}">${item.displayName}</p>
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
  if (type === '0') {
    const randomItem = newStrats[Math.floor(Math.random() * newStrats.length)];
    stratagemAccordionBody.innerHTML += generateItemCard(randomItem, false, 'svgs');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, true, 'svgs');
    removeItemFromList(newStrats, randomItem);
  }
  if (type === '1') {
    const randomItem = newPrims[Math.floor(Math.random() * newPrims.length)];
    primaryAccordionBody.innerHTML += generateItemCard(randomItem, false, 'equipment');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, true, 'equipment');
    removeItemFromList(newPrims, randomItem);
  }
  if (type === '2') {
    const randomItem = newBoosts[Math.floor(Math.random() * newBoosts.length)];
    boosterAccordionBody.innerHTML += generateItemCard(randomItem, false, 'equipment');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, true, 'equipment');
    removeItemFromList(newBoosts, randomItem);
  }
};

const clearRewardModal = () => {
  missionCompleteModalBody.innerHTML = '';
  genRewardModalBodies();
};

// logic for rolling max stars rewards
const rollPCMS = (type) => {
  if (type === '1') {
    const randomItem = newSecondaries[Math.floor(Math.random() * newSecondaries.length)];
    secondaryAccordionBody.innerHTML += generateItemCard(randomItem, 'equipment');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'equipment');
    removeItemFromList(newSecondaries, randomItem);
  }
  if (type === '2') {
    const randomItem = newThrows[Math.floor(Math.random() * newThrows.length)];
    throwableAccordionBody.innerHTML += generateItemCard(randomItem, 'equipment');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'equipment');
    removeItemFromList(newThrows, randomItem);
  }
  if (type === '3') {
    const randomItem = newArmorPassives[Math.floor(Math.random() * newArmorPassives.length)];
    armorPassiveAccordionBody.innerHTML += generateItemCard(randomItem, 'armor');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, 'armor');
    removeItemFromList(newArmorPassives, randomItem);
  }
};

const addDefaultItemsToAccordions = () => {
  for (let i = 0; i < defaultStrats.length; i++) {
    stratagemAccordionBody.innerHTML += generateItemCard(defaultStrats[i], false, 'svgs');
  }
  for (let i = 0; i < defaultPrims.length; i++) {
    primaryAccordionBody.innerHTML += generateItemCard(defaultPrims[i], false, 'equipment');
  }
  for (let i = 0; i < defaultSeconds.length; i++) {
    secondaryAccordionBody.innerHTML += generateItemCard(defaultSeconds[i], false, 'equipment');
  }
  for (let i = 0; i < defaultThrows.length; i++) {
    throwableAccordionBody.innerHTML += generateItemCard(defaultThrows[i], false, 'equipment');
  }
  for (let i = 0; i < defaultArmorPassives.length; i++) {
    armorPassiveAccordionBody.innerHTML += generateItemCard(
      defaultArmorPassives[i],
      false,
      'armor',
    );
  }
};

addDefaultItemsToAccordions();
