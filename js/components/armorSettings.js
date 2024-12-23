const armorPassiveCheck = document.getElementById("armorPassiveCheck");
const armorSetCheck = document.getElementById("armorSetCheck");
const armorSizeCheck = document.getElementById("armorSizeCheck");
const armorContainer = document.getElementById("armorContainer");
let armorPassivesList = [...ARMOR_PASSIVES];
let armorSetsList = [...ARMOR_SETS];
let armorSizesList = [...ARMOR_SIZES];

const getSelectedArmorRollType = () => {
    const armorChecks = [
        { el: armorSetCheck, list: armorSetsList },
        { el: armorSizeCheck, list: armorSizesList },
        { el: armorPassiveCheck, list: armorPassivesList }
    ];
    for (let i = 0; i < armorChecks.length; i++) {
        if (armorChecks[i].el.classList.contains("active")) {
            return armorChecks[i].list;
        }
    }
};

const rollArmor = async () => {
    const armorRollList = await getSelectedArmorRollType();
    console.log(armorRollList);
    const randArmorIndex = Math.floor(Math.random() * armorRollList.length);
    const randArmorType = armorRollList[randArmorIndex].displayName;
    armorContainer.innerText = randArmorType;
};

const setArmorRollType = (type) => {
    clearActiveArmorRollType();
    if (type === "passive") {
        armorPassiveCheck.classList.add("active");
    } else if (type === "size") {
        armorSizeCheck.classList.add("active");
    } else if (type === "set") {
        armorSetCheck.classList.add("active");
    }
};

const clearActiveArmorRollType = () => {
    const armorChecks = [armorSetCheck, armorSizeCheck, armorPassiveCheck];
    for (let i = 0; i < armorChecks.length; i++) {
        if (armorChecks[i].classList.contains("active")) {
            armorChecks[i].classList.remove("active");
            return;
        }
    }
};
