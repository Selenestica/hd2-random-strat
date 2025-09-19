const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");
const boosterContainer = document.getElementById("boosterContainer");
const rollStratsButton = document.getElementById("rollStratsButton");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");
const superCitizenCheckBox = document.getElementById("warbond0");
const oneSupportCheck = document.getElementById("oneSupportCheck");
const oneBackpackCheck = document.getElementById("oneBackpackCheck");
const alwaysSupportCheck = document.getElementById("alwaysSupportCheck");
const alwaysBackpackCheck = document.getElementById("alwaysBackpackCheck");
const viewItemsModal = document.getElementById("viewItemsModal");
const viewItemsModalBody = document.getElementById("viewItemsModalBody");
const viewItemsModalTitle = document.getElementById("viewItemsModalTitle");

const supplyAmountOptions = [
  oneSupportCheck,
  oneBackpackCheck,
  alwaysBackpackCheck,
  alwaysSupportCheck,
];

let stratsList = [...STRATAGEMS];
let primsList = [...PRIMARIES];
let secondsList = [...SECONDARIES];
let throwsList = [...THROWABLES];
let boostsList = [...BOOSTERS];
let armorPassivesList = [...ARMOR_PASSIVES];

let rolledStrats = [];

let workingPrimsList = [];
let workingSecondsList = [];
let workingThrowsList = [];
let workingBoostsList = [];
let workingStratsList = [];
let workingArmorPassivesList = [];
let missionsFailed = 0;
let currentStratagems = [];
let currentPrimary = null;
let currentSecondary = null;
let currentThrowable = null;
let currentArmorPassive = null;
let currentBooster = null;

let oneBackpack = false;
let oneSupportWeapon = false;
let alwaysBackpack = false;
let alwaysSupport = false;

const disableOtherRadios = (radio) => {
  oneSupportCheck.disabled = true;
  oneBackpackCheck.disabled = true;
  alwaysBackpackCheck.disabled = true;
  alwaysSupportCheck.disabled = true;
  for (let i = 0; i < stratOptionRadios.length; i++) {
    if (stratOptionRadios[i].name !== radio) {
      stratOptionRadios[i].disabled = true;
    }
  }
};

const enableRadios = () => {
  oneSupportCheck.disabled = false;
  oneBackpackCheck.disabled = false;
  alwaysBackpackCheck.disabled = false;
  alwaysSupportCheck.disabled = false;
  for (let i = 0; i < stratOptionRadios.length; i++) {
    stratOptionRadios[i].disabled = false;
  }
};

// when the items modal closes, clear it
viewItemsModal.addEventListener("hidden.bs.modal", () => {
  viewItemsModalBody.innerHTML = "";
});

for (let z = 0; z < warbondCheckboxes.length; z++) {
  warbondCheckboxes[z].addEventListener("change", (e) => {
    // now do the front end stuff
    if (e.target.checked && !warbondCodes.includes(e.srcElement.id)) {
      warbondCodes.push(e.srcElement.id);
    }
    if (!e.target.checked && warbondCodes.includes(e.srcElement.id)) {
      const indexToRemove = warbondCodes.indexOf(e.srcElement.id);
      warbondCodes.splice(indexToRemove, 1);
    }
    filterItemsByWarbond();
  });
}

const filterItemsByWarbond = async () => {
  const itemsList = [
    primsList,
    secondsList,
    throwsList,
    boostsList,
    stratsList,
    armorPassivesList,
  ];
  for (let i = 0; i < itemsList.length; i++) {
    let tempList = [...itemsList[i]];
    itemsList[i] = await tempList.filter(
      (item) =>
        warbondCodes.includes(item.warbondCode) || item.warbondCode === "none"
    );
    if (i === 0) {
      workingPrimsList = itemsList[i];
    } else if (i === 1) {
      workingSecondsList = itemsList[i];
    } else if (i === 2) {
      workingThrowsList = itemsList[i];
    } else if (i === 3) {
      workingBoostsList = itemsList[i];
    } else if (i === 4) {
      workingStratsList = itemsList[i];
    } else if (i === 5) {
      workingArmorPassivesList = itemsList[i];
    } else if (i === 6) {
      workingArmorSetsList = itemsList[i];
    }
  }
};

