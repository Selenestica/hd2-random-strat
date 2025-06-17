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

const toggleLoadoutItem = async (item) => {
  const card = document.getElementById(
    "bbLoadoutItemCard-" + item.internalName
  );
  const badgeText = card.querySelector(".costBadges").innerHTML;
  const parentID = card.parentElement.id;

  if (item.type === "Stratagem") {
    // if equipped, move back to inventory
    if (
      parentID !== "defaultInventory" &&
      parentID !== "purchasedItemsInventory"
    ) {
      equippedStratagems = equippedStratagems.filter((it) => {
        return it.id !== card.id;
      });
      if (equippedStratagems.length === 0) {
        // put empty squares back up
        stratagemsContainerBB.innerHTML = "";
        for (let i = 0; i < 4; i++) {
          stratagemsContainerBB.innerHTML += `
            <div
              class="col-3 mx-2 d-flex justify-content-center align-items-center"
              style="width: 100px; height: 100px; background-color: grey"
            >
              <span class="text-white text-center"
                >Select Stratagem Below</span
              >
            </div>  
          `;
        }
      }
      if (badgeText.trim() === "∞") {
        defaultInventory.appendChild(card);
        checkMissionButtons();
        return;
      }
      purchasedItemsInventory.appendChild(card);
      checkMissionButtons();
      return;
    }

    // if not equipped, move to loadout
    if (
      (parentID === "defaultInventory" ||
        parentID === "purchasedItemsInventory") &&
      equippedStratagems.length < 4
    ) {
      stratagemsContainerBB.innerHTML = "";
      equippedStratagems.push(card);
      for (let i = 0; i < equippedStratagems.length; i++) {
        stratagemsContainerBB.appendChild(equippedStratagems[i]);
      }
      checkMissionButtons();
      return;
    }
  }
  if (item.category === "armor") {
    // if equipped, move back to inventory
    if (
      parentID !== "defaultInventory" &&
      parentID !== "purchasedItemsInventory"
    ) {
      const newArray = equippedArmor.filter((it) => {
        it.id !== card.id;
      });
      equippedArmor = newArray;
      armorContainerBB.appendChild(emptyArmorSquare);
      if (!card.classList.contains("col-1")) {
        card.classList.add("col-1");
      }
      if (badgeText.trim() === "∞") {
        defaultInventory.appendChild(card);
        checkMissionButtons();
        return;
      }
      purchasedItemsInventory.appendChild(card);
      checkMissionButtons();
      return;
    }

    // if not equipped, move to loadout
    if (
      (parentID === "defaultInventory" ||
        parentID === "purchasedItemsInventory") &&
      equippedArmor.length < 1
    ) {
      equippedArmor.push(card);
      card.classList.remove("col-1");
      for (let i = 0; i < equippedArmor.length; i++) {
        emptyArmorSquare.replaceWith(equippedArmor[i]);
      }
      checkMissionButtons();
      return;
    }
  }
  if (item.category === "primary") {
    // if equipped, move back to inventory
    if (
      parentID !== "defaultInventory" &&
      parentID !== "purchasedItemsInventory"
    ) {
      const newArray = equippedPrimary.filter((it) => {
        it.id !== card.id;
      });
      equippedPrimary = newArray;
      primaryContainerBB.appendChild(emptyPrimarySquare);
      if (!card.classList.contains("col-1")) {
        card.classList.add("col-1");
      }
      if (badgeText.trim() === "∞") {
        defaultInventory.appendChild(card);
        checkMissionButtons();
        return;
      }
      purchasedItemsInventory.appendChild(card);
      checkMissionButtons();
      return;
    }

    // if not equipped, move to loadout
    if (
      (parentID === "defaultInventory" ||
        parentID === "purchasedItemsInventory") &&
      equippedPrimary.length < 1
    ) {
      equippedPrimary.push(card);
      card.classList.remove("col-1");
      for (let i = 0; i < equippedPrimary.length; i++) {
        emptyPrimarySquare.replaceWith(equippedPrimary[i]);
      }
      checkMissionButtons();
      return;
    }
  }
  if (item.category === "secondary") {
    // if equipped, move back to inventory
    if (
      parentID !== "defaultInventory" &&
      parentID !== "purchasedItemsInventory"
    ) {
      const newArray = equippedSecondary.filter((it) => {
        it.id !== card.id;
      });
      equippedSecondary = newArray;
      secondaryContainerBB.appendChild(emptySecondarySquare);
      if (!card.classList.contains("col-1")) {
        card.classList.add("col-1");
      }
      if (badgeText.trim() === "∞") {
        defaultInventory.appendChild(card);
        checkMissionButtons();
        return;
      }
      purchasedItemsInventory.appendChild(card);
      checkMissionButtons();
      return;
    }

    // if not equipped, move to loadout
    if (
      (parentID === "defaultInventory" ||
        parentID === "purchasedItemsInventory") &&
      equippedSecondary.length < 1
    ) {
      equippedSecondary.push(card);
      card.classList.remove("col-1");
      for (let i = 0; i < equippedSecondary.length; i++) {
        emptySecondarySquare.replaceWith(equippedSecondary[i]);
      }
      checkMissionButtons();
      return;
    }
  }
  if (item.category === "throwable") {
    // if equipped, move back to inventory
    if (
      parentID !== "defaultInventory" &&
      parentID !== "purchasedItemsInventory"
    ) {
      const newArray = equippedThrowable.filter((it) => {
        it.id !== card.id;
      });
      equippedThrowable = newArray;
      throwableContainerBB.appendChild(emptyThrowableSquare);
      if (!card.classList.contains("col-1")) {
        card.classList.add("col-1");
      }
      if (badgeText.trim() === "∞") {
        defaultInventory.appendChild(card);
        checkMissionButtons();
        return;
      }
      purchasedItemsInventory.appendChild(card);
      checkMissionButtons();
      return;
    }

    // if not equipped, move to loadout
    if (
      (parentID === "defaultInventory" ||
        parentID === "purchasedItemsInventory") &&
      equippedThrowable.length < 1
    ) {
      equippedThrowable.push(card);
      card.classList.remove("col-1");
      for (let i = 0; i < equippedThrowable.length; i++) {
        emptyThrowableSquare.replaceWith(equippedThrowable[i]);
      }
      checkMissionButtons();
      return;
    }
  }
  if (item.category === "booster") {
    // if equipped, move back to inventory
    if (
      parentID !== "defaultInventory" &&
      parentID !== "purchasedItemsInventory"
    ) {
      const newArray = equippedBooster.filter((it) => {
        it.id !== card.id;
      });
      equippedBooster = newArray;
      boosterContainerBB.appendChild(emptyBoosterSquare);
      if (!card.classList.contains("col-1")) {
        card.classList.add("col-1");
      }
      if (badgeText.trim() === "∞") {
        defaultInventory.appendChild(card);
        checkMissionButtons();
        return;
      }
      purchasedItemsInventory.appendChild(card);
      checkMissionButtons();
      return;
    }

    // if not equipped, move to loadout
    if (
      (parentID === "defaultInventory" ||
        parentID === "purchasedItemsInventory") &&
      equippedBooster.length < 1
    ) {
      equippedBooster.push(card);
      card.classList.remove("col-1");
      for (let i = 0; i < equippedBooster.length; i++) {
        emptyBoosterSquare.replaceWith(equippedBooster[i]);
      }
      checkMissionButtons();
      return;
    }
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
    if (credits < parseInt(badge.innerHTML)) {
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
    console.log(equippedArmor);
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
    // else
    missionCompleteButton.disabled = true;
    missionFailedButton.disabled = true;
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

uploadSaveData();
