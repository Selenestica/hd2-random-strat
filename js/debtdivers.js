const missionDifficultyInput = document.getElementById(
  "missionDifficultyInput"
);
const numOfAccidentalsInput = document.getElementById("numOfAccidentalsInput");
const operationCompleteCheck = document.getElementById(
  "operationCompleteCheck"
);

let failedMissions = 0;
let successfulMissions = 0;
let creditsPerMission = [];

// this will stay 0 and never change
let missionCounter = 0;

let randomItem = null;
let difficulty = "Medium";
let currentView = "loadoutButton";
let credits = 100;
missionButtonsDiv.style.display = "flex";
bbShopFilterDiv.style.display = "none";
hellDiversMobilizeCheckbox.disabled = true;
const inventoryIDs = ["defaultInventory", "purchasedItemsInventory"];

missionDifficultyInput.addEventListener("change", (e) => {
  if (e.target.value >= 10) {
    highValueItemCollectedCheck.disabled = false;
  } else {
    highValueItemCollectedCheck.disabled = true;
    highValueItemCollectedCheck.checked = false;
  }
  if (e.target.value >= 6) {
    superSamplesCollectedInput.disabled = false;
  } else {
    superSamplesCollectedInput.disabled = true;
    superSamplesCollectedInput.value = 0;
  }
});

// when the mission report modal opens...
missionCompleteModal.addEventListener("shown.bs.modal", () => {
  console.log("put input validation for mission difficulty here");
});

const startNewRun = async (isRestart = null) => {
  // probably want to set all warbond codes to checked just in case
  warbondCodes = [...masterWarbondCodes];
  for (let i = 0; i < warbondCheckboxes.length; i++) {
    warbondCheckboxes[i].checked = true;
  }

  difficulty = "Medium";

  await writeItems();

  credits = 100;
  creditsPerMission = [];
  scCounter.innerHTML = `${": " + credits}`;
  sesItem = {
    cost: 15,
    timesPurchased: 0,
    warbondCode: "none",
    category: "random",
  };
  currentItems = [];
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
  missionCounterText.innerHTML = `${successfulMissions + failedMissions}`;

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

// change this to fire if players completed an operation
const updateShopItemsCostAndSaleStatus = async () => {
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
      item.cost = getItemCost(difficulty, item, false);
      item.onSale = getIsItemOnSale(difficulty);
      updateMasterListItem(item);
    }
  }
};

const checkMissionButtons = () => {
  if (
    successfulMissions > 0 ||
    purchasedItems.length > 0 ||
    failedMissions > 0
  ) {
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].disabled = true;
    }
    for (let j = 0; j < diffRadios.length; j++) {
      diffRadios[j].disabled = true;
    }
  }

  if (credits >= 1000) {
    missionFailedButton.disabled = true;
    missionCompleteButton.disabled = true;

    // hide the mission buttons, and show download items buttons
    missionCompleteButton.style.display = "none";
    missionFailedButton.style.display = "none";
    downloadPDFButtonDiv.style.display = "block";
  }

  if (credits < 1000) {
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
    missionCompleteButton.disabled = false; // change to phalze for testing
    missionFailedButton.disabled = false; // change to phalze for testing
  }
};

const uploadSaveData = async () => {
  await getStartingItems("dd");
  await populateDefaultItems();
  const debtDiversSaveData = localStorage.getItem("debtDiversSaveData");
  if (debtDiversSaveData) {
    const currentGame = await getCurrentGame("debtDiversSaveData");

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
    failedMissions = currentGame.failedMissions;
    successfulMissions = currentGame.successfulMissions;
    warbondCodes = currentGame.warbondCodes;
    dataName = currentGame.dataName;
    credits = currentGame.credits;
    creditsPerMission = currentGame.creditsPerMission;
    sesItem = currentGame.sesItem;
    difficulty = currentGame.difficulty;
    scCounter.innerHTML = `${": " + credits}`;
    missionCounterText.innerHTML = `${
      currentGame.successfulMissions + currentGame.failedMissions
    }`;
    checkMissionButtons();

    if (difficulty === "Easy") {
      bbDiffRadioEasy.checked = true;
    }
    if (difficulty === "Hard") {
      bbDiffRadioHard.checked = true;
    }

    await filterItemsByWarbond(true);
    await populatePurchasedItemsInventory();
    return;
  }
  startNewRun();
};

