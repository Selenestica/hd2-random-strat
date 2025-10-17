const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");
const boosterContainer = document.getElementById("boosterContainer");
const rollStratsButton = document.getElementById("rollStratsButton");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");
const superCitizenCheckBox = document.getElementById("warbond0");
const oneSupportCheck = document.getElementById("oneSupportCheck");
const oneBackpackCheck = document.getElementById("oneBackpackCheck");
const alwaysSupportCheck = document.getElementById("alwaysSupportCheck");
const alwaysBackpackCheck = document.getElementById("alwaysBackpackCheck");
const rerollItemModal = document.getElementById("rerollItemModal");
const rerollItemContainer = document.getElementById("rerollItemContainer");
const viewItemsModal = document.getElementById("viewItemsModal");
const viewItemsModalBody = document.getElementById("viewItemsModalBody");
const viewItemsModalTitle = document.getElementById("viewItemsModalTitle");
const viewItemsModalTitleText = document.getElementById(
  "viewItemsModalTitleText"
);
const viewItemsModalTitleLockedText = document.getElementById(
  "viewItemsModalTitleLockedText"
);
const randomModeToggleButtonsContainer = document.getElementById(
  "randomModeToggleButtonsContainer"
);
const numOfRerollTokensText = document.getElementById("numOfRerollTokensText");

const supplyAmountOptions = [
  oneSupportCheck,
  oneBackpackCheck,
  alwaysBackpackCheck,
  alwaysSupportCheck,
];

let stratsList = [...STRATAGEMS];
let primsList = [...PRIMARIES];
let secondsList = [...SECONDARIES];
let throwsList = [...THROWABLES];
let boostsList = [...BOOSTERS];
let armorPassivesList = [...ARMOR_PASSIVES];

let rolledStrats = [];

let workingPrimsList = [];
let workingSecondsList = [];
let workingThrowsList = [];
let workingBoostsList = [];
let workingStratsList = [];
let workingArmorPassivesList = [];
let missionsFailed = 0;
let rerollTokens = 0;
let currentStratagems = [];
let currentPrimary = null;
let currentSecondary = null;
let currentThrowable = null;
let currentArmorPassive = null;
let currentBooster = null;

let oneBackpack = false;
let oneSupportWeapon = false;
let alwaysBackpack = false;
let alwaysSupport = false;

let itemToReroll = null;

const disableOtherRadios = (radio) => {
  oneSupportCheck.disabled = true;
  oneBackpackCheck.disabled = true;
  alwaysBackpackCheck.disabled = true;
  alwaysSupportCheck.disabled = true;
  for (let i = 0; i < stratOptionRadios.length; i++) {
    if (stratOptionRadios[i].name !== radio) {
      stratOptionRadios[i].disabled = true;
    }
  }
};

const enableRadios = () => {
  oneSupportCheck.disabled = false;
  oneBackpackCheck.disabled = false;
  alwaysBackpackCheck.disabled = false;
  alwaysSupportCheck.disabled = false;
  for (let i = 0; i < stratOptionRadios.length; i++) {
    stratOptionRadios[i].disabled = false;
  }
};

// when the items modal closes, clear it
viewItemsModal.addEventListener("hidden.bs.modal", () => {
  viewItemsModalBody.innerHTML = "";
});

for (let z = 0; z < warbondCheckboxes.length; z++) {
  warbondCheckboxes[z].addEventListener("change", (e) => {
    // now do the front end stuff
    if (e.target.checked && !warbondCodes.includes(e.srcElement.id)) {
      warbondCodes.push(e.srcElement.id);
    }
    if (!e.target.checked && warbondCodes.includes(e.srcElement.id)) {
      const indexToRemove = warbondCodes.indexOf(e.srcElement.id);
      warbondCodes.splice(indexToRemove, 1);
    }
    filterItemsByWarbond();
  });
}

