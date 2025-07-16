const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody"
);
const missionCompleteModal = document.getElementById("missionCompleteModal");
const specialistsModal = document.getElementById("specialistsModal");
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
const planetDropdownList = document.getElementById("planetDropdownList");
const planetNameText = document.getElementById("planetNameText");
const enemyNameText = document.getElementById("enemyNameText");
const hazardsText = document.getElementById("hazardsText");
const objectiveNameText = document.getElementById("objectiveNameText");
const objectiveProgressText = document.getElementById("objectiveProgressText");
const specialistNameText = document.getElementById("specialistNameText");
const maxStarsModalBody = document.getElementById("maxStarsModalBody");
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
const missionCounterText = document.getElementById("missionCounterText");
const maxStarsPromptModal = document.getElementById("maxStarsPromptModal");
const applySpecialistButton = document.getElementById("applySpecialistButton");
let missionCounter = 1;
let currentPlanet = null;
let currentEnemy = null;
let currentSpecialist = null;
let latestUnlockedSpecialist = null;
let currentObjectives = null;
let campaignsData = null;
let selectedSpecialist = null;
let specialists = null;

let primaries = [...PRIMARIES];
let secondaries = [...SECONDARIES];
let throwables = [...THROWABLES];
let armorPassives = [...ARMOR_PASSIVES];
let stratagems = [...STRATAGEMS];

