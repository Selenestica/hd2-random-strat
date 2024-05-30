const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");
const rollStratsButton = document.getElementById("rollStratsButton");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");
const superCitizenCheckBox = document.getElementById("warbond0");
const oneSupportCheck = document.getElementById("oneSupportCheck");
const oneBackpackCheck = document.getElementById("oneBackpackCheck");

let maxStrats = 4;
let stratsList = [...stratagemsList];
let primsList = [...primariesList];
let secondsList = [...secondariesList];
let grensList = [...grenadesList];

let workingPrimsList;
let workingSecondsList;
let workingGrensList;

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
    const equipmentLists = [primsList, secondsList, grensList];
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
        }
    }
};

const setMaxStrats = (val) => {
    maxStrats = val;
    rollStratsButton.innerHTML = `Roll Stratagems (${val})`;
};

const rollStratagems = () => {
    // get random numbers that arent the same and get the strats at those indices
    stratagemsContainer.innerHTML = "";

    // if oneSupportWeapon or oneBackpack is checked, then account for those
    const oneSupportWeapon = oneSupportCheck.checked;
    const oneBackpack = oneBackpackCheck.checked;

    // will need to make the first arg below dynamic (3 or 4 or whatever)
    const randomUniqueNumbers = getRandomUniqueNumbers(
        maxStrats,
        stratsList,
        oneSupportWeapon,
        oneBackpack
    );

    for (let i = 0; i < randomUniqueNumbers.length; i++) {
        const stratagem = stratsList[randomUniqueNumbers[i]];
        stratagemsContainer.innerHTML += `
          <div class="col-3 d-flex justify-content-center">
            <div class="card">
              <img
                  src="./images/stratagems/${stratagem.imageURL}"
                  class="img-card-top"
                  alt="${stratagem.displayName}"
              />
              <div class="card-body stratagemNameContainer align-items-center">
                  <p class="card-title">${stratagem.displayName}</p>
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
        workingGrensList ?? grensList
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
            category: "Primary",
            tags: ["SubmachineGun"],
            warbond: "Super Citizen",
            warbondCode: "warbond0",
            internalName: "mp98knight",
            imageURL: "mp98knight.png"
        });
    }
    for (let i = 0; i < equipmentLists.length; i++) {
        const randomNumber = Math.floor(
            Math.random() * equipmentLists[i].length
        );
        const equipment = equipmentLists[i][randomNumber];
        equipmentContainer.innerHTML += `
        <div class="col-3 d-flex justify-content-center">
          <div class="card">
            <img
                src="./images/equipment/${equipment.imageURL}"
                class="img-card-top"
                alt="${equipment.displayName}"
            />
            <div class="card-body stratagemNameContainer align-items-center">
                <p class="card-title">${equipment.displayName}</p>
            </div>
          </div>
        </div>
      `;
    }
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