const filterItemsByWarbond = async () => {
  const itemsList = [
    primsList,
    secondsList,
    throwsList,
    boostsList,
    stratsList,
    armorPassivesList,
  ];
  for (let i = 0; i < itemsList.length; i++) {
    let tempList = [...itemsList[i]];
    itemsList[i] = await tempList.filter(
      (item) =>
        warbondCodes.includes(item.warbondCode) || item.warbondCode === "none"
    );
    if (i === 0) {
      workingPrimsList = itemsList[i];
    } else if (i === 1) {
      workingSecondsList = itemsList[i];
    } else if (i === 2) {
      workingThrowsList = itemsList[i];
    } else if (i === 3) {
      workingBoostsList = itemsList[i];
    } else if (i === 4) {
      workingStratsList = itemsList[i];
    } else if (i === 5) {
      workingArmorPassivesList = itemsList[i];
    } else if (i === 6) {
      workingArmorSetsList = itemsList[i];
    }
  }
};

const categoryMap = (item, cat = null) => {
  let imgDir = "equipment";
  let currentItemReference = null;
  let cardId = null;
  if (!cat) {
    cat = item.category;
  }
  if ((item && item.type === "Stratagem") || cat === "stratagem") {
    cat = "stratagem";
    imgDir = "svgs";
    currentItemReference = currentStratagems;
    container = stratagemsContainer;
  }
  let list = getWorkingList(cat);
  if (cat === "armor") {
    imgDir = "armorpassives";
    currentItemReference = currentArmorPassive;
    cardId = "armorCard";
  }
  if (cat === "primary") {
    currentItemReference = currentPrimary;
    cardId = "primaryCard";
  }
  if (cat === "secondary") {
    currentItemReference = currentSecondary;
    cardId = "secondaryCard";
  }
  if (cat === "booster") {
    currentItemReference = currentBooster;
    cardId = "boosterCard";
  }
  if (cat === "throwable") {
    currentItemReference = currentThrowable;
    cardId = "throwableCard";
  }
  return { imgDir, cat, list, currentItemReference, cardId };
};

const genRerollItemModalContent = async (name, category) => {
  if (rerollTokens < 1) {
    showNoRerollTokensToast();
    return;
  }
  const { imgDir, list } = await categoryMap(null, category);
  const item = list.filter((it) => name === it.displayName)[0];
  itemToReroll = item;
  rerollItemContainer.innerHTML = `
      <div class="card w-50 soItemCards position-relative">
        <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
          id="${item.internalName}"
        />
        <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
          <p id="${item.internalName}-randName" class="text-center card-title text-white">
            ${item.displayName}
          </p>
        </div>
      </div>
  `;
  const modal = new bootstrap.Modal(rerollItemModal);
  modal.show();
};

const generateRerollButton = (name, cat) => {
  if (rerollTokens > 0) {
    return `        
      <img 
        src="../images/iconSVGs/pinkDice.svg" 
        class="img-fluid rerollButton"
        onclick="event.stopPropagation(); genRerollItemModalContent('${name}', '${cat}');"
      />
    `;
  }
  return;
};

const generateMainItemCard = (item) => {
  const { imgDir, cat, cardId } = categoryMap(item);
  return `
    <div id="${cardId}" class="col-3 px-1 d-flex justify-content-center">
      <div class="card itemCards position-relative" 
        onclick="genItemsModalContent('${cat}')"
      >
        ${generateRerollButton(item.displayName, cat)}
        <img
            src="../images/${imgDir}/${item.imageURL}"
            class="img-card-top"
            alt="${item.displayName}"
            id="${item.internalName}-randImage"
        />
        <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
            <p id="${
              item.internalName
            }-randName" class="text-center card-title text-white">${
    item.displayName
  }</p>
        </div>
      </div>
    </div>
  `;
};

// will need to give these functions eventually so that they can set them manually
const generateModalItemCard = (item) => {
  const { imgDir } = categoryMap(item);
  let lockedStyle = "rmUnlockedItem";
  if (item.locked) {
    lockedStyle = "rmLockedItem";
  }
  return `
    <div class="card d-flex col-3 col-lg-2 mx-1 my-1 ${lockedStyle}">
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
          <p class="card-title text-white" style="font-size: small;">${item.displayName}</p>
      </div>
    </div>`;
};

