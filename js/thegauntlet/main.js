const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody",
);
const missionCompleteModal = document.getElementById("missionCompleteModal");
const specialistsModal = document.getElementById("specialistsModal");
const objectiveInputsContainer = document.getElementById(
  "objectiveInputsContainer",
);
const constraintsContainer = document.getElementById("constraintsContainer");
const missionInfoContainer = document.getElementById("missionInfoContainer");
const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");
const armorContainer = document.getElementById("armorContainer");
const primaryContainer = document.getElementById("primaryContainer");
const secondaryContainer = document.getElementById("secondaryContainer");
const throwableContainer = document.getElementById("throwableContainer");
const objectiveNameText = document.getElementById("objectiveNameText");
const objectiveProgressText = document.getElementById("objectiveProgressText");
const specialistNameText = document.getElementById("specialistNameText");
const maxStarsModalBody = document.getElementById("maxStarsModalBody");
const flavorAndInstructionsModal = document.getElementById(
  "flavorAndInstructionsModal",
);
const warbondSelectModal = document.getElementById("warbondSelectModal");
const missionCompleteButton = document.getElementById("missionCompleteButton");
const missionFailedButton = document.getElementById("missionFailedButton");
const missionCompleteButtonDiv = document.getElementById(
  "missionCompleteButtonDiv",
);
const missionFailedButtonDiv = document.getElementById(
  "missionFailedButtonDiv",
);
const maxStarsPromptModal = document.getElementById("maxStarsPromptModal");
const applySpecialistButton = document.getElementById("applySpecialistButton");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");
const hellDiversMobilizeCheckbox = document.getElementById("warbond3");
const stimsUsedInput = document.getElementById("stimsUsedInput");
const deathsInput = document.getElementById("deathsInput");
const stratsUsedInput = document.getElementById("stratsUsedInput");
const challengePage = document.getElementById("challengePage");
const specialistSelectPage = document.getElementById("specialistSelectPage");
const minutesCounterText = document.getElementById("minutesCounterText");
const challengeCompleteButtonDiv = document.getElementById(
  "challengeCompleteButtonDiv",
);
const challengeButtonsDiv = document.getElementById("challengeButtonsDiv");

hellDiversMobilizeCheckbox.disabled = true;
let missionCounter = 1;
let currentSpecialist = null;
let selectedSpecialist = null;
let specialists = null;
let restarts = 0;

let stimsUsed = 0;
let reinforcementsUsed = 0;
let stratsUsed = 0;

let stimsAvailable = 50;
let reinforcementsAvailable = 12;
let stratsAvailable = 110;
let minutesNumber = 40;

let primaries = [...PRIMARIES];
let secondaries = [...SECONDARIES];
let throwables = [...THROWABLES];
let armorPassives = [...ARMOR_PASSIVES];
let stratagems = [...STRATAGEMS];

// if the submit mission report modal ever closes, reset the inputs
// missionCompleteModal.addEventListener("hidden.bs.modal", () => {
//   for (let z = 0; z < currentObjectives.length; z++) {
//     const objInputEl = document.getElementById(
//       `objId-${currentObjectives[z].id}`,
//     );
//     objInputEl.value = 0;
//   }
// });

// specialistsModal.addEventListener("hidden.bs.modal", () => {
//   // remove the checkmark from all specialists
//   const elements = document.querySelectorAll(".specialistCheckMarks");
//   elements.forEach((element) => element.remove());

//   // remove green text from all specialists
//   const specialistHeaders = document.querySelectorAll(
//     ".specialistHeadersClass",
//   );
//   specialistHeaders.forEach((header) => {
//     header.classList.remove("text-success");
//     header.classList.add("text-white");
//   });
// });

const generateItemCard = (item) => {
  let imgDir = "equipment";
  if (item.category === "armor") {
    imgDir = "armorpassives";
  }
  if (item.type === "Stratagem") {
    imgDir = "svgs";
  }
  return `
    <div class="card d-flex col-2 soItemCards mx-1">
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center text-center">
          <p class="card-title text-white">${item.displayName}</p>
      </div>
    </div>`;
};

const makeMissionRow = (label, value, id, extraClass = "") =>
  `<div class="d-flex justify-content-between" style="border-bottom: 1px solid grey">
    <span class="fw-bold">${label}</span>
    <span id="${id}" class="${extraClass}">${value}</span>
  </div>`;

const makeMissionRowFromResourcesUsed = (label, val, id) =>
  `<div class="d-flex justify-content-between" style="border-bottom: 1px solid grey">
    <span class="fw-bold">${label}</span>
    <span id="${id}">${val}</span>
  </div>`;

