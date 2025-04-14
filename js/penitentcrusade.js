const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const primaryAccordionBody = document.getElementById('PrimariesAccordionBody');
const secondaryAccordionBody = document.getElementById('SecondariesAccordionBody');
const stratagemAccordionBody = document.getElementById('StratagemsAccordionBody');
const throwableAccordionBody = document.getElementById('ThrowablesAccordionBody');
const armorPassiveAccordionBody = document.getElementById('ArmorsAccordionBody');
const boosterAccordionBody = document.getElementById('BoostersAccordionBody');
const maxStarsModalLabel = document.getElementById('maxStarsModalLabel');
const missionCompleteModalLabel = document.getElementById('missionCompleteModalLabel');
const rewardModalHeaderItemName = document.getElementById('rewardModalHeaderItemName');
const tierBadgeHeader = document.getElementById('tierBadgeHeader');

let rerollSTierItem = true;

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

const getRandomItem = (list) => {
  const item = list[Math.floor(Math.random() * list.length)];
  // reroll s tier items one time
  if (item.tier === 's' && rerollSTierItem) {
    rerollSTierItem = false;
    return getRandomItem(list);
  }
  rerollSTierItem = true;
  return item;
};

const generateItemCard = (item, inModal, imgDir) => {
  // set the modal header to the item name and tier
  rewardModalHeaderItemName.innerHTML = item.displayName;
  tierBadgeHeader.innerHTML = item.tier;

  // display the item image in the modal or accordion item
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
    // const randomItem = newStrats[Math.floor(Math.random() * newStrats.length)];
    const randomItem = getRandomItem(newStrats);
    stratagemAccordionBody.innerHTML += generateItemCard(randomItem, false, 'svgs');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, true, 'svgs');
    removeItemFromList(newStrats, randomItem);
  }
  if (type === '1') {
    const randomItem = getRandomItem(newPrims);
    primaryAccordionBody.innerHTML += generateItemCard(randomItem, false, 'equipment');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, true, 'equipment');
    removeItemFromList(newPrims, randomItem);
  }
  if (type === '2') {
    const randomItem = getRandomItem(newBoosts);
    boosterAccordionBody.innerHTML += generateItemCard(randomItem, false, 'equipment');
    missionCompleteModalBody.innerHTML = generateItemCard(randomItem, true, 'equipment');
    removeItemFromList(newBoosts, randomItem);
  }
};

// logic for rolling max stars rewards
const rollPCMS = (type) => {
  if (type === '0') {
    const randomItem = getRandomItem(newSecondaries);
    secondaryAccordionBody.innerHTML += generateItemCard(randomItem, false, 'equipment');
    maxStarsModalBody.innerHTML = generateItemCard(randomItem, true, 'equipment');
    removeItemFromList(newSecondaries, randomItem);
  }
  if (type === '1') {
    const randomItem = getRandomItem(newThrows);
    throwableAccordionBody.innerHTML += generateItemCard(randomItem, false, 'equipment');
    maxStarsModalBody.innerHTML = generateItemCard(randomItem, true, 'equipment');
    removeItemFromList(newThrows, randomItem);
  }
  if (type === '2') {
    const randomItem = getRandomItem(newArmorPassives);
    armorPassiveAccordionBody.innerHTML += generateItemCard(randomItem, false, 'armor');
    maxStarsModalBody.innerHTML = generateItemCard(randomItem, true, 'armor');
    removeItemFromList(newArmorPassives, randomItem);
  }
};

const clearRewardModal = () => {
  missionCompleteModalBody.innerHTML = '';
  maxStarsModalBody.innerHTML = '';
  rewardModalHeaderItemName.innerHTML = 'Choose One...';
  tierBadgeHeader.innerHTML = '';
  genRewardModalBodies();
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
