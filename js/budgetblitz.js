const missionCompleteModal = document.getElementById("missionCompleteModal");
const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody"
);
const mainViewButtons = document.getElementsByClassName("mainViewButtons");
const scCounter = document.getElementById("scCounter");
const loadoutButton = document.getElementById("loadoutButton");
const loadoutContainer = document.getElementById("loadoutContainer");
const stratagemsContainerBB = document.getElementById("stratagemsContainerBB");
const equipmentContainerBB = document.getElementById("equipmentContainerBB");
const emptyArmorText = document.getElementById("emptyArmorText");
const emptyPrimaryText = document.getElementById("emptyPrimaryText");
const emptySecondaryText = document.getElementById("emptySecondaryText");
const emptyThrowableText = document.getElementById("emptyThrowableText");
const emptyBoosterText = document.getElementById("emptyBoosterText");
const armorContainerBB = document.getElementById("armorContainerBB");
const primaryContainerBB = document.getElementById("primaryContainerBB");
const secondaryContainerBB = document.getElementById("secondaryContainerBB");
const throwableContainerBB = document.getElementById("throwableContainerBB");
const boosterContainerBB = document.getElementById("boosterContainerBB");
const bbShopItemsContainer = document.getElementById("bbShopItemsContainer");
const defaultInventory = document.getElementById("defaultInventory");
const purchasedItemsInventory = document.getElementById(
  "purchasedItemsInventory"
);
const starsEarnedInput = document.getElementById("starsEarnedInput");
const superSamplesCollectedCheck = document.getElementById(
  "superSamplesCollectedCheck"
);
const highValueItemCollectedCheck = document.getElementById(
  "highValueItemCollectedCheck"
);
const superSamplesCollectedForm = document.getElementById(
  "superSamplesCollectedForm"
);
const highValueItemCollectedForm = document.getElementById(
  "highValueItemCollectedForm"
);
const yourCreditsAmount = document.getElementById("yourCreditsAmount");
const itemCostAmount = document.getElementById("itemCostAmount");
const itemQuantityInput = document.getElementById("itemQuantityInput");
const itemPurchaseModalBody = document.getElementById("itemPurchaseModalBody");
const downloadPDFButtonDiv = document.getElementById("downloadPDFButtonDiv");
const missionButtonsDiv = document.getElementById("missionButtonsDiv");
const bbShopFilterDiv = document.getElementById("bbShopFilterDiv");
const missionCompleteButton = document.getElementById("missionCompleteButton");
const missionFailedButton = document.getElementById("missionFailedButton");
const shopSearchInput = document.getElementById("shopSearchInput");
const missionCounterText = document.getElementById("missionCounterText");
const hellDiversMobilizeCheckbox = document.getElementById("warbond3");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");

let missionCounter = 8;
let failedMissions = 0;
let successfulMissions = 0;
let purchasedItems = [];
let equippedStratagems = [];
let equippedArmor = [];
let equippedPrimary = [];
let equippedSecondary = [];
let equippedThrowable = [];
let equippedBooster = [];

let masterPrimsList = [];
let masterSecondsList = [];
let masterThrowsList = [];
let masterBoostsList = [];
let masterStratsList = [];
let masterArmorPassivesList = [];

let currentView = "loadoutButton";
let credits = 100;
missionButtonsDiv.style.display = "flex";
bbShopFilterDiv.style.display = "none";
hellDiversMobilizeCheckbox.disabled = true;
const inventoryIDs = ["defaultInventory", "purchasedItemsInventory"];

// if the submit mission report modal ever closes, reset the inputs
missionCompleteModal.addEventListener("hidden.bs.modal", () => {
  starsEarnedInput.value = 1;
  superSamplesCollectedCheck.checked = false;
  highValueItemCollectedCheck.checked = false;
});

// when the mission report modal opens, set the max stars able to be earned according to the missionCounter
missionCompleteModal.addEventListener("shown.bs.modal", () => {
  const maxStarsPossible = getMaxStarsForMission(missionCounter);
  starsEarnedInput.max = maxStarsPossible;
  // check if super samples are in the level
  if (missionCounter >= 8) {
    superSamplesCollectedForm.classList.remove("d-none");
  }

  // check if high value item in the level
  if (missionCounter >= 17) {
    highValueItemCollectedForm.classList.remove("d-none");
  }
});