const genCurrentMissionInfo = () => {
  if (missionCounter > 6) {
    challengeButtonsDiv.classList.toggle("d-none", true);
    challengeCompleteButtonDiv.classList.toggle("d-none", false);
  }
  const { boosters, text, minutes, obtainHVI, enemy } =
    getMissionData(missionCounter);

  const rows = [
    makeMissionRow("Difficulty:", text, "currentMissionText"),
    makeMissionRow("Enemy:", enemy, "currentEnemyText"),
    minutes !== -100 &&
      makeMissionRow(
        "Minutes Remaining Required:",
        minutes,
        "minutesCounterText",
      ),
    boosters !== -100 &&
      makeMissionRow("Booster Slots:", boosters, "boosterCounterText"),
    obtainHVI &&
      makeMissionRow(
        "",
        "Extract with the High Value Item",
        "hviText",
        "text-warning",
      ),

    makeMissionRowFromResourcesUsed(
      "Stims Available:",
      stimsAvailable,
      "stimsCounterText",
    ),
    makeMissionRowFromResourcesUsed(
      "Reinforcements Available:",
      reinforcementsAvailable,
      "reinforcementsCounterText",
    ),
    makeMissionRowFromResourcesUsed(
      "Stratagems Available:",
      stratsAvailable,
      "stratsCounterText",
    ),
  ];

  missionInfoContainer.innerHTML = rows.filter(Boolean).join("\n");
};

const saveProgress = async () => {
  let obj = {};
  const theGauntletSaveData = localStorage.getItem("theGauntletSaveData");
  if (!theGauntletSaveData) {
    obj = {
      dataName: `The Gauntlet Save Data`,
      missionCounter,
      currentSpecialist,
      specialists,
      restarts,
    };
    localStorage.setItem("theGauntletSaveData", JSON.stringify(obj));
    genCurrentMissionInfo();
    return;
  }
  let data = JSON.parse(theGauntletSaveData);
  data = {
    ...data,
    missionCounter,
    currentSpecialist,
    specialists,
    restarts,
  };

  localStorage.setItem("theGauntletSaveData", JSON.stringify(data));
};

const calculateResources = (
  stimsUsed,
  numOfDeaths,
  stratagemsUsed,
  hviObtainedCheck,
  minutesRemaining,
) => {
  if (stimsUsed > stimsAvailable) {
    return false;
  }
  if (numOfDeaths > reinforcementsAvailable) {
    return false;
  }
  if (stratagemsUsed > stratsAvailable) {
    return false;
  }
  if (hviObtainedCheck === false) {
    return false;
  }
  if (minutesRemaining > minutesNumber) {
    return false;
  }
  return true;
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (isMissionSucceeded) {
    const stimsUsed = parseInt(
      document.getElementById("stimsUsedInput").value,
      10,
    );
    const numOfDeaths = parseInt(
      document.getElementById("deathsInput").value,
      10,
    );
    const stratagemsUsed = parseInt(
      document.getElementById("stratsUsedInput").value,
      10,
    );
    const hviObtainedCheck =
      document.getElementById("hviObtainedCheck") &&
      document.getElementById("hviObtainedCheck").value;
    const minutesRemaining =
      document.getElementById("minutesRemainingInput") &&
      parseInt(document.getElementById("minutesRemainingInput").value, 10);

    // we're going to want to check and see if the objectives were met and resources didn't exceed the limits
    const didPlayerMeetObjectives = await calculateResources(
      stimsUsed,
      numOfDeaths,
      stratagemsUsed,
      hviObtainedCheck,
      minutesRemaining,
    );

    // resources set back to when the mission was started the first time (resources used during failed missions dont count)
    if (!didPlayerMeetObjectives) {
      console.log("player didnt meet objectives!");
      // show mission failed modal
      // give option to change specialists in mission failed modal
      // if changing specialist, showSpecialistOptions();
      // if not, just close the modal
      restarts++;
      // showSpecialistOptions();
      // probably want to wipe inputs in mission report modal
      // saveProgress()
      return;
    }

    console.log("player moves on to next mission!");
    // if everything good, then proceed to next mission
    missionCounter++;
    stimsAvailable -= stimsUsed;
    reinforcementsAvailable -= numOfDeaths;
    stratsAvailable -= stratagemsUsed;
    genCurrentMissionInfo();
    genGauntletMissionCompleteModalContent(missionCounter);
    // saveProgress();
    // return;
  }

  if (!isMissionSucceeded) {
    console.log("mission failed oh no");
    // missionCounter = 1;
    // restarts += 1;
    // saveProgress();
  }
};

