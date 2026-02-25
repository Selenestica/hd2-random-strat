const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody",
);
const primaryAccordionBody = document.getElementById("PrimariesAccordionBody");
const secondaryAccordionBody = document.getElementById(
  "SecondariesAccordionBody",
);
const stratagemAccordionBody = document.getElementById(
  "StratagemsAccordionBody",
);
const throwableAccordionBody = document.getElementById(
  "ThrowablesAccordionBody",
);
const armorPassiveAccordionBody = document.getElementById(
  "ArmorsAccordionBody",
);
const boosterAccordionBody = document.getElementById("BoostersAccordionBody");
const flavorAndInstructionsModal = document.getElementById(
  "flavorAndInstructionsModal",
);
const itemOptionsModalBody = document.getElementById("itemOptionsModalBody");
const itemOptionsModalLabel = document.getElementById("itemOptionsModalLabel");
const itemOptionsModalHeaderItemName = document.getElementById(
  "itemOptionsModalHeaderItemName",
);
const itemOptionsModal = document.getElementById("itemOptionsModal");
const missionCompleteButton = document.getElementById("missionCompleteButton");
const missionFailedButton = document.getElementById("missionFailedButton");
const missionCompleteButtonDiv = document.getElementById(
  "missionCompleteButtonDiv",
);
const missionFailedButtonDiv = document.getElementById(
  "missionFailedButtonDiv",
);
const downloadPDFButtonDiv = document.getElementById("downloadPDFButtonDiv");
const missionCounterText = document.getElementById("missionCounterText");
const oldDataDetectedModal = document.getElementById("oldDataDetectedModal");
const maxStarsPromptModal = document.getElementById("maxStarsPromptModal");
const applySpecialistButton = document.getElementById("applySpecialistButton");
const timeRemainingInput = document.getElementById("timeRemainingInput");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");
const hellDiversMobilizeCheckbox = document.getElementById("warbond3");
const pcDiffRadioSolo = document.getElementById("pcDiffRadioSolo");
const pcDiffRadioQuick = document.getElementById("pcDiffRadioQuick");
const pcDiffRadioNormal = document.getElementById("pcDiffRadioNormal");
const pcDiffRadioSuper = document.getElementById("pcDiffRadioSuper");
const pcDiffRadioSuperSolo = document.getElementById("pcDiffRadioSuperSolo");
const pcTitleName = document.getElementById("pcTitleName");
const diff4Input = document.getElementById("diff4Input");
const diff6Input = document.getElementById("diff6Input");
const diff8Input = document.getElementById("diff8Input");
const starsOptionsDiv = document.getElementById("starsOptionsDiv");

let selectedStars = 1;
let missionsFailed = 0;
let missionTimes = [];
let currentItems = [];
let currentPunishmentItems = [];
let missionCounter = 1;
let difficulty = "normal";
hellDiversMobilizeCheckbox.disabled = true;
let masterPrimsList = [];
let masterSecondsList = [];
let masterThrowsList = [];
let masterBoostsList = [];
let masterStratsList = [];
let masterArmorPassivesList = [];

document.addEventListener("change", (e) => {
  if (e.target.name === "starsRadio") {
    selectedStars = Number(e.target.value);
    console.log(selectedStars);
  }
});

// whenever maxStarsModal opens, generate how many stars options they will have
// options will reset when modal is closed
maxStarsPromptModal.addEventListener("show.bs.modal", function () {
  genStarsOptions();
});

timeRemainingInput.addEventListener("input", () => {
  let value = parseInt(timeRemainingInput.value, 10);

  if (isNaN(value)) {
    value = 0;
  }

  if (value < 0) value = 0;
  if (value > 100) value = 100;

  timeRemainingInput.value = value;
});

// will need to keep track of master list
for (let y = 0; y < warbondCheckboxes.length; y++) {
  warbondCheckboxes[y].addEventListener("change", (e) => {
    if (e.target.checked && !warbondCodes.includes(e.srcElement.id)) {
      warbondCodes.push(e.srcElement.id);
    }
    if (!e.target.checked && warbondCodes.includes(e.srcElement.id)) {
      const indexToRemove = warbondCodes.indexOf(e.srcElement.id);
      warbondCodes.splice(indexToRemove, 1);
    }
    filterItemsByWarbond();
    currentItems = [];
    applySpecialist("default");
    genSpecialistsCards();
  });
}