const genItemsModalContent = async (cat) => {
  let list = [];
  if (cat === "secondary") {
    list = workingSecondsList;
    viewItemsModalTitleText.innerHTML = "Secondaries";
  }
  if (cat === "primary") {
    list = workingPrimsList;
    viewItemsModalTitleText.innerHTML = "Primaries";
  }
  if (cat === "stratagem") {
    list = workingStratsList;
    viewItemsModalTitleText.innerHTML = "Stratagems";
  }
  if (cat === "throwable") {
    list = workingThrowsList;
    viewItemsModalTitleText.innerHTML = "Throwables";
  }
  if (cat === "armor") {
    list = workingArmorPassivesList;
    viewItemsModalTitleText.innerHTML = "Armor Passives";
  }
  if (cat === "booster") {
    list = workingBoostsList;
    viewItemsModalTitleText.innerHTML = "Boosters";
  }
  const unlockedArray = await list.filter((item) => item.locked === false);
  viewItemsModalTitleLockedText.innerHTML = `(${unlockedArray.length}/${list.length} unlocked)`;
  for (let i = 0; i < list.length; i++) {
    viewItemsModalBody.innerHTML += generateModalItemCard(list[i]);
  }
  const modal = new bootstrap.Modal(viewItemsModal);
  modal.show();
};

const rerollItem = async () => {
  if (rerollTokens < 1) {
    return;
  }
  // get the displayNames of all current stratagems and put them in a list
  // if reroll is a stratagem, make sure you dont roll something in the currentStratagems list
  let stratDisplayNameList = [];
  if (itemToReroll.type === "Stratagem") {
    for (let k = 0; k < currentStratagems.length; k++) {
      stratDisplayNameList.push(currentStratagems[k].displayName);
    }
  }
  const { list, currentItemReference, cardId } = categoryMap(itemToReroll);
  let listToUse = await list.filter(
    (item) =>
      item.locked === true &&
      item.displayName !== itemToReroll.displayName &&
      !stratDisplayNameList.includes(item.displayName)
  );
  if (listToUse.length === 0) {
    if (itemToReroll.locked) {
      return;
    }
    listToUse = list;
  }
  const randomNumber = Math.floor(Math.random() * listToUse.length);
  const newItem = listToUse[randomNumber];

  // do this part if rerolling a stratagem
  let oldStratIndex = null;
  if (itemToReroll.type === "Stratagem") {
    for (let i = 0; i < currentStratagems.length; i++) {
      if (itemToReroll.displayName === currentStratagems[i].displayName) {
        oldStratIndex = i;
        break;
      }
    }
    currentStratagems.splice(oldStratIndex, 1, newItem);
    stratagemsContainer.innerHTML = "";
    for (let j = 0; j < currentStratagems.length; j++) {
      stratagemsContainer.innerHTML += generateMainItemCard(
        currentStratagems[j]
      );
    }
  }
  // else
  if (itemToReroll.type !== "Stratagem") {
    if (currentItemReference.category === "primary") {
      currentPrimary = newItem;
    }
    if (currentItemReference.category === "secondary") {
      currentSecondary = newItem;
    }
    if (currentItemReference.category === "throwable") {
      currentThrowable = newItem;
    }
    if (currentItemReference.category === "booster") {
      currentBooster = newItem;
    }
    if (currentItemReference.category === "armor") {
      currentArmorPassive = newItem;
    }
    const oldCard = document.getElementById(cardId);
    const newCardString = generateMainItemCard(newItem);
    const parser = new DOMParser();
    const doc = parser.parseFromString(newCardString, "text/html");
    const newCard = doc.body.firstChild;
    oldCard.replaceWith(newCard);
  }

  rerollTokens--;
  numOfRerollTokensText.innerHTML = rerollTokens;
  const rerollButtons = document.querySelectorAll(".rerollButton");
  if (rerollTokens < 1) {
    for (let i = 0; i < rerollButtons.length; i++) {
      rerollButtons[i].style = "z-index: -10;";
    }
  }

  saveProgress();
};

