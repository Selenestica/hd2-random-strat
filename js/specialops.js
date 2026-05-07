const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const missionCompleteModal = document.getElementById('missionCompleteModal');
const specialistsModal = document.getElementById('specialistsModal');
const objectiveInputsContainer = document.getElementById('objectiveInputsContainer');
const objectivesContainer = document.getElementById('objectivesContainer');
const stratagemsContainer = document.getElementById('stratagemsContainer');
const equipmentContainer = document.getElementById('equipmentContainer');
const armorContainer = document.getElementById('armorContainer');
const primaryContainer = document.getElementById('primaryContainer');
const secondaryContainer = document.getElementById('secondaryContainer');
const throwableContainer = document.getElementById('throwableContainer');
const objectiveNameText = document.getElementById('objectiveNameText');
const objectiveProgressText = document.getElementById('objectiveProgressText');
const specialistNameText = document.getElementById('specialistNameText');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const flavorAndInstructionsModal = document.getElementById('flavorAndInstructionsModal');
const warbondSelectModal = document.getElementById('warbondSelectModal');
const missionCompleteButton = document.getElementById('missionCompleteButton');
const missionFailedButton = document.getElementById('missionFailedButton');
const missionCompleteButtonDiv = document.getElementById('missionCompleteButtonDiv');
const missionFailedButtonDiv = document.getElementById('missionFailedButtonDiv');
const maxStarsPromptModal = document.getElementById('maxStarsPromptModal');
const applySpecialistButton = document.getElementById('applySpecialistButton');
const warbondCheckboxes = document.getElementsByClassName('warbondCheckboxes');
const hellDiversMobilizeCheckbox = document.getElementById('warbond3');

hellDiversMobilizeCheckbox.disabled = true;
let currentSpecialist = null;
let latestUnlockedSpecialist = null;
let currentObjectives = null;
let campaignsData = null;
let selectedSpecialist = null;
let specialists = null;
let restarts = 0;

let primaries = [...PRIMARIES];
let secondaries = [...SECONDARIES];
let throwables = [...THROWABLES];
let armorPassives = [...ARMOR_PASSIVES];
let stratagems = [...STRATAGEMS];

// if the submit mission report modal ever closes, reset the inputs
missionCompleteModal.addEventListener('hidden.bs.modal', () => {
  for (let z = 0; z < currentObjectives.length; z++) {
    const objInputEl = document.getElementById(`objId-${currentObjectives[z].id}`);
    objInputEl.value = 0;
  }
});

warbondSelectModal.addEventListener('hidden.bs.modal', async () => {
  const saveData = await localStorage.getItem('specialOpsSaveData');
  if (saveData) {
    return;
  }
  startNewRun();
});

// will need to keep track of master list
for (let y = 0; y < warbondCheckboxes.length; y++) {
  warbondCheckboxes[y].addEventListener('change', (e) => {
    // Skip warbond3 (Helldivers Mobilize) - it should always stay checked
    if (e.target.id === 'warbond3') {
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

    // Update the toggle all button state
    updateToggleAllButton();
  });
}

specialistsModal.addEventListener('hidden.bs.modal', () => {
  // remove the checkmark from all specialists
  const elements = document.querySelectorAll('.specialistCheckMarks');
  elements.forEach((element) => element.remove());

  // remove green text from all specialists
  const specialistHeaders = document.querySelectorAll('.specialistHeadersClass');
  specialistHeaders.forEach((header) => {
    header.classList.remove('text-success');
    header.classList.add('text-white');
  });
});

// Handle toggle all warbonds for Special Ops
const handleToggleAllWarbonds = (e) => {
  const isChecked = e.target.checked;
  const allWarbondCheckboxes = document.querySelectorAll('.warbondCheckboxes');

  allWarbondCheckboxes.forEach((checkbox) => {
    // Skip warbond3 (Helldivers Mobilize) - it should always stay disabled and checked
    if (checkbox.id === 'warbond3') return;

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
      const changeEvent = new Event('change', { bubbles: true });
      checkbox.dispatchEvent(changeEvent);
    }
  });

  // Filter specialists and update UI
  filterSpecialistsByWarbond(true);
};

// Add toggle all warbonds functionality
const toggleAllButton = document.getElementById('toggleAllWarbonds');
if (toggleAllButton) {
  toggleAllButton.addEventListener('change', handleToggleAllWarbonds);
}