// prevent input of anything outside of min and max values
starsEarnedInput.addEventListener("input", () => {
  const value = parseInt(starsEarnedInput.value, 10);
  const max = parseInt(starsEarnedInput.max, 10);

  if (value < 1) starsEarnedInput.value = 1;
  if (value > max) starsEarnedInput.value = max;
});

const categoryMap = {
  armor: {
    equipped: () => equippedArmor,
    setEquipped: (val) => (equippedArmor = val),
    container: armorContainerBB,
    list: newArmorPassives,
    masterList: masterArmorPassivesList,
    max: 1,
    emptyText: emptyArmorText,
  },
  primary: {
    equipped: () => equippedPrimary,
    setEquipped: (val) => (equippedPrimary = val),
    container: primaryContainerBB,
    list: newPrims,
    masterList: masterPrimsList,
    max: 1,
    emptyText: emptyPrimaryText,
  },
  secondary: {
    equipped: () => equippedSecondary,
    setEquipped: (val) => (equippedSecondary = val),
    container: secondaryContainerBB,
    list: newSeconds,
    masterList: masterSecondsList,
    max: 1,
    emptyText: emptySecondaryText,
  },
  throwable: {
    equipped: () => equippedThrowable,
    setEquipped: (val) => (equippedThrowable = val),
    container: throwableContainerBB,
    list: newThrows,
    masterList: masterThrowsList,
    max: 1,
    emptyText: emptyThrowableText,
  },
  booster: {
    equipped: () => equippedBooster,
    setEquipped: (val) => (equippedBooster = val),
    container: boosterContainerBB,
    list: newBoosts,
    masterList: masterBoostsList,
    max: 1,
    emptyText: emptyBoosterText,
  },
  Stratagem: {
    equipped: () => equippedStratagems,
    setEquipped: (val) => (equippedStratagems = val),
    container: stratagemsContainerBB,
    list: newStrats,
    masterList: masterStratsList,
    max: 4,
  },
};

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
  });
}

const filterItemsByWarbond = async (uploadingSaveData = null) => {
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
        warbondCodes.includes(item.warbondCode) || item.warbondCode === "none"
    )
  );

  [newPrims, newSeconds, newThrows, newBoosts, newStrats, newArmorPassives] =
    filteredLists;

  // only save progress if user is actively filtering by warbonds. otherwise, we are uploading save data
  !uploadingSaveData ? saveProgress() : null;

  // when uploading save data, we want to uncheck any boxes that shouldnt be checked
  if (uploadingSaveData) {
    const missingWarbondCodes = masterWarbondCodes.filter(
      (code) => !warbondCodes.includes(code)
    );
    for (let i = 0; i < missingWarbondCodes.length; i++) {
      document.getElementById(missingWarbondCodes[i]).checked = false;
    }
  }
  // Refresh the shop UI
  bbShopItemsContainer.innerHTML = "";
  populateShopItems();
};

// toggles view between LOADOUT and SHOP
for (let z = 0; z < mainViewButtons.length; z++) {
  mainViewButtons[z].addEventListener("change", (e) => {
    if (e.target.checked) {
      currentView = e.srcElement.id;
      if (e.srcElement.id === "loadoutButton") {
        missionButtonsDiv.style.display = "flex";
        bbShopFilterDiv.style.display = "none";
        bbShopItemsContainer.classList.remove("d-flex");
        bbShopItemsContainer.classList.add("d-none");
        loadoutContainer.classList.remove("d-none");
        loadoutContainer.classList.add("d-flex");
        purchasedItemsInventory.innerHTML = "";
        populatePurchasedItemsInventory();
        resetShopFilters();
      }
      if (e.srcElement.id === "shopButton") {
        missionButtonsDiv.style.display = "none";
        bbShopFilterDiv.style.display = "flex";
        bbShopItemsContainer.classList.add("d-flex");
        bbShopItemsContainer.classList.remove("d-none");
        loadoutContainer.classList.add("d-none");
        loadoutContainer.classList.remove("d-flex");
        bbShopItemsContainer.innerHTML = "";
        populateShopItems();
        updateAllRenderedItems();
        unequipAllItems();
      }
    }
  });
}

