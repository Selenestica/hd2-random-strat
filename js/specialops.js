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
const pointsCounterText = document.getElementById("pointsCounterText");
const flavorAndInstructionsModal = document.getElementById(
  "flavorAndInstructionsModal"
);
const warbondSelectModal = document.getElementById("warbondSelectModal");
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
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");
const hellDiversMobilizeCheckbox = document.getElementById("warbond3");

hellDiversMobilizeCheckbox.disabled = true;
let missionCounter = 1;
let currentPlanet = null;
let currentEnemy = null;
let currentSpecialist = null;
let latestUnlockedSpecialist = null;
let currentObjectives = null;
let campaignsData = null;
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
      `objId-${currentObjectives[z].id}`
    );
    objInputEl.value = 0;
  }
});

warbondSelectModal.addEventListener("hidden.bs.modal", async () => {
  const saveData = await localStorage.getItem("specialOpsSaveData");
  if (saveData) {
    return;
  }
  startNewRun();
});

// will need to keep track of master list
for (let y = 0; y < warbondCheckboxes.length; y++) {
  warbondCheckboxes[y].addEventListener("change", (e) => {
    if (e.target.checked && !warbondCodes.includes(e.srcElement.id)) {
      warbondCodes.push(e.srcElement.id);
    }
    if (!e.target.checked && warbondCodes.includes(e.srcElement.id)) {
      const indexToRemove = warbondCodes.indexOf(e.srcElement.id);
      warbondCodes.splice(indexToRemove, 1);
    }
  });
}

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

