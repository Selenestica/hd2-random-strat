const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const primaryAccordionBody = document.getElementById('PrimariesAccordionBody');
const secondaryAccordionBody = document.getElementById('SecondariesAccordionBody');
const stratagemAccordionBody = document.getElementById('StratagemsAccordionBody');
const throwableAccordionBody = document.getElementById('ThrowablesAccordionBody');
const armorPassiveAccordionBody = document.getElementById('ArmorsAccordionBody');
const boosterAccordionBody = document.getElementById('BoostersAccordionBody');
const flavorAndInstructionsModal = document.getElementById('flavorAndInstructionsModal');
const itemOptionsModalBody = document.getElementById('itemOptionsModalBody');
const itemOptionsModalLabel = document.getElementById('itemOptionsModalLabel');
const itemOptionsModalHeaderItemName = document.getElementById('itemOptionsModalHeaderItemName');
const itemOptionsModal = document.getElementById('itemOptionsModal');
const missionCompleteButton = document.getElementById('missionCompleteButton');

let rerollHighTierItem = true;
let numOfRerolls = 15;
let currentItems = [];

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

const startNewRun = () => {
  newStrats = OGstratsList.filter((strat) => {
    return !starterStratNames.includes(strat.displayName);
  });
  newPrims = OGprimsList.filter((prim) => {
    return !starterPrimNames.includes(prim.displayName);
  });
  newSeconds = OGsecondsList.filter((sec) => {
    return !starterSecNames.includes(sec.displayName);
  });
  newThrows = OGthrowsList.filter((throwable) => {
    return !starterThrowNames.includes(throwable.displayName);
  });
  newArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
    return !starterArmorPassiveNames.includes(armorPassive.displayName);
  });
  newBoosts = OGboostsList;
  rerollHighTierItem = true;
  numOfRerolls = 15;
  currentItems = [];
  missionCompleteButton.disabled = false;
  // open the modal to show the rules
  document.addEventListener('DOMContentLoaded', () => {
    const modal = new bootstrap.Modal(flavorAndInstructionsModal);
    modal.show();
  });
  clearItemOptionsModal();
};

const claimItem = (currentItemIndex, listIndex) => {
  const item = currentItems[currentItemIndex];
  const { imgDir, list, accBody } = getItemCardParams(listIndex);
  accBody.innerHTML += generateItemCard(item, false, imgDir);
  removeItemFromList(list, item);
  const modal = bootstrap.Modal.getInstance(itemOptionsModal);
  modal.hide();
  clearItemOptionsModal();
  currentItems = [];
  saveProgress(item, listIndex);
};

const claimPunishment = (currentItemIndex, listIndex) => {
  const item = currentItems[currentItemIndex];

  // remove item from local storage
  const penitentCrusadeSaveData = localStorage.getItem('penitentCrusadeSaveData');
  const data = JSON.parse(penitentCrusadeSaveData);
  const acquiredItems = data.acquiredItems;
  const newAcquiredItems = acquiredItems.filter((acquiredItem) => {
    return acquiredItem.item.displayName !== item.displayName;
  });
  const newData = {
    ...data,
    acquiredItems: newAcquiredItems,
  };
  localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(newData));

  // remove item from accordion
  const { list, accBody } = getItemCardParams(listIndex);
  for (let i = 0; i < accBody.children.length; i++) {
    const card = accBody.children[i];
    if (card.children[0].alt === item.displayName) {
      accBody.removeChild(card);
      break;
    }
  }

  // add that item back into the pool of potential rewards
  list.push(item);

  const modal = bootstrap.Modal.getInstance(itemOptionsModal);
  modal.hide();
  clearItemOptionsModal();
  currentItems = [];
};

const getItemCardParams = (index) => {
  let imgDir;
  let list;
  let accBody;
  let type;
  if (index === 0) {
    imgDir = 'svgs';
    list = newStrats;
    accBody = stratagemAccordionBody;
    type = 'Stratagem';
  }
  if (index === 1) {
    imgDir = 'equipment';
    list = newPrims;
    accBody = primaryAccordionBody;
    type = 'Primary';
  }
  if (index === 2) {
    imgDir = 'equipment';
    list = newBoosts;
    accBody = boosterAccordionBody;
    type = 'Booster';
  }
  if (index === 3) {
    imgDir = 'equipment';
    list = newSeconds;
    accBody = secondaryAccordionBody;
    type = 'Secondary';
  }
  if (index === 4) {
    imgDir = 'equipment';
    list = newThrows;
    accBody = throwableAccordionBody;
    type = 'Throwable';
  }
  if (index === 5) {
    imgDir = 'armor';
    list = newArmorPassives;
    accBody = armorPassiveAccordionBody;
    type = 'Armor Passive';
  }
  return { imgDir, list, accBody, type };
};

// if too many of one item is rolled and theres nothing left in the list, the image will be blank and the item may show up in the wrong accordion
const rollRewardOptions = () => {
  let itemsLists = [newStrats, newPrims, newBoosts, newSeconds, newThrows, newArmorPassives];
  itemsLists = itemsLists.filter((list) => list.length > 0);
  if (itemsLists.length < 3) {
    console.log('not enough items to show');
    return;
  }
  const numbers = new Set();
  while (numbers.size < 3) {
    const randomNumber = Math.floor(Math.random() * itemsLists.length);
    numbers.add(randomNumber);
  }
  const numsList = Array.from(numbers);
  for (let i = 0; i < numsList.length; i++) {
    const vals = getItemCardParams(numsList[i]);
    const list = itemsLists[numsList[i]];
    const randomItem = getRandomItem(list);
    currentItems.push(randomItem);
    itemOptionsModalBody.innerHTML += generateItemCard(
      randomItem,
      true,
      vals.imgDir,
      i,
      numsList[i],
      vals.type,
    );
  }
};

