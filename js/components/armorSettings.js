const armorPassiveCheck = document.getElementById("armorPassiveCheck");
const armorSetCheck = document.getElementById("armorSetCheck");
const armorSizeCheck = document.getElementById("armorSizeCheck");
const armorContainer = document.getElementById("armorContainer");
let armorPassivesList = [...ARMOR_PASSIVES];
let armorSetsList = [...ARMOR_SETS];
let armorSizesList = [...ARMOR_SIZES];
let workingArmorPassivesList = [];
let workingArmorSetsList = [];

const getSelectedArmorRollType = () => {
  const armorChecks = [
    { el: armorSetCheck, list: workingArmorSetsList },
    { el: armorSizeCheck, list: armorSizesList },
    { el: armorPassiveCheck, list: workingArmorPassivesList },
  ];
  for (let i = 0; i < armorChecks.length; i++) {
    if (armorChecks[i].el.classList.contains("active")) {
      return armorChecks[i];
    }
  }
};

const rollArmor = async () => {
  proTipCounter += 1;
  if (proTipCounter === 3) {
    rollProTip();
  }
  const activeArmorList = await getSelectedArmorRollType();
  const randArmorIndex = Math.floor(
    Math.random() * activeArmorList.list.length
  );
  const rolledArmor = activeArmorList.list[randArmorIndex];
  let armorImage = `                    
                    <img
                        src="../images/armor/${rolledArmor.imageURL}"
                        class="img-card-top"
                        alt="${rolledArmor.displayName}"
                    />`;
  if (rolledArmor.tags.includes("ArmorSize")) {
    armorImage = await getArmorSizeIcon(rolledArmor.internalName);
  }
  armorContainer.innerHTML = `
          <div class="col-2 px-1 d-flex justify-content-center">
            <div class="card itemCards armorLogo" 
              onclick="rerollArmor('${rolledArmor.internalName}', 'armor')"
            >
                ${armorImage}
            </div>
          </div>
          <div class="col-10 px-0 d-flex justify-content-start">
              <div class="card-body d-flex align-items-center">
                  <p class="card-title text-white">${rolledArmor.displayName}</p>
              </div>
          </div>
    `;
};

const rerollArmor = async (intName, cat) => {
  // const itemImage = document.getElementById(`${intName}-randImage`);
  // const itemName = document.getElementById(`${intName}-randName`);
  // let newItem = null;
  // if (cat === 'primary') {
  //   const randomNumber = Math.floor(Math.random() * workingPrimsList.length);
  //   newItem = workingPrimsList[randomNumber];
  //   itemImage.src = `../images/equipment/${newItem.imageURL}`;
  //   itemName.innerText = newItem.displayName;
  // }
  console.log("Reroll armor here eventually, maybe?");
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

const getArmorSizeIcon = async (size) => {
  if (size === "light") {
    return `<i class="fa-solid armorSizeLogo p-1 d-flex justify-content-center fa-user-ninja"></i>`;
  } else if (size === "medium") {
    return `<i class="fa-solid armorSizeLogo p-1 d-flex justify-content-center fa-user"></i>`;
  }
  return `<i class="fa-solid armorSizeLogo p-1 d-flex justify-content-center fa-user-shield"></i>`;
};