// if the submit mission report modal ever closes, reset the inputs
missionCompleteModal.addEventListener("hidden.bs.modal", () => {
  for (let z = 0; z < currentObjectives.length; z++) {
    const objInputEl = document.getElementById(
      `objId-${currentObjectives[z].id}`
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
    ".specialistHeadersClass"
  );
  specialistHeaders.forEach((header) => {
    header.classList.remove("text-success");
    header.classList.add("text-white");
  });
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
      <div class="card-body itemNameContainer align-items-center">
          <p class="card-title text-white">${item.displayName}</p>
      </div>
    </div>`;
};

const saveProgress = async () => {
  let obj = {};
  const specialOpsSaveData = localStorage.getItem("specialOpsSaveData");
  if (!specialOpsSaveData) {
    obj = {
      seesRulesOnOpen: false,
      dataName: `Special Ops Save Data`,
      missionCounter,
      currentSpecialist,
      latestUnlockedSpecialist,
      currentPlanet,
      currentEnemy,
      currentObjectives,
      specialists,
    };
    localStorage.setItem("specialOpsSaveData", JSON.stringify(obj));
    missionCounterText.innerHTML = `Mission ${missionCounter}`;
    return;
  }
  let data = JSON.parse(specialOpsSaveData);
  data = {
    ...data,
    seesRulesOnOpen: false,
    missionCounter,
    currentSpecialist,
    latestUnlockedSpecialist,
    currentPlanet,
    currentEnemy,
    currentObjectives,
    specialists,
  };

  localStorage.setItem("specialOpsSaveData", JSON.stringify(data));
};

const fetchCampaignsData = async () => {
  const url =
    "https://helldivers2challengesapi.s3.us-east-2.amazonaws.com/helldivers-data.json";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    campaignsData = data;
    genPlanetsList(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const genPlanetsList = async (campaigns) => {
  for (let i = 0; i < campaigns.length; i++) {
    const planetName = campaigns[i].planet.name;
    planetDropdownList.innerHTML += `
        <li><a class="dropdown-item planetOption" href="#">${planetName}</a></li>
    `;
  }
};

const genNewOperation = async (unlockSpecialist) => {
  // random planet
  const randPlanetNumber = Math.floor(Math.random() * campaignsData.length);
  currentPlanet = campaignsData[randPlanetNumber];
  currentEnemy = getCurrentEnemy(currentPlanet);
  planetNameText.innerHTML = currentPlanet.planet.name;
  enemyNameText.innerHTML = currentEnemy;
  hazardsText.innerHTML = currentPlanet.planet.hazards[0].name;

  // random specialist, only if new game or objectives were met
  if (unlockSpecialist) {
    // get a random locked specialist if there are any
    let specList = specialists.filter((s) => s.locked === true);
    if (specList.length < 1) {
      specList = specialists;
    }
    const randSpecialistNumber = Math.floor(Math.random() * specList.length);

    let specialist = specList[randSpecialistNumber];
    specialist.locked = false;
    currentSpecialist = specialist;
    latestUnlockedSpecialist = specialist;
    genSOSpecialistsModalContent(currentSpecialist, latestUnlockedSpecialist);
    displaySpecialistLoadout();
    showSOSpecialistUnlockedToast(currentSpecialist.displayName);
  }

  // random mission objectives
  objectivesContainer.innerHTML = "";
  const objectives = getRandomSpecialOpsObjectives(currentEnemy);
  currentObjectives = objectives;
  // add progress bars too that would be cool
  for (let i = 0; i < objectives.length; i++) {
    const objName = objectives[i].name.replace("X", objectives[i].goal);
    const progType = objectives[i].progressType;
    objectivesContainer.innerHTML += `
      <div id="objectiveNameText${i}" class="text-white">${objName}</div>
      <small class="text-white">Progress: <span class="${
        progType === "positive" ? "text-danger" : "text-success"
      }" id="objectiveProgressText${i}">${objectives[i].progress}/${
      objectives[i].goal
    }</span></small>
    `;
  }

  missionCounterText.innerHTML = "Mission: 1";
  genSOMissionCompleteModalContent(objectives);
};

const renderObjectiveProgressText = () => {
  for (let i = 0; i < currentObjectives.length; i++) {
    const progressText = document.getElementById("objectiveProgressText" + i);
    progressText.innerHTML =
      currentObjectives[i].progress + "/" + currentObjectives[i].goal;
    if (
      currentObjectives[i].progress >= currentObjectives[i].goal &&
      currentObjectives[i].progressType === "positive"
    ) {
      progressText.classList.remove("text-danger");
      progressText.classList.add("text-success");
    }
    if (
      currentObjectives[i].progress >= currentObjectives[i].goal &&
      currentObjectives[i].progressType === "negative"
    ) {
      progressText.classList.remove("text-success");
      progressText.classList.add("text-danger");
    }
  }
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
    }
    renderObjectiveProgressText();

    missionCounter++;
    if (missionCounter > 3) {
      let objectivesMet = true;
      for (let j = 0; j < currentObjectives.length; j++) {
        const obj = currentObjectives[j];
        if (obj.progressType === "positive" && obj.progress < obj.goal) {
          objectivesMet = false;
          break;
        }
        if (obj.progressType === "negative" && obj.progress >= obj.goal) {
          objectivesMet = false;
          break;
        }
      }

      // only by using latest unlock can you unlock the next specialist
      if (
        latestUnlockedSpecialist.displayName !== currentSpecialist.displayName
      ) {
        objectivesMet = false;
      }

      missionCounter = 1;
      await genNewOperation(objectivesMet);
      saveProgress();
      return;
    }

    saveProgress();
    missionCounterText.innerHTML = `Mission: ${missionCounter}`;
    return;
  }

  // set missionCounter back to start of operation
  if (!isMissionSucceeded) {
    missionCounter = 1;
    await genNewOperation(false);
  }
};

const getCurrentEnemy = (planet) => {
  if (planet.faction === "Humans") {
    return planet.planet.currentOwner;
  }
  return planet.faction;
};

const displaySpecialistLoadout = () => {
  stratagemsContainer.innerHTML = "";
  equipmentContainer.innerHTML = "";

  specialistNameText.innerText = currentSpecialist.displayName;
  const primaryObj = primaries.find(
    (obj) => obj.displayName === currentSpecialist.primary
  );
  const secondaryObj = secondaries.find(
    (obj) => obj.displayName === currentSpecialist.secondary
  );
  const throwObj = throwables.find(
    (obj) => obj.displayName === currentSpecialist.throwable
  );
  const armorObj = armorPassives.find(
    (obj) => obj.displayName === currentSpecialist.armorPassive
  );

  for (let i = 0; i < currentSpecialist.stratagems.length; i++) {
    let stratagem = stratagems.find(
      (obj) => obj.displayName === currentSpecialist.stratagems[i]
    );
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
    ".specialistHeadersClass"
  );
  specialistHeaders.forEach((header) => {
    header.classList.remove("text-success");
    header.classList.add("text-white");
  });

  // add the checkmark to the selected specialist
  const specCardHeader = document.getElementById("specialistHeader" + index);
  specCardHeader.innerHTML += `<i class="fa-solid specialistCheckMarks text-success mx-1 fa-check"></i>`;
  specCardHeader.classList.add("text-success");
  specCardHeader.classList.remove("text-white");
};

const applySpecialist = async () => {
  console.log(selectedSpecialist);
  if (selectedSpecialist.displayName === currentSpecialist.displayName) {
    selectedSpecialist = null;
    return;
  }

  currentSpecialist = selectedSpecialist;
  displaySpecialistLoadout();
  await genNewOperation(false);
  saveProgress();
  selectedSpecialist = null;
};

const startNewRun = async () => {
  // clear the slate
  missionCounter = 1;
  currentPlanet = null;
  currentEnemy = null;
  currentSpecialist = null;
  latestUnlockedSpecialist = null;
  currentObjectives = null;
  specialists = [...SPECOPSSPECS];

  // get a specialist, objective list, and planet
  await genNewOperation(true);

  // save the randomly selected objectives, planet, and specialist to ls
  // so user doesnt cycle through specialists
  await saveProgress();
  genSOSaveDataManagementModalContent();
};

const populateWebPage = () => {
  planetNameText.innerHTML = currentPlanet.planet.name;
  enemyNameText.innerHTML = currentEnemy;
  hazardsText.innerHTML = currentPlanet.planet.hazards[0].name;

  displaySpecialistLoadout();
  genSOSpecialistsModalContent(currentSpecialist, latestUnlockedSpecialist);

  // this part handles rendering the progress text. surprisingly complex
  for (let i = 0; i < currentObjectives.length; i++) {
    const objName = currentObjectives[i].name.replace(
      "X",
      currentObjectives[i].goal
    );
    const progType = currentObjectives[i].progressType;
    objectivesContainer.innerHTML += `
      <div class="text-white">${objName}</div>
      <small class="text-white">Progress: <span class="${
        progType === "positive" ? "text-danger" : "text-success"
      }" id="objectiveProgressText${i}">${currentObjectives[i].progress}/${
      currentObjectives[i].goal
    }</span></small>
    `;
  }
  renderObjectiveProgressText();

  missionCounterText.innerHTML = "Mission: " + missionCounter;
  genSOMissionCompleteModalContent(currentObjectives);
};

const uploadSaveData = async () => {
  await fetchCampaignsData();
  const specialOpsSaveData = localStorage.getItem("specialOpsSaveData");
  if (specialOpsSaveData) {
    // do a check here to make sure the planet they were on is still available
    // if not, put a warning up that teammates may not be able to select that planet
    const data = JSON.parse(specialOpsSaveData);
    currentPlanet = data.currentPlanet;
    currentObjectives = data.currentObjectives;
    currentEnemy = data.currentEnemy;
    currentSpecialist = data.currentSpecialist;
    latestUnlockedSpecialist = data.latestUnlockedSpecialist;
    specialists = data.specialists;
    seesRulesOnOpen = data.seesRulesOnOpen;
    missionCounter = data.missionCounter;
    dataName = data.dataName;
    populateWebPage();
    return;
  }
  startNewRun();
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("specialOpsSaveData");
  window.location.reload();
};

uploadSaveData();

// https://api.helldivers2.dev/api/v1/war         -o 801_war_v1.json
// https://api.helldivers2.dev/api/v1/planets     -o 801_planets_v1.json
// https://api.helldivers2.dev/api/v1/assignments -o 801_assignments_v1.json
// https://api.helldivers2.dev/api/v1/campaigns   -o 801_campaigns_v1.json
// https://api.helldivers2.dev/api/v1/dispatches
