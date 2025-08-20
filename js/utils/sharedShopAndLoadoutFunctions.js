const missionCompleteModal = document.getElementById("missionCompleteModal");
const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody"
);
const bbDiffRadioEasy = document.getElementById("bbDiffRadioEasy");
const bbDiffRadioMedium = document.getElementById("bbDiffRadioMedium");
const bbDiffRadioHard = document.getElementById("bbDiffRadioHard");
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
const superSamplesCollectedInput = document.getElementById(
  "superSamplesCollectedInput"
);
const timeRemainingInput = document.getElementById("timeRemainingInput");
const numOfDeathsInput = document.getElementById("numOfDeathsInput");
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

let sesItem = {
  cost: 15,
  timesPurchased: 0,
  warbondCode: "none",
  category: "random",
};

missionCompleteModal.addEventListener("hidden.bs.modal", () => {
  starsEarnedInput.value = 1;
  superSamplesCollectedInput.value = 0;
  timeRemainingInput.value = 0;
  numOfDeathsInput.value = 0;
  highValueItemCollectedCheck.checked = false;
});

timeRemainingInput.addEventListener("input", () => {
  const value = parseInt(timeRemainingInput.value, 10);

  if (value < 0) timeRemainingInput.value = 0;
  if (value > 100) timeRemainingInput.value = 100;
});

numOfDeathsInput.addEventListener("input", () => {
  const value = parseInt(numOfDeathsInput.value, 10);

  if (value < 0) numOfDeathsInput.value = 0;
  if (value > 24) numOfDeathsInput.value = 24;
});

