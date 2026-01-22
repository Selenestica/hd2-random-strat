const helmetsList = document.getElementById("helmetsList");
const armorList = document.getElementById("armorList");
const capesList = document.getElementById("capesList");
const helmetCard = document.getElementById("helmetCard");
const helmetImg = document.getElementById("helmetImg");
const helmetContainer = document.getElementById("helmetContainer");
const armorImg = document.getElementById("armorImg");
const capeImg = document.getElementById("capeImg");
const infoContainer = document.getElementById("infoContainer");
const armorNameText = document.getElementById("armorNameText");
const helmetNameText = document.getElementById("helmetNameText");
const capeNameText = document.getElementById("capeNameText");
const passiveNameText = document.getElementById("passiveNameText");
const protectionValueText = document.getElementById("protectionValueText");
const speedValueText = document.getElementById("speedValueText");
const staminaValueText = document.getElementById("staminaValueText");
const typeValueText = document.getElementById("typeValueText");
const armorDrawer = document.getElementById("armorDrawer");
const helmetDrawer = document.getElementById("helmetDrawer");
const capesDrawer = document.getElementById("capesDrawer");
const loadoutNameContainer = document.getElementById("loadoutNameContainer");
const loadoutEditNameContainer = document.getElementById(
  "loadoutEditNameContainer",
);
const loadoutNameText = document.getElementById("loadoutNameText");
const newLoadoutNameInput = document.getElementById("newLoadoutNameInput");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");
const helmetSearchInput = document.getElementById("helmetSearchInput");
const armorSearchInput = document.getElementById("armorSearchInput");
const capeSearchInput = document.getElementById("capeSearchInput");

let currentArmor = "b01tactical";
let currentHelmet = "b01tactical";
let currentCape = "foesmasher";
let currentLoadoutName = "Unnamed Set #1";

helmetSearchInput.addEventListener("input", () => {
  const itemCards = document.getElementsByClassName("helmetsCards");
  const query = helmetSearchInput.value.toLowerCase();

  Array.from(itemCards).forEach((item) => {
    const match = item.dataset.internalname.toLowerCase().includes(query);
    item.classList.toggle("d-none", !match);
  });
});

armorSearchInput.addEventListener("input", () => {
  const itemCards = document.getElementsByClassName("armorCards");
  const query = armorSearchInput.value.toLowerCase();

  Array.from(itemCards).forEach((item) => {
    const match = item.dataset.internalname.toLowerCase().includes(query);
    item.classList.toggle("d-none", !match);
  });
});

capeSearchInput.addEventListener("input", () => {
  const itemCards = document.getElementsByClassName("capesCards");
  const query = capeSearchInput.value.toLowerCase();

  Array.from(itemCards).forEach((item) => {
    const match = item.dataset.internalname.toLowerCase().includes(query);
    item.classList.toggle("d-none", !match);
  });
});

const editName = () => {
  loadoutNameContainer.classList.toggle("d-none", true);
  loadoutEditNameContainer.classList.toggle("d-none", false);
};

const submitLoadoutName = () => {
  loadoutNameContainer.classList.toggle("d-none", false);
  loadoutEditNameContainer.classList.toggle("d-none", true);
  loadoutNameText.innerHTML = newLoadoutNameInput.value;
  currentLoadoutName = newLoadoutNameInput.value;
  updateCurrentLoadout();
  genSaveDataManagementModalContent();
};

const saveLoadout = async () => {
  const data = localStorage.getItem("armorLabSaveData");

  // create data if none exists
  if (!data) {
    let newSaveObj = {
      armor: currentArmor,
      cape: currentCape,
      helmet: currentHelmet,
      name: currentLoadoutName,
      loadouts: [
        {
          armor: currentArmor,
          cape: currentCape,
          helmet: currentHelmet,
          name: currentLoadoutName,
        },
      ],
    };
    localStorage.setItem("armorLabSaveData", JSON.stringify(newSaveObj));
    return;
  }

  const parsedData = JSON.parse(data);
  let newData = { ...parsedData };
  if (!JSON.parse(data).loadouts) {
    localStorage.removeItem("armorLabSaveData");
    return;
  }

  // if user selects an older loadout and then changes it, the original loadout is kept
  // show a toast that the loadout was saved
  const newLoadoutSaveObj = {
    armor: currentArmor,
    cape: currentCape,
    helmet: currentHelmet,
    name: currentLoadoutName,
  };
  newData.loadouts.push(newLoadoutSaveObj);
  localStorage.setItem("armorLabSaveData", JSON.stringify(newData));
  showLoadoutSavedToast(currentLoadoutName);
  genSaveDataManagementModalContent();
};

const updateCurrentLoadout = async () => {
  const data = await localStorage.getItem("armorLabSaveData");
  // create data if none exists
  if (!data) {
    let newSaveObj = {
      armor: currentArmor,
      cape: currentCape,
      helmet: currentHelmet,
      name: currentLoadoutName,
      loadouts: [],
    };
    localStorage.setItem("armorLabSaveData", JSON.stringify(newSaveObj));
    return;
  }

  const parsedData = JSON.parse(data);
  let newData = { ...parsedData };
  newData.armor = currentArmor;
  newData.cape = currentCape;
  newData.helmet = currentHelmet;
  newData.name = currentLoadoutName;

  localStorage.setItem("armorLabSaveData", JSON.stringify(newData));
};

