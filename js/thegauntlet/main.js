const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody",
);
const missionCompleteModal = document.getElementById("missionCompleteModal");
const missionFailedModal = document.getElementById("missionFailedModal");
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
const hviObtainedCheck = document.getElementById("hviObtainedCheck");
const minutesRemainingInput = document.getElementById("minutesRemainingInput");
const boosterCounterText = document.getElementById("boosterCounterText");
const missionSuccessConfirmationModal = document.getElementById(
  "missionSuccessConfirmationModal",
);
const failureReasonsList = document.getElementById("failureReasonsList");

hellDiversMobilizeCheckbox.disabled = true;
let missionCounter = 1;
let currentSpecialist = null;
let specialists = null;
let restarts = 0;

let stimsUsed = null;
let reinforcementsUsed = null;
let stratsUsed = null;

let failureReasons = [];

let stimsAvailable = 50;
let reinforcementsAvailable = 12;
let stratsAvailable = 110;
let minutesNumber = 40;

let primaries = [...PRIMARIES];
let secondaries = [...SECONDARIES];
let throwables = [...THROWABLES];
let armorPassives = [...ARMOR_PASSIVES];
let stratagems = [...STRATAGEMS];

const missionReportInputs = [
  "stimsUsedInput",
  "deathsInput",
  "stratsUsedInput",
  "minutesRemainingInput",
  "hviObtainedCheck",
];
// if the submit mission report modal ever closes, reset the inputs
missionCompleteModal.addEventListener("hidden.bs.modal", () => {
  for (let z = 0; z < missionReportInputs.length; z++) {
    const inputEl = document.getElementById(`${missionReportInputs[z]}`);
    if (!inputEl) {
      continue;
    }
    if (z !== 4) {
      inputEl.value = 0;
    } else {
      inputEl.checked = false;
    }
  }
});

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
      savedGames: [
        {
          dataName: `The Gauntlet Save Data`,
          missionCounter,
          currentSpecialist,
          specialists,
          restarts,
          stimsAvailable,
          reinforcementsAvailable,
          stratsAvailable,
          currentGame: true,
        },
      ],
    };
    localStorage.setItem("theGauntletSaveData", JSON.stringify(obj));
    return;
  }
  const data = JSON.parse(theGauntletSaveData);
  const newSavedGames = await data.savedGames.map((sg) => {
    if (sg.currentGame === true) {
      sg = {
        ...sg,
        missionCounter,
        currentSpecialist,
        specialists,
        restarts,
        stimsAvailable,
        reinforcementsAvailable,
        stratsAvailable,
        seesRulesOnOpen: false,
        dataName: sg.editedName
          ? sg.dataName
          : `The Gauntlet Save Data | ${getCurrentDateTime()} | ${currentSpecialist.displayName}`,
        currentGame: true,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };
  localStorage.setItem("theGauntletSaveData", JSON.stringify(obj));
};

const proceedToNextLevel = () => {
  missionCounter++;
  stimsAvailable -= stimsUsed;
  reinforcementsAvailable -= reinforcementsUsed;
  stratsAvailable -= stratsUsed;
  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(missionCounter);
  stimsUsed = null;
  reinforcementsUsed = null;
  stratsUsed = null;
  saveProgress();
};

const genMissionFailedReasons = () => {
  failureReasonsList.innerHTML = "";
  console.log(failureReasons);
  for (let i = 0; i < failureReasons.length; i++) {
    failureReasonsList.innerHTML += `
      <li class="text-white">${failureReasons[i]}<li/>
    `;
  }
};

const closeMissionReportModal = (didSucceed) => {
  const mcModal = new bootstrap.Modal(missionCompleteModal);
  mcModal.hide();
  let modal = missionSuccessConfirmationModal;
  if (!didSucceed) {
    genMissionFailedReasons();
    modal = missionFailedModal;
  }

  // Wait until modal is fully hidden before showing next
  missionCompleteModal.addEventListener(
    "hidden.bs.modal",
    function handleHidden() {
      missionCompleteModal.removeEventListener("hidden.bs.modal", handleHidden); // Clean up
      const nextModal = new bootstrap.Modal(modal);
      nextModal.show();
    },
  );
};

const calculateResources = (
  stims,
  numOfDeaths,
  stratagemsUsed,
  hviObtainedCheck,
  minutesRemaining,
) => {
  failureReasons = [];
  if (hviObtainedCheck === false) {
    failureReasons.push("Failed to extract with the High Value Item");
  }
  if (minutesRemaining > minutesNumber) {
    failureReasons.push(
      `Early extraction. Minutes remaining required: ${minutesNumber}. Extracted with ${minutesRemaining} minutes remaining.`,
    );
  }
  if (stims > stimsAvailable) {
    failureReasons.push(
      `Used too many stims. ${stims}/${stimsAvailable} available`,
    );
  }
  if (numOfDeaths > reinforcementsAvailable) {
    failureReasons.push(
      `Used too many reinforcements. ${numOfDeaths}/${reinforcementsAvailable} available`,
    );
  }
  if (stratagemsUsed > stratsAvailable) {
    failureReasons.push(
      `Used too many stratagems. ${stratagemsUsed}/${stratsAvailable} available`,
    );
  }
  if (
    stims > stimsAvailable ||
    numOfDeaths > reinforcementsAvailable ||
    stratagemsUsed > stratsAvailable ||
    hviObtainedCheck === false ||
    minutesRemaining > minutesNumber
  ) {
    return false;
  }
  return true;
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (isMissionSucceeded) {
    stimsUsed = parseInt(document.getElementById("stimsUsedInput").value, 10);
    reinforcementsUsed = parseInt(
      document.getElementById("deathsInput").value,
      10,
    );
    stratsUsed = parseInt(document.getElementById("stratsUsedInput").value, 10);
    const hviObtainedCheck =
      document.getElementById("hviObtainedCheck") &&
      document.getElementById("hviObtainedCheck").value;
    const minutesRemaining =
      document.getElementById("minutesRemainingInput") &&
      parseInt(document.getElementById("minutesRemainingInput").value, 10);

    // we're going to want to check and see if the objectives were met and resources didn't exceed the limits
    const didPlayerMeetObjectives = await calculateResources(
      stimsUsed,
      reinforcementsUsed,
      stratsUsed,
      hviObtainedCheck,
      minutesRemaining,
    );

    // resources set back to when the mission was started the first time (resources used during failed missions dont count)
    if (!didPlayerMeetObjectives) {
      closeMissionReportModal(false);
      return;
    }

    // if everything good, then proceed to next mission
    closeMissionReportModal(true);
  }

  if (!isMissionSucceeded) {
    closeMissionReportModal(false);
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

const showSpecialistOptions = (isRestart = null) => {
  challengePage.classList.toggle("d-none", true);
  specialistSelectPage.classList.toggle("d-none", false);
  genGauntletSpecialistsModalContent(isRestart);
};

const removePreviousSpecialistBoons = () => {
  const { stims, booster, deaths, extraStrats, minutes } = currentSpecialist;
  if (boosterCounterText) {
    let boosterNumber = parseInt(boosterCounterText.innerHTML);
    boosterNumber -= booster;
    boosterCounterText.innerHTML = boosterNumber;
  }

  if (minutesCounterText) {
    minutesNumber = getMissionData(missionCounter);
    minutesNumber -= minutes;
    minutesCounterText.innerHTML = minutesNumber;
  }

  stimsAvailable -= stims;
  reinforcementsAvailable -= deaths;
  stratsAvailable -= extraStrats;
  stimsCounterText.innerHTML = stimsAvailable;
  reinforcementsCounterText.innerHTML = reinforcementsAvailable;
  stratsCounterText.innerHTML = stratsAvailable;
};

const applySpecialist = async (index, isRestartString = null) => {
  const isRestart = isRestartString === "true";

  challengePage.classList.toggle("d-none", false);
  specialistSelectPage.classList.toggle("d-none", true);

  //// just handles the UI decor
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

  //// logic goes here
  // check to see if they already have a currentSpecialist
  // if yes, will need to deduct the boons from the current specialist from the buckets
  if (currentSpecialist) {
    await removePreviousSpecialistBoons();
  }
  currentSpecialist = specialists[index];
  // add specialist boons to total
  const { stims, booster, deaths, extraStrats, minutes } = currentSpecialist;
  // add booster
  if (boosterCounterText) {
    let boosterNumber = parseInt(boosterCounterText.innerHTML);
    boosterNumber += booster;
    boosterCounterText.innerHTML = boosterNumber;
  }

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
  if (isRestart) {
    restarts++;
    failureReasons = [];
    failureReasonsList.innerHTML = "";
  }
  displaySpecialistLoadout();
  saveProgress();
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
  specialists = structuredClone(GAUNTLETSPECIALISTS);
  failureReasons = [];

  stimsUsed = 0;
  reinforcementsUsed = 0;
  stratsUsed = 0;

  stimsAvailable = 50;
  reinforcementsAvailable = 12;
  stratsAvailable = 110;
  minutesNumber = 40;
  showSpecialistOptions();
  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(missionCounter);
  genSaveDataManagementModalContent();
};

const populateWebPage = async () => {
  genGauntletSpecialistsModalContent();
  displaySpecialistLoadout();
  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(missionCounter);
};

const uploadSaveData = async () => {
  const theGauntletSaveData = await localStorage.getItem("theGauntletSaveData");
  if (theGauntletSaveData) {
    const currentGame = await getCurrentGame("theGauntletSaveData");
    missionCounter = currentGame.missionCounter;
    dataName = currentGame.dataName;
    currentSpecialist = currentGame.currentSpecialist;
    restarts = currentGame.restarts;
    stimsAvailable = currentGame.stimsAvailable;
    reinforcementsAvailable = currentGame.reinforcementsAvailable;
    stratsAvailable = currentGame.stratsAvailable;
    specialists = structuredClone(GAUNTLETSPECIALISTS);
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
