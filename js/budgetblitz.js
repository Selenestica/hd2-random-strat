const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const primaryAccordionBody = document.getElementById('PrimariesAccordionBody');
const secondaryAccordionBody = document.getElementById('SecondariesAccordionBody');
const stratagemAccordionBody = document.getElementById('StratagemsAccordionBody');
const throwableAccordionBody = document.getElementById('ThrowablesAccordionBody');
const armorPassiveAccordionBody = document.getElementById('ArmorsAccordionBody');
const boosterAccordionBody = document.getElementById('BoostersAccordionBody');
const mainViewButtons = document.getElementsByClassName('mainViewButtons')
const loadoutContainer = document.getElementById('loadoutContainer');
const shopContainer = document.getElementById('shopContainer');
const defaultInventory = document.getElementById('defaultInventory')
const itemPurchaseModal = document.getElementById('itemPurchaseModal');
const itemPurchaseModalHeaderItemName = document.getElementById('itemPurchaseModalHeaderItemName');
const itemPurchaseModalBody = document.getElementById('itemPurchaseModalBody');
const missionCompleteButton = document.getElementById('missionCompleteButton');
const missionFailedButton = document.getElementById('missionFailedButton');
const missionCompleteButtonDiv = document.getElementById('missionCompleteButtonDiv');
const missionFailedButtonDiv = document.getElementById('missionFailedButtonDiv');
const downloadPDFButtonDiv = document.getElementById('downloadPDFButtonDiv');
const missionCounterText = document.getElementById('missionCounterText');
const maxStarsPromptModal = document.getElementById('maxStarsPromptModal'); // will have to change this modal to input # of stars
let missionCounter = 5;
let purchasedItems = []
let currentView = "loadoutButton"

// toggles view between LOADOUT and SHOP
for (let z = 0; z < mainViewButtons.length; z++) {
  mainViewButtons[z].addEventListener('change', (e) => {
    // Loadout view will be like Randomizer
    // Shop view similar to what it is now
    if (e.target.checked) {
      currentView = e.srcElement.id
      if (e.srcElement.id === "loadoutButton") {
        shopContainer.classList.remove('d-flex')
        shopContainer.classList.add('d-none')
        loadoutContainer.classList.remove('d-none')
        loadoutContainer.classList.add('d-flex')
        populatePurchasedItemsInventory()
      }
      if (e.srcElement.id === 'shopButton') {
        // clear the accordions first
        stratagemAccordionBody.innerHTML = '';
        primaryAccordionBody.innerHTML = '';
        secondaryAccordionBody.innerHTML = '';
        throwableAccordionBody.innerHTML = '';
        armorPassiveAccordionBody.innerHTML = '';
        boosterAccordionBody.innerHTML = '';
        addItemsToAccordions(e.srcElement.id)
        shopContainer.classList.add('d-flex')
        shopContainer.classList.remove('d-none')
        loadoutContainer.classList.add('d-none')
        loadoutContainer.classList.remove('d-flex')
      }
    }
  });
}

const startNewRun = async () => {
  newStrats = await OGstratsList
  .filter((strat) => (!starterStratNames.includes(strat.displayName)))
  .map((strat) => {
    strat.cost = getItemCost(strat)
    strat.quantity = 1
    return strat
  })
  newPrims = await OGprimsList
  .filter((prim) => (!starterPrimNames.includes(prim.displayName)))
  .map((prim) => {
    prim.cost = getItemCost(prim)
    prim.quantity = 1
    return prim
  })
  newSeconds = await OGsecondsList
  .filter((sec) => (!starterSecNames.includes(sec.displayName)))
  .map((sec) => {
    sec.cost = getItemCost(sec)
    sec.quantity = 3
    return sec
  })
  newThrows = await OGthrowsList
  .filter((throwable) => (!starterThrowNames.includes(throwable.displayName)))
  .map((throwable) => {
    throwable.cost = getItemCost(throwable)
    throwable.quantity = 3
    return throwable
  })
  newArmorPassives = await OGarmorPassivesList
  .filter((armorPassive) => (!starterArmorPassiveNames.includes(armorPassive.displayName)))
  .map((armorPassive) => {
    armorPassive.quantity = 2
    armorPassive.cost = getItemCost(armorPassive)
    return armorPassive
  })
  newBoosts = await OGboostsList
  .filter((booster) => (!starterBoosterNames.includes(booster.displayName)))
  .map((booster) => {
    booster.quantity = 1
    booster.cost = getItemCost(booster)
    return booster
  })
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
  clearItemPurchaseModal();
  addItemsToAccordions("default")
};