const submitMissionReport = async (isMissionSucceeded) => {
  await unequipAllItems(true);

  if (isMissionSucceeded) {
    let deathsDifficultyModifier = 10;
    let accidentalsDifficultyModifier = 20;
    const starsEarnedModifier =
      parseInt(starsEarnedInput.value, 10) *
      parseInt(missionDifficultyInput.value, 10) *
      2;
    const superSamplesModifier = superSamplesCollectedInput.value * 12;

    // if (difficulty === 'Easy') {
    //   deathsDifficultyModifier = 1;
    //   accidentalsDifficultyModifier = 1;
    // }
    // if (difficulty === 'Hard') {
    //   deathsDifficultyModifier = 3;
    //   accidentalsDifficultyModifier = 3;
    // }
    let numOfDeathsModifier =
      parseInt(numOfDeathsInput.value, 10) * deathsDifficultyModifier;
    let numOfAccidentalsModifier =
      parseInt(numOfAccidentalsInput.value, 10) * accidentalsDifficultyModifier;

    if (highValueItemCollectedCheck.checked) {
      await genRandomItem([
        newPrims,
        newStrats,
        newBoosts,
        newSeconds,
        newArmorPassives,
        newThrows,
      ]);
      await purchaseItem(null, true, true);
      purchasedItemsInventory.innerHTML = "";
      populatePurchasedItemsInventory();
    }

    const timeRemainingModifier = parseInt(timeRemainingInput.value, 10);
    const operationCompleteModifier = operationCompleteCheck.checked ? 50 : 0;
    const total =
      starsEarnedModifier +
      superSamplesModifier +
      operationCompleteModifier +
      timeRemainingModifier -
      numOfDeathsModifier -
      numOfAccidentalsModifier;
    credits += total;
    scCounter.innerHTML = `${": " + credits}`;
    showBBCreditsEarnedToast(total);

    successfulMissions++;
    creditsPerMission.push({
      totalCredits: total,
      timeRemaining: parseInt(timeRemainingInput.value, 10),
      starsEarned: parseInt(starsEarnedInput.value, 10),
      superSamplesCollected: parseInt(superSamplesCollectedInput.value, 10),
      highValueItemsCollected: highValueItemCollectedCheck.checked,
      numOfDeaths: parseInt(numOfDeathsInput.value, 10),
      numOfAccidentals: parseInt(numOfAccidentalsInput.value, 10),
    });

    // here we want to go through all the items in the shop and update their cost and onSale property
    // if they are starting a new operation
    if (operationCompleteCheck.checked) {
      await updateShopItemsCostAndSaleStatus();
    }

    // reset values in modal when done calculating
    starsEarnedInput.value = 1;
    superSamplesCollectedInput.value = 0;
    timeRemainingInput.value = 0;
    numOfDeathsInput.value = 0;
    numOfAccidentalsInput.value = 0;
    highValueItemCollectedCheck.checked = false;
    operationCompleteCheck.checked = false;

    missionCounterText.innerHTML = `${successfulMissions + failedMissions}`;
    checkMissionButtons();

    saveProgress();
    return;
  }

  if (!isMissionSucceeded) {
    checkMissionButtons();
    failedMissions++;
    missionCounterText.innerHTML = `${successfulMissions + failedMissions}`;
    saveProgress();
    return;
  }
};

const saveProgress = async () => {
  // we want to disable warbond and difficulty inputs here if player bought something but didnt start a mission
  if (successfulMissions < 1 && failedMissions < 1) {
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].disabled = true;
    }
    for (let j = 0; j < diffRadios.length; j++) {
      diffRadios[j].disabled = true;
    }
  }

  let obj = {};
  const debtDiversSaveData = localStorage.getItem("debtDiversSaveData");
  if (!debtDiversSaveData) {
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
          dataName: `${difficulty} | Missions: ${
            successfulMissions + failedMissions
          } | ${getCurrentDateTime()}`,
          dateStarted: `${getCurrentDateTime()}`,
          currentGame: true,
          failedMissions,
          successfulMissions,
          credits,
          creditsPerMission,
          sesItem,
          difficulty,

          warbondCodes,
        },
      ],
    };
    localStorage.setItem("debtDiversSaveData", JSON.stringify(obj));
    missionCounterText.innerHTML = `${successfulMissions + failedMissions}`;
    return;
  }
  const data = JSON.parse(debtDiversSaveData);
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
        dataName: sg.editedName
          ? sg.dataName
          : `${difficulty} | Missions: ${
              successfulMissions + failedMissions
            } | ${getCurrentDateTime()}`,
        dateStarted: sg.dateStarted
          ? sg.dateStarted
          : `${getCurrentDateTime()}`,
        dateEnded: credits >= 1000 ? `${getCurrentDateTime()}` : null,
        currentGame: true,
        failedMissions,
        successfulMissions,
        credits,
        creditsPerMission,
        sesItem,
        difficulty,

        warbondCodes,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };
  localStorage.setItem("debtDiversSaveData", JSON.stringify(obj));

  // show score modal after local storage has been updated when challenge complete
  if (credits >= 1000) {
    genBBGameOverModal();
  }
};

const saveDataAndRestart = async () => {
  const debtDiversSaveData = localStorage.getItem("debtDiversSaveData");
  if (!debtDiversSaveData) {
    return;
  }
  const savedGames = JSON.parse(debtDiversSaveData).savedGames;
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
    dataName: `${difficulty} | Missions: ${
      successfulMissions + failedMissions
    } | ${getCurrentDateTime()}`,
    currentGame: true,
    failedMissions,
    successfulMissions,
    credits,
    creditsPerMission,
    sesItem,
    difficulty,

    warbondCodes,
  };

  updatedSavedGames.push(newSaveObj);
  const newdebtDiversSaveData = {
    savedGames: updatedSavedGames,
  };
  await localStorage.setItem(
    "debtDiversSaveData",
    JSON.stringify(newdebtDiversSaveData)
  );

  // remove saved games that are at the first mission of their difficulty,
  // as long as they are not the current game ...to prevent the user from having a million saves
  pruneSavedGames();
};

// get rid of all games that arent the current game and are on the first mission
const pruneSavedGames = async () => {
  const debtDiversSaveData = localStorage.getItem("debtDiversSaveData");
  if (!debtDiversSaveData) {
    return;
  }
  const prunedGames = await JSON.parse(debtDiversSaveData).savedGames.filter(
    (sg) => {
      if (
        sg.currentGame === true ||
        sg.successfulMissions + sg.failedMissions > 0 ||
        sg.purchasedItems.length > 0
      ) {
        return sg;
      }
    }
  );
  const oldData = JSON.parse(debtDiversSaveData);
  const newData = {
    ...oldData,
    savedGames: prunedGames,
  };
  localStorage.setItem("debtDiversSaveData", JSON.stringify(newData));
};

uploadSaveData();