// search bar functionality for shop
shopSearchInput.addEventListener("input", () => {
  const itemCards = document.getElementsByClassName("bbShopItemCards");
  const query = shopSearchInput.value.toLowerCase();

  Array.from(itemCards).forEach((item) => {
    const match = item.id.toLowerCase().includes(query);
    item.classList.toggle("d-none", !match);
  });
});

const startNewRun = async (isRestart = null) => {
  // probably want to set all warbond codes to checked just in case
  warbondCodes = [...masterWarbondCodes];
  for (let i = 0; i < warbondCheckboxes.length; i++) {
    warbondCheckboxes[i].checked = true;
  }

  newStrats = await OGstratsList.filter(
    (strat) => !starterStratNames.includes(strat.displayName)
  ).map((strat) => {
    strat.timesPurchased = 0;
    strat.cost = getItemCost(strat);
    strat.quantity = 0;
    strat.onSale = getIsItemOnSale();
    return strat;
  });
  newPrims = await OGprimsList.filter(
    (prim) => !starterPrimNames.includes(prim.displayName)
  ).map((prim) => {
    prim.timesPurchased = 0;
    prim.cost = getItemCost(prim);
    prim.quantity = 0;
    prim.onSale = getIsItemOnSale();
    return prim;
  });
  newSeconds = await OGsecondsList.filter(
    (sec) => !starterSecNames.includes(sec.displayName)
  ).map((sec) => {
    sec.timesPurchased = 0;
    sec.cost = getItemCost(sec);
    sec.quantity = 0;
    sec.onSale = getIsItemOnSale();
    return sec;
  });
  newThrows = await OGthrowsList.filter(
    (throwable) => !starterThrowNames.includes(throwable.displayName)
  ).map((throwable) => {
    throwable.timesPurchased = 0;
    throwable.cost = getItemCost(throwable);
    throwable.quantity = 0;
    throwable.onSale = getIsItemOnSale();
    return throwable;
  });
  newArmorPassives = await OGarmorPassivesList.filter(
    (armorPassive) =>
      !starterArmorPassiveNames.includes(armorPassive.displayName)
  ).map((armorPassive) => {
    armorPassive.quantity = 0;
    armorPassive.timesPurchased = 0;
    armorPassive.onSale = getIsItemOnSale();
    armorPassive.cost = getItemCost(armorPassive);
    return armorPassive;
  });
  newBoosts = await OGboostsList.filter(
    (booster) => !starterBoosterNames.includes(booster.displayName)
  ).map((booster) => {
    booster.quantity = 0;
    booster.timesPurchased = 0;
    booster.onSale = getIsItemOnSale();
    booster.cost = getItemCost(booster);
    return booster;
  });

  // primarily for warbond filtering
  masterPrimsList = cloneList(newPrims);
  masterSecondsList = cloneList(newSeconds);
  masterThrowsList = cloneList(newThrows);
  masterBoostsList = cloneList(newBoosts);
  masterStratsList = cloneList(newStrats);
  masterArmorPassivesList = cloneList(newArmorPassives);

  credits = 100;
  scCounter.innerHTML = `${": " + credits}`;
  currentItems = [];
  missionCounter = 8;
  failedMissions = 0;
  successfulMissions = 0;
  purchasedItems = [];
  equippedStratagems = [];
  equippedArmor = [];
  equippedPrimary = [];
  equippedSecondary = [];
  equippedThrowable = [];
  equippedBooster = [];
  checkMissionButtons();
  missionCounterText.innerHTML = `${getMissionText()}`;

  // open the modal to show the rules
  document.addEventListener("DOMContentLoaded", () => {
    const modal = new bootstrap.Modal(flavorAndInstructionsModal);
    modal.show();
  });

  // only do this next part when restarting a run
  if (isRestart) {
    stratagemsContainerBB.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      stratagemsContainerBB.innerHTML += emptyStratagemBox;
    }
    // also need to apply empty equipment boxes
    purchasedItemsInventory.innerHTML = "";
    defaultInventory.innerHTML = "";
    isRestart !== "applyingSave" ? populateDefaultItems() : null;

    missionButtonsDiv.style.display = "flex";
    bbShopFilterDiv.style.display = "none";
    bbShopItemsContainer.classList.remove("d-flex");
    bbShopItemsContainer.classList.add("d-none");
    loadoutContainer.classList.remove("d-none");
    loadoutContainer.classList.add("d-flex");
    resetShopFilters();
    window.location.reload();
  }
};

