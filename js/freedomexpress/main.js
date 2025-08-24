const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const missionCompleteModal = document.getElementById('missionCompleteModal');
const objectiveInputsContainer = document.getElementById('objectiveInputsContainer');
const planetContainer = document.getElementById('planetContainer');
const objectivesContainer = document.getElementById('objectivesContainer');
const loadoutContainer = document.getElementById('loadoutContainer');
const stratagemsContainer = document.getElementById('stratagemsContainer');
const equipmentContainer = document.getElementById('equipmentContainer');
const armorContainer = document.getElementById('armorContainer');
const primaryContainer = document.getElementById('primaryContainer');
const secondaryContainer = document.getElementById('secondaryContainer');
const throwableContainer = document.getElementById('throwableContainer');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const pointsCounterText = document.getElementById('pointsCounterText');
const missionCounterText = document.getElementById('missionCounterText');
const flavorAndInstructionsModal = document.getElementById('flavorAndInstructionsModal');
const missionCompleteButton = document.getElementById('missionCompleteButton');
const missionFailedButton = document.getElementById('missionFailedButton');
const missionCompleteButtonDiv = document.getElementById('missionCompleteButtonDiv');
const missionFailedButtonDiv = document.getElementById('missionFailedButtonDiv');
const maxStarsPromptModal = document.getElementById('maxStarsPromptModal');

let missionCounter = 1;
let randomBoosters = [];
let randomStrat = null;
let pointsPerMission = [];

let stratagems = [...FE_STRATAGEMS];
let boosters = [...FE_BOOSTERS];

// if the submit mission report modal ever closes, reset the inputs
missionCompleteModal.addEventListener('hidden.bs.modal', () => {
  numOfDeathsInput.value = 0;
  timeRemainingInput.value = 0;
});

const generateItemCard = (item) => {
  let imgDir = 'equipment';
  if (item.category === 'armor') {
    imgDir = 'armor';
  }
  if (item.type === 'Stratagem') {
    imgDir = 'svgs';
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
  const freedomExpressSaveData = localStorage.getItem('freedomExpressSaveData');
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
          pointsPerMission,
        },
      ],
    };
    localStorage.setItem('freedomExpressSaveData', JSON.stringify(obj));
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
        currentItems,
        seesRulesOnOpen: false,
        dataName: sg.editedName ? sg.dataName : `${getCurrentDateTime()}`,
        currentGame: true,
        missionCounter,
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
  localStorage.setItem('freedomExpressSaveData', JSON.stringify(obj));
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (isMissionSucceeded) {
    missionCounter++;
    const numOfDeaths = parseInt(numOfDeathsInput.value, 10);
    const timeRemaining = parseInt(timeRemainingInput.value, 10);
    const numOfDeathsModifier = numOfDeaths * 2;
    const missionScore = numOfDeathsModifier + timeRemaining;
    pointsPerMission.push({
      missionScore,
      numOfDeaths,
      timeRemaining,
      randomStrat,
      randomBoosters,
    });

    // show a toast here eventually
    // showFEPointsEarnedToast(operationPoints);

    points += missionScore;
    pointsCounterText.innerHTML = missionScore;

    saveProgress();
    missionCounterText.innerHTML = getMissionText(missionCounter);
    return;
  }

  // startNewRun()
  if (!isMissionSucceeded) {
    startNewRun();
    return;
  }
};

const getCurrentEnemy = (planet) => {
  if (planet.faction === 'Humans') {
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
  const saveData = await localStorage.getItem('freedomExpressSaveData');
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
  missionCounterText.innerHTML = `${getMissionText(missionCounter)}`;
};

const uploadSaveData = async () => {
  const freedomExpressSaveData = localStorage.getItem('freedomExpressSaveData');
  if (freedomExpressSaveData) {
    const currentGame = await getCurrentGame('freedomExpressSaveData');
    missionCounter = currentGame.missionCounter;
    dataName = currentGame.dataName;
    points = currentGame.points ?? 0;
    randomBoosters = currentGame.randomBoosters;
    randomStrat = currentGame.randomStrat;
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
  localStorage.removeItem('freedomExpressSaveData');
  window.location.reload();
};

uploadSaveData();