superSamplesCollectedInput.addEventListener("input", () => {
  const value = parseInt(superSamplesCollectedInput.value, 10);
  const max = parseInt(superSamplesCollectedInput.max, 10);

  if (value < 0) superSamplesCollectedInput.value = 0;
  if (value > max) superSamplesCollectedInput.value = max;
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

const diffRadios = [bbDiffRadioEasy, bbDiffRadioMedium, bbDiffRadioHard];
for (let w = 0; w < diffRadios.length; w++) {
  diffRadios[w].addEventListener("change", async (e) => {
    if (e.srcElement.id.includes("Easy")) {
      credits = 150;
      difficulty = "Easy";
    }
    if (e.srcElement.id.includes("Medium")) {
      credits = 100;
      difficulty = "Medium";
    }
    if (e.srcElement.id.includes("Hard")) {
      credits = 50;
      difficulty = "Hard";
    }
    scCounter.innerHTML = `${": " + credits}`;
    await writeItems();
    if (currentView === "shopButton") {
      bbShopItemsContainer.innerHTML = "";
      populateShopItems();
    }
  });
}

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
        populateInventory();
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

const writeItems = async () => {
  newStrats = await OGstratsList.filter(
    (strat) => !starterStratNames.includes(strat.displayName)
  ).map((strat) => {
    strat.timesPurchased = 0;
    strat.cost = getItemCost(difficulty, strat);
    strat.quantity = 0;
    strat.onSale = getIsItemOnSale(difficulty);
    return strat;
  });
  newPrims = await OGprimsList.filter(
    (prim) => !starterPrimNames.includes(prim.displayName)
  ).map((prim) => {
    prim.timesPurchased = 0;
    prim.cost = getItemCost(difficulty, prim);
    prim.quantity = 0;
    prim.onSale = getIsItemOnSale(difficulty);
    return prim;
  });
  newSeconds = await OGsecondsList.filter(
    (sec) => !starterSecNames.includes(sec.displayName)
  ).map((sec) => {
    sec.timesPurchased = 0;
    sec.cost = getItemCost(difficulty, sec);
    sec.quantity = 0;
    sec.onSale = getIsItemOnSale(difficulty);
    return sec;
  });
  newThrows = await OGthrowsList.filter(
    (throwable) => !starterThrowNames.includes(throwable.displayName)
  ).map((throwable) => {
    throwable.timesPurchased = 0;
    throwable.cost = getItemCost(difficulty, throwable);
    throwable.quantity = 0;
    throwable.onSale = getIsItemOnSale(difficulty);
    return throwable;
  });
  newArmorPassives = await OGarmorPassivesList.filter(
    (armorPassive) =>
      !starterArmorPassiveNames.includes(armorPassive.displayName)
  ).map((armorPassive) => {
    armorPassive.quantity = 0;
    armorPassive.timesPurchased = 0;
    armorPassive.onSale = getIsItemOnSale(difficulty);
    armorPassive.cost = getItemCost(difficulty, armorPassive);
    return armorPassive;
  });
  newBoosts = await OGboostsList.filter(
    (booster) => !starterBoosterNames.includes(booster.displayName)
  ).map((booster) => {
    booster.quantity = 0;
    booster.timesPurchased = 0;
    booster.onSale = getIsItemOnSale(difficulty);
    booster.cost = getItemCost(difficulty, booster);
    return booster;
  });

  // primarily for warbond filtering
  masterPrimsList = cloneList(newPrims);
  masterSecondsList = cloneList(newSeconds);
  masterThrowsList = cloneList(newThrows);
  masterBoostsList = cloneList(newBoosts);
  masterStratsList = cloneList(newStrats);
  masterArmorPassivesList = cloneList(newArmorPassives);
};

const populateInventory = async () => {
  const equipmentCardContainers = [
    primaryContainerBB,
    secondaryContainerBB,
    throwableContainerBB,
    armorContainerBB,
    boosterContainerBB,
  ];
  let equippedItemCardIDs = [];

  // get any equipped equipment
  for (let k = 0; k < equipmentCardContainers.length; k++) {
    const id = equipmentCardContainers[k].children[0].id;
    if (id && id.includes("bbLoadoutItemCard-")) {
      equippedItemCardIDs.push(id);
    }
  }

  // get any equipped stratagems
  for (let j = 0; j < stratagemsContainerBB.children.length; j++) {
    const id = stratagemsContainerBB.children[j].id;
    if (id && id.includes("bbLoadoutItemCard-")) {
      equippedItemCardIDs.push(id);
    }
  }

  await populatePurchasedItemsInventory(equippedItemCardIDs);
};

const populatePurchasedItemsInventory = async (equippedItems = null) => {
  let purchasedItemCards = [];
  // make a card for every purchased item
  for (let i = 0; i < purchasedItems.length; i++) {
    const card = await generateItemCard(purchasedItems[i]);
    purchasedItemCards.push(card);
  }

  // if equipped items, take out those items from the card list
  if (equippedItems && equippedItems.length > 0) {
    purchasedItemCards = await purchasedItemCards.filter((cd) => {
      return !equippedItems.includes(cd.id);
    });
    // only put the unequipped purchased items in the purchased items box
    for (let j = 0; j < purchasedItemCards.length; j++) {
      purchasedItemsInventory.appendChild(purchasedItemCards[j]);
    }
    return;
  }

  // only put the unequipped purchased items in the purchased items box
  for (let j = 0; j < purchasedItemCards.length; j++) {
    purchasedItemsInventory.appendChild(purchasedItemCards[j]);
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
  genRandomItem(allItemsList);
  for (let i = 0; i < allItemsList.length; i++) {
    const items = allItemsList[i];
    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      bbShopItemsContainer.appendChild(generateItemCard(item, "shop"));
    }
  }
  bbShopItemsContainer.prepend(generateSESItemCard());
};

const genRandomItem = (allItemsList) => {
  const randomListIndex = Math.floor(Math.random() * 6);
  const randomItemIndex = Math.floor(
    Math.random() * allItemsList[randomListIndex].length
  );
  const item = allItemsList[randomListIndex][randomItemIndex];
  randomItem = item;
};

const generateSESItemCard = () => {
  const card = document.createElement("div");
  if (difficulty === "Easy") {
    sesItem.cost = 10;
  }
  if (difficulty === "Hard") {
    sesItem.cost = 20;
  }

  card.id = "bbShopItemCard-RANDOM";
  card.dataset.type = "RANDOM";
  if (sesItem.cost <= credits) {
    card.onclick = () => purchaseItem(null, true);
  }

  card.className = `card col-2 col-lg-1 text-center bbShopItemCards pcItemCards bbItemCards none`;
  card.innerHTML = `
    <i class="fa-2x text-info fa-solid fa-question pt-1 img-card-top"></i>
    <span class="costBadges translate-middle badge rounded-pill bg-warning text-dark">
      ${sesItem.cost}
    </span>
    <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
      <p class="card-title text-white pcItemCardText">Super Earth Surplus (random)</p>
    </div>
  `;

  return card;
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
      card.onclick = () => purchaseItem(item, false);
    }
    if (totalCost > credits) {
      costBadgeColor = "bg-danger text-light";
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
    <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
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
  if (missionCounter >= 23) return;
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

const purchaseItem = async (item, isRandom, isAward = null) => {
  if (!item) {
    item = randomItem;
  }
  if (missionCounter >= 23) return;
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
        !isAward
          ? updateUserCredits(isRandom ? sesItem.cost : totalCost)
          : null;
        i.quantity++;
        isRandom ? sesItem.timesPurchased++ : i.timesPurchased++;
        !isRandom ? (item.cost += 5) : null;
        // Update item in master list here
        updateMasterListItem(i);
      }
      isRandom
        ? genRandomItem([
            newPrims,
            newStrats,
            newBoosts,
            newSeconds,
            newArmorPassives,
            newThrows,
          ])
        : null;
      return i;
    });
    updateRenderedItem(item, isRandom);
    updateAllRenderedItems();
    saveProgress();
    showBBPurchasedItemToast(item.displayName);
    return;
  }
  !isAward ? updateUserCredits(isRandom ? sesItem.cost : totalCost) : null;

  !isRandom ? (item.cost += 5) : null;
  isRandom ? sesItem.timesPurchased++ : item.timesPurchased++;
  item.quantity++;
  // update item in masterlist here
  updateMasterListItem(item);
  purchasedItems.push(item);
  updateRenderedItem(item, isRandom);
  updateAllRenderedItems();
  saveProgress();
  showBBPurchasedItemToast(item.displayName);
  isRandom
    ? genRandomItem([
        newPrims,
        newStrats,
        newBoosts,
        newSeconds,
        newArmorPassives,
        newThrows,
      ])
    : null;
};

