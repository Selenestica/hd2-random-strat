const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody"
);
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
let currentObjectives = null;
let campaignsData = null;

let primaries = [...PRIMARIES];
let secondaries = [...SECONDARIES];
let throwables = [...THROWABLES];
let armorPassives = [...ARMOR_PASSIVES];
let stratagems = [...STRATAGEMS];

const getItemMetaData = (item) => {
  const { category, type } = item;
  let imgDir;
  let list;
  let accBody;
  let typeText;
  let listKeyName;
  if (type === "Stratagem") {
    imgDir = "svgs";
    list = newStrats;
    accBody = stratagemAccordionBody;
    typeText = "Stratagem";
    listKeyName = "newStrats";
  }
  if (category === "primary") {
    imgDir = "equipment";
    list = newPrims;
    accBody = primaryAccordionBody;
    typeText = "Primary";
    listKeyName = "newPrims";
  }
  if (category === "booster") {
    imgDir = "equipment";
    list = newBoosts;
    accBody = boosterAccordionBody;
    typeText = "Booster";
    listKeyName = "newBoosts";
  }
  if (category === "secondary") {
    imgDir = "equipment";
    list = newSeconds;
    accBody = secondaryAccordionBody;
    typeText = "Secondary";
    listKeyName = "newSeconds";
  }
  if (category === "throwable") {
    imgDir = "equipment";
    list = newThrows;
    accBody = throwableAccordionBody;
    typeText = "Throwable";
    listKeyName = "newThrows";
  }
  if (category === "armor") {
    imgDir = "armor";
    list = newArmorPassives;
    accBody = armorPassiveAccordionBody;
    typeText = "Armor Passive";
    listKeyName = "newArmorPassives";
  }
  return { imgDir, list, accBody, typeText, listKeyName };
};

const closeMaxStarsPromptModal = () => {
  const mspModal = new bootstrap.Modal(maxStarsPromptModal);
  mspModal.hide();

  // if that was the last mission, dont show rewards because theyre done
  if (missionCounter >= 22) {
    missionCounter++;
    missionCounterText.innerHTML = `${getMissionText()}`;
    mspModal.hide();
    saveProgress();
    return;
  }

  const itemsModal = new bootstrap.Modal(itemOptionsModal);
  itemsModal.show();
  rollRewardOptions();
};

const generateItemCard = (item) => {
  let imgDir = "equipment";
  if (item.category === "armor") {
    imgDir = "armor";
  }
  if (item.type === "Stratagem") {
    imgDir = "svgs";
  }
  return `
    <div class="card d-flex col-2 pcItemCards mx-1">
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
      currentPlanet,
      currentEnemy,
      currentObjectives,
    };
    localStorage.setItem("specialOpsSaveData", JSON.stringify(obj));
    missionCounterText.innerHTML = `${getMissionText()}`;
    return;
  }
  let data = JSON.parse(specialOpsSaveData);
  data = {
    ...data,
    seesRulesOnOpen: false,
    missionCounter,
    currentSpecialist,
    currentPlanet,
    currentEnemy,
    currentObjectives,
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

const genNewOperation = async () => {
  // random planet
  const randPlanetNumber = Math.floor(Math.random() * campaignsData.length);
  currentPlanet = campaignsData[randPlanetNumber];
  currentEnemy = getCurrentEnemy(currentPlanet);
  planetNameText.innerHTML = currentPlanet.planet.name;
  enemyNameText.innerHTML = currentEnemy;

  // random specialist
  const randSpecialistNumber = Math.floor(Math.random() * SPECOPSSPECS.length);
  specialist = SPECOPSSPECS[randSpecialistNumber];
  currentSpecialist = specialist;
  displaySpecialistLoadout();

  // random mission objectives
  const objectives = getRandomSpecialOpsObjectives(currentEnemy);
  currentObjectives = objectives;
  // add progress bars too that would be cool
  for (let i = 0; i < objectives.length; i++) {
    const objName = objectives[i].name.replace("X", objectives[i].goal);
    objectivesContainer.innerHTML += `
      <div id="objectiveNameText${i}" class="text-white">${objName}</div>
      <small class="text-white">Progress: <span id="objectiveProgressText${i}">${objectives[i].progress}%</span></small>
    `;
  }

  missionCounterText.innerHTML = "Mission: 1";
  genSOMissionCompleteModalContent(objectives);
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (isMissionSucceeded) {
    for (let i = 0; i < currentObjectives.length; i++) {
      let val;
      // if (currentObjectives[i].inputType === "check") {
      //   val = document.getElementById("objId-" + currentObjectives[i].id).value;
      // }
      val = parseInt(
        document.getElementById("objId-" + currentObjectives[i].id).value,
        10
      );
      currentObjectives[i].progress += val;
      const progressText = document.getElementById("objectiveProgressText" + i);
      progressText.innerHTML = currentObjectives[i].progress;
    }

    // increment mission counter

    // if objectives met and mission counter > 3
    // genNewOperation
  }

  // set missionCounter back to start of operation
  if (!isMissionSucceeded) {
    console.log("failure");
  }
};

const getCurrentEnemy = (planet) => {
  if (planet.faction === "Humans") {
    return planet.planet.currentOwner;
  }
  return planet.faction;
};

const displaySpecialistLoadout = () => {
  specialistNameText.innerText = currentSpecialist.displayName;
  const primaryObj = primaries.find(
    (obj) => obj.displayName === currentSpecialist.primary[0]
  );
  const secondaryObj = secondaries.find(
    (obj) => obj.displayName === currentSpecialist.secondary[0]
  );
  const throwObj = throwables.find(
    (obj) => obj.displayName === currentSpecialist.throwable[0]
  );
  const armorObj = armorPassives.find(
    (obj) => obj.displayName === currentSpecialist.armorPassive[0]
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

const startNewRun = async () => {
  // clear the slate
  missionCounter = 1;
  currentPlanet = null;
  currentEnemy = null;
  currentSpecialist = null;
  currentObjectives = null;

  // get a specialist, objective list, and planet
  genNewOperation();

  // save the randomly selected objectives, planet, and specialist to ls
  // so user doesnt cycle through specialists
  saveProgress();
};

const populateWebPage = () => {
  planetNameText.innerHTML = currentPlanet.planet.name;
  enemyNameText.innerHTML = currentEnemy;

  displaySpecialistLoadout();

  for (let i = 0; i < currentObjectives.length; i++) {
    const objName = currentObjectives[i].name.replace(
      "X",
      currentObjectives[i].goal
    );
    objectivesContainer.innerHTML += `
      <div class="text-white">${objName}</div>
      <small class="text-white">Progress: <span id="objectiveProgressText">${currentObjectives[i].progress}%</span></small>
    `;
  }

  missionCounterText.innerHTML = "Mission: 1";
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

// probably want to run this on a timer. every five minutes or so, and whenever the page loads
uploadSaveData();

// https://api.helldivers2.dev/api/v1/war         -o 801_war_v1.json
// https://api.helldivers2.dev/api/v1/planets     -o 801_planets_v1.json
// https://api.helldivers2.dev/api/v1/assignments -o 801_assignments_v1.json
// https://api.helldivers2.dev/api/v1/campaigns   -o 801_campaigns_v1.json
// https://api.helldivers2.dev/api/v1/dispatches