const diffRadios = [
  pcDiffRadioSolo,
  pcDiffRadioQuick,
  pcDiffRadioNormal,
  pcDiffRadioSuper,
  pcDiffRadioSuperSolo,
];
for (let w = 0; w < diffRadios.length; w++) {
  diffRadios[w].addEventListener("change", async (e) => {
    if (e.srcElement.id === "pcDiffRadioSolo") {
      difficulty = "solo";
      pcTitleName.innerHTML = "Solo Crusade";
    }
    if (e.srcElement.id === "pcDiffRadioQuick") {
      difficulty = "quick";
      pcTitleName.innerHTML = "Quick Crusade";
    }
    if (e.srcElement.id === "pcDiffRadioNormal") {
      difficulty = "normal";
      pcTitleName.innerHTML = "Penitent Crusade";
    }
    if (e.srcElement.id === "pcDiffRadioSuper") {
      difficulty = "super";
      pcTitleName.innerHTML = "Super Penitent Crusade";
    }
    if (e.srcElement.id === "pcDiffRadioSuperSolo") {
      difficulty = "supersolo";
      pcTitleName.innerHTML = "Solo Super Crusade";
    }
    await changeDifficulty();
    await writeItems();
  });
}

const filterItemsByWarbond = async () => {
  const sourceLists = [
    masterPrimsList,
    masterSecondsList,
    masterThrowsList,
    masterBoostsList,
    masterStratsList,
    masterArmorPassivesList,
  ];
  const filteredLists = await sourceLists.map((list) =>
    list.filter(
      (item) =>
        warbondCodes.includes(item.warbondCode) || item.warbondCode === "none",
    ),
  );

  [newPrims, newSeconds, newThrows, newBoosts, newStrats, newArmorPassives] =
    filteredLists;
};

const writeItems = () => {
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

  // primarily for warbond filtering
  masterPrimsList = cloneList(newPrims);
  masterSecondsList = cloneList(newSeconds);
  masterThrowsList = cloneList(newThrows);
  masterBoostsList = cloneList(newBoosts);
  masterStratsList = cloneList(newStrats);
  masterArmorPassivesList = cloneList(newArmorPassives);
};

const startNewRun = async (spec = null, diff = null, removingSpec = null) => {
  // probably want to set all warbond codes to checked just in case
  if (!removingSpec) {
    warbondCodes = [...masterWarbondCodes];
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].checked = true;
    }
  }

  if (spec === null) {
    specialistNameText.innerHTML = "";
  }

  if (!removingSpec && !spec) {
    await writeItems();
  }

  missionTimes = [];
  missionsFailed = 0;
  currentItems = [];
  currentPunishmentItems = [];
  missionCounter = diff === "super" || diff === "supersolo" ? 3 : 1;
  difficulty = diff ? diff : "normal";
  specialist = spec;
  checkMissionButtons();
  // open the modal to show the rules
  if (!removingSpec) {
    document.addEventListener("DOMContentLoaded", () => {
      const modal = new bootstrap.Modal(flavorAndInstructionsModal);
      modal.show();
    });
    missionCounterText.innerHTML = `${getMissionText()}`;
  }
  clearItemOptionsModal();
  if (spec !== null || removingSpec) {
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

const checkMissionButtons = () => {
  // default behaviour
  hellDiversMobilizeCheckbox.disabled = true;
  applySpecialistButton.disabled = false;
  for (let u = 0; u < warbondCheckboxes.length; u++) {
    warbondCheckboxes[u].disabled = false;
  }
  for (let y = 0; y < diffRadios.length; y++) {
    diffRadios[y].disabled = false;
  }

  // disables challenge settings if past the first mission
  // for normal and solo
  if (
    missionCounter !== 1 &&
    (difficulty === "normal" || difficulty === "solo")
  ) {
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].disabled = true;
    }
    for (let j = 0; j < diffRadios.length; j++) {
      diffRadios[j].disabled = true;
    }
    applySpecialistButton.disabled = true;
  }
  // for super PC and solo super PC
  if (
    missionCounter > 3 &&
    (difficulty === "super" || difficulty === "supersolo")
  ) {
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].disabled = true;
    }
    for (let j = 0; j < diffRadios.length; j++) {
      diffRadios[j].disabled = true;
    }
    applySpecialistButton.disabled = true;
  }
  // for quick PC
  if (missionCounter > 11 && difficulty === "quick") {
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].disabled = true;
    }
    for (let j = 0; j < diffRadios.length; j++) {
      diffRadios[j].disabled = true;
    }
    applySpecialistButton.disabled = true;
  }

  // conditional for when challenge is over
  if (missionCounter >= 23) {
    missionFailedButton.disabled = true;
    missionCompleteButton.disabled = true;
    // hide the mission buttons, and show download items buttons
    missionCompleteButton.style.display = "none";
    missionFailedButton.style.display = "none";
    downloadPDFButtonDiv.style.display = "block";
  }

  // conditional for an ongoing challenge
  if (missionCounter < 21) {
    missionCompleteButton.disabled = false;
    missionFailedButton.disabled = false;
    missionCompleteButton.style.display = "block";
    missionFailedButton.style.display = "block";
    downloadPDFButtonDiv.style.display = "none";
  }
};