// Update the toggle all button state based on individual checkboxes
const updateToggleAllButton = () => {
  const toggleAllButton = document.getElementById('toggleAllWarbonds');
  if (!toggleAllButton) return;

  const allWarbondCheckboxes = document.querySelectorAll('.warbondCheckboxes');
  // Filter out warbond3 (Helldivers Mobilize) since it's always disabled
  const enabledCheckboxes = Array.from(allWarbondCheckboxes).filter((cb) => cb.id !== 'warbond3');
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

const filterSpecialistsByWarbond = async (save = null) => {
  const newSpecialistInfo = await checkForSOSpecialistDiffs(
    specialists,
    currentSpecialist,
    latestUnlockedSpecialist,
    warbondCodes,
  );
  specialists = newSpecialistInfo.newSpecialistsList;
  currentSpecialist = newSpecialistInfo.newCurrentSpec;
  latestUnlockedSpecialist = newSpecialistInfo.newLatestSpec;

  // this probably means that the current specialist has items that were just toggled off
  // so we need to give the player a new specialist
  if (!currentSpecialist || !latestUnlockedSpecialist) {
    await genNewOperation(true, null, null);
    save = false;
  }
  specialistsList.innerHTML = '';
  genSOSpecialistsModalContent(currentSpecialist, latestUnlockedSpecialist);

  // Update the toggle all button state
  updateToggleAllButton();

  if (save) {
    saveProgress();
  }
};

const generateItemCard = (item) => {
  let imgDir = 'equipment';
  if (item.category === 'armor') {
    imgDir = 'armorpassives';
  }
  if (item.type === 'Stratagem') {
    imgDir = 'svgs';
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

const saveProgress = async () => {
  let obj = {};
  const specialOpsSaveData = localStorage.getItem('specialOpsSaveData');
  if (!specialOpsSaveData) {
    obj = {
      dataName: `Special Ops Save Data`,
      currentSpecialist,
      latestUnlockedSpecialist,
      currentObjectives,
      specialists,
      restarts,
      warbondCodes,
    };
    localStorage.setItem('specialOpsSaveData', JSON.stringify(obj));
    return;
  }
  let data = JSON.parse(specialOpsSaveData);
  data = {
    ...data,
    currentSpecialist,
    latestUnlockedSpecialist,
    currentObjectives,
    specialists,
    restarts,
    warbondCodes,
  };

  localStorage.setItem('specialOpsSaveData', JSON.stringify(data));
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

  // random mission objectives
  objectivesContainer.innerHTML = '';
  const objectives = await getRandomSpecialOpsObjectives();
  currentObjectives = objectives;
  for (let i = 0; i < objectives.length; i++) {
    const objName = objectives[i].name.replace('X', objectives[i].goal);
    const progType = objectives[i].progressType;
    objectivesContainer.innerHTML += `
      <div id="objectiveNameText${i}" class="d-flex justify-content-center text-white">${objName}: <span class="${
        progType === 'positive' ? 'text-danger' : 'text-success'
      }" id="objectiveProgressText${i}">${objectives[i].progress}/${objectives[i].goal}</span></div>
    `;
  }

  genSOMissionCompleteModalContent(objectives);
};

const renderObjectiveProgressText = () => {
  for (let i = 0; i < currentObjectives.length; i++) {
    const progressText = document.getElementById('objectiveProgressText' + i);
    progressText.innerHTML = currentObjectives[i].progress + '/' + currentObjectives[i].goal;
    if (
      currentObjectives[i].progress >= currentObjectives[i].goal &&
      currentObjectives[i].progressType === 'positive'
    ) {
      progressText.classList.remove('text-danger');
      progressText.classList.add('text-success');
    }
    if (
      currentObjectives[i].progress >= currentObjectives[i].goal &&
      currentObjectives[i].progressType === 'negative'
    ) {
      progressText.classList.remove('text-success');
      progressText.classList.add('text-danger');
    }
  }
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (!isMissionSucceeded) {
    saveProgress();
    return;
  }

  for (let i = 0; i < currentObjectives.length; i++) {
    const val = parseInt(document.getElementById('objId-' + currentObjectives[i].id).value, 10);
    currentObjectives[i].progress += val;
  }
  renderObjectiveProgressText();

  const objectivesMet = currentObjectives.every((obj) => obj.pointsAdded);
  const usingLatestSpecialist =
    latestUnlockedSpecialist.displayName === currentSpecialist.displayName;

  if (objectivesMet && usingLatestSpecialist) {
    await genNewOperation(true, null, null);
  } else {
    await genNewOperation(false, null, null);
  }

  saveProgress();
};

const displaySpecialistLoadout = () => {
  stratagemsContainer.innerHTML = '';
  equipmentContainer.innerHTML = '';

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
  const elements = document.querySelectorAll('.specialistCheckMarks');
  elements.forEach((element) => element.remove());

  // remove green text from all other specialists
  const specialistHeaders = document.querySelectorAll('.specialistHeadersClass');
  specialistHeaders.forEach((header) => {
    header.classList.remove('text-success');
    header.classList.add('text-white');
  });

  // add the checkmark to the selected specialist
  const specCardHeader = document.getElementById('specialistHeader' + index);
  specCardHeader.innerHTML += `<i class="bi bi-check-lg specialistCheckMarks text-success mx-1"></i>`;
  specCardHeader.classList.add('text-success');
  specCardHeader.classList.remove('text-white');
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
  const saveData = await localStorage.getItem('specialOpsSaveData');
  if (saveData) {
    return;
  }
  const infoModal = new bootstrap.Modal(flavorAndInstructionsModal);
  infoModal.show();

  // clear the slate
  currentSpecialist = null;
  latestUnlockedSpecialist = null;
  currentObjectives = null;
  restarts = 0;
  warbondCodes = [...masterWarbondCodes];
  specialists = structuredClone(SPECOPSSPECS);

  // Set checkbox states for new run
  for (let i = 0; i < warbondCheckboxes.length; i++) {
    if (warbondCheckboxes[i].id === 'warbond3') {
      warbondCheckboxes[i].checked = true;
      warbondCheckboxes[i].disabled = true;
    } else {
      warbondCheckboxes[i].checked = true;
      warbondCheckboxes[i].disabled = false;
    }
  }

  // Update toggle button after setting checkboxes
  updateToggleAllButton();

  // get a specialist, objective list
  await genNewOperation(true, null, true);

  // so user doesnt cycle through specialists
  await saveProgress();
  genSOSaveDataManagementModalContent();
};

const populateWebPage = async () => {
  const missingWarbondCodes = masterWarbondCodes.filter((code) => !warbondCodes.includes(code));
  for (let i = 0; i < missingWarbondCodes.length; i++) {
    document.getElementById(missingWarbondCodes[i]).checked = false;
  }

  // Update toggle button state
  updateToggleAllButton();

  // specialistsList.innerHTML = "";
  // await filterSpecialistsByWarbond(false);
  genSOSpecialistsModalContent(currentSpecialist, latestUnlockedSpecialist);
  displaySpecialistLoadout();

  // this part handles rendering the progress text. surprisingly complex
  for (let i = 0; i < currentObjectives.length; i++) {
    const objName = currentObjectives[i].name.replace('X', currentObjectives[i].goal);
    const progType = currentObjectives[i].progressType;
    objectivesContainer.innerHTML += `
      <div class="text-white d-flex justify-content-center">${objName}:<span style='padding-left: 5px;' class="${
        progType === 'positive' ? 'text-danger' : 'text-success'
      }" id="objectiveProgressText${i}">${currentObjectives[i].progress}/${
        currentObjectives[i].goal
      }
        </span>
      </div>
      
    `;
  }
  renderObjectiveProgressText();

  genSOMissionCompleteModalContent(currentObjectives);
};

const uploadSaveData = async () => {
  const specialOpsSaveData = await localStorage.getItem('specialOpsSaveData');
  if (specialOpsSaveData) {
    const data = JSON.parse(specialOpsSaveData);
    currentObjectives = data.currentObjectives;
    currentSpecialist = data.currentSpecialist;
    latestUnlockedSpecialist = data.latestUnlockedSpecialist;
    warbondCodes = data.warbondCodes ?? [...masterWarbondCodes];

    // Ensure warbond3 is always checked and disabled
    const warbond3Checkbox = document.getElementById('warbond3');
    if (warbond3Checkbox) {
      warbond3Checkbox.checked = true;
      warbond3Checkbox.disabled = true;
    }

    const newSpecialistInfo = await checkForSOSpecialistDiffs(
      data.specialists,
      data.currentSpecialist,
      data.latestUnlockedSpecialist,
      warbondCodes,
    );

    specialists = newSpecialistInfo.newSpecialistsList;
    currentSpecialist = newSpecialistInfo.newCurrentSpec;
    latestSpecialist = newSpecialistInfo.newLatestSpec;

    restarts = data.restarts;
    dataName = data.dataName;

    // Update toggle button after loading
    updateToggleAllButton();

    populateWebPage();
    return;
  }
  startNewRun();
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem('specialOpsSaveData');
  window.location.reload();
};

uploadSaveData();

// https://api.helldivers2.dev/api/v1/war         -o 801_war_v1.json
// https://api.helldivers2.dev/api/v1/planets     -o 801_planets_v1.json
// https://api.helldivers2.dev/api/v1/assignments -o 801_assignments_v1.json
// https://api.helldivers2.dev/api/v1/campaigns   -o 801_campaigns_v1.json
// https://api.helldivers2.dev/api/v1/dispatches
