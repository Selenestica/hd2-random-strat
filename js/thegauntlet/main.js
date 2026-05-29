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

hellDiversMobilizeCheckbox.disabled = true;
let missionCounter = 1;
let currentSpecialist = null;
let currentObjectives = null;
let selectedSpecialist = null;
let specialists = null;
let restarts = 0;
let operationPoints = 0;
let points = 0;

let primaries = [...PRIMARIES];
let secondaries = [...SECONDARIES];
let throwables = [...THROWABLES];
let armorPassives = [...ARMOR_PASSIVES];
let stratagems = [...STRATAGEMS];

// if the submit mission report modal ever closes, reset the inputs
missionCompleteModal.addEventListener("hidden.bs.modal", () => {
  for (let z = 0; z < currentObjectives.length; z++) {
    const objInputEl = document.getElementById(
      `objId-${currentObjectives[z].id}`,
    );
    objInputEl.value = 0;
  }
});

specialistsModal.addEventListener("hidden.bs.modal", () => {
  // remove the checkmark from all specialists
  const elements = document.querySelectorAll(".specialistCheckMarks");
  elements.forEach((element) => element.remove());

  // remove green text from all specialists
  const specialistHeaders = document.querySelectorAll(
    ".specialistHeadersClass",
  );
  specialistHeaders.forEach((header) => {
    header.classList.remove("text-success");
    header.classList.add("text-white");
  });
});

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
  `<div class="row d-block"><b>${label}</b><span class="mx-1 ${extraClass}" id="${id}">${value}</span></div>`;

const genCurrentMissionInfo = () => {
  const { stims, stratagems, boosters, deaths, text, minutes, obtainHVI } =
    getMissionData(missionCounter);

  const rows = [
    makeMissionRow("Difficulty:", text, "currentMissionText"),
    makeMissionRow("Stratagems Available:", stratagems, "stratagemCounterText"),
    stims !== -100 &&
      makeMissionRow("Stims Available:", stims, "stimCounterText"),
    minutes !== -100 &&
      makeMissionRow(
        "Minutes Remaining Required:",
        minutes,
        "minutesCounterText",
      ),
    boosters !== -100 &&
      makeMissionRow("Booster Slots:", boosters, "boosterCounterText"),
    deaths !== -100 &&
      makeMissionRow("Reinforcements Available:", deaths, "deathsCounterText"),
    obtainHVI &&
      makeMissionRow(
        "",
        "Extract with the High Value Item",
        "hviText",
        "text-warning",
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
      latestUnlockedSpecialist,
      currentObjectives,
      specialists,
      restarts,
      points,
      operationPoints,
      warbondCodes,
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
    latestUnlockedSpecialist,
    currentObjectives,
    specialists,
    restarts,
    points,
    operationPoints,
  };

  localStorage.setItem("theGauntletSaveData", JSON.stringify(data));
};

const genNewOperation = async (unlockSpecialist, newGame = null) => {
  // random specialist, only if new game or objectives were met
  if (unlockSpecialist) {
    // get a random locked specialist if there are any
    let specList = await specialists.filter((s) => s.locked === true);
    if (specList.length < 1) {
      specList = specialists;
    }
    let randSpecialistNumber = Math.floor(Math.random() * specList.length);
    // if a brand new game, always start with The O.G.
    if (newGame) {
      randSpecialistNumber = 2;
    }
    let specialist = specList[randSpecialistNumber];
    if (specialist.locked) {
      showSOSpecialistUnlockedToast(specialist.displayName);
    }
    specialist.locked = false;
    currentSpecialist = specialist;
    latestUnlockedSpecialist = specialist;
    genSOSpecialistsModalContent(currentSpecialist, latestUnlockedSpecialist);
    displaySpecialistLoadout();
  }

  missionCounter = 1;
  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(objectives);
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (isMissionSucceeded) {
    for (let i = 0; i < currentObjectives.length; i++) {
      let val;
      val = parseInt(
        document.getElementById("objId-" + currentObjectives[i].id).value,
        10,
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

    missionCounter++;

    saveProgress();
    genCurrentMissionInfo();
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

const setSpecialist = (index) => {
  selectedSpecialist = specialists[index];
  if (selectedSpecialist.displayName === currentSpecialist.displayName) {
    return;
  }

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
};

const applySpecialist = async () => {
  if (selectedSpecialist.displayName === currentSpecialist.displayName) {
    selectedSpecialist = null;
    return;
  }

  currentSpecialist = selectedSpecialist;
  displaySpecialistLoadout();
  await genNewOperation(false, null, null);
  saveProgress();
  selectedSpecialist = null;
};

const startNewRun = async () => {
  const saveData = await localStorage.getItem("theGauntletSaveData");
  if (saveData) {
    return;
  }
  const infoModal = new bootstrap.Modal(flavorAndInstructionsModal);
  infoModal.show();

  // clear the slate
  missionCounter = 1;
  currentSpecialist = null;
  latestUnlockedSpecialist = null;
  currentObjectives = null;
  restarts = 0;
  points = 0;
  operationPoints = 0;
  specialists = structuredClone(SPECOPSSPECS);

  // get a specialist, objective list
  await genNewOperation(true, null, true);

  // save the randomly selected objectives, and specialist to ls
  // so user doesnt cycle through specialists
  await saveProgress();
  genSOSaveDataManagementModalContent();
};

const populateWebPage = async () => {
  genSOSpecialistsModalContent(currentSpecialist, latestUnlockedSpecialist);
  displaySpecialistLoadout();

  // this part handles rendering the progress text. surprisingly complex
  for (let i = 0; i < currentObjectives.length; i++) {
    const objName = currentObjectives[i].name.replace(
      "X",
      currentObjectives[i].goal,
    );
    const progType = currentObjectives[i].progressType;
    constraintsContainer.innerHTML += `
      <div class="text-white">${objName}</div>
      <small class="text-white">Progress: <span class="${
        progType === "positive" ? "text-danger" : "text-success"
      }" id="objectiveProgressText${i}">${currentObjectives[i].progress}/${
        currentObjectives[i].goal
      }</span></small>
    `;
  }
  renderObjectiveProgressText();

  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(currentObjectives);
};

const uploadSaveData = async () => {
  const theGauntletSaveData = await localStorage.getItem("theGauntletSaveData");
  if (theGauntletSaveData) {
    const data = JSON.parse(theGauntletSaveData);
    currentObjectives = data.currentObjectives;
    currentSpecialist = data.currentSpecialist;
    latestUnlockedSpecialist = data.latestUnlockedSpecialist;

    const newSpecialistInfo = await checkForSOSpecialistDiffs(
      data.specialists,
      data.currentSpecialist,
      data.latestUnlockedSpecialist,
      warbondCodes,
    );

    specialists = newSpecialistInfo.newSpecialistsList;
    currentSpecialist = newSpecialistInfo.newCurrentSpec;
    latestSpecialist = newSpecialistInfo.newLatestSpec;

    missionCounter = data.missionCounter;
    restarts = data.restarts;
    dataName = data.dataName;
    points = data.points ?? 0;
    operationPoints = data.operationPoints ?? 0;

    populateWebPage();
    return;
  }
  startNewRun();
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("theGauntletSaveData");
  window.location.reload();
};

uploadSaveData();
