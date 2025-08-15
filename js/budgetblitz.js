let missionCounter = 8;
let failedMissions = 0;
let successfulMissions = 0;
let creditsPerMission = [];

let randomItem = null;
let difficulty = "Medium";
let currentView = "loadoutButton";
let credits = 100;
missionButtonsDiv.style.display = "flex";
bbShopFilterDiv.style.display = "none";
hellDiversMobilizeCheckbox.disabled = true;
const inventoryIDs = ["defaultInventory", "purchasedItemsInventory"];

// when the mission report modal opens, set the max stars able to be earned according to the missionCounter
missionCompleteModal.addEventListener("shown.bs.modal", () => {
  const maxStarsPossible = getMaxStarsForMission(missionCounter);
  const maxSuperSamplesPossible = getMaxSuperSamplesForMission(missionCounter);
  starsEarnedInput.max = maxStarsPossible;
  superSamplesCollectedInput.max = maxSuperSamplesPossible;

  // check if high value item in the level
  if (missionCounter >= 20) {
    highValueItemCollectedForm.classList.remove("d-none");
  }
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
      item.cost = getItemCost(difficulty, item);
      item.onSale = getIsItemOnSale(difficulty);
      updateMasterListItem(item);
    }
  }
};

const checkMissionButtons = () => {
  if (missionCounter > 8 || purchasedItems.length > 0) {
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].disabled = true;
    }
    for (let j = 0; j < diffRadios.length; j++) {
      diffRadios[j].disabled = true;
    }
  }

  if (missionCounter >= 23) {
    missionFailedButton.disabled = true;
    missionCompleteButton.disabled = true;

    // hide the mission buttons, and show download items buttons
    missionCompleteButton.style.display = "none";
    missionFailedButton.style.display = "none";
    downloadPDFButtonDiv.style.display = "block";
  }

  if (missionCounter < 23) {
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
    missionCompleteButton.disabled = true; // change to phalze for testing
    missionFailedButton.disabled = true; // change to phalze for testing
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
    const currentGame = await getCurrentGame("budgetBlitzSaveData");

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
    creditsPerMission = currentGame.creditsPerMission;
    sesItem = currentGame.sesItem;
    difficulty = currentGame.difficulty;
    scCounter.innerHTML = `${": " + credits}`;
    missionCounterText.innerHTML = `${getMissionText()}`;
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
    let deathsDifficultyModifier = 2;
    const starsEarnedModifier = parseInt(starsEarnedInput.value, 10) * 12;
    const superSamplesModifier = superSamplesCollectedInput.value * 3;

    if (difficulty === "Easy") {
      deathsDifficultyModifier = 1;
    }
    if (difficulty === "Hard") {
      deathsDifficultyModifier = 3;
    }
    let numOfDeathsModifier =
      parseInt(numOfDeathsInput.value, 10) * deathsDifficultyModifier;
    if (numOfDeathsModifier > 10) {
      numOfDeathsModifier = 10;
    }

    const timeRemainingModifier = Math.ceil(timeRemainingInput.value * 0.3);
    const highValueItemModifier = highValueItemCollectedCheck.checked ? 25 : 0;
    const total =
      starsEarnedModifier +
      superSamplesModifier +
      highValueItemModifier +
      timeRemainingModifier -
      numOfDeathsModifier;
    credits += total;
    scCounter.innerHTML = `${": " + credits}`;
    showBBCreditsEarnedToast(total);

    // update missionCounter
    successfulMissions++;
    missionCounter++;

    // if missionCounter - 8 <= creditsPerMission.length, dont push. that means a mission was failed and the mission was a redo
    if (missionCounter - 8 > creditsPerMission.length) {
      creditsPerMission.push({
        totalCredits: total,
        timeRemaining: parseInt(timeRemainingInput.value, 10),
        starsEarned: parseInt(starsEarnedInput.value, 10),
        superSamplesCollected: parseInt(superSamplesCollectedInput.value, 10),
        highValueItemsCollected: highValueItemCollectedCheck.checked,
        numOfDeaths: parseInt(numOfDeathsInput.value, 10),
      });
    }

    // reset values in modal when done calculating
    starsEarnedInput.value = 1;
    superSamplesCollectedInput.value = 0;
    timeRemainingInput.value = 0;
    numOfDeathsInput.value = 0;
    highValueItemCollectedCheck.checked = false;

    // here we want to go through all the items in the shop and update their cost and onSale property
    // if they are starting a new operation
    await updateShopItemsCostAndSaleStatus();

    missionCounterText.innerHTML = `${getMissionText()}`;
    checkMissionButtons();

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

const saveProgress = async () => {
  // we want to disable warbond and difficulty inputs here
  if (missionCounter < 9) {
    for (let i = 0; i < warbondCheckboxes.length; i++) {
      warbondCheckboxes[i].disabled = true;
    }
    for (let j = 0; j < diffRadios.length; j++) {
      diffRadios[j].disabled = true;
    }
  }

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
          dataName: `${difficulty} | ${getMissionText()} | ${getCurrentDateTime()}`,
          dateStarted: `${getCurrentDateTime()}`,
          currentGame: true,
          missionCounter,
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
        dataName: sg.editedName
          ? sg.dataName
          : `${difficulty} | ${getMissionText()} | ${getCurrentDateTime()}`,
        dateStarted: sg.dateStarted
          ? sg.dateStarted
          : `${getCurrentDateTime()}`,
        dateEnded: missionCounter >= 23 ? `${getCurrentDateTime()}` : null,
        currentGame: true,
        missionCounter,
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
  localStorage.setItem("budgetBlitzSaveData", JSON.stringify(obj));

  // show score modal after local storage has been updated when challenge complete
  if (missionCounter >= 23) {
    genBBGameOverModal();
  }
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
    dataName: `${difficulty} | ${getMissionText()} | ${getCurrentDateTime()}`,
    currentGame: true,
    missionCounter,
    failedMissions,
    successfulMissions,
    credits,
    creditsPerMission,
    sesItem,
    difficulty,

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

uploadSaveData();
