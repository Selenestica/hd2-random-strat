const helmetsList = document.getElementById("helmetsList");
const armorList = document.getElementById("armorList");
const capesList = document.getElementById("capesList");

const genImageModalContent = async () => {
  // will need to refactor armor sets and armor passives images into separate files
  //   const paths = ["armor", "helmets", "capes"];
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
  // display the item image in the modal or accordion item
  let style = "col-2";
  if (type === "helmets") {
    console.log("helmet");
  }
  if (type === "capes") {
    console.log("cape");
  }
  if (type === "armor") {
    console.log("armor");
  }
  style = "pcModalItemCards col-1";
  return `
    <div onclick="setItem(${item.internalName}, ${type})" class="card d-flex ${style} pcItemCards mx-1">
      <img
          src="../images/${type}/${item.internalName}.webp"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer p-0 align-items-center">
          <p class="card-title text-white">${item.displayName}</p>
      </div>
    </div>`;
};

const setItem = (name, type) => {
  console.log(name, type);
};

genImageModalContent();
