const helmetsList = document.getElementById("helmetsList");
const armorList = document.getElementById("armorList");
const capesList = document.getElementById("capesList");
const helmetImg = document.getElementById("helmetImg");
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
  return `
    <div onclick="setItem('${item.internalName}', '${type}')" class="card d-flex col-2 pcItemCards cursorPointer mx-1 my-1">
      <img
          src="../images/${type}/${item.internalName}.webp"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer p-0 align-items-center">
          <p class="card-title text-white" style="font-size: small">${item.displayName}</p>
      </div>
    </div>`;
};

const setItem = async (name, type) => {
  if (type === "helmets") {
    helmetImg.src = `../images/helmets/${name}.webp`;
    const helmetObjs = await HELMETS.filter(
      (helm) => helm.internalName === name
    );
    helmetNameText.innerHTML = helmetObjs[0].displayName;
  }
  if (type === "capes") {
    capeImg.src = `../images/capes/${name}.webp`;
    const capeObjs = await CAPES.filter((cape) => cape.internalName === name);
    capeNameText.innerHTML = capeObjs[0].displayName;
  }
  if (type === "armor") {
    armorImg.src = `../images/armor/${name}.webp`;
    armorNameText.innerHTML = dName;
    const armorObjs = await ARMOR_SETS.filter(
      (armor) => armor.internalName === name
    );
    const { armorRating, speed, stamina, passive, tags, warbondCode } =
      armorObjs[0];
    passiveNameText.innerHTML = passive;
    protectionValueText.innerHTML = armorRating;
    speedValueText.innerHTML = speed;
    staminaValueText.innerHTML = stamina;
    typeValueText.innerHTML = tags[0];
  }
};

genImageDrawerContent();
