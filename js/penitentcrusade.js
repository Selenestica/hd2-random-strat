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
const missionFailedButton = document.getElementById('missionFailedButton');
const missionCounterText = document.getElementById('missionCounterText');
const oldDataDetectedModal = document.getElementById('oldDataDetectedModal');
const maxStarsPromptModal = document.getElementById('maxStarsPromptModal');
const applySpecialistButton = document.getElementById('applySpecialistButton');

let currentItems = [];
let missionCounter = 1;

const startNewRun = (spec = null) => {
  if (spec === null) {
    specialistNameText.innerHTML = '';
  }

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
  newBoosts = OGboostsList.filter((booster) => {
    return !starterBoosterNames.includes(booster.displayName);
  });

  currentItems = [];
  missionCounter = 1;
  specialist = spec;
  checkMissionButtons();
  // open the modal to show the rules
  document.addEventListener('DOMContentLoaded', () => {
    const modal = new bootstrap.Modal(flavorAndInstructionsModal);
    modal.show();
  });
  missionCounterText.innerHTML = `${getMissionText()}`;
  clearItemOptionsModal();
  if (spec !== null) {
    addDefaultItemsToAccordions(spec);
  }
};

const getDefaultItems = () => {
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
  return {
    defaultStrats,
    defaultPrims,
    defaultSeconds,
    defaultThrows,
    defaultArmorPassives,
    defaultBoosters,
  };
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

const checkMissionButtons = () => {
  if (missionCounter > 1) {
    applySpecialistButton.disabled = true;
  }
  if (missionCounter === 1) {
    applySpecialistButton.disabled = false;
  }
  if (missionCounter >= 22) {
    missionFailedButton.disabled = true;
    missionCompleteButton.disabled = true;
  }

  if (missionCounter < 21) {
    missionCompleteButton.disabled = false;
    missionFailedButton.disabled = false;
  }
};

const reduceMissionCounter = () => {
  const reduceByOneArray = [2, 4, 6, 9, 12, 15, 18, 21];
  const reduceByTwoArray = [7, 10, 13, 16, 19];
  if (reduceByOneArray.includes(missionCounter)) {
    missionCounter--;
  }
  if (reduceByTwoArray.includes(missionCounter)) {
    missionCounter -= 2;
  }
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
  missionCounter++;
  checkMissionButtons();
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
    return acquiredItem.displayName !== item.displayName;
  });

  reduceMissionCounter();
  checkMissionButtons();
  missionCounterText.innerHTML = `${getMissionText()}`;

  // create updated game data
  const newCurrentGameData = {
    ...currentGame,
    [listKeyName]: list,
    acquiredItems: newAcquiredItems,
    missionCounter,
    dataName: `${getMissionText()} | ${getCurrentDateTime()}`,
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

const maxStarsNotEarned = async () => {
  missionCounter++;
  checkMissionButtons();
  missionCounterText.innerHTML = `${getMissionText()}`;
  // save progress just for missionCounter
  const penitentCrusadeSaveData = JSON.parse(localStorage.getItem('penitentCrusadeSaveData'));
  const updatedSavedGames = await penitentCrusadeSaveData.savedGames.map((sg) => {
    if (sg.currentGame === true) {
      sg.missionCounter = missionCounter;
      return sg;
    }
    return sg;
  });
  let newObj = {
    ...penitentCrusadeSaveData,
    savedGames: updatedSavedGames,
  };
  localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(newObj));
};

const closeMaxStarsPromptModal = () => {
  const mspModal = new bootstrap.Modal(maxStarsPromptModal);
  mspModal.hide();

  // if that was the last mission, dont show rewards because theyre done
  if (missionCounter >= 21) {
    missionCounter++;
    checkMissionButtons();
    missionCounterText.innerHTML = `${getMissionText()}`;
    mspModal.hide();
    saveProgress();
    return;
  }

  const itemsModal = new bootstrap.Modal(itemOptionsModal);
  itemsModal.show();
  rollRewardOptions();
};