const categoryMap = (item) => {
  let cat = item.category;
  let imgDir = "equipment";
  if (cat === "armor") {
    imgDir = "armorpassives";
  }
  if (item.type === "Stratagem") {
    imgDir = "svgs";
    cat = "stratagem";
  }

  return { imgDir, cat };
};

const generateMainItemCard = (item) => {
  const { imgDir, cat } = categoryMap(item);
  return `
    <div class="col-3 px-1 d-flex justify-content-center">
      <div class="card itemCards" 
        onclick="genItemsModalContent('${cat}')"
      >
        <img
            src="../images/${imgDir}/${item.imageURL}"
            class="img-card-top"
            alt="${item.displayName}"
            id="${item.internalName}-randImage"
        />
        <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
            <p id="${item.internalName}-randName" class="text-center card-title text-white">${item.displayName}</p>
        </div>
      </div>
    </div>
  `;
};

// will need to give these functions eventually so that they can set them manually
const generateModalItemCard = (item) => {
  const { imgDir, cat } = categoryMap(item);
  return `
    <div class="card d-flex col-3 col-lg-2 soItemCards mx-1">
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
          <p class="card-title text-white" style="font-size: small;">${item.displayName}</p>
      </div>
    </div>`;
};

const genItemsModalContent = async (cat) => {
  let list = [];
  if (cat === "secondary") {
    list = workingSecondsList;
    viewItemsModalTitle.innerHTML = "Secondaries";
  }
  if (cat === "primary") {
    list = workingPrimsList;
    viewItemsModalTitle.innerHTML = "Primaries";
  }
  if (cat === "stratagem") {
    list = workingStratsList;
    viewItemsModalTitle.innerHTML = "Stratagems";
  }
  if (cat === "throwable") {
    list = workingThrowsList;
    viewItemsModalTitle.innerHTML = "Throwables";
  }
  if (cat === "armor") {
    list = workingArmorPassivesList;
    viewItemsModalTitle.innerHTML = "Armor Passives";
  }
  if (cat === "booster") {
    list = workingBoostsList;
    viewItemsModalTitle.innerHTML = "Boosters";
  }
  const unlockedArray = await list.filter((item) => item.locked === false);
  viewItemsModalTitle.innerHTML += `<span class="mx-2">(${unlockedArray.length}/${list.length} unlocked)</span>`;
  for (let i = 0; i < list.length; i++) {
    viewItemsModalBody.innerHTML += generateModalItemCard(list[i]);
  }
  const modal = new bootstrap.Modal(viewItemsModal);
  modal.show();
};

const rollStratagems = async () => {
  // get random numbers that arent the same and get the strats at those indices
  stratagemsContainer.innerHTML = "";

  // if support/backpack checkbox is checked and enabled, then account for those
  const oneSupportWeapon = oneSupportCheck.checked && !oneSupportCheck.disabled;
  const oneBackpack = oneBackpackCheck.checked && !oneBackpackCheck.disabled;
  let alwaysBackpack =
    alwaysBackpackCheck.checked && !alwaysBackpackCheck.disabled;
  let alwaysSupport =
    alwaysSupportCheck.checked && !alwaysSupportCheck.disabled;
  // if no more backpacks/support weapons to unlock and not all stratagems are unlocked
  // alwaysBackPack = false
  // alwaysSupport = false

  const lockedStrats = await workingStratsList.filter(
    (strat) => strat.locked === true
  );

  const randomUniqueNumbers = getRandomUniqueNumbers(
    lockedStrats,
    oneSupportWeapon,
    oneBackpack,
    alwaysBackpack,
    alwaysSupport,
    4
  );

  currentStratagems = [];
  for (let i = 0; i < randomUniqueNumbers.length; i++) {
    let stratagem = lockedStrats[randomUniqueNumbers[i]];
    currentStratagems.push(stratagem);
    rolledStrats.push(stratagem.internalName);
    stratagemsContainer.innerHTML += generateMainItemCard(stratagem);
  }
};

