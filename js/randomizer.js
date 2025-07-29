const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");
const rollStratsButton = document.getElementById("rollStratsButton");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");
const superCitizenCheckBox = document.getElementById("warbond0");
const oneSupportCheck = document.getElementById("oneSupportCheck");
const oneBackpackCheck = document.getElementById("oneBackpackCheck");
const onlyEaglesRadio = document.getElementById("onlyEaglesRadio");
const noEaglesRadio = document.getElementById("noEaglesRadio");
const defaultEaglesRadio = document.getElementById("defaultEaglesRadio");
const onlyOrbitalsRadio = document.getElementById("onlyOrbitalsRadio");
const noOrbitalsRadio = document.getElementById("noOrbitalsRadio");
const defaultOrbitalsRadio = document.getElementById("defaultOrbitalsRadio");
const onlyDefenseRadio = document.getElementById("onlyDefenseRadio");
const noDefenseRadio = document.getElementById("noDefenseRadio");
const defaultDefenseRadio = document.getElementById("defaultDefenseRadio");
const onlySupplyRadio = document.getElementById("onlySupplyRadio");
const noSupplyRadio = document.getElementById("noSupplyRadio");
const defaultSupplyRadio = document.getElementById("defaultSupplyRadio");

const stratOptionRadios = [
  onlyEaglesRadio,
  noEaglesRadio,
  defaultEaglesRadio,
  onlyOrbitalsRadio,
  noOrbitalsRadio,
  defaultOrbitalsRadio,
  onlyDefenseRadio,
  noDefenseRadio,
  defaultDefenseRadio,
  onlySupplyRadio,
  noSupplyRadio,
  defaultSupplyRadio,
];

const supplyAmountOptions = [oneSupportCheck, oneBackpackCheck];

let stratsList = [...STRATAGEMS];
let primsList = [...PRIMARIES];
let secondsList = [...SECONDARIES];
let throwsList = [...THROWABLES];
let boostsList = [...BOOSTERS];

let rolledStrats = [];

let workingPrimsList;
let workingSecondsList;
let workingThrowsList;
let workingBoostsList;
let workingStratsList;

let oneBackpack = false;
let oneSupportWeapon = false;

let checkedWarbonds = [
  "warbond0",
  "warbond1",
  "warbond2",
  "warbond3",
  "warbond4",
  "warbond5",
  "warbond6",
  "warbond7",
  "warbond8",
  "warbond9",
  "warbond10",
  "warbond11",
  "warbond12",
  "warbond13",
  "warbond14",
  "warbond15",
  "warbond16",
  "warbond17",
  "warbond18",
];

for (let y = 0; y < supplyAmountOptions.length; y++) {
  supplyAmountOptions[y].addEventListener("change", (e) => {
    updateLocalStorage(supplyAmountOptions[y], "supplyAmountOptions");
  });
}

for (let x = 0; x < stratOptionRadios.length; x++) {
  stratOptionRadios[x].addEventListener("change", (e) => {
    // update localStorage obj
    updateLocalStorage(stratOptionRadios[x], "stratagemOptions");

    // now do the front end stuff
    if (onlyEaglesRadio.checked) {
      disableOtherRadios("Eagle");
    } else if (onlyOrbitalsRadio.checked) {
      disableOtherRadios("Orbital");
    } else if (onlyDefenseRadio.checked) {
      disableOtherRadios("Defense");
    } else if (onlySupplyRadio.checked) {
      disableOtherRadios("Supply");
    } else {
      enableRadios();
    }
  });
}

const disableOtherRadios = (radio) => {
  oneSupportCheck.disabled = true;
  oneBackpackCheck.disabled = true;
  for (let i = 0; i < stratOptionRadios.length; i++) {
    if (stratOptionRadios[i].name !== radio) {
      stratOptionRadios[i].disabled = true;
    }
  }
};

const enableRadios = () => {
  oneSupportCheck.disabled = false;
  oneBackpackCheck.disabled = false;
  for (let i = 0; i < stratOptionRadios.length; i++) {
    stratOptionRadios[i].disabled = false;
  }
};

