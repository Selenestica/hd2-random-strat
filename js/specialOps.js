const missionCompleteModalBody = document.getElementById(
  "missionCompleteModalBody"
);
const planetContainer = document.getElementById("planetContainer");
const objectivesContainer = document.getElementById("objectivesContainer");
const loadoutContainer = document.getElementById("loadoutContainer");
const planetDropdownList = document.getElementById("planetDropdownList");
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
let campaignsData = null;

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

const maxStarsNotEarned = async () => {
  missionCounter++;
  missionCounterText.innerHTML = `${getMissionText()}`;
  // save progress just for missionCounter
  const specialOpsSaveData = JSON.parse(
    localStorage.getItem("specialOpsSaveData")
  );
  const updatedSavedGames = await specialOpsSaveData.savedGames.map((sg) => {
    if (sg.currentGame === true) {
      sg.missionCounter = missionCounter;
      return sg;
    }
    return sg;
  });
  let newObj = {
    ...specialOpsSaveData,
    savedGames: updatedSavedGames,
  };
  localStorage.setItem("specialOpsSaveData", JSON.stringify(newObj));
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

const generateItemCard = (
  item,
  inModal,
  imgDir,
  currentItemIndex = null,
  type = null,
  missionFailed = false
) => {
  // display the item image in the modal or accordion item
  let style = "col-2";
  let modalTextStyle = "pcItemCardText";
  let fcn = "";
  let typeText = "";
  if (inModal) {
    style = "pcModalItemCards col-6";
    modalTextStyle = "";
    fcn = !missionFailed
      ? `claimItem(${currentItemIndex})`
      : `claimPunishment(${currentItemIndex})`;
    typeText = `<p class="card-title fst-italic text-white">${type}</p>`;
  }
  return `
    <div onclick="${fcn}" class="card d-flex ${style} pcItemCards mx-1">
    ${typeText}
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer align-items-center">
          <p class="card-title text-white ${modalTextStyle}">${item.displayName}</p>
      </div>
    </div>`;
};

const applySpecialist = async () => {
  if (specialist === null) {
    return;
  }
  specialistNameText.innerHTML = SPECIALISTS[specialist].displayName;
  saveProgress();
};

const saveProgress = async (item = null) => {
  let obj = {};
  const specialOpsSaveData = localStorage.getItem("specialOpsSaveData");
  if (!specialOpsSaveData) {
    obj = {
      savedGames: [
        {
          acquiredItems: item ? [item] : [],
          newStrats,
          newPrims,
          newSeconds,
          newThrows,
          newArmorPassives,
          newBoosts,
          seesRulesOnOpen: false,
          dataName: `${difficulty.toUpperCase()} | ${getMissionText()} | ${getCurrentDateTime()}${
            specialist !== null
              ? " | " + SPECIALISTS[specialist].displayName
              : ""
          }`,
          currentGame: true,
          missionCounter,
          specialist,
          difficulty,
        },
      ],
    };
    localStorage.setItem("specialOpsSaveData", JSON.stringify(obj));
    missionCounterText.innerHTML = `${getMissionText()}`;
    return;
  }
  const data = JSON.parse(specialOpsSaveData);
  const newSavedGames = await data.savedGames.map((sg) => {
    if (sg.currentGame === true) {
      let updatedItems = sg.acquiredItems;
      if (item) {
        updatedItems.push(item);
      }
      sg = {
        ...sg,
        currentItems,
        currentPunishmentItems,
        acquiredItems: updatedItems,
        newStrats,
        newPrims,
        newSeconds,
        newThrows,
        newArmorPassives,
        newBoosts,
        seesRulesOnOpen: false,
        dataName: sg.editedName
          ? sg.dataName
          : `${difficulty.toUpperCase()} | ${getMissionText()} | ${getCurrentDateTime()}${
              specialist !== null
                ? " | " + SPECIALISTS[specialist].displayName
                : ""
            }`,
        currentGame: true,
        missionCounter,
        specialist,
        difficulty,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedGames: newSavedGames,
  };
  missionCounterText.innerHTML = `${getMissionText()}`;
  localStorage.setItem("specialOpsSaveData", JSON.stringify(obj));
};

const fetchCampaignsData = async () => {
  try {
    const response = await fetch(
      "https://api.helldivers2.dev/api/v1/campaigns",
      {
        method: "GET",
        headers: {
          "X-Super-Client": "helldivers2challenges.com",
          "X-Super-Contact": "joebenwilson.dev@gmail.com",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

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
  const objectives = getRandomSpecialOpsObjectives(currentEnemy);
};

const submitMissionReport = async (isMissionSucceeded) => {
  if (isMissionSucceeded) {
    console.log("success!");
  }

  // set missionCounter back to start of operation
  if (!isMissionSucceeded) {
    console.log("failure");
  }
};

const startNewRun = async () => {
  // random planet
  const randPlanetNumber = Math.floor(Math.random() * campaignsData.length - 1);
  currentPlanet = campaignsData[randPlanetNumber];
  console.log(currentPlanet);

  // random specialist
  const randSpecialistNumber = Math.floor(
    Math.random() * SPECOPSSPECS.length - 1
  );
  specialist = SPECOPSSPECS[randSpecialistNumber];
  console.log(specialist);

  // random mission objectives
};

const uploadSaveData = async () => {
  const specialOpsSaveData = localStorage.getItem("specialOpsSaveData");
  if (specialOpsSaveData) {
    // do a check here to make sure the planet they were on is still available
    // if not, put a warning up that teammates may not be able to select that planet
    currentPlanet = specialOpsSaveData.currentPlanet;
    seesRulesOnOpen = specialOpsSaveData.seesRulesOnOpen;
    missionCounter = specialOpsSaveData.missionCounter;
    dataName = specialOpsSaveData.dataName;
    specialist = specialOpsSaveData.specialist;
    missionCounterText.innerHTML = `${getMissionText()}`;
    return;
  }
  // start a new run
  // get a random planet
  // get a random specialist
  // get random mission objectives
  await fetchCampaignsData();
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
