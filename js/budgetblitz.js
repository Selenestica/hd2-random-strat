const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody"
);
const maxStarsModalBody = document.getElementById("maxStarsModalBody");
const mainViewButtons = document.getElementsByClassName("mainViewButtons");
const scCounter = document.getElementById("scCounter");
const loadoutContainer = document.getElementById("loadoutContainer");
const bbShopItemsContainer = document.getElementById("bbShopItemsContainer");
const defaultInventory = document.getElementById("defaultInventory");
const yourCreditsAmount = document.getElementById("yourCreditsAmount");
const itemCostAmount = document.getElementById("itemCostAmount");
const itemQuantityInput = document.getElementById("itemQuantityInput");
const itemPurchaseModalBody = document.getElementById("itemPurchaseModalBody");
const downloadPDFButtonDiv = document.getElementById("downloadPDFButtonDiv");
const missionButtonsDiv = document.getElementById("missionButtonsDiv");
const bbShopFilterDiv = document.getElementById("bbShopFilterDiv");
const shopSearchInput = document.getElementById("shopSearchInput");
const missionCounterText = document.getElementById("missionCounterText");
const maxStarsPromptModal = document.getElementById("maxStarsPromptModal"); // will have to change this modal to input # of stars

let missionCounter = 5;
let purchasedItems = [];
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
      }
      if (e.srcElement.id === "shopButton") {
        addItemsToAccordions(e.srcElement.id);
        missionButtonsDiv.style.display = "none";
        bbShopFilterDiv.style.display = "flex";
        bbShopItemsContainer.classList.add("d-flex");
        bbShopItemsContainer.classList.remove("d-none");
        loadoutContainer.classList.add("d-none");
        loadoutContainer.classList.remove("d-flex");
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
    strat.cost = getItemCost(strat);
    strat.quantity = 1;
    strat.timesPurchased = 0;
    strat.onSale = getIsItemOnSale();
    return strat;
  });
  newPrims = await OGprimsList.filter(
    (prim) => !starterPrimNames.includes(prim.displayName)
  ).map((prim) => {
    prim.cost = getItemCost(prim);
    prim.quantity = 1;
    prim.timesPurchased = 0;
    prim.onSale = getIsItemOnSale();
    return prim;
  });
  newSeconds = await OGsecondsList.filter(
    (sec) => !starterSecNames.includes(sec.displayName)
  ).map((sec) => {
    sec.cost = getItemCost(sec);
    sec.quantity = 1;
    sec.timesPurchased = 0;
    sec.onSale = getIsItemOnSale();
    return sec;
  });
  newThrows = await OGthrowsList.filter(
    (throwable) => !starterThrowNames.includes(throwable.displayName)
  ).map((throwable) => {
    throwable.cost = getItemCost(throwable);
    throwable.quantity = 1;
    throwable.timesPurchased = 0;
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
    const card = generateItemCard(purchasedItems[i], 2);
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
    const card = generateItemCard(list[i], 1);
    defaultInventory.appendChild(card);
  }
};

const addItemsToAccordions = () => {
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
      bbShopItemsContainer.appendChild(generateItemCard(item));
    }
  }
};

const filterByType = (type) => {
  console.log(type);
};

const filterByPrice = (type) => {
  console.log(type);
};

const resetShopFilters = () => {
  console.log("resetting filters");
};

const generateItemCard = (item, colWidth = 1) => {
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
  card.id = "bbItemCard-" + item.internalName;
  if (currentView === "shopButton") {
    shopClass = "bbShopItemCards";
    showCost = true;
    card.style.cursor = "pointer";
    if (item.onSale) {
      totalCost = Math.ceil(item.cost * 0.5);
      costBadgeColor = "bg-success text-light";
    }
    // lets check if the item can be purchased
    if (totalCost > credits) {
      costBadgeColor = "bg-danger text-light";
    }
    if (totalCost <= credits) {
      card.onclick = () => purchaseItem(item);
    }
  }
  card.className = `card d-flex col-${colWidth} pcItemCards ${shopClass} mx-1 my-1 position-relative`;

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

const purchaseItem = async (item) => {
  // add the item to the list or add the quantity to it if it exists
  const existsInPurchasedList = await purchasedItems.filter((i) => {
    return i.displayName === item.displayName;
  });
  if (existsInPurchasedList.length > 0) {
    purchasedItems = await purchasedItems.map((i) => {
      if (i.displayName === item.displayName) {
        i.quantity++;
        i.timesPurchased++;
        i.cost += 5;
      }
      return i;
    });
    updateShopItemCost(item);
    return;
  }

  item.cost += 5;
  item.timesPurchased++;
  purchasedItems.push(item);
  updateShopItemCost(item);
};

const updateShopItemCost = (item) => {
  let totalCost = item.cost;
  if (item.onSale) {
    totalCost = Math.ceil(item.cost * 0.5);
  }
  const cardEl = document.getElementById("bbItemCard-" + item.internalName);
  const badgeEl = cardEl.querySelector(".costBadges");
  badgeEl.innerHTML = totalCost;
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
    missionCompleteButton.disabled = false;
    missionFailedButton.disabled = false;
    missionCompleteButton.style.display = "block";
    missionFailedButton.style.display = "block";
    downloadPDFButtonDiv.style.display = "none";
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
    seesRulesOnOpen = currentGame.seesRulesOnOpen;
    missionCounter = currentGame.missionCounter;
    dataName = currentGame.dataName;
    missionCounterText.innerHTML = `${getMissionText()}`;
    checkMissionButtons();
    await addItemsToAccordions("default");
    for (let i = 0; i < currentGame.acquiredItems.length; i++) {
      const item = currentGame.acquiredItems[i];
      const { accBody } = getItemMetaData(item);
      accBody.innerHTML += generateItemCard(item);
    }
    return;
  }
  startNewRun();
};

uploadSaveData();
