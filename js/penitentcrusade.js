const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const primaryAccordionBody = document.getElementById('PrimariesAccordionBody');
const secondaryAccordionBody = document.getElementById('SecondariesAccordionBody');
const stratagemAccordionBody = document.getElementById('StratagemsAccordionBody');
const throwableAccordionBody = document.getElementById('ThrowablesAccordionBody');
const armorPassiveAccordionBody = document.getElementById('ArmorsAccordionBody');
const boosterAccordionBody = document.getElementById('BoostersAccordionBody');
const flavorAndInstructionsModal = document.getElementById('flavorAndInstructionsModal');
const rewardModalBody = document.getElementById('rewardModalBody');
const rewardModalLabel = document.getElementById('rewardModalLabel');
const rewardModalHeaderItemName = document.getElementById('rewardModalHeaderItemName');
const rewardModal = document.getElementById('rewardModal');

let rerollSTierItem = true;
let numOfRerolls = 10;

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

// remove starter items from the lists
// create default item lists for later use
newStrats = OGstratsList.filter((strat) => {
  return !starterStratNames.includes(strat.displayName);
});
const defaultStrats = OGstratsList.filter((strat) => {
  return starterStratNames.includes(strat.displayName);
});

newPrims = OGprimsList.filter((prim) => {
  return !starterPrimNames.includes(prim.displayName);
});
const defaultPrims = OGprimsList.filter((prim) => {
  return starterPrimNames.includes(prim.displayName);
});

newSecondaries = OGsecondsList.filter((sec) => {
  return !starterSecNames.includes(sec.displayName);
});
const defaultSeconds = OGsecondsList.filter((sec) => {
  return starterSecNames.includes(sec.displayName);
});

newThrows = OGthrowsList.filter((throwable) => {
  return !starterThrowNames.includes(throwable.displayName);
});
const defaultThrows = OGthrowsList.filter((throwable) => {
  return starterThrowNames.includes(throwable.displayName);
});

newArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
  return !starterArmorPassiveNames.includes(armorPassive.displayName);
});
const defaultArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
  return starterArmorPassiveNames.includes(armorPassive.displayName);
});

newBoosts = OGboostsList;

let currentItems = [];

const claimItem = (currentItemIndex, listIndex) => {
  const item = currentItems[currentItemIndex];
  const { imgDir, list, accBody } = getItemCardParams(listIndex);
  accBody.innerHTML += generateItemCard(item, false, imgDir);
  removeItemFromList(list, item);
  const modal = bootstrap.Modal.getInstance(rewardModal);
  modal.hide();
  clearRewardModal();
  currentItems = [];
  saveProgress(item, listIndex);
};

const getItemCardParams = (index) => {
  let imgDir;
  let list;
  let accBody;
  if (index === 0) {
    imgDir = 'svgs';
    list = newStrats;
    accBody = stratagemAccordionBody;
  }
  if (index === 1) {
    imgDir = 'equipment';
    list = newPrims;
    accBody = primaryAccordionBody;
  }
  if (index === 2) {
    imgDir = 'equipment';
    list = newBoosts;
    accBody = boosterAccordionBody;
  }
  if (index === 3) {
    imgDir = 'equipment';
    list = newSecondaries;
    accBody = secondaryAccordionBody;
  }
  if (index === 4) {
    imgDir = 'equipment';
    list = newThrows;
    accBody = throwableAccordionBody;
  }
  if (index === 5) {
    imgDir = 'armor';
    list = newArmorPassives;
    accBody = armorPassiveAccordionBody;
  }
  return { imgDir, list, accBody };
};

const rollRewardOptions = () => {
  const itemsLists = [newStrats, newPrims, newBoosts, newSecondaries, newThrows, newArmorPassives];
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
    rewardModalBody.innerHTML += generateItemCard(randomItem, true, vals.imgDir, i, numsList[i]);
  }
};

const getRandomItem = (list) => {
  const item = list[Math.floor(Math.random() * list.length)];
  // reroll s tier items one time
  if (item.tier === 's' && rerollSTierItem && numOfRerolls > 0) {
    rerollSTierItem = false;
    numOfRerolls--;
    console.log(numOfRerolls);
    return getRandomItem(list);
  }
  rerollSTierItem = true;
  return item;
};

const generateItemCard = (item, inModal, imgDir, currentItemIndex = null, listIndex = null) => {
  // display the item image in the modal or accordion item
  let style = 'col-2';
  let modalTextStyle = 'pcItemCardText';
  let fcn = '';
  if (inModal) {
    style = 'pcModalItemCards col-6';
    modalTextStyle = '';
    fcn = `claimItem(${currentItemIndex}, ${listIndex})`;
  }
  return `
    <div onclick="${fcn}" class="card d-flex ${style} pcItemCards mx-1">
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

const clearRewardModal = () => {
  rewardModalBody.innerHTML = '';
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
    };
    localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(obj));
    return;
  }
  const data = JSON.parse(penitentCrusadeSaveData);
  const acquiredItems = data.acquiredItems;
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
    for (let i = 0; i < data.acquiredItems.length; i++) {
      const { item, listIndex } = data.acquiredItems[i];
      const { imgDir, accBody } = getItemCardParams(listIndex);
      accBody.innerHTML += generateItemCard(item, false, imgDir);
    }
  }
};

addDefaultItemsToAccordions();

uploadSaveData();