const updateShopItemsCostAndSaleStatus = async () => {
  const newOperationNums = [8, 11, 14, 17, 20];
  const isStartingNewOperation = newOperationNums.includes(missionCounter);
  if (!isStartingNewOperation) return;

  const allItemsList = [
    newPrims,
    newStrats,
    newBoosts,
    newSeconds,
    newArmorPassives,
    newThrows,
  ];
  for (let i = 0; i < allItemsList.length; i++) {
    const list = allItemsList[i];
    for (let j = 0; j < list.length; j++) {
      const item = list[j];
      item.cost = getItemCost(item);
      item.onSale = getIsItemOnSale();
      updateMasterListItem(item);
    }
  }
};

const populatePurchasedItemsInventory = async () => {
  for (let i = 0; i < purchasedItems.length; i++) {
    const card = generateItemCard(purchasedItems[i]);
    purchasedItemsInventory.appendChild(card);
  }
};

const populateDefaultItems = () => {
  let list = [];
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
  list = list
    .concat(defaultStrats)
    .concat(defaultPrims)
    .concat(defaultSeconds)
    .concat(defaultThrows)
    .concat(defaultBoosters)
    .concat(defaultArmorPassives);
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    item.cost = null;
    item.quantity = "&infin;";
    defaultInventory.appendChild(generateItemCard(list[i]));
  }
};

const populateShopItems = () => {
  const allItemsList = [
    newPrims,
    newStrats,
    newBoosts,
    newSeconds,
    newArmorPassives,
    newThrows,
  ];
  for (let i = 0; i < allItemsList.length; i++) {
    const items = allItemsList[i];
    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      bbShopItemsContainer.appendChild(generateItemCard(item, "shop"));
    }
  }
};

const generateItemCard = (item, view = null) => {
  let shopClass = "";
  let showCost = false;
  let totalCost = item.cost;
  let imgDir = "equipment";
  let costBadgeColor = "bg-warning text-dark";
  if (item.type === "Stratagem") {
    imgDir = "svgs";
  }
  if (item.category === "armor") {
    imgDir = "armor";
  }
  const card = document.createElement("div");

  // shop code
  if (view === "shop" || currentView === "shopButton") {
    card.id = "bbShopItemCard-" + item.internalName;
    card.dataset.type = getItemType(item);
    shopClass = "bbShopItemCards";
    showCost = true;
    if (item.onSale) {
      totalCost = Math.ceil(item.cost * 0.5);
      costBadgeColor = "bg-success text-light";
    }
    if (totalCost <= credits) {
      card.onclick = () => purchaseItem(item);
    }
  }

  // loadout code
  if (currentView === "loadoutButton") {
    card.id = "bbLoadoutItemCard-" + item.internalName;
    card.onclick = () => toggleLoadoutItem(item);
  }
  card.className = `card col-2 col-lg-1 pcItemCards bbItemCards ${item.warbondCode} ${shopClass}`;
  card.innerHTML = `
    <img
      src="../images/${imgDir}/${item.imageURL}"
      class="img-card-top"
      alt="${item.displayName}"
    />
    <span class="costBadges translate-middle badge rounded-pill ${
      showCost ? costBadgeColor : "bg-primary text-light"
    }">
      ${showCost ? totalCost : item.quantity}
    </span>
    <div class="card-body itemNameContainer align-items-center">
      <p class="card-title text-white pcItemCardText">${item.displayName}</p>
    </div>
  `;

  return card;
};

const isInInventory = (parentID) => {
  return inventoryIDs.includes(parentID);
};

