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
    defaultSupplyRadio
];

let stratsList = [...STRATAGEMS];
let primsList = [...PRIMARIES];
let secondsList = [...SECONDARIES];
let grensList = [...GRENADES];
let boostsList = [...BOOSTERS];

let workingPrimsList;
let workingSecondsList;
let workingGrensList;
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
    "warbond12"
];

for (let x = 0; x < stratOptionRadios.length; x++) {
    stratOptionRadios[x].addEventListener("change", (e) => {
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
        grensList,
        boostsList,
        stratsList
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
            workingGrensList = itemsList[i];
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
    const oneSupportWeapon =
        oneSupportCheck.checked && !oneSupportCheck.disabled;
    const oneBackpack = oneBackpackCheck.checked && !oneBackpackCheck.disabled;

    // if "only" or "no" strat type options checked, modify the strat list here
    const filteredStratList = await filterStratList();

    const randomUniqueNumbers = getRandomUniqueNumbers(
        filteredStratList,
        oneSupportWeapon,
        oneBackpack
    );

    for (let i = 0; i < randomUniqueNumbers.length; i++) {
        const stratagem = filteredStratList[randomUniqueNumbers[i]];
        stratagemsContainer.innerHTML += `
          <div class="col-3 d-flex justify-content-center">
            <div class="card itemCards" 
              onclick="holdToChangeItem('${stratagem.internalName}', 'stratagem')"
            >
              <img
                  src="./images/svgs/${stratagem.imageURL}"
                  class="img-card-top"
                  alt="${stratagem.displayName}"
              />
              <div class="card-body itemNameContainer align-items-center">
                  <p class="card-title text-white">${stratagem.displayName}</p>
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
        workingGrensList ?? grensList,
        workingBoostsList ?? boostsList
    ];

    // removes mp98 knight initially
    let scPrimariesList = workingPrimsList ?? primsList;
    if (!superCitizenCheckBox.checked) {
        for (let n = 0; n < scPrimariesList.length; n++) {
            if (scPrimariesList[n].internalName === "mp98knight") {
                scPrimariesList.splice(n, 1);
            }
        }
        // adds it in initially
    } else if (superCitizenCheckBox.checked) {
        scPrimariesList.push({
            displayName: "MP-98 Knight",
            type: "Equipment",
            category: "primary",
            tags: ["SubmachineGun"],
            warbond: "Super Citizen",
            warbondCode: "warbond0",
            internalName: "mp98knight",
            imageURL: "mp98knight.png"
        });
    }
    for (let i = 0; i < equipmentLists.length; i++) {
        if (equipmentLists[i].length === 0) {
            equipmentContainer.innerHTML += `
              <div class="col-3 d-flex justify-content-center">
                <div class="card itemCards">
                </div>
              </div>
            `;
        } else {
            const randomNumber = Math.floor(
                Math.random() * equipmentLists[i].length
            );
            const equipment = equipmentLists[i][randomNumber];
            equipmentContainer.innerHTML += `
              <div class="col-3 d-flex justify-content-center">
                <div class="card itemCards" 
                  onclick="holdToChangeItem('${equipment.internalName}', '${equipment.category}')"
                >
                  <img
                      src="./images/equipment/${equipment.imageURL}"
                      class="img-card-top"
                      alt="${equipment.displayName}"
                  />
                  <div class="card-body itemNameContainer align-items-center">
                      <p class="card-title text-white">${equipment.displayName}</p>
                  </div>
                </div>
              </div>
            `;
        }
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
        onlySupplyRadio
    ];
    const noRadios = [
        noDefenseRadio,
        noOrbitalsRadio,
        noEaglesRadio,
        noSupplyRadio
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

const getRandomUniqueNumbers = (list, oneSupportWeapon, oneBackpack) => {
    let hasVehicle = false;
    let hasBackpack = false;
    let hasSupportWeapon = false;
    let numbers = [];
    let randomNumber = null;
    const MAX_NUM_OF_STRATS = 4;
    while (numbers.length < MAX_NUM_OF_STRATS) {
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