const filterSpecialistsByWarbond = async (save = null) => {
  const newSpecialistInfo = await checkForSOSpecialistDiffs(
    specialists,
    currentSpecialist,
    latestUnlockedSpecialist,
    warbondCodes
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
  specialistsList.innerHTML = "";
  genSOSpecialistsModalContent(currentSpecialist, latestUnlockedSpecialist);
  if (save) {
    saveProgress();
  }
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

const saveProgress = async () => {
  let obj = {};
  const specialOpsSaveData = localStorage.getItem("specialOpsSaveData");
  if (!specialOpsSaveData) {
    obj = {
      dataName: `Special Ops Save Data`,
      missionCounter,
      currentSpecialist,
      latestUnlockedSpecialist,
      currentPlanet,
      currentEnemy,
      currentObjectives,
      specialists,
      restarts,
      points,
      operationPoints,
      warbondCodes,
    };
    localStorage.setItem("specialOpsSaveData", JSON.stringify(obj));
    missionCounterText.innerHTML = missionCounter;
    return;
  }
  let data = JSON.parse(specialOpsSaveData);
  data = {
    ...data,
    missionCounter,
    currentSpecialist,
    latestUnlockedSpecialist,
    currentPlanet,
    currentEnemy,
    currentObjectives,
    specialists,
    restarts,
    points,
    operationPoints,
    warbondCodes,
  };

  localStorage.setItem("specialOpsSaveData", JSON.stringify(data));
};

const fetchCampaignsData = async () => {
  console.log("Fetching campaign data...");
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
  planetDropdownList.innerHTML = "";
  for (let i = 0; i < campaigns.length; i++) {
    const planetName = campaigns[i].planet.name;
    planetDropdownList.innerHTML += `
        <li><a class="dropdown-item planetOption" onclick="switchPlanet('${campaigns[i].planet.name}')" href="#">${planetName}</a></li>
    `;
  }
};

const switchPlanet = async (planetName) => {
  restarts += 1;
  await genNewOperation(false, planetName, null);
  saveProgress();
};

const getCampaignFromPlanetName = async (planetName) => {
  const newPlanet = await campaignsData.filter(
    (cd) => cd.planet.name === planetName
  );
  return newPlanet[0];
};

const genNewOperation = async (
  unlockSpecialist,
  planetName = null,
  newGame = null
) => {
  // random planet
  const randPlanetNumber = Math.floor(Math.random() * campaignsData.length);
  let planetToUse = campaignsData[randPlanetNumber];
  if (planetName) {
    planetToUse = await getCampaignFromPlanetName(planetName);
  }
  currentPlanet = planetToUse;
  currentEnemy = getCurrentEnemy(currentPlanet);
  planetNameText.innerHTML = currentPlanet.planet.name;
  enemyNameText.innerHTML = currentEnemy;
  hazardsText.innerHTML = currentPlanet.planet.hazards[0].name;

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
  objectivesContainer.innerHTML = "";
  const objectives = await getRandomSpecialOpsObjectives(currentEnemy);
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

  missionCounter = 1;
  missionCounterText.innerHTML = "1";
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

      showPointsEarnedToast(operationPoints);
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
  const saveData = await localStorage.getItem("specialOpsSaveData");
  if (saveData) {
    return;
  }
  const infoModal = new bootstrap.Modal(flavorAndInstructionsModal);
  infoModal.show();

  // clear the slate
  missionCounter = 1;
  currentPlanet = null;
  currentEnemy = null;
  currentSpecialist = null;
  latestUnlockedSpecialist = null;
  currentObjectives = null;
  restarts = 0;
  points = 0;
  operationPoints = 0;
  warbondCodes = [...masterWarbondCodes];
  specialists = structuredClone(SPECOPSSPECS);

  pointsCounterText.innerHTML = 0;

  // get a specialist, objective list, and planet
  await genNewOperation(true, null, true);

  // save the randomly selected objectives, planet, and specialist to ls
  // so user doesnt cycle through specialists
  await saveProgress();
  genSOSaveDataManagementModalContent();
};

const populateWebPage = async () => {
  planetNameText.innerHTML = currentPlanet.planet.name;
  enemyNameText.innerHTML = currentEnemy;
  hazardsText.innerHTML = currentPlanet.planet.hazards[0].name;
  pointsCounterText.innerHTML = points;

  const missingWarbondCodes = masterWarbondCodes.filter(
    (code) => !warbondCodes.includes(code)
  );
  for (let i = 0; i < missingWarbondCodes.length; i++) {
    document.getElementById(missingWarbondCodes[i]).checked = false;
  }

  // specialistsList.innerHTML = "";
  // await filterSpecialistsByWarbond(false);
  genSOSpecialistsModalContent(currentSpecialist, latestUnlockedSpecialist);
  displaySpecialistLoadout();

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

  missionCounterText.innerHTML = missionCounter;
  genSOMissionCompleteModalContent(currentObjectives);
};

const uploadSaveData = async () => {
  await fetchCampaignsData();
  const specialOpsSaveData = await localStorage.getItem("specialOpsSaveData");
  if (specialOpsSaveData) {
    // do a check here to make sure the planet they were on is still available
    // if not, put a warning up that teammates may not be able to select that planet

    const data = JSON.parse(specialOpsSaveData);
    currentPlanet = data.currentPlanet;
    currentObjectives = data.currentObjectives;
    currentEnemy = data.currentEnemy;
    currentSpecialist = data.currentSpecialist;
    latestUnlockedSpecialist = data.latestUnlockedSpecialist;
    warbondCodes = data.warbondCodes ?? [...masterWarbondCodes];
    const newSpecialistInfo = await checkForSOSpecialistDiffs(
      data.specialists,
      data.currentSpecialist,
      data.latestUnlockedSpecialist,
      warbondCodes
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
  localStorage.removeItem("specialOpsSaveData");
  window.location.reload();
};

uploadSaveData();

setInterval(fetchCampaignsData, 5 * 60 * 1000);

// https://api.helldivers2.dev/api/v1/war         -o 801_war_v1.json
// https://api.helldivers2.dev/api/v1/planets     -o 801_planets_v1.json
// https://api.helldivers2.dev/api/v1/assignments -o 801_assignments_v1.json
// https://api.helldivers2.dev/api/v1/campaigns   -o 801_campaigns_v1.json
// https://api.helldivers2.dev/api/v1/dispatches