const rollStratagems = async () => {
  // get random numbers that arent the same and get the strats at those indices
  stratagemsContainer.innerHTML = "";

  // if support/backpack checkbox is checked and enabled, then account for those
  const oneSupportWeapon = oneSupportCheck.checked && !oneSupportCheck.disabled;
  const oneBackpack = oneBackpackCheck.checked && !oneBackpackCheck.disabled;
  let alwaysBackpack =
    alwaysBackpackCheck.checked && !alwaysBackpackCheck.disabled;
  let alwaysSupport =
    alwaysSupportCheck.checked && !alwaysSupportCheck.disabled;
  // if no more backpacks/support weapons to unlock and not all stratagems are unlocked
  // alwaysBackPack = false
  // alwaysSupport = false

  let leftoverStratIndices = [];
  let strats = await workingStratsList.filter((strat, i) => {
    if (strat.locked === true) {
      leftoverStratIndices.push(i);
      return strat;
    }
  });

  // if more than 4 locked strats, proceed as normal
  if (leftoverStratIndices.length > 4) {
    leftoverStratIndices = [];
  }

  // if less than 4 locked strats, guarantee the player will roll the remaining locked strats
  // and use the full strats list to fill in the remaining strats
  if (leftoverStratIndices.length < 4) {
    strats = workingStratsList;
  }

  // if exactly 4 locked strats remaining, guarantee that these will be rolled for the player
  let randomUniqueNumbers = leftoverStratIndices;

  // else do this
  if (leftoverStratIndices !== 4) {
    randomUniqueNumbers = getRandomUniqueNumbers(
      strats,
      oneSupportWeapon,
      oneBackpack,
      alwaysBackpack,
      alwaysSupport,
      4,
      leftoverStratIndices
    );
  }

  currentStratagems = [];
  for (let i = 0; i < randomUniqueNumbers.length; i++) {
    let stratagem = strats[randomUniqueNumbers[i]];
    currentStratagems.push(stratagem);
    rolledStrats.push(stratagem.internalName);
    stratagemsContainer.innerHTML += generateMainItemCard(stratagem);
  }
};

const rollEquipment = async () => {
  equipmentContainer.innerHTML = "";
  boosterContainer.innerHTML = "";
  let container = equipmentContainer;
  const equipmentLists = [
    workingPrimsList,
    workingSecondsList,
    workingThrowsList,
    workingArmorPassivesList,
    workingBoostsList,
  ];

  for (let i = 0; i < equipmentLists.length; i++) {
    let items = await equipmentLists[i].filter(
      (equip) => equip.locked === true
    );
    if (items.length < 1) {
      items = equipmentLists[i];
    }

    const randomNumber = Math.floor(Math.random() * items.length);
    let equipment = items[randomNumber];
    if (i === 0) {
      currentPrimary = equipment;
    }
    if (i === 1) {
      currentSecondary = equipment;
    }
    if (i === 2) {
      currentThrowable = equipment;
    }
    if (i === 3) {
      currentArmorPassive = equipment;
    }
    if (i === 4) {
      container = boosterContainer;
      currentBooster = equipment;
    }
    container.innerHTML += generateMainItemCard(equipment);
  }
};

