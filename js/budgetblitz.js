const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const primaryAccordionBody = document.getElementById('PrimariesAccordionBody');
const secondaryAccordionBody = document.getElementById('SecondariesAccordionBody');
const stratagemAccordionBody = document.getElementById('StratagemsAccordionBody');
const throwableAccordionBody = document.getElementById('ThrowablesAccordionBody');
const armorPassiveAccordionBody = document.getElementById('ArmorsAccordionBody');
const boosterAccordionBody = document.getElementById('BoostersAccordionBody');
const mainViewButtons = document.getElementsByClassName('mainViewButtons')
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

for (let z = 0; z < mainViewButtons.length; z++) {
  mainViewButtons[z].addEventListener('change', (e) => {
    if (e.target.checked) {
        // clear the accordions first
        stratagemAccordionBody.innerHTML = '';
        primaryAccordionBody.innerHTML = '';
        secondaryAccordionBody.innerHTML = '';
        throwableAccordionBody.innerHTML = '';
        armorPassiveAccordionBody.innerHTML = '';
        boosterAccordionBody.innerHTML = '';
        addItemsToAccordions(e.srcElement.id)
    }
  });
}

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
  newBoosts = OGboostsList.filter((booster) => {
    return !starterBoosterNames.includes(booster.displayName);
  });
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

const addItemsToAccordions = async (view) => {
  let strats = []
  let throws = []
  let prims = []
  let seconds = []
  let boosts = []
  let passives = []

  // for new games and initial default population of save data
  if (view === "default") {
      const {
        defaultArmorPassives,
        defaultBoosters,
        defaultPrims,
        defaultSeconds,
        defaultStrats,
        defaultThrows,
      } = await getDefaultItems();
      strats = defaultStrats
      throws = defaultThrows
      prims = defaultPrims
      seconds = defaultSeconds
      boosts = defaultBoosters
      passives = defaultArmorPassives
  }

  // for switching to inventory view
  if (view === "inventoryButton") {
      const {
        defaultArmorPassives,
        defaultBoosters,
        defaultPrims,
        defaultSeconds,
        defaultStrats,
        defaultThrows,
      } = await getDefaultItems();
      strats = defaultStrats
      throws = defaultThrows
      prims = defaultPrims
      seconds = defaultSeconds
      boosts = defaultBoosters
      passives = defaultArmorPassives
  }

  // for switching to shop view
  if (view === "shopButton") {
      strats = newStrats
      throws = newThrows
      prims = newPrims
      seconds = newSeconds
      boosts = newBoosts
      passives = newArmorPassives
  }

  for (let i = 0; i < strats.length; i++) {
    stratagemAccordionBody.innerHTML += generateItemCard(strats[i], false, 'svgs');
  }
  for (let i = 0; i < prims.length; i++) {
    primaryAccordionBody.innerHTML += generateItemCard(prims[i], false, 'equipment');
  }
  for (let i = 0; i < seconds.length; i++) {
    secondaryAccordionBody.innerHTML += generateItemCard(seconds[i], false, 'equipment');
  }
  for (let i = 0; i < throws.length; i++) {
    throwableAccordionBody.innerHTML += generateItemCard(throws[i], false, 'equipment');
  }
  for (let i = 0; i < passives.length; i++) {
    armorPassiveAccordionBody.innerHTML += generateItemCard(
      passives[i],
      false,
      'armor',
    );
  }
  for (let i = 0; i < boosts.length; i++) {
    boosterAccordionBody.innerHTML += generateItemCard(boosts[i], false, 'equipment');
  }
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
    await getStartingItems();
    await addItemsToAccordions("default");
    for (let i = 0; i < currentGame.acquiredItems.length; i++) {
      const item = currentGame.acquiredItems[i];
      const { imgDir, accBody } = getItemMetaData(item);
      accBody.innerHTML += generateItemCard(item, false, imgDir);
    }
    return;
  }
  await getStartingItems();
  startNewRun();
};

uploadSaveData()