for (let z = 0; z < warbondCheckboxes.length; z++) {
  warbondCheckboxes[z].addEventListener("change", (e) => {
    // update localStorage obj
    updateLocalStorage(warbondCheckboxes[z], "warbondOptions");

    // now do the front end stuff
    if (e.target.checked && !checkedWarbonds.includes(e.srcElement.id)) {
      checkedWarbonds.push(e.srcElement.id);
    }
    if (!e.target.checked && checkedWarbonds.includes(e.srcElement.id)) {
      const indexToRemove = checkedWarbonds.indexOf(e.srcElement.id);
      checkedWarbonds.splice(indexToRemove, 1);
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
  ];
  for (let i = 0; i < itemsList.length; i++) {
    let tempList = [...itemsList[i]];
    itemsList[i] = await tempList.filter(
      (item) =>
        checkedWarbonds.includes(item.warbondCode) ||
        item.warbondCode === "none"
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
    }
  }
};

const rollStratagems = async () => {
  // get random numbers that arent the same and get the strats at those indices
  stratagemsContainer.innerHTML = "";

  // if oneSupportWeapon or oneBackpack is checked and enabled, then account for those
  const oneSupportWeapon = oneSupportCheck.checked && !oneSupportCheck.disabled;
  const oneBackpack = oneBackpackCheck.checked && !oneBackpackCheck.disabled;

  // if "only" or "no" strat type options checked, modify the strat list here
  const filteredStratList = await filterStratList();

  const randomUniqueNumbers = getRandomUniqueNumbers(
    filteredStratList,
    oneSupportWeapon,
    oneBackpack,
    4
  );

  for (let i = 0; i < randomUniqueNumbers.length; i++) {
    const stratagem = filteredStratList[randomUniqueNumbers[i]];
    rolledStrats.push(stratagem.internalName);
    stratagemsContainer.innerHTML += `
          <div class="col-3 px-1 d-flex justify-content-center">
            <div class="card itemCards" 
              onclick="rerollItem('${stratagem.internalName}', 'strat')"
            >
              <img
                  src="../images/svgs/${stratagem.imageURL}"
                  class="img-card-top"
                  alt="${stratagem.displayName}"
                  id="${stratagem.internalName}-randImage"
              />
              <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
                  <p id="${stratagem.internalName}-randName" class="card-title text-white">${stratagem.displayName}</p>
              </div>
            </div>
          </div>
        `;
  }
};

const rollEquipment = () => {
  equipmentContainer.innerHTML = "";
  const equipmentLists = [
    workingPrimsList ?? primsList,
    workingSecondsList ?? secondsList,
    workingThrowsList ?? throwsList,
    workingBoostsList ?? boostsList,
  ];

  for (let i = 0; i < equipmentLists.length; i++) {
    if (equipmentLists[i].length === 0) {
      equipmentContainer.innerHTML += `
              <div class="col-3 d-flex justify-content-center">
                <div class="card itemCards">
                </div>
              </div>
            `;
    } else {
      const randomNumber = Math.floor(Math.random() * equipmentLists[i].length);
      const equipment = equipmentLists[i][randomNumber];
      equipmentContainer.innerHTML += `
              <div class="col-3 px-1 d-flex justify-content-center">
                <div class="card itemCards"
                  onclick="rerollItem('${equipment.internalName}', '${equipment.category}')"
                >
                  <img
                      src="../images/equipment/${equipment.imageURL}"
                      class="img-card-top"
                      alt="${equipment.displayName}"
                      id="${equipment.internalName}-randImage"
                  />
                  <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
                      <p id="${equipment.internalName}-randName" class="card-title text-white">${equipment.displayName}</p>
                  </div>
                </div>
              </div>
            `;
    }
  }
};

const rerollItem = async (intName, cat) => {
  const itemImage = document.getElementById(`${intName}-randImage`);
  const itemName = document.getElementById(`${intName}-randName`);
  let newItem = null;
  if (cat === "strat") {
    const filteredStratList = await filterStratList();
    const oneSupportWeapon =
      oneSupportCheck.checked && !oneSupportCheck.disabled;
    const oneBackpack = oneBackpackCheck.checked && !oneBackpackCheck.disabled;
    while (newItem === null || rolledStrats.includes(newItem.internalName)) {
      const randomUniqueNumber = getRandomUniqueNumbers(
        filteredStratList,
        oneSupportWeapon,
        oneBackpack,
        1
      );
      newItem = filteredStratList[randomUniqueNumber];
    }
    itemImage.src = `../images/svgs/${newItem.imageURL}`;
    itemName.innerText = newItem.displayName;
  }
  if (cat === "primary") {
    const randomNumber = Math.floor(Math.random() * workingPrimsList.length);
    newItem = workingPrimsList[randomNumber];
    itemImage.src = `../images/equipment/${newItem.imageURL}`;
    itemName.innerText = newItem.displayName;
  }
  if (cat === "secondary") {
    const randomNumber = Math.floor(Math.random() * workingSecondsList.length);
    newItem = workingSecondsList[randomNumber];
    itemImage.src = `../images/equipment/${newItem.imageURL}`;
    itemName.innerText = newItem.displayName;
  }
  if (cat === "throwable") {
    const randomNumber = Math.floor(Math.random() * workingThrowsList.length);
    newItem = workingThrowsList[randomNumber];
    itemImage.src = `../images/equipment/${newItem.imageURL}`;
    itemName.innerText = newItem.displayName;
  }
  if (cat === "booster") {
    const randomNumber = Math.floor(Math.random() * workingBoostsList.length);
    newItem = workingBoostsList[randomNumber];
    itemImage.src = `../images/equipment/${newItem.imageURL}`;
    itemName.innerText = newItem.displayName;
  }
};

const filterStratList = async () => {
  let warbondFilteredStratList = workingStratsList ?? stratsList;
  let newList;
  let categoriesToFilter = [];
  const onlyRadios = [
    onlyDefenseRadio,
    onlyEaglesRadio,
    onlyOrbitalsRadio,
    onlySupplyRadio,
  ];
  const noRadios = [
    noDefenseRadio,
    noOrbitalsRadio,
    noEaglesRadio,
    noSupplyRadio,
  ];
  // check if a "only" radio is checked
  for (let i = 0; i < onlyRadios.length; i++) {
    if (onlyRadios[i].checked) {
      newList = await warbondFilteredStratList.filter(
        (strat) => strat.category === onlyRadios[i].name
      );
      return newList;
    }
  }

  // check if any "no" radios are checked and not disabled
  for (let j = 0; j < noRadios.length; j++) {
    if (noRadios[j].checked && !noRadios[j].disabled) {
      categoriesToFilter.push(noRadios[j].name);
    }
  }
  newList = await warbondFilteredStratList.filter(
    (strat) => !categoriesToFilter.includes(strat.category)
  );

  return newList;
};

const getRandomUniqueNumbers = (list, oneSupportWeapon, oneBackpack, amt) => {
  let hasVehicle = false;
  let hasBackpack = false;
  let hasSupportWeapon = false;
  let numbers = [];
  let randomNumber = null;
  while (numbers.length < amt) {
    randomNumber = Math.floor(Math.random() * list.length);
    const tags = list[randomNumber].tags;
    if (
      (tags.includes("Weapons") && hasSupportWeapon) ||
      (tags.includes("Backpacks") && hasBackpack) ||
      (tags.includes("Vehicles") && hasVehicle) ||
      numbers.includes(randomNumber)
    ) {
      continue;
    } else {
      if (tags.includes("Vehicles")) {
        hasVehicle = true;
        numbers.push(randomNumber);
        continue;
      }
      if (oneSupportWeapon && tags.includes("Weapons")) {
        numbers.push(randomNumber);
        hasSupportWeapon = true;
        if (tags.includes("Backpacks")) {
          hasBackpack = true;
        }
        continue;
      } else if (oneBackpack && tags.includes("Backpacks")) {
        numbers.push(randomNumber);
        hasBackpack = true;
        if (tags.includes("Weapons")) {
          hasSupportWeapon = true;
        }
        continue;
      }
      numbers.push(randomNumber);
    }
  }
  return numbers;
};

const updateLocalStorage = (element, type) => {
  const elID = element.id;
  const checked = element.checked;
  const randomizerOptions = JSON.parse(
    localStorage.getItem("randomizerOptions")
  );
  let tempInnerObj;
  let newObj;
  // if (type !== 'stratagemOptions') {
  tempInnerObj = {
    ...randomizerOptions[type],
    [elID]: checked,
  };
  newObj = {
    ...randomizerOptions,
    [type]: tempInnerObj,
  };
  // ok so if the user updates stratagems, then the other values need to be set to false
  localStorage.setItem("randomizerOptions", JSON.stringify(newObj));
  //   return;
  // }
  // tempInnerObj = {
  //   stratagemOptions: {
  //     ...randomizerOptions.stratagemOptions,
  //     [elID]: checked,
  //   },
  // };
  // newObj = {
  //   ...randomizerOptions,
  // };
};

const checkLocalStorageForOptionsPreferences = async () => {
  const randomizerOptions = localStorage.getItem("randomizerOptions");
  if (!randomizerOptions) {
    // create randomizerOptions object and put in local storage
    const obj = {
      warbondOptions: {
        warbond0: true,
        warbond1: true,
        warbond2: true,
        warbond3: true,
        warbond4: true,
        warbond5: true,
        warbond6: true,
        warbond7: true,
        warbond8: true,
        warbond9: true,
        warbond10: true,
        warbond11: true,
        warbond12: true,
        warbond13: true,
        warbond14: true,
        warbond15: true,
        warbond16: true,
        warbond17: true,
        warbond18: true,
      },
      stratagemOptions: {
        onlyEaglesRadio: false,
        noEaglesRadio: false,
        defaultEaglesRadio: true,
        onlyOrbitalsRadio: false,
        noOrbitalsRadio: false,
        defaultOrbitalsRadio: true,
        onlyDefenseRadio: false,
        noDefenseRadio: false,
        defaultDefenseRadio: true,
        onlySupplyRadio: false,
        noSupplyRadio: false,
        defaultSupplyRadio: true,
      },
      supplyAmountOptions: {
        oneBackpackCheck: false,
        oneSupportCheck: false,
      },
    };
    await localStorage.setItem("randomizerOptions", JSON.stringify(obj));
    return;
  }
  if (randomizerOptions) {
    const data = JSON.parse(randomizerOptions);
    const { warbondOptions, stratagemOptions, supplyAmountOptions } = data;
    const list = [warbondOptions, stratagemOptions, supplyAmountOptions];
    for (const outerKey in data) {
      for (const innerKey in data[outerKey]) {
        document.getElementById(innerKey).checked = data[outerKey][innerKey];
      }
    }
    await applyStoredOptionsToLists();
  }
};

const applyStoredOptionsToLists = () => {
  for (let i = 0; i < warbondCheckboxes.length; i++) {
    // now do the front end stuff
    const cb = warbondCheckboxes[i];
    if (cb.checked && !checkedWarbonds.includes(cb.id)) {
      checkedWarbonds.push(cb.id);
    }
    if (!cb.checked && checkedWarbonds.includes(cb.id)) {
      const indexToRemove = checkedWarbonds.indexOf(cb.id);
      checkedWarbonds.splice(indexToRemove, 1);
    }
  }
  filterItemsByWarbond();

  // will want to add the stratagems options here one day
};

const randomizeAll = async () => {
  await checkLocalStorageForOptionsPreferences();
  rollEquipment();
  rollStratagems();
  rollArmor();
};

randomizeAll();
