const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody"
);
const maxStarsModalBody = document.getElementById("maxStarsModalBody");
const mainViewButtons = document.getElementsByClassName("mainViewButtons");
const scCounter = document.getElementById("scCounter");
const loadoutContainer = document.getElementById("loadoutContainer");
const stratagemsContainerBB = document.getElementById("stratagemsContainerBB");
const armorContainerBB = document.getElementById("armorContainerBB");
const emptyArmorSquare = document.getElementById("emptyArmorSquare");
const emptyPrimarySquare = document.getElementById("emptyPrimarySquare");
const emptyThrowableSquare = document.getElementById("emptyThrowableSquare");
const emptySecondarySquare = document.getElementById("emptySecondarySquare");
const emptyBoosterSquare = document.getElementById("emptyBoosterSquare");
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
const maxStarsPromptModal = document.getElementById("maxStarsPromptModal"); // will have to change this modal to input # of stars, super samples, high value items

let missionCounter = 5;
let purchasedItems = [];
let equippedStratagems = [];
let equippedArmor = [];
let equippedPrimary = [];
let equippedSecondary = [];
let equippedThrowable = [];
let equippedBooster = [];

let currentView = "loadoutButton";
let credits = 100;
missionButtonsDiv.style.display = "flex";
bbShopFilterDiv.style.display = "none";

// toggles view between LOADOUT and SHOP
for (let z = 0; z < mainViewButtons.length; z++) {
  mainViewButtons[z].addEventListener("change", (e) => {
    // Loadout view will be like Randomizer
    // Shop view similar to what it is now
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

const startNewRun = async () => {
  newStrats = await OGstratsList.filter(
    (strat) => !starterStratNames.includes(strat.displayName)
  ).map((strat) => {
    strat.timesPurchased = 0;
    strat.cost = getItemCost(strat);
    strat.quantity = 1;
    strat.onSale = getIsItemOnSale();
    return strat;
  });
  newPrims = await OGprimsList.filter(
    (prim) => !starterPrimNames.includes(prim.displayName)
  ).map((prim) => {
    prim.timesPurchased = 0;
    prim.cost = getItemCost(prim);
    prim.quantity = 1;
    prim.onSale = getIsItemOnSale();
    return prim;
  });
  newSeconds = await OGsecondsList.filter(
    (sec) => !starterSecNames.includes(sec.displayName)
  ).map((sec) => {
    sec.timesPurchased = 0;
    sec.cost = getItemCost(sec);
    sec.quantity = 1;
    sec.onSale = getIsItemOnSale();
    return sec;
  });
  newThrows = await OGthrowsList.filter(
    (throwable) => !starterThrowNames.includes(throwable.displayName)
  ).map((throwable) => {
    throwable.timesPurchased = 0;
    throwable.cost = getItemCost(throwable);
    throwable.quantity = 1;
    throwable.onSale = getIsItemOnSale();
    return throwable;
  });
  newArmorPassives = await OGarmorPassivesList.filter(
    (armorPassive) =>
      !starterArmorPassiveNames.includes(armorPassive.displayName)
  ).map((armorPassive) => {
    armorPassive.quantity = 1;
    armorPassive.timesPurchased = 0;
    armorPassive.onSale = getIsItemOnSale();
    armorPassive.cost = getItemCost(armorPassive);
    return armorPassive;
  });
  newBoosts = await OGboostsList.filter(
    (booster) => !starterBoosterNames.includes(booster.displayName)
  ).map((booster) => {
    booster.quantity = 1;
    booster.timesPurchased = 0;
    booster.onSale = getIsItemOnSale();
    booster.cost = getItemCost(booster);
    return booster;
  });
  credits = 100;
  scCounter.innerHTML = `${": " + credits}`;
  currentItems = [];
  missionCounter = 5;
  checkMissionButtons();

  // DISABLED MODAL JUST FOR TESTING. ADD THIS BACK IN WHEN CHALLENGE GOES LIVE
  // open the modal to show the rules
  // document.addEventListener('DOMContentLoaded', () => {
  //   const modal = new bootstrap.Modal(flavorAndInstructionsModal);
  //   modal.show();
  // });
  missionCounterText.innerHTML = `${getMissionText()}`;
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
  card.className = `card d-flex col-1 pcItemCards bbItemCards ${shopClass}`;
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

const inventoryIDs = ["defaultInventory", "purchasedItemsInventory"];

const categoryMap = {
  armor: {
    equipped: () => equippedArmor,
    setEquipped: (val) => (equippedArmor = val),
    container: armorContainerBB,
    emptySlot: emptyArmorSquare,
    max: 1,
  },
  primary: {
    equipped: () => equippedPrimary,
    setEquipped: (val) => (equippedPrimary = val),
    container: primaryContainerBB,
    emptySlot: emptyPrimarySquare,
    max: 1,
  },
  secondary: {
    equipped: () => equippedSecondary,
    setEquipped: (val) => (equippedSecondary = val),
    container: secondaryContainerBB,
    emptySlot: emptySecondarySquare,
    max: 1,
  },
  throwable: {
    equipped: () => equippedThrowable,
    setEquipped: (val) => (equippedThrowable = val),
    container: throwableContainerBB,
    emptySlot: emptyThrowableSquare,
    max: 1,
  },
  booster: {
    equipped: () => equippedBooster,
    setEquipped: (val) => (equippedBooster = val),
    container: boosterContainerBB,
    emptySlot: emptyBoosterSquare,
    max: 1,
  },
  Stratagem: {
    equipped: () => equippedStratagems,
    setEquipped: (val) => (equippedStratagems = val),
    container: stratagemsContainerBB,
    emptySlot: null,
    max: 4,
  },
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

  if (itemConfig.emptySlot) {
    itemConfig.container.appendChild(itemConfig.emptySlot);
  } else {
    // Stratagem specific: add 4 empty boxes
    if (equippedStratagems.length === 0) {
      itemConfig.container.innerHTML = "";
      for (let i = 0; i < 4; i++) {
        itemConfig.container.innerHTML += `
        <div class="col-3 mx-2 d-flex justify-content-center align-items-center"
             style="width: 100px; height: 100px; background-color: grey">
          <span class="text-white text-center">Select Stratagem Below</span>
        </div>`;
      }
    }
  }

  card.classList.add("col-1");
  moveToInventory(card, badgeText);
};

const equipItem = (itemConfig, card) => {
  if (itemConfig.equipped().length >= itemConfig.max) return;

  itemConfig.setEquipped([...itemConfig.equipped(), card]);

  // only do this if not a stratagem card
  if (itemConfig.max !== 4) {
    card.classList.remove("col-1");
  }

  if (itemConfig.emptySlot) {
    itemConfig.emptySlot.replaceWith(card);
  } else {
    // Stratagems: replace all children
    itemConfig.container.innerHTML = "";
    itemConfig.equipped().forEach((el) => {
      itemConfig.container.appendChild(el);
    });
  }

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
        i.quantity++;
        i.timesPurchased++;
        updateUserCredits(totalCost);
        i.cost += 5;
      }
      return i;
    });
    updateRenderedItem(item);
    updateAllRenderedItems();
    return;
  }
  updateUserCredits(totalCost);
  item.cost += 5;
  item.timesPurchased++;
  purchasedItems.push(item);
  updateRenderedItem(item);
  updateAllRenderedItems();
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
  if (missionCounter >= 23) {
    missionFailedButton.disabled = true;
    missionCompleteButton.disabled = true;
    // hide the mission buttons, and show download items buttons
    missionCompleteButton.style.display = "none";
    missionFailedButton.style.display = "none";
    downloadPDFButtonDiv.style.display = "block";
  }

  if (missionCounter < 21) {
    missionCompleteButton.style.display = "block";
    missionFailedButton.style.display = "block";
    downloadPDFButtonDiv.style.display = "none";

    // if all equippedItems arrays are full, can start mission
    if (
      equippedArmor.length === 1 &&
      equippedPrimary.length === 1 &&
      equippedSecondary.length === 1 &&
      equippedThrowable.length === 1 &&
      equippedStratagems.length === 4
    ) {
      missionCompleteButton.disabled = false;
      missionFailedButton.disabled = false;
      return;
    }
    // REMEMBER TO CHANGE THIS BACK WHEN DONE TESTING
    // else
    missionCompleteButton.disabled = false;
    missionFailedButton.disabled = false;
  }
};

