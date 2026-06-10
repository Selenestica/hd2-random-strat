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
const challengeCompleteButtonDiv = document.getElementById(
  "challengeCompleteButtonDiv",
);
const challengeButtonsDiv = document.getElementById("challengeButtonsDiv");
const hviObtainedCheck = document.getElementById("hviObtainedCheck");
const minutesRemainingInput = document.getElementById("minutesRemainingInput");
const missionSuccessConfirmationModal = document.getElementById(
  "missionSuccessConfirmationModal",
);
const failureReasonsList = document.getElementById("failureReasonsList");
const squadSpecialistsSelectModal = document.getElementById(
  "squadSpecialistsSelectModal",
);
const soloCheckbox = document.getElementById("soloCheckbox");
const soloCheckboxDiv = document.getElementById("soloCheckboxDiv");
const numOfSquadSpecialistsText = document.getElementById(
  "numOfSquadSpecialistsText",
);
const squadInfoContainer = document.getElementById("squadInfoContainer");
const squadListDiv = document.getElementById("squadListDiv");
const specialistBoonsText = document.getElementById("specialistBoonsText");

hellDiversMobilizeCheckbox.disabled = true;
let missionCounter = 1;
let currentSpecialist = null;
let tempSpecialist = null;
let tempSquadSpecialists = [];
let squadSpecialists = [];
let restarts = 0;
let missionsData = [];

let stimsUsed = null;
let reinforcementsUsed = null;
let stratsUsed = null;

let failureReasons = [];
let isRestarting = false;
let numOfSquadSpecialists = 0;

let stimsAvailable = 50;
let reinforcementsAvailable = 12;
let stratsAvailable = 110;
let minutesNumber = 40;
let boosterNumber = 4;

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

document.addEventListener("input", (e) => {
  if (
    e.target.classList &&
    e.target.classList.contains("squadSpecialistInputs")
  ) {
    handleSquadSpecialistInputs(e.target);
  }
});

document.addEventListener("change", (e) => {
  if (
    e.target.classList &&
    e.target.classList.contains("squadSpecialistInputs")
  ) {
    handleSquadSpecialistInputs(e.target);
  }
});

let selectedSpecialists = [];

const handleSquadSpecialistInputs = (changedInput) => {
  const inputs = document.querySelectorAll(".squadSpecialistInputs");

  // Calculate total
  let total = 0;
  inputs.forEach((input) => {
    total += parseInt(input.value) || 0;
  });

  if (total > 3) {
    changedInput.value = changedInput.defaultValue;
    return;
  }

  changedInput.defaultValue = changedInput.value;

  // Update the tracking array
  updateSelectedSpecialists();

  // Disable empty inputs when total reaches 3
  if (total === 3) {
    inputs.forEach((input) => {
      if (parseInt(input.value) === 0) {
        input.disabled = true;
      }
    });
  } else {
    inputs.forEach((input) => {
      input.disabled = false;
    });
  }
};

const updateSelectedSpecialists = () => {
  const inputs = document.querySelectorAll(".squadSpecialistInputs");
  tempSquadSpecialists = [];

  inputs.forEach((input) => {
    const value = parseInt(input.value) || 0;
    const spc = allSpecialists[parseInt(input.id.split("squadSpecialist")[1])];

    if (value > 0 && spc) {
      // Push the specialist object to the array 'value' number of times
      for (let i = 0; i < value; i++) {
        tempSquadSpecialists.push(spc);
      }
    }
  });

  return tempSquadSpecialists;
};

// will need to keep track of master list
for (let y = 0; y < warbondCheckboxes.length; y++) {
  warbondCheckboxes[y].addEventListener("change", (e) => {
    // Skip warbond3 (Helldivers Mobilize) - it should always stay checked
    if (e.target.id === "warbond3") {
      // Ensure it stays checked
      e.target.checked = true;
      return;
    }

    if (e.target.checked && !warbondCodes.includes(e.srcElement.id)) {
      warbondCodes.push(e.srcElement.id);
    }
    if (!e.target.checked && warbondCodes.includes(e.srcElement.id)) {
      const indexToRemove = warbondCodes.indexOf(e.srcElement.id);
      warbondCodes.splice(indexToRemove, 1);
    }

    // Filter specialists and update UI
    filterSpecialistsByWarbond();
    // Update the toggle all button state
    updateToggleAllButton();
  });
}