const updateUserCredits = (cost) => {
  credits -= cost;
  if (credits < 0) {
    credits = 0;
  }
  scCounter.innerHTML = `${": " + credits}`;
};

const updateRenderedItem = (item, isRandom) => {
  // update shop card
  let totalCost = isRandom ? sesItem.cost : item.cost;
  if (item.onSale && !isRandom) {
    totalCost = Math.ceil(item.cost * 0.5);
  }
  let shopCardID = "bbShopItemCard-" + item.internalName;
  if (isRandom) {
    shopCardID = "bbShopItemCard-RANDOM";
  }
  if (!isRandom) {
    const shopCardEl = document.getElementById(shopCardID);
    const shopBadgeEl = shopCardEl.querySelector(".costBadges");
    shopBadgeEl.textContent = totalCost;
  }
  // update loadout card
  const loadoutCardEl = document.getElementById(
    "bbLoadoutItemCard-" + item.internalName
  );
  if (loadoutCardEl) {
    const loadoutBadgeEl = loadoutCardEl.querySelector(".costBadges");
    loadoutBadgeEl.textContent = item.quantity;
  }
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

const decreasePurchasedItemQuantity = (item) => {
  for (let i = 0; i < purchasedItems.length; i++) {
    if (item.displayName === purchasedItems[i].displayName) {
      purchasedItems[i] = item;
    }
  }
};

const decrementItemQuantity = (card, arr) => {
  const badge = card.querySelector(".costBadges");
  let badgeValue = badge.innerHTML.trim();

  if (badgeValue === "∞") return;

  let itemName = card.querySelector(".pcItemCardText").innerHTML;
  if (itemName === "Breaker Spray &amp; Pray") {
    itemName = itemName.replace("&amp;", "&");
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].displayName === itemName) {
      arr[i].quantity--;
      updateMasterListItem(arr[i]);
      if (arr[i].quantity > 0) {
        decreasePurchasedItemQuantity(arr[i]);
      }
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

const clearSaveDataAndRestart = async (data) => {
  localStorage.removeItem(data);
  window.location.reload();
};