const rollEquipment = async () => {
  equipmentContainer.innerHTML = "";
  boosterContainer.innerHTML = "";
  let container = equipmentContainer;
  const equipmentLists = [
    workingPrimsList,
    workingSecondsList,
    workingThrowsList,
    workingArmorPassivesList,
    workingBoostsList,
  ];

  for (let i = 0; i < equipmentLists.length; i++) {
    const lockedItems = await equipmentLists[i].filter(
      (equip) => equip.locked === true
    );
    const randomNumber = Math.floor(Math.random() * lockedItems.length);
    let equipment = lockedItems[randomNumber];
    if (i === 0) {
      currentPrimary = equipment;
    }
    if (i === 1) {
      currentSecondary = equipment;
    }
    if (i === 2) {
      currentThrowable = equipment;
    }
    if (i === 3) {
      currentArmorPassive = equipment;
    }
    if (i === 4) {
      container = boosterContainer;
      currentBooster = equipment;
    }
    container.innerHTML += generateMainItemCard(equipment);
  }
};

const getRandomUniqueNumbers = (
  list,
  oneSupportWeapon,
  oneBackpack,
  alwaysBackpack,
  alwaysSupport,
  amt
) => {
  let hasVehicle = false;
  let hasBackpack = false;
  let hasSupportWeapon = false;
  let numbers = [];
  let randomNumber = null;
  while (numbers.length < amt) {
    randomNumber = Math.floor(Math.random() * list.length);
    const tags = list[randomNumber].tags;
    if (
      (tags.includes("Weapons") && hasSupportWeapon && oneSupportWeapon) ||
      (tags.includes("Backpacks") && hasBackpack && oneBackpack) ||
      (tags.includes("Vehicles") && hasVehicle) ||
      numbers.includes(randomNumber) ||
      (!hasBackpack && alwaysBackpack && !tags.includes("Backpacks"))
    ) {
      continue;
    } else {
      if (tags.includes("Vehicles")) {
        hasVehicle = true;
        numbers.push(randomNumber);
        continue;
      }
      if (!hasSupportWeapon && oneSupportWeapon && tags.includes("Weapons")) {
        numbers.push(randomNumber);
        hasSupportWeapon = true;
        if (tags.includes("Backpacks")) {
          hasBackpack = true;
        }
        continue;
      } else if (!hasBackpack && oneBackpack && tags.includes("Backpacks")) {
        numbers.push(randomNumber);
        hasBackpack = true;
        if (tags.includes("Weapons")) {
          hasSupportWeapon = true;
        }
        continue;
      } else if (alwaysBackpack && tags.includes("Backpacks")) {
        numbers.push(randomNumber);
        hasBackpack = true;
        if (tags.includes("Weapons")) {
          hasSupportWeapon = true;
        }
        continue;
      } else if (alwaysSupport && tags.includes("Weapons")) {
        numbers.push(randomNumber);
        hasSupportWeapon = true;
        if (tags.includes("Backpacks")) {
          hasBackpack = true;
        }
        continue;
      }
      if (!hasSupportWeapon && alwaysSupport && !tags.includes("Weapons")) {
        continue;
      }
      numbers.push(randomNumber);
    }
  }
  return numbers;
};

const saveProgress = async () => {
  let obj = {
    workingStratsList,
    workingPrimsList,
    workingSecondsList,
    workingThrowsList,
    workingArmorPassivesList,
    workingBoostsList,
    seesRulesOnOpen: false,
    dataName: `Randomizer Marathon Save Data`,
    warbondCodes,
    missionsFailed,
    currentStratagems,
    currentArmorPassive,
    currentBooster,
    currentPrimary,
    currentSecondary,
    currentThrowable,
  };
  localStorage.setItem("randomizerMarathonSaveData", JSON.stringify(obj));
};