const uploadSaveData = async () => {
  await getStartingItems("bb");
  await populateDefaultItems();
  const budgetBlitzSaveData = localStorage.getItem("budgetBlitzSaveData");
  if (budgetBlitzSaveData) {
    const currentGame = await getCurrentGame();
    newStrats = currentGame.newStrats;
    newPrims = currentGame.newPrims;
    newSeconds = currentGame.newSeconds;
    newThrows = currentGame.newThrows;
    newArmorPassives = currentGame.newArmorPassives;
    newBoosts = currentGame.newBoosts;
    purchasedItems = currentGame.purchasedItems;
    seesRulesOnOpen = currentGame.seesRulesOnOpen;
    missionCounter = currentGame.missionCounter;
    dataName = currentGame.dataName;
    missionCounterText.innerHTML = `${getMissionText()}`;
    checkMissionButtons();
    await populateShopItems();
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

  arr = arr.map((obj) => {
    if (obj.displayName === itemName) {
      const newQuantity = obj.quantity - 1;

      // update the badge text in the DOM
      badge.innerHTML = newQuantity;

      // remove the card if quantity is 0
      if (newQuantity === 0) {
        card.remove();
      }

      return { ...obj, quantity: newQuantity };
    }

    return obj;
  });

  return arr;
};

const submitMissionReport = (isMissionSucceeded) => {
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
    let masterArray = [];
    if (i === 0) {
      key = "Stratagem";
      masterArray = newStrats;
    } else if (i === 1) {
      key = "armor";
      masterArray = newArmorPassives;
    } else if (i === 2) {
      key = "primary";
      masterArray = newPrims;
    } else if (i === 3) {
      key = "secondary";
      masterArray = newSeconds;
    } else if (i === 4) {
      key = "throwable";
      masterArray = newThrows;
    } else if (i === 5) {
      key = "booster";
      masterArray = newBoosts;
    }
    for (let j = 0; j < itemArray.length; j++) {
      const card = document.getElementById(itemArray[j].id);
      const badgeText = card.querySelector(".costBadges").innerHTML;
      const itemConfig = categoryMap[key];
      if (!itemConfig) {
        return;
      }
      unequipItem(itemConfig, card, badgeText);
      decrementItemQuantity(card, masterArray);
    }
  }

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

    missionCounter++;
    missionCounterText.innerHTML = `${getMissionText()}`;
    checkMissionButtons();
    return;
  }

  // if !isMissionSucceeded:
  // set missionCounter back to start of operation
  console.log(isMissionSucceeded);
};

uploadSaveData();
