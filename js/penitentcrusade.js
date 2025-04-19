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

const getCurrentGame = async () => {
  const savedGames = JSON.parse(localStorage.getItem('penitentCrusadeSaveData')).savedGames;
  const currentGame = await savedGames.filter((sg) => {
    return sg.currentGame === true;
  });
  if (currentGame.length !== 1) {
    console.log('SAVED GAME DATA CORRUPTED', savedGames);
    return;
  }
  return currentGame[0];
};

const claimItem = (currentItemIndex) => {
  const item = currentItems[currentItemIndex];
  const { imgDir, list, accBody } = getItemMetaData(item);
  accBody.innerHTML += generateItemCard(item, false, imgDir);
  removeItemFromList(list, item);
  const modal = bootstrap.Modal.getInstance(itemOptionsModal);
  modal.hide();
  clearItemOptionsModal();
  currentItems = [];
  saveProgress(item);
};

const claimPunishment = async (currentItemIndex) => {
  const item = currentItems[currentItemIndex];

  // remove item from accordion
  const { listKeyName, list, accBody } = getItemMetaData(item);
  for (let i = 0; i < accBody.children.length; i++) {
    const card = accBody.children[i];
    if (card.children[0].alt === item.displayName) {
      accBody.removeChild(card);
      break;
    }
  }

  // add that item back into the pool of potential rewards
  list.push(item);

  // remove item from local storage
  const currentGame = await getCurrentGame();
  const acquiredItems = currentGame.acquiredItems;
  const newAcquiredItems = acquiredItems.filter((acquiredItem) => {
    return acquiredItem.item.displayName !== item.displayName;
  });

  // create updated game data
  const newCurrentGameData = {
    ...currentGame,
    [listKeyName]: list,
    acquiredItems: newAcquiredItems,
  };

  // set the updated data into local storage
  let saveData = JSON.parse(localStorage.getItem('penitentCrusadeSaveData'));
  const notCurrentGames = await saveData.savedGames.filter((game) => {
    return game.currentGame !== true;
  });
  notCurrentGames.push(newCurrentGameData);
  saveData = {
    ...saveData,
    savedGames: notCurrentGames,
  };

  localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(saveData));

  const modal = bootstrap.Modal.getInstance(itemOptionsModal);
  modal.hide();
  clearItemOptionsModal();
  currentItems = [];
};

const getItemMetaData = (item) => {
  const { category, type } = item;
  let imgDir;
  let list;
  let accBody;
  let typeText;
  let listKeyName;
  if (type === 'Stratagem') {
    imgDir = 'svgs';
    list = newStrats;
    accBody = stratagemAccordionBody;
    typeText = 'Stratagem';
    listKeyName = 'newStrats';
  }
  if (category === 'primary') {
    imgDir = 'equipment';
    list = newPrims;
    accBody = primaryAccordionBody;
    typeText = 'Primary';
    listKeyName = 'newPrims';
  }
  if (category === 'booster') {
    imgDir = 'equipment';
    list = newBoosts;
    accBody = boosterAccordionBody;
    typeText = 'Booster';
    listKeyName = 'newBoosts';
  }
  if (category === 'secondary') {
    imgDir = 'equipment';
    list = newSeconds;
    accBody = secondaryAccordionBody;
    typeText = 'Secondary';
    listKeyName = 'newSeconds';
  }
  if (category === 'throwable') {
    imgDir = 'equipment';
    list = newThrows;
    accBody = throwableAccordionBody;
    typeText = 'Throwable';
    listKeyName = 'newThrows';
  }
  if (category === 'armor') {
    imgDir = 'armor';
    list = newArmorPassives;
    accBody = armorPassiveAccordionBody;
    typeText = 'Armor Passive';
    listKeyName = 'newArmorPassives';
  }
  return { imgDir, list, accBody, typeText, listKeyName };
};

// if too many of one item is rolled and theres nothing left in the list, the image will be blank and the item may show up in the wrong accordion
const rollRewardOptions = () => {
  let itemsLists = [newStrats, newPrims, newBoosts, newSeconds, newThrows, newArmorPassives];
  itemsLists = itemsLists.filter((list) => list.length > 0);
  if (itemsLists.length < 3) {
    console.log('NOT ENOUGH ITEMS TO SHOW');
    return;
  }
  const numbers = new Set();
  while (numbers.size < 3) {
    const randomNumber = Math.floor(Math.random() * itemsLists.length);
    numbers.add(randomNumber);
  }
  const numsList = Array.from(numbers);
  for (let i = 0; i < numsList.length; i++) {
    const list = itemsLists[numsList[i]];
    const randomItem = getRandomItem(list);
    const vals = getItemMetaData(randomItem);
    currentItems.push(randomItem);
    itemOptionsModalBody.innerHTML += generateItemCard(
      randomItem,
      true,
      vals.imgDir,
      i,
      vals.typeText,
    );
  }
};