const unlockItem = (item, list) => {
  list.map((workingItem) => {
    if (item.displayName === workingItem.displayName) {
      workingItem.locked = false;
    }
  });
};

const missionComplete = async () => {
  const currentItemsArray = [
    currentStratagems,
    currentArmorPassive,
    currentBooster,
    currentPrimary,
    currentSecondary,
    currentThrowable,
  ];
  for (let i = 0; i < currentItemsArray.length; i++) {
    const current = currentItemsArray[i];
    if (i === 0) {
      for (let j = 0; j < current.length; j++) {
        const cStrat = current[j];
        unlockItem(cStrat, workingStratsList);
      }
    }
    if (i === 1) {
      unlockItem(current, workingArmorPassivesList);
    }
    if (i === 2) {
      unlockItem(current, workingBoostsList);
    }
    if (i === 3) {
      unlockItem(current, workingPrimsList);
    }
    if (i === 4) {
      unlockItem(current, workingSecondsList);
    }
    if (i === 5) {
      unlockItem(current, workingThrowsList);
    }
  }

  randomizeAll();
};

const missionFailed = () => {
  missionsFailed++;
  randomizeAll();
};

const randomizeAll = async () => {
  await rollEquipment();
  await rollStratagems();
  saveProgress();
};

const startNewRun = async () => {
  await lockAllItems();
  await filterItemsByWarbond();
  randomizeAll();
};

const uploadSaveData = async () => {
  const randomizerMarathonSaveData = localStorage.getItem(
    "randomizerMarathonSaveData"
  );
  if (randomizerMarathonSaveData) {
    const data = JSON.parse(randomizerMarathonSaveData);
    warbondCodes = data.warbondCodes ?? warbondCodes;
    workingStratsList = data.workingStratsList;
    workingPrimsList = data.workingPrimsList;
    workingSecondsList = data.workingSecondsList;
    workingThrowsList = data.workingThrowsList;
    workingBoostsList = data.workingBoostsList;
    workingArmorPassivesList = data.workingArmorPassivesList;
    seesRulesOnOpen = data.seesRulesOnOpen;
    missionCounter = data.missionCounter;
    currentStratagems = data.currentStratagems;
    currentArmorPassive = data.currentArmorPassive;
    currentBooster = data.currentBooster;
    currentPrimary = data.currentPrimary;
    currentSecondary = data.currentSecondary;
    currentThrowable = data.currentThrowable;
    missionsFailed = data.missionsFailed ?? 0;
    missionTimes = data.missionTimes ?? [];

    // populate the page with the uploaded data here
    // equipment
    const currentEquipment = [
      currentPrimary,
      currentSecondary,
      currentThrowable,
      currentArmorPassive,
      currentBooster,
    ];
    let container = equipmentContainer;
    for (let i = 0; i < currentEquipment.length; i++) {
      if (i === 4) {
        container = boosterContainer;
      }
      container.innerHTML += generateMainItemCard(currentEquipment[i]);
    }

    // stratagems
    for (let j = 0; j < currentStratagems.length; j++) {
      stratagemsContainer.innerHTML += generateMainItemCard(
        currentStratagems[j]
      );
    }

    const missingWarbondCodes = masterWarbondCodes.filter(
      (code) => !warbondCodes.includes(code)
    );
    for (let i = 0; i < missingWarbondCodes.length; i++) {
      document.getElementById(missingWarbondCodes[i]).checked = false;
    }
    return;
  }
  startNewRun();
};

const lockAllItems = async () => {
  const allItems = [
    stratsList,
    primsList,
    secondsList,
    armorPassivesList,
    boostsList,
    throwsList,
  ].flat();
  await allItems.map((item) => {
    item.locked = true;
  });
};

uploadSaveData();