const rollPunishmentOptions = () => {
  let maxPunishmentItems = 3;
  const acquiredItems = JSON.parse(localStorage.getItem('penitentCrusadeSaveData')).acquiredItems;
  if (acquiredItems.length <= 0) {
    return;
  }
  const modal = new bootstrap.Modal(itemOptionsModal);
  modal.show();
  if (acquiredItems.length < maxPunishmentItems) {
    maxPunishmentItems = acquiredItems.length;
  }
  const numbers = new Set();
  while (numbers.size < maxPunishmentItems) {
    const randomNumber = Math.floor(Math.random() * acquiredItems.length);
    numbers.add(randomNumber);
  }
  const numsList = Array.from(numbers);
  for (let i = 0; i < numsList.length; i++) {
    const vals = getItemCardParams(acquiredItems[numsList[i]].listIndex);
    const randomItem = acquiredItems[numsList[i]].item;
    currentItems.push(randomItem);
    itemOptionsModalBody.innerHTML += generateItemCard(
      randomItem,
      true,
      vals.imgDir,
      i,
      acquiredItems[numsList[i]].listIndex,
      vals.type,
      true,
    );
  }
};

const getRandomItem = (list) => {
  const item = list[Math.floor(Math.random() * list.length)];
  // reroll s and a tier items one time
  if ((item.tier === 's' || item.tier === 'a') && rerollHighTierItem && numOfRerolls > 0) {
    rerollHighTierItem = false;
    numOfRerolls--;
    return getRandomItem(list);
  }
  rerollHighTierItem = true;
  return item;
};

const generateItemCard = (
  item,
  inModal,
  imgDir,
  currentItemIndex = null,
  listIndex = null,
  type = null,
  missionFailed = false,
) => {
  // display the item image in the modal or accordion item
  let style = 'col-2';
  let modalTextStyle = 'pcItemCardText';
  let fcn = '';
  let typeText = '';
  if (inModal) {
    style = 'pcModalItemCards col-6';
    modalTextStyle = '';
    fcn = !missionFailed
      ? `claimItem(${currentItemIndex}, ${listIndex})`
      : `claimPunishment(${currentItemIndex}, ${listIndex})`;
    typeText = `<p class="card-title fst-italic text-white">${type}</p>`;
  }
  return `
    <div onclick="${fcn}" class="card d-flex ${style} pcItemCards mx-1">
    ${typeText}
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

const clearItemOptionsModal = () => {
  currentItems = [];
  itemOptionsModalBody.innerHTML = '';
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

const clearSaveData = () => {
  localStorage.removeItem('penitentCrusadeSaveData');
  startNewRun();
  stratagemAccordionBody.innerHTML = '';
  primaryAccordionBody.innerHTML = '';
  secondaryAccordionBody.innerHTML = '';
  throwableAccordionBody.innerHTML = '';
  armorPassiveAccordionBody.innerHTML = '';
  boosterAccordionBody.innerHTML = '';
  addDefaultItemsToAccordions();
};

const saveProgress = (item, listIndex) => {
  let obj = {};
  const penitentCrusadeSaveData = localStorage.getItem('penitentCrusadeSaveData');
  if (!penitentCrusadeSaveData) {
    obj = {
      acquiredItems: [{ item, listIndex }],
      numOfRerolls,
      newStrats,
      newPrims,
      newSeconds,
      newThrows,
      newArmorPassives,
      newBoosts,
      seesRulesOnOpen: false,
      dataName: 'Unnamed Data #1',
    };
    localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(obj));
    return;
  }
  const data = JSON.parse(penitentCrusadeSaveData);
  const acquiredItems = data.acquiredItems;
  const dataName = data.dataName;
  const newItem = { item, listIndex };
  acquiredItems.push(newItem);
  obj = {
    acquiredItems,
    numOfRerolls,
    newStrats,
    newPrims,
    newSeconds,
    newThrows,
    newArmorPassives,
    newBoosts,
    seesRulesOnOpen: false,
    dataName,
  };
  localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(obj));
};

const uploadSaveData = () => {
  const penitentCrusadeSaveData = localStorage.getItem('penitentCrusadeSaveData');
  if (penitentCrusadeSaveData) {
    const data = JSON.parse(penitentCrusadeSaveData);
    numOfRerolls = data.numOfRerolls;
    newStrats = data.newStrats;
    newPrims = data.newPrims;
    newSeconds = data.newSeconds;
    newThrows = data.newThrows;
    newArmorPassives = data.newArmorPassives;
    newBoosts = data.newBoosts;
    seesRulesOnOpen = data.seesRulesOnOpen;
    for (let i = 0; i < data.acquiredItems.length; i++) {
      const { item, listIndex } = data.acquiredItems[i];
      const { imgDir, accBody } = getItemCardParams(listIndex);
      accBody.innerHTML += generateItemCard(item, false, imgDir);
    }
    return;
  }
  startNewRun();
};

addDefaultItemsToAccordions();

uploadSaveData();