const handleToggleAllWarbonds = (e) => {
  const isChecked = e.target.checked;
  const allWarbondCheckboxes = document.querySelectorAll(".warbondCheckboxes");

  allWarbondCheckboxes.forEach((checkbox) => {
    // Skip warbond3 (Helldivers Mobilize) - it should always stay disabled and checked
    if (checkbox.id === "warbond3") return;

    if (checkbox.checked !== isChecked) {
      checkbox.checked = isChecked;

      // Update the warbondCodes array
      if (isChecked) {
        if (!warbondCodes.includes(checkbox.id)) {
          warbondCodes.push(checkbox.id);
        }
      } else {
        const indexToRemove = warbondCodes.indexOf(checkbox.id);
        if (indexToRemove !== -1) {
          warbondCodes.splice(indexToRemove, 1);
        }
      }

      // Trigger change event to update filtering
      const changeEvent = new Event("change", { bubbles: true });
      checkbox.dispatchEvent(changeEvent);
    }
  });

  // Filter specialists and update UI
  filterSpecialistsByWarbond();
};

// Add toggle all warbonds functionality
const toggleAllButton = document.getElementById("toggleAllWarbonds");
if (toggleAllButton) {
  toggleAllButton.addEventListener("change", handleToggleAllWarbonds);
}

// Update the toggle all button state based on individual checkboxes
const updateToggleAllButton = () => {
  const toggleAllButton = document.getElementById("toggleAllWarbonds");
  if (!toggleAllButton) return;

  const allWarbondCheckboxes = document.querySelectorAll(".warbondCheckboxes");
  // Filter out warbond3 (Helldivers Mobilize) since it's always disabled
  const enabledCheckboxes = Array.from(allWarbondCheckboxes).filter(
    (cb) => cb.id !== "warbond3",
  );
  if (enabledCheckboxes.length === 0) return;

  const checkedCount = enabledCheckboxes.filter((cb) => cb.checked).length;
  const totalCount = enabledCheckboxes.length;

  if (checkedCount === 0) {
    toggleAllButton.checked = false;
    toggleAllButton.indeterminate = false;
  } else if (checkedCount === totalCount) {
    toggleAllButton.checked = true;
    toggleAllButton.indeterminate = false;
  } else {
    toggleAllButton.indeterminate = true;
  }
};