const uploadSaveData = async (saveIndex = null) => {
  // get ls data
  const data = await localStorage.getItem("armorLabSaveData");
  if (!data) {
    genImageDrawerContent();
    return;
  }

  // populate current loadout and save data modal here
  const parsedData = JSON.parse(data);
  const { armor, cape, helmet, name } =
    saveIndex === null ? parsedData : parsedData.loadouts[saveIndex];
  setItem(armor, "armor");
  setItem(cape, "capes");
  setItem(helmet, "helmets");
  loadoutNameText.innerHTML = name;
  currentLoadoutName = name;
  if (saveIndex === null) {
    genSaveDataManagementModalContent();
    genImageDrawerContent();
  }
};

const genImageDrawerContent = async () => {
  for (let i = 0; i < HELMETS.length; i++) {
    const helmetCard = await generateItemCard(HELMETS[i], "helmets");
    helmetsList.innerHTML += helmetCard;
  }
  for (let j = 0; j < ARMOR_SETS.length; j++) {
    const armorCard = await generateItemCard(ARMOR_SETS[j], "armor");
    armorList.innerHTML += armorCard;
  }
  for (let i = 0; i < CAPES.length; i++) {
    const capeCard = await generateItemCard(CAPES[i], "capes");
    capesList.innerHTML += capeCard;
  }
};

const generateItemCard = (item, type) => {
  // get width of screen
  const width = window.innerWidth;
  let closeDrawerFnc = "";
  if (width < 1200) {
    closeDrawerFnc = 'data-bs-dismiss="offcanvas"';
  }
  let armorTypeClass = "";
  let armorPassive = "";
  if (type === "armor") {
    armorTypeClass = item.tags[0];
    armorPassive = item.passive;
  }
  return `
    <div ${closeDrawerFnc} onclick="setItem('${item.internalName}', '${type}')" 
      class="card ${item.warbondCode} col-3 pcItemCards ${armorTypeClass} ${type}Cards cursorPointer mx-1 my-1"
      data-internalname="${item.internalName}"
      data-armorpassive="${armorPassive}"
    >
      <img
          src="../images/${type}/${item.internalName}.webp"
          class="img-card-top"
          alt="${item.displayName}"
          style="max-height: 100px"
      />
      <div class="card-body itemNameContainer p-0 align-items-center">
          <p class="card-title text-white" style="font-size: small">${item.displayName}</p>
      </div>
    </div>`;
};

const applySpecialRules = () => {
  // default styles
  helmetCard.style.clipPath = "inset(1px 25px 12px 22px)";
  helmetContainer.style.top = "11px";
  helmetContainer.style.left = "53.5%";
  helmetContainer.style.minWidth = "96px";
  armorImg.style.objectPosition = "center -40px";
  helmetImg.style.width = "100%";
  capeImg.style.width = "100%";

  // has an air filter that juts out
  if (currentHelmet === "ce27groundbreaker") {
    helmetCard.style.clipPath = "inset(1px 1px 12px 22px)";
  }

  // tall and skinny Redacted Regiment armors. hopefully they update them to be consistent witht he others soon
  const rrArmors = ["rs67nullcipher", "rs89shadowparagon"];
  if (rrArmors.includes(currentArmor)) {
    armorImg.style.maxHeight = "390px";
    helmetContainer.style.left = "53.5%";
    helmetContainer.style.top = "13.5px";
  }

  // the helmets are larger than the others for some reason
  const largeHelmets = [
    "rs6fienddestroyer",
    "rs89shadowparagon",
    "rs67nullcipher",
  ];
  if (largeHelmets.includes(currentHelmet)) {
    helmetImg.style.width = "84%";
    helmetContainer.style.top = "22px";
    helmetContainer.style.left = "55%";
  }

  // has a tall neck shield
  if (currentArmor === "fs55devastator") {
    helmetCard.style.clipPath = "inset(1px 25px 32px 22px)";
    helmetContainer.style.top = "28px";
    armorImg.style.objectPosition = "center -25px";
  }

  // these armors are short for some reason
  const shortSets = [
    "ds191scorpion",
    "ds10biggamehunter",
    "ds42federationsblade",
  ];
  if (shortSets.includes(currentArmor)) {
    helmetContainer.style.top = "21.5px";
  }

  // these capes are too skinny
  const skinnyCapes = ["pillaroftheabyss", "triangulationveil"];
  if (skinnyCapes.includes(currentCape)) {
    capeImg.style.width = "45%";
  }
};

const setItem = async (name, type) => {
  if (type === "helmets") {
    helmetImg.src = `../images/helmets/${name}.webp`;
    const helmetObjs = await HELMETS.filter(
      (helm) => helm.internalName === name,
    );
    helmetNameText.innerHTML = helmetObjs[0].displayName;
    currentHelmet = name;
  }
  if (type === "capes") {
    capeImg.src = `../images/capes/${name}.webp`;
    const capeObjs = await CAPES.filter((cape) => cape.internalName === name);
    capeNameText.innerHTML = capeObjs[0].displayName;
    currentCape = name;
  }
  if (type === "armor") {
    armorImg.src = `../images/armor/${name}.webp`;
    const armorObjs = await ARMOR_SETS.filter(
      (armor) => armor.internalName === name,
    );
    armorNameText.innerHTML = armorObjs[0].displayName;
    currentArmor = name;
    const { armorRating, speed, stamina, passive, tags } = armorObjs[0];
    passiveNameText.innerHTML = passive;
    protectionValueText.innerHTML = armorRating;
    speedValueText.innerHTML = speed;
    staminaValueText.innerHTML = stamina;
    typeValueText.innerHTML = tags[0];
  }
  applySpecialRules();
  updateCurrentLoadout();
};