const reduceMissionCounter = () => {
  const reduceByOneArray = [2, 4, 6, 9, 12, 15, 18, 21];
  const reduceByTwoArray = [7, 10, 13, 16, 19, 22];
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
  if (missionCounter - 1 > missionTimes.length) {
    missionTimes.push(parseInt(timeRemainingInput.value, 10));
  }
  timeRemainingInput.value = 0;
  saveProgress(item);
};

const claimPunishment = async (currentItemIndex) => {
  const item = currentPunishmentItems[currentItemIndex];

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
  const currentGame = await getCurrentGame("penitentCrusadeSaveData");
  const acquiredItems = currentGame.acquiredItems;
  const newAcquiredItems = acquiredItems.filter((acquiredItem) => {
    return acquiredItem.displayName !== item.displayName;
  });

  reduceMissionCounter();
  checkMissionButtons();
  missionCounterText.innerHTML = `${getMissionText()}`;

  // create updated game data
  missionsFailed++;
  const newCurrentGameData = {
    ...currentGame,
    [listKeyName]: list,
    acquiredItems: newAcquiredItems,
    missionCounter,
    dataName: `${getMissionText()} | ${getCurrentDateTime()}`,
    missionsFailed,
  };

  // set the updated data into local storage
  let saveData = JSON.parse(localStorage.getItem("penitentCrusadeSaveData"));
  const notCurrentGames = await saveData.savedGames.filter((game) => {
    return game.currentGame !== true;
  });

  notCurrentGames.push(newCurrentGameData);
  saveData = {
    ...saveData,
    savedGames: notCurrentGames,
  };

  localStorage.setItem("penitentCrusadeSaveData", JSON.stringify(saveData));

  const modal = bootstrap.Modal.getInstance(itemOptionsModal);
  modal.hide();
  currentPunishmentItems = [];
  clearItemOptionsModal();
};

const getItemMetaData = (item) => {
  const { category, type } = item;
  let imgDir;
  let list;
  let accBody;
  let typeText;
  let listKeyName;
  if (type === "Stratagem") {
    imgDir = "svgs";
    list = newStrats;
    accBody = stratagemAccordionBody;
    typeText = "Stratagem";
    listKeyName = "newStrats";
  }
  if (category === "primary") {
    imgDir = "equipment";
    list = newPrims;
    accBody = primaryAccordionBody;
    typeText = "Primary";
    listKeyName = "newPrims";
  }
  if (category === "booster") {
    imgDir = "equipment";
    list = newBoosts;
    accBody = boosterAccordionBody;
    typeText = "Booster";
    listKeyName = "newBoosts";
  }
  if (category === "secondary") {
    imgDir = "equipment";
    list = newSeconds;
    accBody = secondaryAccordionBody;
    typeText = "Secondary";
    listKeyName = "newSeconds";
  }
  if (category === "throwable") {
    imgDir = "equipment";
    list = newThrows;
    accBody = throwableAccordionBody;
    typeText = "Throwable";
    listKeyName = "newThrows";
  }
  if (category === "armor") {
    imgDir = "armorpassives";
    list = newArmorPassives;
    accBody = armorPassiveAccordionBody;
    typeText = "Armor Passive";
    listKeyName = "newArmorPassives";
  }
  return { imgDir, list, accBody, typeText, listKeyName };
};

const genStarsOptions = async () => {
  starsOptionsDiv.innerHTML = "";
  const maxStars = await getMaxStarsForMission(missionCounter);
  selectedStars = maxStars;
  for (let i = 0; i < maxStars; i++) {
    starsOptionsDiv.innerHTML += `
      <input
        type="radio"
        class="btn-check"
        name="starsRadio"
        id="starsRadio${i + 1}"
        autocomplete="off"
        ${i + 1 === selectedStars ? "checked" : ""}
        value="${i + 1}"
      />
      <label class="btn btn-outline-primary text-white" for="starsRadio${i + 1}">
        ${i + 1}</label
      >
    `;
  }
};