const populatePurchasedItemsInventory = async () => {
  console.log("populating purchased inventory with this function")
}

const populateDefaultItems = () => {
  let list = []
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
  list = list.concat(defaultStrats).concat(defaultPrims).concat(defaultSeconds).concat(defaultThrows).concat(defaultBoosters).concat(defaultArmorPassives)
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    item.cost = null
    const card = generateItemCard(list[i], 1)
    defaultInventory.appendChild(card)
  }
};

const addItemsToAccordions = async () => {
  for (let i = 0; i < newStrats.length; i++) {
    stratagemAccordionBody.appendChild(generateItemCard(newStrats[i]));
  }
  for (let i = 0; i < newPrims.length; i++) {
    primaryAccordionBody.appendChild(generateItemCard(newPrims[i]));
  }
  for (let i = 0; i < newSeconds.length; i++) {
    secondaryAccordionBody.appendChild(generateItemCard(newSeconds[i]));
  }
  for (let i = 0; i < newThrows.length; i++) {
    throwableAccordionBody.appendChild(generateItemCard(newThrows[i]));
  }
  for (let i = 0; i < newArmorPassives.length; i++) {
    armorPassiveAccordionBody.appendChild(generateItemCard(
      newArmorPassives[i]
    ));
  }
  for (let i = 0; i < newBoosts.length; i++) {
    boosterAccordionBody.appendChild(generateItemCard(newBoosts[i]));
  }
};

const generateItemCard = (item, colWidth = 2) => {
  let imgDir = 'equipment'
  if (item.type === "Stratagem") {
    imgDir = 'svgs'
  }
  if (item.category === "armor") {
    imgDir = 'armor'
  }
  const card = document.createElement('div');
  card.className = `card d-flex col-${colWidth} pcItemCards mx-1 my-1`;
  card.style.cursor = 'pointer';
  card.onclick = () => openPurchaseModal(item);

  card.innerHTML = `
    <img
      src="../images/${imgDir}/${item.imageURL}"
      class="img-card-top"
      alt="${item.displayName}"
    />
    <div class="card-body itemNameContainer align-items-center">
      <p class="card-title text-white pcItemCardText">${item.displayName}</p>
    </div>
  `;

  return card;
};


const openPurchaseModal = (item) => {
    const modal = new bootstrap.Modal(itemPurchaseModal);
    modal.show();
}

const clearItemPurchaseModal = () => {
  itemPurchaseModalBody.innerHTML = '';
};

const checkMissionButtons = () => {
  if (missionCounter >= 23) {
    missionFailedButton.disabled = true;
    missionCompleteButton.disabled = true;
    // hide the mission buttons, and show download items buttons
    missionCompleteButton.style.display = 'none';
    missionFailedButton.style.display = 'none';
    downloadPDFButtonDiv.style.display = 'block';
  }

  if (missionCounter < 21) {
    missionCompleteButton.disabled = false;
    missionFailedButton.disabled = false;
    missionCompleteButton.style.display = 'block';
    missionFailedButton.style.display = 'block';
    downloadPDFButtonDiv.style.display = 'none';
  }
};

const uploadSaveData = async () => {
  await getStartingItems();
  await populateDefaultItems()
  const budgetBlitzSaveData = localStorage.getItem('budgetBlitzSaveData');
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
    stratagemAccordionBody.innerHTML = '';
    primaryAccordionBody.innerHTML = '';
    secondaryAccordionBody.innerHTML = '';
    throwableAccordionBody.innerHTML = '';
    armorPassiveAccordionBody.innerHTML = '';
    boosterAccordionBody.innerHTML = '';
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

uploadSaveData()

