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
    const randArmorIndex = Math.floor(Math.random() * armorRollList.length);
    const rolledArmor = armorRollList[randArmorIndex];
    armorContainer.innerHTML = `
    <div class="col-12 d-flex justify-content-center">
        <div class="row d-flex justify-content-center">
            <div class="col-6 d-flex justify-co>
                <div class="card itemCards" 
                    onclick="holdToChangeItem('${rolledArmor.internalName}', '${rolledArmor.category}')"
                >
                    <img
                        src="./images/armorsets/${rolledArmor.imageURL}"
                        class="img-card-top"
                        alt="${rolledArmor.displayName}"
                    />
                </div>
            </div>
            <div class="col-6 mx-2 d-flex justify-content-center align-items-center">
                <p class="card-title text-white">${rolledArmor.displayName}</p>
            </div>
        </div>
    </div>
    `;
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