const moveToInventory = (card, badgeText) => {
  if (badgeText.trim() === "∞") {
    defaultInventory.appendChild(card);
  } else {
    purchasedItemsInventory.appendChild(card);
  }
  checkMissionButtons();
};

const unequipItem = (itemConfig, card, badgeText) => {
  const newArray = itemConfig.equipped().filter((it) => it.id !== card.id);
  itemConfig.setEquipped(newArray);
  // Stratagem specific: add 4 empty boxes
  if (equippedStratagems.length === 0 && itemConfig.max === 4) {
    itemConfig.container.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      itemConfig.container.innerHTML += emptyStratagemBox;
    }
  } else if (itemConfig.max !== 4) {
    itemConfig.container.appendChild(itemConfig.emptyText);
    card.classList.remove("w-100");
  }

  moveToInventory(card, badgeText);
};

const equipItem = (itemConfig, card) => {
  if (itemConfig.equipped().length >= itemConfig.max) {
    return;
  }

  itemConfig.setEquipped([...itemConfig.equipped(), card]);
  // only do this if not a stratagem card
  if (itemConfig.max !== 4) {
    card.classList.add("w-100");
  }

  // Stratagems: replace all children
  itemConfig.container.innerHTML = "";
  itemConfig.equipped().forEach((el) => {
    itemConfig.container.appendChild(el);
  });

  checkMissionButtons();
};

const toggleLoadoutItem = async (item) => {
  const card = document.getElementById(
    "bbLoadoutItemCard-" + item.internalName
  );
  const badgeText = card.querySelector(".costBadges").innerHTML;
  const parentID = card.parentElement.id;

  const key = item.type === "Stratagem" ? "Stratagem" : item.category;
  const itemConfig = categoryMap[key];
  if (!itemConfig) return;

  if (!isInInventory(parentID)) {
    unequipItem(itemConfig, card, badgeText);
  } else {
    equipItem(itemConfig, card);
  }
};

const purchaseItem = async (item) => {
  let totalCost = item.cost;
  if (item.onSale) {
    totalCost = Math.ceil(item.cost * 0.5);
  }
  // add the item to the list or add the quantity to it if it exists
  const existsInPurchasedList = await purchasedItems.filter((i) => {
    return i.displayName === item.displayName;
  });
  if (existsInPurchasedList.length > 0) {
    purchasedItems = await purchasedItems.map((i) => {
      if (i.displayName === item.displayName) {
        if (i !== item) {
          i = item;
        }
        i.quantity++;
        i.timesPurchased++;
        updateUserCredits(totalCost);
        i.cost += 5;

        // Update item in master list here
        updateMasterListItem(i);
      }
      return i;
    });
    updateRenderedItem(item);
    updateAllRenderedItems();
    saveProgress();
    return;
  }
  updateUserCredits(totalCost);
  item.cost += 5;
  item.timesPurchased++;
  item.quantity++;

  // update item in masterlist here
  updateMasterListItem(item);
  purchasedItems.push(item);
  updateRenderedItem(item);
  updateAllRenderedItems();
  saveProgress();
};

const updateUserCredits = (cost) => {
  credits -= cost;
  if (credits < 0) {
    credits = 0;
  }
  scCounter.innerHTML = `${": " + credits}`;
};

const updateRenderedItem = (item) => {
  let totalCost = item.cost;
  if (item.onSale) {
    totalCost = Math.ceil(item.cost * 0.5);
  }
  const cardEl = document.getElementById("bbShopItemCard-" + item.internalName);
  const badgeEl = cardEl.querySelector(".costBadges");
  badgeEl.textContent = totalCost;
};

const updateAllRenderedItems = () => {
  const cards = document.querySelectorAll(".bbShopItemCards");
  cards.forEach((card) => {
    const badge = card.querySelector(".costBadges");
    if (credits < parseInt(badge.innerHTML, 10)) {
      card.onclick = "";
      badge.classList.add("bg-danger", "text-light");
      badge.classList.remove("bg-warning", "bg-success", "text-dark");
    }
  });
};

