const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody"
);
const missionCompleteModal = document.getElementById("missionCompleteModal");
const objectiveInputsContainer = document.getElementById(
  "objectiveInputsContainer"
);
const planetContainer = document.getElementById("planetContainer");
const objectivesContainer = document.getElementById("objectivesContainer");
const loadoutContainer = document.getElementById("loadoutContainer");
const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");
const armorContainer = document.getElementById("armorContainer");
const primaryContainer = document.getElementById("primaryContainer");
const secondaryContainer = document.getElementById("secondaryContainer");
const throwableContainer = document.getElementById("throwableContainer");
const maxStarsModalBody = document.getElementById("maxStarsModalBody");
const pointsCounterText = document.getElementById("pointsCounterText");
const missionCounterText = document.getElementById("missionCounterText");
const flavorAndInstructionsModal = document.getElementById(
  "flavorAndInstructionsModal"
);
const missionCompleteButton = document.getElementById("missionCompleteButton");
const missionFailedButton = document.getElementById("missionFailedButton");
const missionCompleteButtonDiv = document.getElementById(
  "missionCompleteButtonDiv"
);
const missionFailedButtonDiv = document.getElementById(
  "missionFailedButtonDiv"
);
const downloadPDFButtonDiv = document.getElementById("downloadPDFButtonDiv");
const maxStarsPromptModal = document.getElementById("maxStarsPromptModal");
const highValueItemCollectedCheck = document.getElementById(
  "highValueItemCollectedCheck"
);
const numOfDeathsInput = document.getElementById("numOfDeathsInput");
const timeRemainingInput = document.getElementById("timeRemainingInput");

let missionCounter = 1;
let randomBoosters = [];
let randomStrat = null;
let pointsPerMission = [];

let stratagems = [...FE_STRATAGEMS];
let boosters = [...FE_BOOSTERS];

// if the submit mission report modal ever closes, reset the inputs
missionCompleteModal.addEventListener("hidden.bs.modal", () => {
  numOfDeathsInput.value = 0;
  timeRemainingInput.value = 0;
  highValueItemCollectedCheck.checked = false;
});

const generateItemCard = (item) => {
  let imgDir = "equipment";
  if (item.category === "armor") {
    imgDir = "armor";
  }
  if (item.type === "Stratagem") {
    imgDir = "svgs";
  }
  return `
    <div class="card d-flex col-4 col-lg-2 soItemCards mx-1">
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
          <p class="card-title text-white">${item.displayName}</p>
      </div>
    </div>`;
};