const getRandomUniqueNumbers = (
  list,
  oneSupportWeapon,
  oneBackpack,
  alwaysBackpack,
  alwaysSupport,
  amt,
  leftoverStratIndices
) => {
  let hasVehicle = false;
  let hasBackpack = false;
  let hasSupportWeapon = false;
  let numbers = leftoverStratIndices.length > 0 ? leftoverStratIndices : [];
  let randomNumber = null;
  while (numbers.length < amt) {
    randomNumber = Math.floor(Math.random() * list.length);
    const tags = list[randomNumber].tags;
    if (
      (tags.includes("Weapons") && hasSupportWeapon && oneSupportWeapon) ||
      (tags.includes("Backpacks") && hasBackpack && oneBackpack) ||
      (tags.includes("Vehicles") && hasVehicle) ||
      numbers.includes(randomNumber) ||
      (!hasBackpack && alwaysBackpack && !tags.includes("Backpacks"))
    ) {
      continue;
    } else {
      if (tags.includes("Vehicles")) {
        hasVehicle = true;
        numbers.push(randomNumber);
        continue;
      }
      if (!hasSupportWeapon && oneSupportWeapon && tags.includes("Weapons")) {
        numbers.push(randomNumber);
        hasSupportWeapon = true;
        if (tags.includes("Backpacks")) {
          hasBackpack = true;
        }
        continue;
      } else if (!hasBackpack && oneBackpack && tags.includes("Backpacks")) {
        numbers.push(randomNumber);
        hasBackpack = true;
        if (tags.includes("Weapons")) {
          hasSupportWeapon = true;
        }
        continue;
      } else if (alwaysBackpack && tags.includes("Backpacks")) {
        numbers.push(randomNumber);
        hasBackpack = true;
        if (tags.includes("Weapons")) {
          hasSupportWeapon = true;
        }
        continue;
      } else if (alwaysSupport && tags.includes("Weapons")) {
        numbers.push(randomNumber);
        hasSupportWeapon = true;
        if (tags.includes("Backpacks")) {
          hasBackpack = true;
        }
        continue;
      }
      if (!hasSupportWeapon && alwaysSupport && !tags.includes("Weapons")) {
        continue;
      }
      numbers.push(randomNumber);
    }
  }
  return numbers;
};

const saveProgress = async () => {
  let obj = {
    workingStratsList,
    workingPrimsList,
    workingSecondsList,
    workingThrowsList,
    workingArmorPassivesList,
    workingBoostsList,
    seesRulesOnOpen: false,
    dataName: `Randomizer Marathon Save Data`,
    warbondCodes,
    missionsFailed,
    rerollTokens,
    currentStratagems,
    currentArmorPassive,
    currentBooster,
    currentPrimary,
    currentSecondary,
    currentThrowable,
  };
  localStorage.setItem("randomizerMarathonSaveData", JSON.stringify(obj));
};

const awardRerollToken = () => {
  rerollTokens++;
  numOfRerollTokensText.innerHTML = `${rerollTokens}`;
  const rerollButtons = document.querySelectorAll(".rerollButton");
  if (rerollTokens > 0) {
    for (let i = 0; i < rerollButtons.length; i++) {
      rerollButtons[i].style = "z-index: 1;";
    }
  }
};

const unlockItem = (item, list) => {
  list.map((workingItem) => {
    if (item.displayName === workingItem.displayName) {
      workingItem.locked = false;
    }
  });
};

const missionComplete = async (fullCleared = null) => {
  if (fullCleared) {
    awardRerollToken();
  }

  const currentItemsArray = [
    currentStratagems,
    currentArmorPassive,
    currentBooster,
    currentPrimary,
    currentSecondary,
    currentThrowable,
  ];
  for (let i = 0; i < currentItemsArray.length; i++) {
    const current = currentItemsArray[i];
    if (i === 0) {
      for (let j = 0; j < current.length; j++) {
        const cStrat = current[j];
        unlockItem(cStrat, workingStratsList);
      }
    }
    if (i === 1) {
      unlockItem(current, workingArmorPassivesList);
    }
    if (i === 2) {
      unlockItem(current, workingBoostsList);
    }
    if (i === 3) {
      unlockItem(current, workingPrimsList);
    }
    if (i === 4) {
      unlockItem(current, workingSecondsList);
    }
    if (i === 5) {
      unlockItem(current, workingThrowsList);
    }
  }

  randomizeAll();
};