const getRewardsItemsLists = () => {
  let lists = [newStrats, newPrims, newSeconds, newThrows, newArmorPassives, newBoosts];
  if (specialist === null) {
    return lists;
  }

  lists = [newStrats];
  if (SPECIALISTS[specialist].armorPassives.length === 0) {
    lists.push(newArmorPassives);
  }
  if (SPECIALISTS[specialist].boosters.length === 0) {
    lists.push(newBoosts);
  }
  if (SPECIALISTS[specialist].primaries.length === 0) {
    lists.push(newPrims);
  }
  if (SPECIALISTS[specialist].secondaries.length === 0) {
    lists.push(newSeconds);
  }
  if (SPECIALISTS[specialist].throwables.length === 0) {
    lists.push(newThrows);
  }
  return lists;
};

const rollRewardOptions = async () => {
  let itemsLists = await getRewardsItemsLists();
  itemsLists = itemsLists.filter((list) => list.length > 0);
  if (itemsLists.length < 3) {
    console.log('NOT ENOUGH ITEMS TO SHOW');
    return;
  }
  const numbers = new Set();
  // your first reward pool will always have a stratagem or primary
  if (missionCounter === 1) {
    numbers.add(0);
  }
  while (numbers.size < 3) {
    const randomNumber = Math.floor(Math.random() * itemsLists.length);
    numbers.add(randomNumber);
  }
  const numsList = Array.from(numbers);
  for (let i = 0; i < numsList.length; i++) {
    const list = itemsLists[numsList[i]];
    const randomItem = await getRandomItem(list);
    currentItems.push(randomItem);
    const vals = getItemMetaData(randomItem);
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
    const vals = getItemMetaData(acquiredItems[numsList[i]]);
    const randomItem = acquiredItems[numsList[i]];
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

const getRandomItemList = async (list) => {
  const num = Math.random();
  const saList = await list.filter((item) => {
    return item.tier === 's' || item.tier === 'a';
  });
  const bcList = await list.filter((item) => {
    return item.tier === 'b' || item.tier === 'c';
  });
  if (bcList.length === 0) {
    return saList;
  }
  if (saList.length === 0) {
    return bcList;
  }
  if (missionCounter <= 7) {
    if (num < 0.05) {
      return saList;
    }
    return bcList;
  }
  if (missionCounter <= 16) {
    if (num < 0.08) {
      return saList;
    }
    return bcList;
  }
  if (missionCounter <= 21) {
    if (num < 0.11) {
      return saList;
    }
    return bcList;
  }
};

const getRandomItem = async (list) => {
  const listToUse = await getRandomItemList(list);
  const item = listToUse[Math.floor(Math.random() * listToUse.length)];
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

const addDefaultItemsToAccordions = async (spec = null) => {
  // create default item lists for later use
  const {
    defaultArmorPassives,
    defaultBoosters,
    defaultPrims,
    defaultSeconds,
    defaultStrats,
    defaultThrows,
  } = await getDefaultItems();

  // if a specialist was applied, reset the accordions
  if (spec !== null) {
    stratagemAccordionBody.innerHTML = '';
    primaryAccordionBody.innerHTML = '';
    secondaryAccordionBody.innerHTML = '';
    throwableAccordionBody.innerHTML = '';
    armorPassiveAccordionBody.innerHTML = '';
    boosterAccordionBody.innerHTML = '';
  }

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
  for (let i = 0; i < defaultBoosters.length; i++) {
    boosterAccordionBody.innerHTML += generateItemCard(defaultBoosters[i], false, 'equipment');
  }
};

const applySpecialist = () => {
  if (specialist === null) {
    return;
  }
  specialistNameText.innerHTML = SPECIALISTS[specialist].displayName;
  getStartingItems();
  startNewRun(specialist);
  saveProgress();
};

const saveProgress = async (item = null) => {
  let obj = {};
  const penitentCrusadeSaveData = localStorage.getItem('penitentCrusadeSaveData');
  if (!penitentCrusadeSaveData) {
    obj = {
      savedGames: [
        {
          acquiredItems: item ? [item] : [],
          newStrats,
          newPrims,
          newSeconds,
          newThrows,
          newArmorPassives,
          newBoosts,
          seesRulesOnOpen: false,
          dataName: `${getMissionText()} | ${getCurrentDateTime()}${
            specialist !== null ? ' | ' + SPECIALISTS[specialist].displayName : ''
          }`,
          currentGame: true,
          missionCounter,
          specialist,
        },
      ],
    };
    localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(obj));
    missionCounterText.innerHTML = `${getMissionText()}`;
    return;
  }
  const data = JSON.parse(penitentCrusadeSaveData);
  const newSavedGames = await data.savedGames.map((sg) => {
    if (sg.currentGame === true) {
      let updatedItems = sg.acquiredItems;
      if (item) {
        updatedItems.push(item);
      }
      sg = {
        ...sg,
        acquiredItems: updatedItems,
        newStrats,
        newPrims,
        newSeconds,
        newThrows,
        newArmorPassives,
        newBoosts,
        seesRulesOnOpen: false,
        dataName: `${getMissionText()} | ${getCurrentDateTime()}${
          specialist !== null ? ' | ' + SPECIALISTS[specialist].displayName : ''
        }`,
        currentGame: true,
        missionCounter,
        specialist,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };
  missionCounterText.innerHTML = `${getMissionText()}`;
  localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(obj));
};

const uploadSaveData = async () => {
  const penitentCrusadeSaveData = localStorage.getItem('penitentCrusadeSaveData');
  if (penitentCrusadeSaveData) {
    if (!JSON.parse(penitentCrusadeSaveData).savedGames) {
      localStorage.removeItem('penitentCrusadeSaveData');
      const modal = new bootstrap.Modal(oldDataDetectedModal);
      modal.show();
      startNewRun();
      return;
    }
    const currentGame = await getCurrentGame();
    newStrats = currentGame.newStrats;
    newPrims = currentGame.newPrims;
    newSeconds = currentGame.newSeconds;
    newThrows = currentGame.newThrows;
    newArmorPassives = currentGame.newArmorPassives;
    newBoosts = currentGame.newBoosts;
    seesRulesOnOpen = currentGame.seesRulesOnOpen;
    missionCounter = currentGame.missionCounter;
    dataName = currentGame.dataName;
    specialist = currentGame.specialist ?? null;
    missionCounterText.innerHTML = `${getMissionText()}`;
    checkMissionButtons();
    if (currentGame.specialist !== null) {
      specialistNameText.innerHTML = SPECIALISTS[specialist].displayName;
    }
    stratagemAccordionBody.innerHTML = '';
    primaryAccordionBody.innerHTML = '';
    secondaryAccordionBody.innerHTML = '';
    throwableAccordionBody.innerHTML = '';
    armorPassiveAccordionBody.innerHTML = '';
    boosterAccordionBody.innerHTML = '';
    await getStartingItems();
    await addDefaultItemsToAccordions(specialist);
    for (let i = 0; i < currentGame.acquiredItems.length; i++) {
      const item = currentGame.acquiredItems[i];
      const { imgDir, accBody } = getItemMetaData(item);
      accBody.innerHTML += generateItemCard(item, false, imgDir);
    }
    return;
  }
  startNewRun();
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

  specialist = null;
  await getStartingItems();

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
  newBoosts = OGboostsList.filter((booster) => {
    return !starterBoosterNames.includes(booster.displayName);
  });
  currentItems = [];
  missionCounter = 1;
  missionCounterText.innerHTML = `${getMissionText()}`;
  checkMissionButtons();
  const newSaveObj = {
    acquiredItems: [],
    newStrats,
    newPrims,
    newSeconds,
    newThrows,
    newArmorPassives,
    newBoosts,
    seesRulesOnOpen: false,
    dataName: `${getMissionText()} | ${getCurrentDateTime()}`,
    currentGame: true,
    missionCounter: 1,
    specialist,
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
  specialistNameText.innerHTML = '';
  addDefaultItemsToAccordions();
};

const clearSaveDataAndRestart = () => {
  localStorage.removeItem('penitentCrusadeSaveData');
  startNewRun();
  getStartingItems();
  stratagemAccordionBody.innerHTML = '';
  primaryAccordionBody.innerHTML = '';
  secondaryAccordionBody.innerHTML = '';
  throwableAccordionBody.innerHTML = '';
  armorPassiveAccordionBody.innerHTML = '';
  boosterAccordionBody.innerHTML = '';
  missionCounterText.innerHTML = `${getMissionText()}`;
  specialistNameText.innerHTML = '';
  addDefaultItemsToAccordions();
};

if (!localStorage.getItem('penitentCrusadeSaveData')) {
  addDefaultItemsToAccordions();
}

uploadSaveData();
