const missionCompleteModalBody = document.getElementById('missionCompleteModalBody');
const maxStarsModalBody = document.getElementById('maxStarsModalBody');
const primaryAccordionBody = document.getElementById('PrimariesAccordionBody');
const secondaryAccordionBody = document.getElementById('SecondariesAccordionBody');
const stratagemAccordionBody = document.getElementById('StratagemsAccordionBody');
const throwableAccordionBody = document.getElementById('ThrowablesAccordionBody');
const armorPassiveAccordionBody = document.getElementById('ArmorsAccordionBody');
const boosterAccordionBody = document.getElementById('BoostersAccordionBody');
const buttonStratagem = document.getElementById('buttonStratagem');
const buttonPrimary = document.getElementById('buttonPrimary');
const buttonBooster = document.getElementById('buttonBooster');
const buttonSecondary = document.getElementById('buttonSecondary');
const buttonThrowable = document.getElementById('buttonThrowable');
const buttonArmor = document.getElementById('buttonArmor');
const flavorAndInstructionsModal = document.getElementById('flavorAndInstructionsModal');
const rewardModalBody = document.getElementById('rewardModalBody');
const rewardModalLabel = document.getElementById('rewardModalLabel');
const rewardModalHeaderItemName = document.getElementById('rewardModalHeaderItemName');
const tierBadgeHeader = document.getElementById('tierBadgeHeader');

let rerollSTierItem = true;
let numOfRerolls = 3;

let OGstratsList = [...STRATAGEMS];
let OGprimsList = [...PRIMARIES];
let OGsecondsList = [...SECONDARIES];
let OGthrowsList = [...THROWABLES];
let OGboostsList = [...BOOSTERS];
let OGarmorPassivesList = [...ARMOR_PASSIVES];

const starterStratNames = [
  'Orbital EMS Strike',
  'Orbital Smoke Strike',
  'Eagle Smoke Strike',
  'EMS Mortar Sentry',
  'Shield Generator Relay',
];
const starterPrimNames = ['Constitution'];
const starterSecNames = ['Peacemaker', 'Stun Lance', 'Stun Baton', 'Combat Hatchet'];
const starterThrowNames = ['G-12 High Explosive'];
const starterArmorPassiveNames = ['Extra Padding'];

// remove starter items from the lists
// create default item lists for later use
const newStrats = OGstratsList.filter((strat) => {
  return !starterStratNames.includes(strat.displayName);
});
const defaultStrats = OGstratsList.filter((strat) => {
  return starterStratNames.includes(strat.displayName);
});

const newPrims = OGprimsList.filter((prim) => {
  return !starterPrimNames.includes(prim.displayName);
});
const defaultPrims = OGprimsList.filter((prim) => {
  return starterPrimNames.includes(prim.displayName);
});

const newSecondaries = OGsecondsList.filter((sec) => {
  return !starterSecNames.includes(sec.displayName);
});
const defaultSeconds = OGsecondsList.filter((sec) => {
  return starterSecNames.includes(sec.displayName);
});

const newThrows = OGthrowsList.filter((throwable) => {
  return !starterThrowNames.includes(throwable.displayName);
});
const defaultThrows = OGthrowsList.filter((throwable) => {
  return starterThrowNames.includes(throwable.displayName);
});

const newArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
  return !starterArmorPassiveNames.includes(armorPassive.displayName);
});
const defaultArmorPassives = OGarmorPassivesList.filter((armorPassive) => {
  return starterArmorPassiveNames.includes(armorPassive.displayName);
});

const newBoosts = OGboostsList;

const getRandomItem = (list) => {
  const item = list[Math.floor(Math.random() * list.length)];
  // reroll s tier items one time
  if (item.tier === 's' && rerollSTierItem && numOfRerolls > 0) {
    rerollSTierItem = false;
    numOfRerolls--;
    return getRandomItem(list);
  }
  rerollSTierItem = true;
  return item;
};

const generateItemCard = (item, inModal, imgDir) => {
  // set the modal header to the item name and tier
  rewardModalHeaderItemName.innerHTML = item.displayName;
  tierBadgeHeader.innerHTML = item.tier;

  // display the item image in the modal or accordion item
  let modalStyle = '';
  let modalTextStyle = 'pcItemCardText';
  if (inModal) {
    modalStyle = 'pcModalItemCards';
    modalTextStyle = '';
  }
  return `
    <div class="card d-flex col-2 ${modalStyle} pcItemCards">
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer align-items-center">
          <p class="card-title text-white ${modalTextStyle}">${item.displayName}</p>
      </div>
    </div>`;
};