const missionFailed = async () => {
  missionsFailed++;
  // we will want to lock an item in every category here
  // go through every working list, get the unlocked items, then choose a random unlocked item to be locked again
  const workingLists = [
    workingArmorPassivesList,
    workingBoostsList,
    workingPrimsList,
    workingSecondsList,
    workingStratsList,
    workingThrowsList,
  ];
  for (let i = 0; i < workingLists.length; i++) {
    await lockRandomItem(workingLists[i]);
  }
  await randomizeAll();
  await saveProgress();
};

const lockRandomItem = async (list) => {
  let unlockedItems = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!item.locked) {
      unlockedItems.push(item);
    }
  }
  let randomUnlockedItem =
    unlockedItems[Math.floor(Math.random() * unlockedItems.length)];
  randomUnlockedItem.locked = true;
};

const randomizeAll = async () => {
  await rollEquipment();
  await rollStratagems();
  saveProgress();
};

const startNewRun = async () => {
  await lockAllItems();
  await filterItemsByWarbond();
  randomizeAll();
};

const uploadSaveData = async () => {
  const randomizerMarathonSaveData = localStorage.getItem(
    "randomizerMarathonSaveData"
  );
  if (randomizerMarathonSaveData) {
    const data = JSON.parse(randomizerMarathonSaveData);
    warbondCodes = data.warbondCodes ?? warbondCodes;
    workingStratsList = data.workingStratsList;
    workingPrimsList = data.workingPrimsList;
    workingSecondsList = data.workingSecondsList;
    workingThrowsList = data.workingThrowsList;
    workingBoostsList = data.workingBoostsList;
    workingArmorPassivesList = data.workingArmorPassivesList;
    seesRulesOnOpen = data.seesRulesOnOpen;
    currentStratagems = data.currentStratagems;
    currentArmorPassive = data.currentArmorPassive;
    currentBooster = data.currentBooster;
    currentPrimary = data.currentPrimary;
    currentSecondary = data.currentSecondary;
    currentThrowable = data.currentThrowable;
    missionsFailed = data.missionsFailed;
    rerollTokens = data.rerollTokens;

    // populate the page with the uploaded data here
    // rerollTokens
    numOfRerollTokensText.innerHTML = rerollTokens;

    // equipment
    const currentEquipment = [
      currentPrimary,
      currentSecondary,
      currentThrowable,
      currentArmorPassive,
      currentBooster,
    ];
    let container = equipmentContainer;
    for (let i = 0; i < currentEquipment.length; i++) {
      if (i === 4) {
        container = boosterContainer;
      }
      container.innerHTML += generateMainItemCard(currentEquipment[i]);
    }

    // stratagems
    for (let j = 0; j < currentStratagems.length; j++) {
      stratagemsContainer.innerHTML += generateMainItemCard(
        currentStratagems[j]
      );
    }

    const missingWarbondCodes = masterWarbondCodes.filter(
      (code) => !warbondCodes.includes(code)
    );
    for (let i = 0; i < missingWarbondCodes.length; i++) {
      document.getElementById(missingWarbondCodes[i]).checked = false;
    }
    return;
  }
  startNewRun();
};

const lockAllItems = async () => {
  const allItems = [
    stratsList,
    primsList,
    secondsList,
    armorPassivesList,
    boostsList,
    throwsList,
  ].flat();
  await allItems.map((item) => {
    item.locked = true;
  });
};

const getWorkingList = (cat) => {
  if (cat === "armor") {
    return workingArmorPassivesList;
  }
  if (cat === "stratagem") {
    return workingStratsList;
  }
  if (cat === "secondary") {
    return workingSecondsList;
  }
  if (cat === "throwable") {
    return workingThrowsList;
  }
  if (cat === "booster") {
    return workingBoostsList;
  }
  if (cat === "primary") {
    return workingPrimsList;
  }
};

const restartChallenge = async () => {
  const data = await localStorage.getItem("randomizerMarathonSaveData");
  if (!data) {
    return;
  }

  await localStorage.removeItem("randomizerMarathonSaveData");
  window.location.reload();
};

uploadSaveData();