const checkMissionButtons = () => {
  if (missionCounter > 8) {
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].disabled = true;
    }
  }

  if (missionCounter >= 23) {
    missionFailedButton.disabled = true;
    missionCompleteButton.disabled = true;

    // hide the mission buttons, and show download items buttons
    missionCompleteButton.style.display = "none";
    missionFailedButton.style.display = "none";
    downloadPDFButtonDiv.style.display = "block";

    // show score modal
    genBBGameOverModal();
  }

  if (missionCounter < 22) {
    missionCompleteButton.style.display = "block";
    missionFailedButton.style.display = "block";
    downloadPDFButtonDiv.style.display = "none";

    // if all equippedItems arrays are full, can start mission
    // if (
    //   equippedArmor.length === 1 &&
    //   equippedPrimary.length === 1 &&
    //   equippedSecondary.length === 1 &&
    //   equippedThrowable.length === 1 &&
    //   equippedStratagems.length === 4
    // ) {
    //   missionCompleteButton.disabled = false;
    //   missionFailedButton.disabled = false;
    //   return;
    // }
    // else
    missionCompleteButton.disabled = false; // change to TRUE!!!
    missionFailedButton.disabled = false; // change to TRUE!!!
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

const uploadSaveData = async () => {
  await getStartingItems("bb");
  await populateDefaultItems();
  const budgetBlitzSaveData = localStorage.getItem("budgetBlitzSaveData");
  if (budgetBlitzSaveData) {
    const currentGame = await getCurrentGame();

    // the general working arrays
    newStrats = currentGame.newStrats;
    newPrims = currentGame.newPrims;
    newSeconds = currentGame.newSeconds;
    newThrows = currentGame.newThrows;
    newArmorPassives = currentGame.newArmorPassives;
    newBoosts = currentGame.newBoosts;

    // primarily for warbond filtering
    masterPrimsList = currentGame.masterPrimsList;
    masterSecondsList = currentGame.masterSecondsList;
    masterThrowsList = currentGame.masterThrowsList;
    masterBoostsList = currentGame.masterBoostsList;
    masterStratsList = currentGame.masterStratsList;
    masterArmorPassivesList = currentGame.masterArmorPassivesList;

    // for uploading purchased items, lets loop through newArrays, find the matches, and push those to a temp array. then let purchased items = tempArray

    purchasedItems = await getPurchasedItems(currentGame.purchasedItems);
    seesRulesOnOpen = currentGame.seesRulesOnOpen;
    missionCounter = currentGame.missionCounter;
    failedMissions = currentGame.failedMissions;
    successfulMissions = currentGame.successfulMissions;
    warbondCodes = currentGame.warbondCodes;
    dataName = currentGame.dataName;
    credits = currentGame.credits;
    scCounter.innerHTML = `${": " + credits}`;
    missionCounterText.innerHTML = `${getMissionText()}`;
    checkMissionButtons();

    await filterItemsByWarbond(true);
    await populatePurchasedItemsInventory();
    return;
  }
  startNewRun();
};

const decrementItemQuantity = (card, arr) => {
  const badge = card.querySelector(".costBadges");
  let badgeValue = badge.innerHTML.trim();

  if (badgeValue === "∞") return;

  const itemName = card.querySelector(".pcItemCardText").innerHTML;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i].displayName === itemName) {
      arr[i].quantity--;
      updateMasterListItem(arr[i]);
      badgeValue = arr[i].quantity;
      badge.innerHTML = badgeValue;
      if (arr[i].quantity <= 0) {
        // remove the card from the DOM
        card.remove();

        // remove the item from purchasedItems list
        purchasedItems = purchasedItems.filter(
          (item) => item.displayName !== itemName
        );
      }
      break;
    }
  }
};