const rollPunishmentOptions = async () => {
  let maxPunishmentItems = 3;
  const game = await getCurrentGame();
  const acquiredItems = game.acquiredItems;
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
    const vals = getItemMetaData(acquiredItems[numsList[i]].item);
    const randomItem = acquiredItems[numsList[i]].item;
    currentItems.push(randomItem);
    itemOptionsModalBody.innerHTML += generateItemCard(
      randomItem,
      true,
      vals.imgDir,
      i,
      vals.typeText,
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
      ? `claimItem(${currentItemIndex})`
      : `claimPunishment(${currentItemIndex})`;
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

const clearSaveDataAndRestart = () => {
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

const saveProgress = async (item, newName = null) => {
  let obj = {};
  const penitentCrusadeSaveData = localStorage.getItem('penitentCrusadeSaveData');
  if (!penitentCrusadeSaveData) {
    obj = {
      savedGames: [
        {
          acquiredItems: [{ item }],
          numOfRerolls,
          newStrats,
          newPrims,
          newSeconds,
          newThrows,
          newArmorPassives,
          newBoosts,
          seesRulesOnOpen: false,
          dataName: 'Unnamed Data #1',
          currentGame: true,
        },
      ],
    };
    localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(obj));
    return;
  }
  const data = JSON.parse(penitentCrusadeSaveData);
  const newSavedGames = await data.savedGames.map((sg) => {
    if (sg.currentGame === true) {
      const acquiredItems = sg.acquiredItems;
      const dataName = sg.dataName;
      const newItem = { item };
      acquiredItems.push(newItem);
      sg = {
        ...sg,
        acquiredItems,
        numOfRerolls,
        newStrats,
        newPrims,
        newSeconds,
        newThrows,
        newArmorPassives,
        newBoosts,
        seesRulesOnOpen: false,
        dataName: newName ?? dataName,
        currentGame: true,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };

  localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(obj));
};

const uploadSaveData = async () => {
  // will need to go through each save and choose the one with currentGame === true
  const penitentCrusadeSaveData = localStorage.getItem('penitentCrusadeSaveData');
  if (penitentCrusadeSaveData) {
    const currentGame = await getCurrentGame();

    numOfRerolls = currentGame.numOfRerolls;
    newStrats = currentGame.newStrats;
    newPrims = currentGame.newPrims;
    newSeconds = currentGame.newSeconds;
    newThrows = currentGame.newThrows;
    newArmorPassives = currentGame.newArmorPassives;
    newBoosts = currentGame.newBoosts;
    seesRulesOnOpen = currentGame.seesRulesOnOpen;
    for (let i = 0; i < currentGame.acquiredItems.length; i++) {
      const { item } = currentGame.acquiredItems[i];
      const { imgDir, accBody } = getItemMetaData(item);
      accBody.innerHTML += generateItemCard(item, false, imgDir);
    }
    return;
  }
  startNewRun();
};

const getCurrentDateTime = () => {
  const date = new Date();
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();
  const dateTimeString = `${dateString} ${timeString}`;
  return dateTimeString;
};

const saveDataAndRestart = async () => {
  const penitentCrusadeSaveData = localStorage.getItem('penitentCrusadeSaveData');
  if (!penitentCrusadeSaveData) {
    return;
  }
  const savedGames = JSON.parse(penitentCrusadeSaveData).savedGames;
  if (savedGames.length > 5) {
    console.log(
      'you cant have more than 5 saves. please choose a save to remove before proceeding',
    );
    // const modal = new bootstrap.Modal(saveDataManagementModal);
    // modal.show();
    // return
  }
  // make all saved game data currentGame = false
  let updatedSavedGames = await savedGames.map((sg) => {
    sg.currentGame = false;
    return sg;
  });

  // some of the same code as restarting a run, but we use this to populate the fresh save
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

  const dateTime = getCurrentDateTime();

  const newSaveObj = {
    acquiredItems: [],
    numOfRerolls: 15,
    newStrats,
    newPrims,
    newSeconds,
    newThrows,
    newArmorPassives,
    newBoosts,
    seesRulesOnOpen: false,
    dataName: `Difficulty: 3, Mission: 1 | ${dateTime}`,
    currentGame: true,
  };

  updatedSavedGames.push(newSaveObj);
  const newPenitentCrusadeSaveData = {
    savedGames: updatedSavedGames,
  };
  localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(newPenitentCrusadeSaveData));
  clearItemOptionsModal();
  stratagemAccordionBody.innerHTML = '';
  primaryAccordionBody.innerHTML = '';
  secondaryAccordionBody.innerHTML = '';
  throwableAccordionBody.innerHTML = '';
  armorPassiveAccordionBody.innerHTML = '';
  boosterAccordionBody.innerHTML = '';
  addDefaultItemsToAccordions();
};

addDefaultItemsToAccordions();

uploadSaveData();
