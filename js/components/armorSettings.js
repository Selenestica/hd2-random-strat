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
    { el: armorPassiveCheck, list: armorPassivesList },
  ];
  for (let i = 0; i < armorChecks.length; i++) {
    if (armorChecks[i].el.classList.contains("active")) {
      return armorChecks[i];
    }
  }
};

const rollArmor = async () => {
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
          <div class="col-2 d-flex justify-content-center">
            <div class="card itemCards armorLogo" 
              onclick="holdToChangeItem('${rolledArmor.internalName}', 'stratagem')"
            >
                ${armorImage}
            </div>
          </div>
          <div class="col-10 d-flex justify-content-start">
              <div class="card-body d-flex align-items-center">
                  <p class="card-title text-white">${rolledArmor.displayName}</p>
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

const getArmorSizeIcon = async (size) => {
  if (size === "light") {
    return `<i class="fa-solid armorSizeLogo p-1 d-flex justify-content-center fa-user-ninja"></i>`;
  } else if (size === "medium") {
    return `<i class="fa-solid armorSizeLogo p-1 d-flex justify-content-center fa-user"></i>`;
  }
  return `<i class="fa-solid armorSizeLogo p-1 d-flex justify-content-center fa-user-shield"></i>`;
};