const unequipAllItems = async (missionEnded = false) => {
  const equippedItemsArrays = [
    [...equippedStratagems],
    [...equippedArmor],
    [...equippedPrimary],
    [...equippedSecondary],
    [...equippedThrowable],
    [...equippedBooster],
  ];
  for (let i = 0; i < equippedItemsArrays.length; i++) {
    const itemArray = equippedItemsArrays[i];
    let key = null;
    let arr = [];
    if (i === 0) {
      key = "Stratagem";
      arr = newStrats;
    } else if (i === 1) {
      key = "armor";
      arr = newArmorPassives;
    } else if (i === 2) {
      key = "primary";
      arr = newPrims;
    } else if (i === 3) {
      key = "secondary";
      arr = newSeconds;
    } else if (i === 4) {
      key = "throwable";
      arr = newThrows;
    } else if (i === 5) {
      key = "booster";
      arr = newBoosts;
    }
    for (let j = 0; j < itemArray.length; j++) {
      const card = document.getElementById(itemArray[j].id);
      const badgeText = card.querySelector(".costBadges").innerHTML;
      const itemConfig = categoryMap[key];
      if (!itemConfig) {
        return;
      }
      unequipItem(itemConfig, card, badgeText);
      missionEnded ? await decrementItemQuantity(card, arr) : null;
    }
  }
};

const submitMissionReport = async (isMissionSucceeded) => {
  await unequipAllItems(true);

  if (isMissionSucceeded) {
    const starsEarnedModifier = parseInt(starsEarnedInput.value, 10) * 25;
    const superSamplesModifier = superSamplesCollectedCheck.checked ? 25 : 0;
    const highValueItemModifier = highValueItemCollectedCheck.checked ? 25 : 0;
    const total =
      starsEarnedModifier + superSamplesModifier + highValueItemModifier;
    credits += total;
    scCounter.innerHTML = `${": " + credits}`;

    // reset values in modal when done calculating
    starsEarnedInput.value = 1;
    superSamplesCollectedCheck.checked = false;
    highValueItemCollectedCheck.checked = false;

    // update missionCounter
    missionCounter++;

    // here we want to go through all the items in the shop and update their cost and onSale property
    // if they are starting a new operation
    await updateShopItemsCostAndSaleStatus();

    missionCounterText.innerHTML = `${getMissionText()}`;
    checkMissionButtons();
    successfulMissions++;
    saveProgress();
    return;
  }

  // set missionCounter back to start of operation
  if (!isMissionSucceeded) {
    reduceMissionCounter();
    checkMissionButtons();
    missionCounterText.innerHTML = `${getMissionText()}`;
    failedMissions++;
    saveProgress();
    return;
  }
};

const updateMasterListItem = (item) => {
  let masterList = [];
  const key = item.type === "Stratagem" ? "Stratagem" : item.category;
  if (key === "Stratagem") {
    masterList = masterStratsList;
  } else if (key === "armor") {
    masterList = masterArmorPassivesList;
  } else if (key === "primary") {
    masterList = masterPrimsList;
  } else if (key === "secondary") {
    masterList = masterSecondsList;
  } else if (key === "throwable") {
    masterList = masterThrowsList;
  } else if (key === "booster") {
    masterList = masterBoostsList;
  }
  const index = masterList.findIndex((i) => i.displayName === item.displayName);
  if (index !== -1) {
    masterList[index] = { ...masterList[index], ...item };
  }
};

const cloneList = (list) => {
  return list.map((item) => ({
    ...item,
    tags: [...item.tags], // clone the tags array too
  }));
};