const closeMaxStarsPromptModal = () => {
  const mspModalElement = document.getElementById("maxStarsPromptModal");
  const mspModal = new bootstrap.Modal(maxStarsPromptModal);
  mspModal.hide();

  // if that was the last mission, dont show rewards because theyre done
  if (missionCounter >= 22) {
    missionCounter++;
    checkMissionButtons();
    missionTimes.push(parseInt(timeRemainingInput.value, 10));
    missionCounterText.innerHTML = `${getMissionText()}`;
    mspModal.hide();
    saveProgress();
    return;
  }

  // Wait until modal is fully hidden before showing next
  mspModalElement.addEventListener("hidden.bs.modal", function handleHidden() {
    mspModalElement.removeEventListener("hidden.bs.modal", handleHidden); // Clean up
    const itemsModal = new bootstrap.Modal(itemOptionsModal);
    itemsModal.show();
    rollRewardOptions();
  });
};

const getRewardsItemsLists = () => {
  let lists = [
    newStrats,
    newPrims,
    newSeconds,
    newThrows,
    newArmorPassives,
    newBoosts,
  ];
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
  let rewardQuantity = selectedStars - 1;
  if (difficulty === "super" || difficulty === "supersolo") {
    rewardQuantity = selectedStars - 2;
  }
  if (specialist !== null) {
    rewardQuantity -= 1;
  }
  if (rewardQuantity < 1) {
    rewardQuantity = 1;
  }
  console.log(rewardQuantity);
  // if there are items that were rolled previously but not chosen, show those items again
  // so player isnt able to simply reroll for free
  if (currentItems.length > 0) {
    for (let i = 0; i < rewardQuantity; i++) {
      const vals = await getItemMetaData(currentItems[i]);
      itemOptionsModalBody.innerHTML += await generateItemCard(
        currentItems[i],
        true,
        vals.imgDir,
        i,
        vals.typeText,
      );
    }
    return;
  }

  let itemsLists = await getRewardsItemsLists();
  itemsLists = itemsLists.filter((list) => list.length > 0);
  if (itemsLists.length < 1) {
    console.log("NOT ENOUGH ITEMS TO SHOW");
    return;
  }

  if (currentItems.length === 0) {
    // roll antitank stratagems for non-K9 Handler after mission 7
    if (missionCounter === 7 && specialist !== "22") {
      const antitankStratsList = await itemsLists[0].filter(
        (strat) => strat.antitank === true,
      );
      const randomItemIndices = await getUniqueRandomNumbers(
        0,
        antitankStratsList.length - 1,
        rewardQuantity,
      );
      for (let j = 0; j < randomItemIndices.length; j++) {
        const randomItem = antitankStratsList[randomItemIndices[j]];
        currentItems.push(randomItem);
        const vals = getItemMetaData(randomItem);
        itemOptionsModalBody.innerHTML += generateItemCard(
          randomItem,
          true,
          vals.imgDir,
          j,
          vals.typeText,
        );
      }

      // save current items in LS
      if (missionCounter !== 1) {
        saveProgress();
      }
      return;
    }

    const numbers = new Set();

    // your first reward pool will always have a stratagem
    // unless K9 Handler was chosen, of course
    if (
      missionCounter === 1 &&
      (difficulty === "solo" || difficulty === "normal")
    ) {
      numbers.add(0);
    }
    if (
      missionCounter === 3 &&
      (difficulty === "super" || difficulty === "supersolo")
    ) {
      numbers.add(0);
    }
    if (missionCounter === 11 && difficulty === "quick") {
      numbers.add(0);
    }

    let maxNumbers = 4;
    if (specialist !== null) {
      maxNumbers = 3;
    }
    if (itemsLists.length < maxNumbers) {
      maxNumbers = itemsLists.length;
    }
    while (numbers.size < maxNumbers) {
      const randomNumber = Math.floor(Math.random() * itemsLists.length);
      numbers.add(randomNumber);
    }

    const numsList = Array.from(numbers);
    for (let i = 0; i < rewardQuantity; i++) {
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

    // save current items in LS
    if (missionCounter !== 1) {
      saveProgress();
    }
  }
};

const rollPunishmentOptions = async () => {
  if (currentPunishmentItems.length > 0) {
    for (let i = 0; i < currentPunishmentItems.length; i++) {
      const vals = getItemMetaData(currentPunishmentItems[i]);
      itemOptionsModalBody.innerHTML += generateItemCard(
        currentPunishmentItems[i],
        true,
        vals.imgDir,
        i,
        vals.typeText,
        true,
      );
    }
    const modal = new bootstrap.Modal(itemOptionsModal);
    modal.show();
    return;
  }

  let maxPunishmentItems = 3;
  const game = await getCurrentGame("penitentCrusadeSaveData");
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
    currentPunishmentItems.push(randomItem);
    itemOptionsModalBody.innerHTML += generateItemCard(
      randomItem,
      true,
      vals.imgDir,
      i,
      vals.typeText,
      true,
    );
  }
  saveProgress();
};

