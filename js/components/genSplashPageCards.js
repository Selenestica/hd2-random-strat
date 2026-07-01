const challengeCardsContainer = document.getElementById(
  "challengeCardsContainer",
);
const toolCardsContainer = document.getElementById("toolCardsContainer");

const genSplashPageCards = (type) => {
  let container = challengeCardsContainer;
  let list = [
    {
      displayName: "Penitent Crusade",
      internalName: "penitentcrusade",
      icon: "skull-and-crossbones.svg",
    },
    {
      displayName: "Budget Blitz",
      internalName: "budgetblitz",
      icon: "dollar-circle-list.svg",
    },
    {
      displayName: "The Gauntlet",
      internalName: "thegauntlet",
      icon: "gauntlet3.webp",
    },
    {
      displayName: "Special Ops",
      internalName: "specialops",
      icon: "soldier.svg",
    },
    // {
    //   displayName: "Debt Divers",
    //   internalName: "debtdivers",
    //   icon: "bank.svg",
    // },
  ];
  if (type === "tools") {
    list = [
      {
        displayName: "Randomizer",
        internalName: "randomizer",
        icon: "dice.svg",
      },
      {
        displayName: "Tier List Maker",
        internalName: "tiermaker",
        icon: "list.svg",
      },
      {
        displayName: "Armor Lab",
        internalName: "armorlab",
        icon: "armor.svg",
      },
      {
        displayName: "Loadout Builder",
        internalName: "loadoutbuilder",
        icon: "tools.svg",
      },
    ];
    container = toolCardsContainer;
  }

  for (let i = 0; i < list.length; i++) {
    const li = list[i];
    const card = document.createElement("a");
    let iconStyle = "svgIconStyles";
    if (li.icon.includes(".webp")) {
      console.log("here");
      iconStyle = "webpIconStyles";
    }
    card.href = `./${li.internalName}`;
    card.className = `card col-4 col-lg-2 bg-none m-1 p-2 text-center challengeCards`;
    card.innerHTML = `
    <img class="img-fluid ${iconStyle}" src="../images/iconSVGs/${li.icon}" />
    <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
      <p class="card-title text-white pcItemCardText">${li.displayName}</p>
    </div>
  `;
    container.appendChild(card);
  }
};

genSplashPageCards("challenges");
genSplashPageCards("tools");