const saveProgress = async () => {
  let obj = {};
  const budgetBlitzSaveData = localStorage.getItem("budgetBlitzSaveData");
  if (!budgetBlitzSaveData) {
    obj = {
      savedGames: [
        {
          purchasedItems,

          newStrats,
          newPrims,
          newSeconds,
          newThrows,
          newArmorPassives,
          newBoosts,

          masterStratsList,
          masterPrimsList,
          masterSecondsList,
          masterThrowsList,
          masterBoostsList,
          masterArmorPassivesList,

          seesRulesOnOpen: false,
          dataName: `${getMissionText()} | ${getCurrentDateTime()}`,
          dateStarted: `${getCurrentDateTime()}`,
          currentGame: true,
          missionCounter,
          failedMissions,
          successfulMissions,
          credits,

          warbondCodes,
        },
      ],
    };
    localStorage.setItem("budgetBlitzSaveData", JSON.stringify(obj));
    missionCounterText.innerHTML = `${getMissionText()}`;
    return;
  }
  const data = JSON.parse(budgetBlitzSaveData);
  const newSavedGames = await data.savedGames.map((sg) => {
    if (sg.currentGame === true) {
      sg = {
        ...sg,
        purchasedItems,

        newStrats,
        newPrims,
        newSeconds,
        newThrows,
        newArmorPassives,
        newBoosts,

        masterStratsList,
        masterPrimsList,
        masterSecondsList,
        masterThrowsList,
        masterBoostsList,
        masterArmorPassivesList,

        seesRulesOnOpen: false,
        dataName: `${getMissionText()} | ${getCurrentDateTime()}`,
        currentGame: true,
        missionCounter,
        failedMissions,
        successfulMissions,
        credits,

        warbondCodes,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };
  localStorage.setItem("budgetBlitzSaveData", JSON.stringify(obj));
};

const saveDataAndRestart = async () => {
  const budgetBlitzSaveData = localStorage.getItem("budgetBlitzSaveData");
  if (!budgetBlitzSaveData) {
    return;
  }
  const savedGames = JSON.parse(budgetBlitzSaveData).savedGames;
  // make all saved game data currentGame = false
  let updatedSavedGames = await savedGames.map((sg) => {
    sg.currentGame = false;
    return sg;
  });

  await startNewRun(true);

  const newSaveObj = {
    purchasedItems,

    newStrats,
    newPrims,
    newSeconds,
    newThrows,
    newArmorPassives,
    newBoosts,

    masterStratsList,
    masterPrimsList,
    masterSecondsList,
    masterThrowsList,
    masterBoostsList,
    masterArmorPassivesList,

    seesRulesOnOpen: false,
    dataName: `${getMissionText()} | ${getCurrentDateTime()}`,
    currentGame: true,
    missionCounter,
    failedMissions,
    successfulMissions,
    credits,

    warbondCodes,
  };

  updatedSavedGames.push(newSaveObj);
  const newBudgetBlitzSaveData = {
    savedGames: updatedSavedGames,
  };
  await localStorage.setItem(
    "budgetBlitzSaveData",
    JSON.stringify(newBudgetBlitzSaveData)
  );

  // remove saved games that are at the first mission of their difficulty,
  // as long as they are not the current game ...to prevent the user from having a million saves
  pruneSavedGames();
};

// get rid of all games that arent the current game and are on the first mission
const pruneSavedGames = async () => {
  const budgetBlitzSaveData = localStorage.getItem("budgetBlitzSaveData");
  if (!budgetBlitzSaveData) {
    return;
  }
  const prunedGames = await JSON.parse(budgetBlitzSaveData).savedGames.filter(
    (sg) => {
      if (
        sg.currentGame === true ||
        sg.missionCounter > 8 ||
        sg.purchasedItems.length > 0
      ) {
        return sg;
      }
    }
  );
  const oldData = JSON.parse(budgetBlitzSaveData);
  const newData = {
    ...oldData,
    savedGames: prunedGames,
  };
  localStorage.setItem("budgetBlitzSaveData", JSON.stringify(newData));
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("budgetBlitzSaveData");
  window.location.reload();
};

const getCurrentGame = async () => {
  const savedGames = JSON.parse(
    localStorage.getItem("budgetBlitzSaveData")
  ).savedGames;
  const currentGame = await savedGames.filter((sg) => {
    return sg.currentGame === true;
  });
  if (currentGame.length !== 1) {
    console.log("SAVED GAME DATA CORRUPTED", savedGames);
    return;
  }
  return currentGame[0];
};

const getPurchasedItems = (lsDataPurchasedItems) => {
  const categoryMap = {
    Stratagem: newStrats,
    armor: newArmorPassives,
    primary: newPrims,
    secondary: newSeconds,
    throwable: newThrows,
    booster: newBoosts,
  };

  const tempArray = [];

  for (let i = 0; i < lsDataPurchasedItems.length; i++) {
    const item = lsDataPurchasedItems[i];
    const key = item.type === "Stratagem" ? "Stratagem" : item.category;
    const arr = categoryMap[key] || [];

    const match = arr.find((el) => el.displayName === item.displayName);
    if (match) {
      tempArray.push(match); // push the reference from the source array
    }
  }

  return tempArray;
};

uploadSaveData();