const isDropRateInputFormattedCorrectly = (input) => {
  const regex = /^(100|[1-9]?\d),(100|[1-9]?\d),(100|[1-9]?\d)$/;
  if (typeof input === "string") {
    return regex.test(input);
  }
  return false;
};

const formatDropRateInput = (input) => {
  return input.split(",").map(Number);
};

const getDropRate = () => {
  const startingRate = [0, 20, 70];
  let rate = [5, 25, 75];
  if (missionCounter <= 2) {
    return startingRate;
  } else if (missionCounter > 2 && missionCounter <= 7) {
    rate = diff4Input.value;
  } else if (missionCounter > 7 && missionCounter <= 13) {
    rate = diff6Input.value;
  } else if (missionCounter > 13) {
    rate = diff8Input.value;
  }
  if (!isDropRateInputFormattedCorrectly(rate)) {
    return [5, 25, 75];
  }
  return formatDropRateInput(rate);
};

const getRandomItemListByTier = async (list) => {
  // apply OG specialist trait here probably
  const num = Math.random() * 100;
  const sList = await list.filter((item) => {
    return item.tier === "s";
  });
  const aList = await list.filter((item) => {
    return item.tier === "a";
  });
  const bList = await list.filter((item) => {
    return item.tier === "b";
  });
  const cList = await list.filter((item) => {
    return item.tier === "c";
  });
  // if the list that we want has no items in it, start from bList and go up rarity until a populated list is found
  const dropRate = await getDropRate();
  console.log(dropRate, num);
  if (num <= dropRate[0] && sList.length > 0) {
    console.log(sList);
    return sList;
  }
  if (num <= dropRate[1] && num > dropRate[0] && aList.length > 0) {
    console.log(aList);
    return aList;
  }
  if (num <= dropRate[2] && num > dropRate[1] && bList.length > 0) {
    console.log(bList);
    return bList;
  }
  if (num > dropRate[2] && cList.length > 0) {
    console.log(cList);
    return cList;
  }
  if (bList.length > 0) {
    console.log("BACKUP B!!!", bList);
    return bList;
  }
  if (aList.length > 0) {
    console.log("BACKUP A!!!", aList);
    return aList;
  }
  if (sList.length > 0) {
    console.log("BACKUP S!!!", sList);
    return sList;
  }
  return list;
};

const getRandomItem = async (list) => {
  let listToUse = await getRandomItemListByTier(list);

  // if at the end of diff 5, get all anti-tank options from the list and use the anti-tank list
  // if no anti-tank options in the list, that probably means they already rolled an anti-tank option so just pick a random item like normal
  if (missionCounter === 7) {
    const antitankItems = await list.filter((it) => it.antitank === true);
    if (antitankItems.length > 0) {
      listToUse = antitankItems;
    }
  }

  const item = listToUse[Math.floor(Math.random() * listToUse.length)];
  if (starterStratNames.includes(item.displayName)) {
    return getRandomItem(list);
  }
  return item;
};

