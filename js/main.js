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
const armorTypeButton = document.getElementById("armorTypeButton");

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

let maxStrats = 4;
let stratsList = [...stratagemsList];
let primsList = [...primariesList];
let secondsList = [...secondariesList];
let grensList = [...grenadesList];
let boostsList = [...boostersList];

let workingPrimsList;
let workingSecondsList;
let workingGrensList;
let workingBoostsList;

let oneBackpack = false;
let oneSupportWeapon = false;

let checkedWarbonds = [
    "warbond0",
    "warbond1",
    "warbond2",
    "warbond3",
    "warbond4",
    "warbond5"
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
        filterEquipment();
    });
}

const filterEquipment = async () => {
    const equipmentLists = [primsList, secondsList, grensList, boostsList];
    for (let i = 0; i < equipmentLists.length; i++) {
        let tempList = [...equipmentLists[i]];
        equipmentLists[i] = await tempList.filter(
            (equip) =>
                checkedWarbonds.includes(equip.warbondCode) ||
                equip.warbondCode === "default"
        );
        if (i === 0) {
            workingPrimsList = equipmentLists[i];
        } else if (i === 1) {
            workingSecondsList = equipmentLists[i];
        } else if (i === 2) {
            workingGrensList = equipmentLists[i];
        } else if (i === 3) {
            workingBoostsList = equipmentLists[i];
        }
    }
};

const setMaxStrats = (val) => {
    maxStrats = val;
    rollStratsButton.innerHTML = `Roll Stratagems (${val})`;
};

const rollArmor = () => {
    const armorTypes = ["Light", "Medium", "Heavy"];
    const randArmorIndex = Math.floor(Math.random() * armorTypes.length);
    const randArmorType = armorTypes[randArmorIndex];
    armorTypeButton.innerText = randArmorType;
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

    // will need to make the first arg below dynamic (3 or 4 or whatever)
    const randomUniqueNumbers = getRandomUniqueNumbers(
        maxStrats,
        filteredStratList,
        oneSupportWeapon,
        oneBackpack
    );

    for (let i = 0; i < randomUniqueNumbers.length; i++) {
        const stratagem = filteredStratList[randomUniqueNumbers[i]];
        stratagemsContainer.innerHTML += `
          <div class="col-3 d-flex justify-content-center">
            <div class="card itemCards" 
              onclick="setItemModalContent('${stratagem.internalName}', 'stratagem')"
              data-bs-toggle="modal"
              data-bs-target="#itemModal" 
            >
              <img
                  src="./images/stratagems/${stratagem.imageURL}"
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
                  data-bs-toggle="modal"
                  data-bs-target="#itemModal" 
                  onclick="setItemModalContent('${equipment.internalName}', '${equipment.category}')"
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
            newList = await stratsList.filter(
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
    newList = await stratsList.filter(
        (strat) => !categoriesToFilter.includes(strat.category)
    );
    return newList;
};

const getRandomUniqueNumbers = (
    max = 4,
    list,
    oneSupportWeapon,
    oneBackpack
) => {
    let hasBackpack = false;
    let hasSupportWeapon = false;
    let numbers = [];
    let randomNumber = null;
    while (numbers.length < max) {
        randomNumber = Math.floor(Math.random() * list.length);
        if (
            (list[randomNumber].tags.includes("Weapons") && hasSupportWeapon) ||
            (list[randomNumber].tags.includes("Backpacks") && hasBackpack) ||
            numbers.includes(randomNumber)
        ) {
            continue;
        } else {
            if (
                oneSupportWeapon &&
                list[randomNumber].tags.includes("Weapons")
            ) {
                numbers.push(randomNumber);
                hasSupportWeapon = true;
                if (list[randomNumber].tags.includes("Backpacks")) {
                    hasBackpack = true;
                }
                continue;
            } else if (
                oneBackpack &&
                list[randomNumber].tags.includes("Backpacks")
            ) {
                numbers.push(randomNumber);
                hasBackpack = true;
                if (list[randomNumber].tags.includes("Weapons")) {
                    hasSupportWeapon = true;
                }
                continue;
            }
            numbers.push(randomNumber);
        }
    }
    return numbers;
};