// this isnt working and i have no idea why
const checkIfListIsEmpty = (list, button) => {
  if (list.length === 0) {
    button.classList.add('disabled');
  }
};

const removeItemFromList = (list, item, button) => {
  const index = list.indexOf(item);
  if (index > -1) {
    list.splice(index, 1);
  }
  checkIfListIsEmpty(list, button);
};

// logic for rolling mission complete rewards
const rollPCReward = (rewardType, modalType) => {
  let button;
  let list;
  let accBody;
  let imgURL;
  if (modalType === 'a') {
    if (rewardType === '0') {
      button = buttonStratagem;
      list = newStrats;
      accBody = stratagemAccordionBody;
      imgURL = 'svgs';
    }
    if (rewardType === '1') {
      button = buttonPrimary;
      list = newPrims;
      accBody = primaryAccordionBody;
      imgURL = 'equipment';
    }
    if (rewardType === '2') {
      button = buttonBooster;
      list = newBoosts;
      accBody = boosterAccordionBody;
      imgURL = 'equipment';
    }
  }
  if (modalType === 'b') {
    if (rewardType === '0') {
      button = buttonSecondary;
      list = newSecondaries;
      accBody = secondaryAccordionBody;
      imgURL = 'equipment';
    }
    if (rewardType === '1') {
      button = buttonThrowable;
      list = newThrows;
      accBody = throwableAccordionBody;
      imgURL = 'equipment';
    }
    if (rewardType === '2') {
      button = buttonArmor;
      list = newArmorPassives;
      accBody = armorPassiveAccordionBody;
      imgURL = 'armor';
    }
  }
  const randomItem = getRandomItem(list);
  accBody.innerHTML += generateItemCard(randomItem, false, imgURL);
  rewardModalBody.innerHTML = generateItemCard(randomItem, true, imgURL);
  removeItemFromList(list, randomItem, button);
};

const genRewardModalBody = (modalType) => {
  let rewardOptions = [];
  if (modalType === 'a') {
    rewardOptions = ['Stratagem', 'Primary', 'Booster'];
  }
  if (modalType === 'b') {
    rewardOptions = ['Secondary', 'Throwable', 'Armor'];
  }

  for (let i = 0; i < rewardOptions.length; i++) {
    rewardModalBody.innerHTML += `
      <div class="justify-content-center">
        <button class="btn btn-primary m-1" onclick="rollPCReward('${i}', '${modalType}')" id="button${rewardOptions[i]}" type="button">
          ${rewardOptions[i]}
        </button>
      </div>
    `;
  }
};

const clearRewardModal = () => {
  rewardModalBody.innerHTML = '';
  tierBadgeHeader.innerHTML = '';
  rewardModalHeaderItemName.innerHTML = 'Choose One...';
  genRewardModalBody();
};

const addDefaultItemsToAccordions = () => {
  for (let i = 0; i < defaultStrats.length; i++) {
    stratagemAccordionBody.innerHTML += generateItemCard(defaultStrats[i], false, 'svgs');
  }
  for (let i = 0; i < defaultPrims.length; i++) {
    primaryAccordionBody.innerHTML += generateItemCard(defaultPrims[i], false, 'equipment');
  }
  for (let i = 0; i < defaultSeconds.length; i++) {
    secondaryAccordionBody.innerHTML += generateItemCard(defaultSeconds[i], false, 'equipment');
  }
  for (let i = 0; i < defaultThrows.length; i++) {
    throwableAccordionBody.innerHTML += generateItemCard(defaultThrows[i], false, 'equipment');
  }
  for (let i = 0; i < defaultArmorPassives.length; i++) {
    armorPassiveAccordionBody.innerHTML += generateItemCard(
      defaultArmorPassives[i],
      false,
      'armor',
    );
  }
  rewardModalHeaderItemName.innerHTML = 'Choose One...';
  tierBadgeHeader.innerHTML = '';
};

addDefaultItemsToAccordions();