const filterSpecialistsByWarbond = async () => {
  let masterSpecialistList = structuredClone(GAUNTLETSPECIALISTS);
  const filteredSpecialists = await masterSpecialistList.filter((spec) => {
    const specWarbonds = spec.warbonds;
    return specWarbonds.every((wb) => warbondCodes.includes(wb));
  });
  specialists = filteredSpecialists;
  genGauntletSpecialistsModalContent();

  // Update the toggle all button state
  updateToggleAllButton();
};

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
  challengeButtonsDiv.classList.toggle("d-none", false);
  challengeCompleteButtonDiv.classList.toggle("d-none", true);
  if (missionCounter > 6) {
    challengeButtonsDiv.classList.toggle("d-none", true);
    challengeCompleteButtonDiv.classList.toggle("d-none", false);
  }
  const { text, obtainHVI, enemy, boosters, minutes } =
    getMissionData(missionCounter);
  boosterNumber = boosters;
  minutesNumber = minutes;

  if (currentSpecialist) {
    const { booster } = currentSpecialist;
    const specMinutes = currentSpecialist.minutes;
    boosterNumber += booster;
    minutesNumber += specMinutes;
  }
  if (squadSpecialists.length > 0) {
    const { squadBoosters, squadMinutes } = getSquadBoons();
    boosterNumber += squadBoosters;
    minutesNumber += squadMinutes;
  }

  let rows = [
    makeMissionRow("Difficulty:", text, "currentMissionText"),
    makeMissionRow("Enemy:", enemy, "currentEnemyText"),
    makeMissionRow(
      "Minutes Remaining Required:",
      minutesNumber,
      "minutesCounterText",
    ),
    makeMissionRow("Booster Slots:", boosterNumber, "boosterCounterText"),
    obtainHVI &&
      makeMissionRow(
        "Special Requirement:",
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

  if (missionCounter > 6) {
    rows = [
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
  }

  missionInfoContainer.innerHTML = rows.filter(Boolean).join("\n");
};

const genSquadInfoContainerContent = () => {
  squadListDiv.innerHTML = "";
  for (let i = 0; i < squadSpecialists.length; i++) {
    const { booster, deaths, minutes, extraStrats, stims, displayName } =
      squadSpecialists[i];
    squadListDiv.innerHTML += `
      <div class="card row tgSpecialistCards m-1">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <p class="text-white mb-0">
              ${displayName}
            </p>
          </div>
          <div>
            ${
              minutes &&
              `<p class="text-white mb-0">
                minutes +${minutes}
              </p>`
            }
            ${
              booster &&
              `<p class="text-white mb-0">
                boosters +${booster}
              </p>`
            }
            ${
              stims &&
              `<p class="text-white mb-0">
                stims +${stims}
              </p>`
            }
            ${
              deaths &&
              `<p class="text-white mb-0">
                reinforcements +${deaths}
              </p>`
            }
            ${
              extraStrats &&
              `<p class="text-white mb-0">
                stratagems +${extraStrats}
              </p>`
            }
          </div>
        </div>
      </div>
    `;
  }
};

const saveProgress = async () => {
  let obj = {};
  const theGauntletSaveData = localStorage.getItem("theGauntletSaveData");
  if (!theGauntletSaveData) {
    obj = {
      savedGames: [
        {
          dataName: `The Gauntlet Save Data | ${getCurrentDateTime()} | ${currentSpecialist.displayName}`,
          missionCounter,
          currentSpecialist,
          squadSpecialists,
          restarts,
          missionsData,
          stimsAvailable,
          reinforcementsAvailable,
          stratsAvailable,
          minutesNumber,
          boosterNumber,
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
        squadSpecialists,
        restarts,
        missionsData,
        stimsAvailable,
        reinforcementsAvailable,
        stratsAvailable,
        minutesNumber,
        boosterNumber,
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

const updateMissionsData = () => {
  const { enemy, text } = getMissionData(missionCounter);
  const missionData = {
    stimsUsed,
    reinforcementsUsed,
    stratsUsed,
    difficulty: text,
    enemy: enemy,
    specialist: currentSpecialist.displayName,
    failureReasons,
  };

  missionsData.push({ ...missionData });
};

const proceedToNextLevel = async () => {
  // first, create missionsData entry
  await updateMissionsData();
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

const genSpecialistBoonText = () => {
  const { boosters, stims, deaths, extraStrats, minutes } = currentSpecialist;
  let text = [];
  if (boosters) {
    text.push(`boosters +${boosters}`);
  }
  if (stims) {
    text.push(`stims +${stims}`);
  }
  if (deaths) {
    text.push(`reinforcements +${deaths}`);
  }
  if (extraStrats) {
    text.push(`stratagems +${extraStrats}`);
  }
  if (minutes) {
    text.push(`minutes +${minutes}`);
  }
  return text.join(", ");
};

const displaySpecialistLoadout = () => {
  if (!currentSpecialist) {
    showSpecialistOptions();
    return;
  }
  stratagemsContainer.innerHTML = "";
  equipmentContainer.innerHTML = "";

  specialistNameText.innerText = currentSpecialist.displayName;
  specialistBoonsText.innerText = genSpecialistBoonText();
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
  let boostersReduction = booster;
  let minutesReduction = minutes;
  let stimsReduction = stims;
  let reinforcementsReduction = deaths;
  let stratsReduction = extraStrats;

  // if squadSpecialists.length > 0, add squad boons to numbers
  if (squadSpecialists.length > 0) {
    for (let i = 0; i < squadSpecialists.length; i++) {
      const sqsp = squadSpecialists[i];
      const { deaths, stims, extraStrats, minutes, booster } = sqsp;
      boostersReduction += booster;
      minutesReduction += minutes;
      reinforcementsReduction += deaths;
      stimsReduction += stims;
      stratsReduction += extraStrats;
    }
  }

  boosterNumber -= boostersReduction;
  minutesNumber -= minutesReduction;
  stimsAvailable -= stimsReduction;
  reinforcementsAvailable -= reinforcementsReduction;
  stratsAvailable -= stratsReduction;
  stimsCounterText.innerHTML = stimsAvailable;
  reinforcementsCounterText.innerHTML = reinforcementsAvailable;
  stratsCounterText.innerHTML = stratsAvailable;
  boosterCounterText.innerHTML = boosterNumber;
  minutesCounterText.innerHTML = minutesNumber;
};

const applySpecialist = async (index, isRestartString = null) => {
  if (isRestartString && isRestartString !== "null") {
    isRestarting = true;
  }

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

  tempSpecialist = specialists[index];

  const sssModal = new bootstrap.Modal(squadSpecialistsSelectModal);
  sssModal.show();
};

const getSquadBoons = () => {
  let squadBoosters = 0;
  let squadMinutes = 0;
  let squadReinforcements = 0;
  let squadStims = 0;
  let squadStrats = 0;
  for (let i = 0; i < squadSpecialists.length; i++) {
    const sqsp = squadSpecialists[i];
    const { deaths, stims, extraStrats, minutes, booster } = sqsp;
    squadBoosters += booster;
    squadMinutes += minutes;
    squadReinforcements += deaths;
    squadStims += stims;
    squadStrats += extraStrats;
  }
  return {
    squadBoosters,
    squadMinutes,
    squadReinforcements,
    squadStims,
    squadStrats,
  };
};

const createSquad = async () => {
  challengePage.classList.toggle("d-none", false);
  specialistSelectPage.classList.toggle("d-none", true);

  if (isRestarting) {
    await updateMissionsData();
    restarts++;
    failureReasons = [];
    failureReasonsList.innerHTML = "";
    isRestarting = false;
  }
  if (currentSpecialist) {
    // also remove squad boons in this function
    await removePreviousSpecialistBoons();
  }

  currentSpecialist = { ...tempSpecialist };
  squadSpecialists = [...tempSquadSpecialists];

  // add specialist boons to total
  const { stims, booster, deaths, extraStrats, minutes } = currentSpecialist;
  let boostersToAdd = booster;
  let minutesToAdd = minutes;
  let stimsToAdd = stims;
  let reinforcementsToAdd = deaths;
  let stratsToAdd = extraStrats;

  // add squad boons as well, if any
  if (squadSpecialists.length > 0) {
    const {
      squadBoosters,
      squadMinutes,
      squadStims,
      squadStrats,
      squadReinforcements,
    } = await getSquadBoons();
    boostersToAdd += squadBoosters;
    minutesToAdd += squadMinutes;
    stimsToAdd += squadStims;
    stratsToAdd += squadStrats;
    reinforcementsToAdd += squadReinforcements;
  }
  // add booster
  if (boosterCounterText) {
    let boosterNumber = parseInt(boosterCounterText.innerHTML);
  }

  minutesNumber = getMissionData(missionCounter).minutes;
  boosterNumber = getMissionData(missionCounter).boosters;

  minutesNumber += minutesToAdd;
  boosterNumber += boostersToAdd;
  stimsAvailable += stimsToAdd;
  reinforcementsAvailable += reinforcementsToAdd;
  stratsAvailable += stratsToAdd;
  stimsCounterText.innerHTML = stimsAvailable;
  reinforcementsCounterText.innerHTML = reinforcementsAvailable;
  stratsCounterText.innerHTML = stratsAvailable;
  minutesCounterText.innerHTML = minutesNumber;
  boosterCounterText.innerHTML = boosterNumber;
  displaySpecialistLoadout();
  genSquadInfoContainerContent();
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
  failureReasons = [];
  missionsData = [];
  squadSpecialists = [];

  stimsUsed = 0;
  reinforcementsUsed = 0;
  stratsUsed = 0;

  stimsAvailable = 50;
  reinforcementsAvailable = 12;
  stratsAvailable = 110;
  minutesNumber = 40;
  boosterNumber = 4;
  showSpecialistOptions();
  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(missionCounter);
  genSaveDataManagementModalContent();
  genSquadSpecialistModalContent();
};

const populateWebPage = async () => {
  genGauntletSpecialistsModalContent();
  genSquadSpecialistModalContent();
  displaySpecialistLoadout();
  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(missionCounter);
  if (squadSpecialists.length > 0) {
    squadInfoContainer.classList.toggle("d-none", false);
    genSquadInfoContainerContent();
  }
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
    boosterNumber = currentGame.boosterNumber;
    minutesNumber = currentGame.minutesNumber;
    missionsData = currentGame.missionsData;
    squadSpecialists = currentGame.squadSpecialists;
    populateWebPage();

    return;
  }
  startNewRun();
};

const saveDataAndRestart = async () => {
  const theGauntletSaveData = localStorage.getItem("theGauntletSaveData");
  if (!theGauntletSaveData) {
    return;
  }

  let updatedSavedGames = [];
  const saveData = JSON.parse(theGauntletSaveData);
  if (saveData) {
    // make all saved game data currentGame = false
    updatedSavedGames = await saveData.savedGames.map((sg) => {
      sg.currentGame = false;
      return sg;
    });
  }

  // clear the slate
  missionCounter = 1;
  currentSpecialist = null;
  restarts = 0;
  failureReasons = [];
  missionsData = [];
  squadSpecialists = [];

  stimsUsed = 0;
  reinforcementsUsed = 0;
  stratsUsed = 0;

  stimsAvailable = 50;
  reinforcementsAvailable = 12;
  stratsAvailable = 110;
  minutesNumber = 40;
  boosterNumber = 4;
  showSpecialistOptions();
  genCurrentMissionInfo();
  genGauntletMissionCompleteModalContent(missionCounter);
  genSaveDataManagementModalContent();
  const newSaveObj = {
    dataName,
    missionCounter,
    currentSpecialist,
    squadSpecialists,
    missionsData,
    restarts,
    stimsAvailable,
    reinforcementsAvailable,
    stratsAvailable,
    minutesNumber,
    boosterNumber,
    currentGame: true,
  };

  if (saveData) {
    updatedSavedGames.push(newSaveObj);
    const newtheGauntletSaveData = {
      savedGames: updatedSavedGames,
    };
    await localStorage.setItem(
      "theGauntletSaveData",
      JSON.stringify(newtheGauntletSaveData),
    );
  }

  // remove saved games that are at the first mission of their difficulty,
  // as long as they are not the current game
  // ...this is to prevent the user from having a million saves
  pruneSavedGames();
};

// get rid of all games that arent the current game and are on the first mission
const pruneSavedGames = async () => {
  const theGauntletSaveData = localStorage.getItem("theGauntletSaveData");
  if (!theGauntletSaveData) {
    return;
  }
  const prunedGames = await JSON.parse(theGauntletSaveData).savedGames.filter(
    (sg) => {
      if (sg.currentGame === true || sg.missionCounter !== 1) {
        return sg;
      }
    },
  );
  const oldData = JSON.parse(theGauntletSaveData);
  const newData = {
    ...oldData,
    savedGames: prunedGames,
  };
  localStorage.setItem("theGauntletSaveData", JSON.stringify(newData));
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("theGauntletSaveData");
  window.location.reload();
};

uploadSaveData();