const displaySpecialistLoadout = () => {
  stratagemsContainer.innerHTML = "";
  equipmentContainer.innerHTML = "";

  specialistNameText.innerText = currentSpecialist.displayName;
  const primaryObj = primaries[currentSpecialist.primary];
  const secondaryObj = secondaries[currentSpecialist.secondary];
  const throwObj = throwables[currentSpecialist.throwable];
  const armorObj = armorPassives[currentSpecialist.armorPassive];
  for (let i = 0; i < currentSpecialist.stratagems.length; i++) {
    let stratagem = stratagems[currentSpecialist.stratagems[i]];
    const card = generateItemCard(stratagem);
    stratagemsContainer.innerHTML += card;
  }

  const equipmentObjs = [primaryObj, secondaryObj, throwObj, armorObj];
  for (let j = 0; j < equipmentObjs.length; j++) {
    const obj = equipmentObjs[j];
    const card = generateItemCard(obj);
    equipmentContainer.innerHTML += card;
  }
};

const showSpecialistOptions = () => {
  challengePage.classList.toggle("d-none", true);
  specialistSelectPage.classList.toggle("d-none", false);
  genGauntletSpecialistsModalContent();
};

const applySpecialist = async (index) => {
  challengePage.classList.toggle("d-none", false);
  specialistSelectPage.classList.toggle("d-none", true);

  // just handles the UI decor
  // remove the checkmark from all other specialists
  const elements = document.querySelectorAll(".specialistCheckMarks");
  elements.forEach((element) => element.remove());

  // remove green text from all other specialists
  const specialistHeaders = document.querySelectorAll(
    ".specialistHeadersClass",
  );
  specialistHeaders.forEach((header) => {
    header.classList.remove("text-success");
    header.classList.add("text-white");
  });

  // add the checkmark to the selected specialist
  const specCardHeader = document.getElementById("specialistHeader" + index);
  specCardHeader.innerHTML += `<i class="bi bi-check-lg specialistCheckMarks text-success mx-1"></i>`;
  specCardHeader.classList.add("text-success");
  specCardHeader.classList.remove("text-white");

  // logic goes here
  currentSpecialist = specialists[index];
  // add specialist boons to total
  const { stims, booster, deaths, extraStrats, minutes } = currentSpecialist;
  // add booster
  let boosterNumber = parseInt(boosterCounterText.innerHTML);
  boosterNumber += booster;
  boosterCounterText.innerHTML = boosterNumber;
  // add minutes
  if (minutesCounterText) {
    minutesNumber = getMissionData(missionCounter);
    minutesNumber += minutes;
    minutesCounterText.innerHTML = minutesNumber;
  }
  // add deaths, strats, stims
  stimsAvailable += stims;
  reinforcementsAvailable += deaths;
  stratsAvailable += extraStrats;
  stimsCounterText.innerHTML = stimsAvailable;
  reinforcementsCounterText.innerHTML = reinforcementsAvailable;
  stratsCounterText.innerHTML = stratsAvailable;

  displaySpecialistLoadout();
  // saveProgress();
};

const startNewRun = async () => {
  const saveData = await localStorage.getItem("theGauntletSaveData");
  // if (saveData) {
  //   return;
  // }
  const infoModal = new bootstrap.Modal(flavorAndInstructionsModal);
  infoModal.show();

  // clear the slate
  missionCounter = 1;
  currentSpecialist = null;
  restarts = 0;
  specialists = structuredClone(SPECOPSSPECS);
  stimsUsed = 0;
  reinforcementsUsed = 0;
  stratsUsed = 0;

  stimsAvailable = 50;
  reinforcementsAvailable = 12;
  stratsAvailable = 110;
  showSpecialistOptions();
  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(missionCounter);
  // genTGSaveDataManagementModalContent();
};

const populateWebPage = async () => {
  genGauntletSpecialistsModalContent();
  displaySpecialistLoadout();

  genGauntletMissionCompleteModalContent(missionCounter);
};

const uploadSaveData = async () => {
  const theGauntletSaveData = await localStorage.getItem("theGauntletSaveData");
  if (theGauntletSaveData) {
    const data = JSON.parse(theGauntletSaveData);

    currentSpecialist = data.currentSpecialist;
    missionCounter = data.missionCounter;
    restarts = data.restarts;
    dataName = data.dataName;

    populateWebPage();
    return;
  }
  startNewRun();
};

const saveDataAndRestart = () => {
  console.log("starting a new run after saving the old run!");
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("theGauntletSaveData");
  window.location.reload();
};

uploadSaveData();