const saveProgress = async (item = null) => {
  let obj = {};
  const freedomExpressSaveData = localStorage.getItem("freedomExpressSaveData");
  if (!freedomExpressSaveData) {
    obj = {
      savedGames: [
        {
          randomBoosters,
          randomStrat,
          seesRulesOnOpen: false,
          dataName: `${getMissionText(
            missionCounter
          )} | ${getCurrentDateTime()}`,
          currentGame: true,
          missionCounter,
          pointsPerMission,
          points,
        },
      ],
    };
    localStorage.setItem("freedomExpressSaveData", JSON.stringify(obj));
    missionCounterText.innerHTML = `${getMissionText(missionCounter)}`;
    return;
  }
  const data = JSON.parse(freedomExpressSaveData);
  const newSavedGames = await data.savedGames.map((sg) => {
    if (sg.currentGame === true) {
      let updatedItems = sg.acquiredItems;
      if (item) {
        updatedItems.push(item);
      }
      sg = {
        ...sg,
        randomBoosters,
        randomStrat,
        seesRulesOnOpen: false,
        dataName: sg.editedName
          ? sg.dataName
          : `${getMissionText(missionCounter)} | ${getCurrentDateTime()}`,
        currentGame: true,
        missionCounter,
        points,
        pointsPerMission,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };
  missionCounterText.innerHTML = `${getMissionText(missionCounter)}`;
  localStorage.setItem("freedomExpressSaveData", JSON.stringify(obj));

  // show the score modal when challenge complete
  if (missionCounter >= 10) {
    genFEGameOverModal();
  }
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (isMissionSucceeded) {
    missionCounter++;
    const numOfDeaths = parseInt(numOfDeathsInput.value, 10);
    const timeRemaining = parseInt(timeRemainingInput.value, 10);
    const numOfDeathsModifier = numOfDeaths * 1;
    let hviModifier = 0;
    if (highValueItemCollectedCheck.checked === true) {
      hviModifier = 10;
    }
    const missionScore = timeRemaining + hviModifier - numOfDeathsModifier;

    pointsPerMission.push({
      missionScore,
      numOfDeaths,
      timeRemaining,
      randomStrat,
      randomBoosters,
      hviCollected: highValueItemCollectedCheck.checked,
    });

    showPointsEarnedToast(missionScore);

    points += missionScore;
    pointsCounterText.innerHTML = points;

    // check missionCounter
    if (missionCounter >= 10) {
      saveProgress();
      missionCompleteButtonDiv.style.display = "none";
      missionFailedButtonDiv.style.display = "none";
      downloadPDFButtonDiv.style.display = "block";
      missionCounterText.innerHTML = getMissionText(missionCounter);
      return;
    }

    // get random strat
    randomStrat = await getRandomStrat();
    const stratCard = await generateItemCard(randomStrat);

    // get random boosters
    randomBoosters = await getRandomBoosters();
    const boosterCards = await randomBoosters.map((bst) => {
      return generateItemCard(bst);
    });

    populateWebPage(stratCard, boosterCards);

    saveProgress();
    missionCounterText.innerHTML = getMissionText(missionCounter);
    return;
  }

  if (!isMissionSucceeded) {
    // reset run, or delete current run and start a new one
    saveDataAndRestart(true);
    return;
  }
};

const getRandomStrat = () => {
  const randNum = Math.floor(Math.random() * FE_STRATAGEMS.length);
  return FE_STRATAGEMS[randNum];
};

const getRandomBoosters = () => {
  let boostList = [];
  let numList = [];
  while (numList.length < 4) {
    const randNum = Math.floor(Math.random() * FE_BOOSTERS.length);
    if (numList.includes(randNum)) {
      continue;
    }
    numList.push(randNum);
    boostList.push(FE_BOOSTERS[randNum]);
  }
  if (boostList.length === 4) {
    return boostList;
  }
};

const startNewRun = async (applyingSave = null) => {
  const freedomExpressSaveData = localStorage.getItem("freedomExpressSaveData");
  if (!freedomExpressSaveData) {
    const infoModal = new bootstrap.Modal(flavorAndInstructionsModal);
    infoModal.show();
  }

  // clear the slate
  missionCounter = 1;
  points = 0;
  pointsCounterText.innerHTML = 0;
  pointsPerMission = [];

  missionCounterText.innerHTML = getMissionText(missionCounter);

  if (!applyingSave) {
    // get random strat
    randomStrat = await getRandomStrat();
    const stratCard = await generateItemCard(randomStrat);

    // get random boosters
    randomBoosters = await getRandomBoosters();
    const boosterCards = await randomBoosters.map((bst) => {
      return generateItemCard(bst);
    });

    populateWebPage(stratCard, boosterCards);

    await saveProgress();
  }
};

const populateWebPage = async (stratCard, boosterCards) => {
  stratagemsContainer.innerHTML = stratCard;

  equipmentContainer.innerHTML = "";
  boosterCards.forEach((bst) => {
    equipmentContainer.innerHTML += bst;
  });

  // check missionCounter
  if (missionCounter >= 10) {
    missionCompleteButtonDiv.style.display = "none";
    missionFailedButtonDiv.style.display = "none";
    downloadPDFButtonDiv.style.display = "block";
  } else {
    missionCompleteButtonDiv.style.display = "block";
    missionFailedButtonDiv.style.display = "block";
    downloadPDFButtonDiv.style.display = "none";
  }

  missionCounterText.innerHTML = `${getMissionText(missionCounter)}`;
  pointsCounterText.innerHTML = points;
};

const uploadSaveData = async () => {
  const freedomExpressSaveData = localStorage.getItem("freedomExpressSaveData");
  if (freedomExpressSaveData) {
    const currentGame = await getCurrentGame("freedomExpressSaveData");
    missionCounter = currentGame.missionCounter;
    dataName = currentGame.dataName;
    points = currentGame.points ?? 0;
    randomBoosters = currentGame.randomBoosters;
    randomStrat = currentGame.randomStrat;
    pointsPerMission = currentGame.pointsPerMission;
    const stratCard = await generateItemCard(randomStrat);
    const boosterCards = await randomBoosters.map((bst) => {
      return generateItemCard(bst);
    });
    populateWebPage(stratCard, boosterCards);
    return;
  }
  startNewRun();
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("freedomExpressSaveData");
  window.location.reload();
};

const saveDataAndRestart = async (missionFailed = null) => {
  const freedomExpressSaveData = localStorage.getItem("freedomExpressSaveData");
  if (!freedomExpressSaveData) {
    return;
  }
  const savedGames = JSON.parse(freedomExpressSaveData).savedGames;
  // make all saved game data currentGame = false
  let updatedSavedGames = await savedGames.map((sg) => {
    if (sg.currentGame === true && missionFailed) {
      sg.failed = true;
    }
    sg.currentGame = false;
    return sg;
  });

  await startNewRun();

  const newSaveObj = {
    randomBoosters,
    randomStrat,
    seesRulesOnOpen: false,
    dataName: `${getMissionText(missionCounter)} | ${getCurrentDateTime()}`,
    currentGame: true,
    missionCounter,
    pointsPerMission,
  };

  updatedSavedGames.push(newSaveObj);
  const newfreedomExpressSaveData = {
    savedGames: updatedSavedGames,
  };
  await localStorage.setItem(
    "freedomExpressSaveData",
    JSON.stringify(newfreedomExpressSaveData)
  );

  // remove saved games that are at the first mission of their difficulty,
  // as long as they are not the current game ...to prevent the user from having a million saves
  pruneSavedGames();
};

const pruneSavedGames = async () => {
  const freedomExpressSaveData = localStorage.getItem("freedomExpressSaveData");
  if (!freedomExpressSaveData) {
    return;
  }
  const prunedGames = await JSON.parse(
    freedomExpressSaveData
  ).savedGames.filter((sg) => {
    if ((sg.currentGame === true || sg.missionCounter > 1) && !sg.failed) {
      return sg;
    }
  });
  const oldData = JSON.parse(freedomExpressSaveData);
  const newData = {
    ...oldData,
    savedGames: prunedGames,
  };
  localStorage.setItem("freedomExpressSaveData", JSON.stringify(newData));
};

uploadSaveData();
