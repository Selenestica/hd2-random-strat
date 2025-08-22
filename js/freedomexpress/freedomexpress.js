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
const maxStarsPromptModal = document.getElementById("maxStarsPromptModal");

let missionCounter = 1;
let randomBoosters = [];
let randomStrat = null;

let stratagems = [...FE_STRATAGEMS];
let boosters = [...FE_BOOSTERS];

// if the submit mission report modal ever closes, reset the inputs
missionCompleteModal.addEventListener("hidden.bs.modal", () => {
  for (let z = 0; z < currentObjectives.length; z++) {
    const objInputEl = document.getElementById(
      `objId-${currentObjectives[z].id}`
    );
    objInputEl.value = 0;
  }
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
    <div class="card d-flex col-2 col-lg-1 soItemCards mx-1">
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
          dataName: `${getCurrentDateTime()}`,
          currentGame: true,
          missionCounter,
        },
      ],
    };
    localStorage.setItem("freedomExpressSaveData", JSON.stringify(obj));
    missionCounterText.innerHTML = `${getMissionText()}`;
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
        currentItems,
        seesRulesOnOpen: false,
        dataName: sg.editedName ? sg.dataName : `${getCurrentDateTime()}`,
        currentGame: true,
        missionCounter,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };
  missionCounterText.innerHTML = `${getMissionText()}`;
  localStorage.setItem("freedomExpressSaveData", JSON.stringify(obj));
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (isMissionSucceeded) {
    for (let i = 0; i < currentObjectives.length; i++) {
      let val;
      val = parseInt(
        document.getElementById("objId-" + currentObjectives[i].id).value,
        10
      );
      currentObjectives[i].progress += val;
      const { progress, goal, progressType, pointsAdded } =
        currentObjectives[i];
      if (progressType === "positive" && progress >= goal && !pointsAdded) {
        if (missionCounter === 1) {
          operationPoints += 5;
          currentObjectives[i].pointsAdded = true;
        }
        if (missionCounter === 2) {
          operationPoints += 3;
          currentObjectives[i].pointsAdded = true;
        }
        if (missionCounter === 3) {
          operationPoints += 1;
          currentObjectives[i].pointsAdded = true;
          if (currentObjectives[i].id === 7) {
            operationPoints += 4;
          }
        }
      }
      if (
        progressType === "negative" &&
        progress < goal &&
        missionCounter === 3
      ) {
        operationPoints += 5;
        currentObjectives[i].pointsAdded = true;
      }
    }
    renderObjectiveProgressText();

    missionCounter++;
    if (missionCounter > 3) {
      let objectivesMet = true;
      for (let j = 0; j < currentObjectives.length; j++) {
        if (!currentObjectives[j].pointsAdded) {
          objectivesMet = false;
          break;
        }
      }

      // only by using latest unlock can you unlock the next specialist
      if (
        latestUnlockedSpecialist.displayName !== currentSpecialist.displayName
      ) {
        objectivesMet = false;
        operationPoints = 0;
      }

      showSOPointsEarnedToast(operationPoints);
      points += operationPoints;
      operationPoints = 0;
      pointsCounterText.innerHTML = points;

      missionCounter = 1;
      await genNewOperation(objectivesMet, null, null);
      saveProgress();
      return;
    }

    saveProgress();
    missionCounterText.innerHTML = missionCounter;
    return;
  }

  // set missionCounter back to start of operation
  if (!isMissionSucceeded) {
    operationPoints = 0;
    missionCounter = 1;
    restarts += 1;
    await genNewOperation(false, null, null);
    saveProgress();
  }
};

const getCurrentEnemy = (planet) => {
  if (planet.faction === "Humans") {
    return planet.planet.currentOwner;
  }
  return planet.faction;
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

const startNewRun = async () => {
  const saveData = await localStorage.getItem("freedomExpressSaveData");
  if (saveData) {
    return;
  }
  const infoModal = new bootstrap.Modal(flavorAndInstructionsModal);
  infoModal.show();

  // clear the slate
  missionCounter = 1;
  points = 0;
  pointsCounterText.innerHTML = 0;

  missionCounterText.innerHTML = getMissionText(missionCounter);

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
  genFESaveDataManagementModalContent();
};

const populateWebPage = async (stratCard, boosterCards) => {
  pointsCounterText.innerHTML = points;
  missionCounterText.innerHTML = missionCounter;

  stratagemsContainer.innerHTML = stratCard;
  boosterCards.forEach((bst) => {
    equipmentContainer.innerHTML += bst;
  });
};

const uploadSaveData = async () => {
  const freedomExpressSaveData = await localStorage.getItem(
    "freedomExpressSaveData"
  );
  if (freedomExpressSaveData) {
    // do a check here to make sure the planet they were on is still available
    // if not, put a warning up that teammates may not be able to select that planet

    const data = JSON.parse(freedomExpressSaveData);

    missionCounter = data.missionCounter;
    dataName = data.dataName;
    points = data.points ?? 0;
    randomBoosters = data.randomBoosters;
    randomStrat = data.randomStrat;
    const stratCard = await generateItemCard(randomStrat);
    const boosterCards = await randomBoosters.map((bst) => {
      return generateItemCard(bst);
    });
    console.log(stratCard, boosterCards);
    populateWebPage(stratCard, boosterCards);
    return;
  }
  startNewRun();
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("freedomExpressSaveData");
  window.location.reload();
};

uploadSaveData();