// adds cyan outline around stratagems that must be taken because of specialist
const getMandatoryStratStyle = (stratName) => {
  let trueDefaultStrats = [
    "One True Flag",
    "Defoliation Tool",
    "Orbital EMS Strike",
    "Orbital Smoke Strike",
    "Eagle Smoke Strike",
    "EMS Mortar Sentry",
    "Shield Generator Relay",
  ];
  if (
    difficulty === "super" ||
    difficulty === "quick" ||
    difficulty === "supersolo"
  ) {
    trueDefaultStrats.push("Ballistic Shield");
  }
  if (
    difficulty === "solo" ||
    difficulty === "quick" ||
    difficulty === "supersolo"
  ) {
    trueDefaultStrats.push("Orbital Precision Strike");
  }
  if (difficulty === "quick") {
    trueDefaultStrats = trueDefaultStrats.concat([
      "Anti-Tank Mines",
      "Grenadier Battlement",
      "Eagle 110mm Rocket Pods",
    ]);
  }
  if (
    (!trueDefaultStrats.includes(stratName) &&
      starterStratNames.includes(stratName)) ||
    (specialist === "2" && stratName === "One True Flag") ||
    (specialist === "13" && stratName === "Ballistic Shield")
  ) {
    return "pcMandatoryStratagemClass";
  }
  return "";
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
  let mandatoryStratStyle = getMandatoryStratStyle(item.displayName);
  let style = "col-2";
  let modalTextStyle = "pcItemCardText";
  let fcn = "";
  let typeText = "";
  if (inModal) {
    style = "pcModalItemCards col-2";
    modalTextStyle = "";
    fcn = !missionFailed
      ? `claimItem(${currentItemIndex})`
      : `claimPunishment(${currentItemIndex})`;
    typeText = `<p class="card-title fst-italic text-white">${type}</p>`;
  }
  return `
    <div onclick="${fcn}" class="card ${mandatoryStratStyle} d-flex ${style} pcNoHoverItemCards mx-1">
    ${typeText}
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
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
  itemOptionsModalBody.innerHTML = "";
};

const addDefaultItemsToAccordions = async (spec = null) => {
  // create default item lists for later use
  // change default items according to difficulty
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
    stratagemAccordionBody.innerHTML = "";
    primaryAccordionBody.innerHTML = "";
    secondaryAccordionBody.innerHTML = "";
    throwableAccordionBody.innerHTML = "";
    armorPassiveAccordionBody.innerHTML = "";
    boosterAccordionBody.innerHTML = "";
  }

  for (let i = 0; i < defaultStrats.length; i++) {
    stratagemAccordionBody.innerHTML += generateItemCard(
      defaultStrats[i],
      false,
      "svgs",
    );
  }
  for (let i = 0; i < defaultPrims.length; i++) {
    primaryAccordionBody.innerHTML += generateItemCard(
      defaultPrims[i],
      false,
      "equipment",
    );
  }
  for (let i = 0; i < defaultSeconds.length; i++) {
    secondaryAccordionBody.innerHTML += generateItemCard(
      defaultSeconds[i],
      false,
      "equipment",
    );
  }
  for (let i = 0; i < defaultThrows.length; i++) {
    throwableAccordionBody.innerHTML += generateItemCard(
      defaultThrows[i],
      false,
      "equipment",
    );
  }
  for (let i = 0; i < defaultArmorPassives.length; i++) {
    armorPassiveAccordionBody.innerHTML += generateItemCard(
      defaultArmorPassives[i],
      false,
      "armorpassives",
    );
  }
  for (let i = 0; i < defaultBoosters.length; i++) {
    boosterAccordionBody.innerHTML += generateItemCard(
      defaultBoosters[i],
      false,
      "equipment",
    );
  }
};

const applySpecialistRules = async () => {
  // remove support weapons for The Preacher
  if (specialist === "16") {
    newStrats = await newStrats.filter((ns) => !ns.tags.includes("Weapons"));
    return;
  }

  // remove eagles and orbitals for The Hellpod Enthusiast
  if (specialist === "17") {
    newStrats = await newStrats.filter(
      (ns) => ns.category !== "Eagle" && ns.category !== "Orbital",
    );
    return;
  }

  // remove all stratagems for The K9 Handler
  if (specialist === "22") {
    newStrats = [];
    return;
  }
};

const applySpecialist = async (specToApply = null) => {
  if (specialist === null) {
    return;
  }

  if (specToApply === "default") {
    specialist = null;
  }

  specToApply === "default"
    ? (specialistNameText.innerHTML = "")
    : (specialistNameText.innerHTML = SPECIALISTS[specialist].displayName);
  if (specToApply) {
    stratagemAccordionBody.innerHTML = "";
    primaryAccordionBody.innerHTML = "";
    secondaryAccordionBody.innerHTML = "";
    throwableAccordionBody.innerHTML = "";
    armorPassiveAccordionBody.innerHTML = "";
    boosterAccordionBody.innerHTML = "";
  }
  await getStartingItems(difficulty);
  startNewRun(specialist, difficulty, true);
  const traitSpecialists = ["16", "17", "22"];
  if (traitSpecialists.includes(specialist)) {
    await applySpecialistRules();
  }
  saveProgress();
};

const changeDifficulty = async (uploadedDiff = null) => {
  // go here when page loads
  if (uploadedDiff) {
    if (uploadedDiff === "normal") {
      pcTitleName.innerHTML = "Penitent Crusade";
    }
    if (uploadedDiff === "super") {
      pcTitleName.innerHTML = "Super Penitent Crusade";
    }
    if (uploadedDiff === "solo") {
      pcTitleName.innerHTML = "Solo Crusade";
    }
    if (uploadedDiff === "quick") {
      pcTitleName.innerHTML = "Quick Crusade";
    }
    if (uploadedDiff === "supersolo") {
      pcTitleName.innerHTML = "Solo Super Crusade";
    }
    return;
  }

  // go here when the user clicks the button
  saveDataAndRestart(difficulty);
};

const saveProgress = async (item = null) => {
  let obj = {};
  const penitentCrusadeSaveData = localStorage.getItem(
    "penitentCrusadeSaveData",
  );
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
          dataName: `${difficulty.toUpperCase()} | ${getMissionText()} | ${getCurrentDateTime()}${
            specialist !== null
              ? " | " + SPECIALISTS[specialist].displayName
              : ""
          }`,
          currentGame: true,
          missionCounter,
          specialist,
          difficulty,
          warbondCodes,
          missionsFailed: missionsFailed ?? 0,
          missionTimes: missionTimes ?? [],
        },
      ],
    };
    localStorage.setItem("penitentCrusadeSaveData", JSON.stringify(obj));
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
        currentItems,
        currentPunishmentItems,
        acquiredItems: updatedItems,
        newStrats,
        newPrims,
        newSeconds,
        newThrows,
        newArmorPassives,
        newBoosts,
        seesRulesOnOpen: false,
        dataName: sg.editedName
          ? sg.dataName
          : `${difficulty.toUpperCase()} | ${getMissionText()} | ${getCurrentDateTime()}${
              specialist !== null
                ? " | " + SPECIALISTS[specialist].displayName
                : ""
            }`,
        currentGame: true,
        missionCounter,
        specialist,
        difficulty,
        warbondCodes,
        missionsFailed: missionsFailed ?? 0,
        missionTimes: missionTimes ?? [],
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };
  missionCounterText.innerHTML = `${getMissionText()}`;
  localStorage.setItem("penitentCrusadeSaveData", JSON.stringify(obj));
};

const uploadSaveData = async () => {
  const penitentCrusadeSaveData = localStorage.getItem(
    "penitentCrusadeSaveData",
  );
  if (penitentCrusadeSaveData) {
    if (!JSON.parse(penitentCrusadeSaveData).savedGames) {
      localStorage.removeItem("penitentCrusadeSaveData");
      const modal = new bootstrap.Modal(oldDataDetectedModal);
      modal.show();
      await getStartingItems();
      startNewRun();
      return;
    }

    const currentGame = await getCurrentGame("penitentCrusadeSaveData");
    difficulty = currentGame.difficulty ?? "normal";
    warbondCodes = currentGame.warbondCodes ?? warbondCodes;
    changeDifficulty(currentGame.difficulty ?? "normal");
    newStrats = currentGame.newStrats;
    newPrims = currentGame.newPrims;
    newSeconds = currentGame.newSeconds;
    newThrows = currentGame.newThrows;
    newArmorPassives = currentGame.newArmorPassives;
    newBoosts = currentGame.newBoosts;
    seesRulesOnOpen = currentGame.seesRulesOnOpen;
    missionCounter = currentGame.missionCounter;
    dataName = currentGame.dataName;
    currentItems = currentGame.currentItems ?? [];
    currentPunishmentItems = currentGame.currentPunishmentItems ?? [];
    specialist = currentGame.specialist ?? null;
    missionsFailed = currentGame.missionsFailed ?? 0;
    missionTimes = currentGame.missionTimes ?? [];
    missionCounterText.innerHTML = `${getMissionText()}`;
    checkMissionButtons();
    if (currentGame.specialist !== null) {
      specialistNameText.innerHTML = SPECIALISTS[specialist].displayName;
    }
    stratagemAccordionBody.innerHTML = "";
    primaryAccordionBody.innerHTML = "";
    secondaryAccordionBody.innerHTML = "";
    throwableAccordionBody.innerHTML = "";
    armorPassiveAccordionBody.innerHTML = "";
    boosterAccordionBody.innerHTML = "";

    // primarily for warbond filtering
    if (missionCounter === 1) {
      masterPrimsList = cloneList(newPrims);
      masterSecondsList = cloneList(newSeconds);
      masterThrowsList = cloneList(newThrows);
      masterBoostsList = cloneList(newBoosts);
      masterStratsList = cloneList(newStrats);
      masterArmorPassivesList = cloneList(newArmorPassives);
    }

    await getStartingItems(currentGame.difficulty);
    await addDefaultItemsToAccordions(specialist);
    genSpecialistsCards();
    for (let i = 0; i < currentGame.acquiredItems.length; i++) {
      const item = currentGame.acquiredItems[i];
      const { imgDir, accBody } = getItemMetaData(item);
      accBody.innerHTML += generateItemCard(item, false, imgDir);
    }
    const missingWarbondCodes = masterWarbondCodes.filter(
      (code) => !warbondCodes.includes(code),
    );
    for (let i = 0; i < missingWarbondCodes.length; i++) {
      document.getElementById(missingWarbondCodes[i]).checked = false;
    }
    return;
  }
  await getStartingItems();
  startNewRun();
};

const saveDataAndRestart = async (diff = null) => {
  difficulty = diff ? diff : "normal";
  if (diff === null) {
    pcTitleName.innerHTML = "Penitent Crusade";
  }

  // probably want to set all warbond codes to checked just in case
  warbondCodes = [...masterWarbondCodes];
  for (let i = 0; i < warbondCheckboxes.length; i++) {
    warbondCheckboxes[i].checked = true;
    if (warbondCheckboxes[i] !== "warbond3") {
      warbondCheckboxes[i].disabled = false;
    }
    hellDiversMobilizeCheckbox.disabled = true;
  }

  for (let j = 0; j < diffRadios.length; j++) {
    diffRadios[j].disabled = false;
  }
  const penitentCrusadeSaveData = localStorage.getItem(
    "penitentCrusadeSaveData",
  );
  if (!penitentCrusadeSaveData && !diff) {
    return;
  }

  let updatedSavedGames = [];
  const saveData = JSON.parse(penitentCrusadeSaveData);
  if (saveData) {
    // make all saved game data currentGame = false
    updatedSavedGames = await saveData.savedGames.map((sg) => {
      sg.currentGame = false;
      return sg;
    });
  }

  specialist = null;
  // will need to change starting items to account for super
  await getStartingItems(diff);

  // some of the same code as restarting a run, but we use this to populate the fresh save
  await writeItems();
  currentItems = [];
  currentPunishmentItems = [];
  missionCounter = 1;
  if (diff === "super" || diff === "supersolo") {
    missionCounter = 3;
  }
  if (diff === "quick") {
    missionCounter = 11;
  }
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
    missionCounter,
    specialist,
    difficulty: diff ? diff : "normal",
    warbondCodes,
    missionsFailed: 0,
    missionTimes: [],
  };

  if (saveData) {
    updatedSavedGames.push(newSaveObj);
    const newPenitentCrusadeSaveData = {
      savedGames: updatedSavedGames,
    };
    await localStorage.setItem(
      "penitentCrusadeSaveData",
      JSON.stringify(newPenitentCrusadeSaveData),
    );
  }

  // remove saved games that are at the first mission of their difficulty,
  // as long as they are not the current game
  // ...this is to prevent the user from having a million saves
  pruneSavedGames();

  clearItemOptionsModal();
  stratagemAccordionBody.innerHTML = "";
  primaryAccordionBody.innerHTML = "";
  secondaryAccordionBody.innerHTML = "";
  throwableAccordionBody.innerHTML = "";
  armorPassiveAccordionBody.innerHTML = "";
  boosterAccordionBody.innerHTML = "";
  specialistNameText.innerHTML = "";
  addDefaultItemsToAccordions();
};

const clearSaveDataAndRestart = async () => {
  await localStorage.removeItem("penitentCrusadeSaveData");
  window.location.reload();
};

// get rid of all games that arent the current game and are on the first mission
const pruneSavedGames = async () => {
  const penitentCrusadeSaveData = localStorage.getItem(
    "penitentCrusadeSaveData",
  );
  if (!penitentCrusadeSaveData) {
    return;
  }
  const prunedGames = await JSON.parse(
    penitentCrusadeSaveData,
  ).savedGames.filter((sg) => {
    if (
      sg.currentGame === true ||
      (sg.missionCounter !== 1 &&
        (sg.difficulty === "normal" || sg.difficulty === "solo")) ||
      (sg.missionCounter !== 3 &&
        (sg.difficulty === "super" || sg.difficulty === "supersolo")) ||
      (sg.missionCounter !== 11 && sg.difficulty === "quick")
    ) {
      return sg;
    }
  });
  const oldData = JSON.parse(penitentCrusadeSaveData);
  const newData = {
    ...oldData,
    savedGames: prunedGames,
  };
  localStorage.setItem("penitentCrusadeSaveData", JSON.stringify(newData));
};

const cloneList = (list) => {
  return list.map((item) => ({
    ...item,
    tags: [...item.tags], // clone the tags array too
  }));
};

if (!localStorage.getItem("penitentCrusadeSaveData")) {
  addDefaultItemsToAccordions();
}

uploadSaveData();
