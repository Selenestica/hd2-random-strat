const looseItemsContainer = document.getElementById("looseItemsContainer");
const itemsSearchInput = document.getElementById("itemsSearchInput");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");

let OGarmorPassivesList = [...ARMOR_PASSIVES];
let OGstratsList = [...STRATAGEMS];
let OGprimsList = [...PRIMARIES];
let OGboostsList = [...BOOSTERS];
let OGsecondsList = [...SECONDARIES];
let OGthrowsList = [...THROWABLES];

//START PRE_CODE

const tiers = ["S", "A", "B", "C", "D"];

// Initialize tiers on page load
window.onload = () => {
  const container = document.getElementById("tierListContainer");
  tiers.forEach((label) => {
    const tier = document.createElement("div");
    tier.className = "tier text-white";
    tier.innerHTML = `
      <div class="tierLabel">${label}</div>
      <div class="tierCategories" data-tier="${label}" ondragover="allowDrop(event)" ondrop="drop(event)"></div>
    `;
    container.appendChild(tier);
  });

  // Add drag events to items
  //   makeItemsDraggable();

  // Optionally load from localStorage
  loadTierList();
};

const allowDrop = (e) => {
  e.preventDefault();
};

const drag = (e) => {
  e.dataTransfer.setData("text/plain", e.currentTarget.id);
};

const drop = (e) => {
  e.preventDefault();

  // Make sure we drop into the tier-items container itself
  let dropTarget = e.target;
  if (!dropTarget.classList.contains("tierCategories")) {
    dropTarget = dropTarget.closest(".tierCategories");
    if (!dropTarget) return; // just in case
  }

  const itemId = e.dataTransfer.getData("text");
  const draggedItem = document.getElementById(itemId);
  // Make sure draggedItem exists and is the card itself
  if (draggedItem && !draggedItem.contains(dropTarget)) {
    dropTarget.appendChild(draggedItem);
  }
};

// Save current tier list to localStorage
const saveTierList = () => {
  const data = {};
  document.querySelectorAll(".tierCategories").forEach((tier) => {
    const tierName = tier.getAttribute("data-tier");
    const items = [...tier.children].map((el) => el.textContent);
    data[tierName] = items;
  });

  // Also save unassigned items
  const unassigned = [
    ...document.querySelectorAll("#looseItemsContainer .tierItem"),
  ].map((el) => el.textContent);
  data["pool"] = unassigned;

  localStorage.setItem("tierListData", JSON.stringify(data));
  alert("Tier list saved!");
};

// Load from localStorage
const loadTierList = () => {
  const data = JSON.parse(localStorage.getItem("tierListData"));
  if (!data) return;

  // Clear all items
  document
    .querySelectorAll(".tierCategories, #looseItems")
    .forEach((container) => (container.innerHTML = ""));

  for (const tier in data) {
    const items = data[tier];
    items.forEach((text) => {
      const item = document.createElement("div");
      item.className = "tierItem";
      item.textContent = text;
      item.setAttribute("draggable", "true");
      item.id = `item-${Math.random().toString(36).substring(2, 9)}`;
      item.ondragstart = drag;

      if (tier === "pool") {
        document.getElementById("looseItemsContainer").appendChild(item);
      } else {
        const tierEl = document.querySelector(
          `.tierCategories[data-tier="${tier}"]`
        );
        if (tierEl) tierEl.appendChild(item);
      }
    });
  }
};

// Reset tier list
const resetTierList = () => {
  localStorage.removeItem("tierListData");
  location.reload();
};

//END PRE_CODE

for (let y = 0; y < warbondCheckboxes.length; y++) {
  warbondCheckboxes[y].addEventListener("change", (e) => {
    if (e.target.checked && !warbondCodes.includes(e.srcElement.id)) {
      warbondCodes.push(e.srcElement.id);
    }
    if (!e.target.checked && warbondCodes.includes(e.srcElement.id)) {
      const indexToRemove = warbondCodes.indexOf(e.srcElement.id);
      warbondCodes.splice(indexToRemove, 1);
    }
    filterItemsByWarbond();
  });
}

const filterItemsByWarbond = async (uploadingSaveData = null) => {
  const sourceLists = [
    OGprimsList,
    OGsecondsList,
    OGthrowsList,
    OGboostsList,
    OGstratsList,
    OGarmorPassivesList,
  ];

  const filteredLists = await sourceLists.map((list) =>
    list.filter(
      (item) =>
        warbondCodes.includes(item.warbondCode) || item.warbondCode === "none"
    )
  );

  [newPrims, newSeconds, newThrows, newBoosts, newStrats, newArmorPassives] =
    filteredLists;

  // when uploading save data, we want to uncheck any boxes that shouldnt be checked
  if (uploadingSaveData) {
    const missingWarbondCodes = masterWarbondCodes.filter(
      (code) => !warbondCodes.includes(code)
    );
    for (let i = 0; i < missingWarbondCodes.length; i++) {
      document.getElementById(missingWarbondCodes[i]).checked = false;
    }
  }
  // Refresh the shop UI
  looseItemsContainer.innerHTML = "";
  populateLooseItems();
};

// search bar functionality for loose items
// itemsSearchInput.addEventListener("input", () => {
//   const itemCards = document.getElementsByClassName("looseItemCards");
//   const query = itemsSearchInput.value.toLowerCase();

//   Array.from(itemCards).forEach((item) => {
//     const match = item.id.toLowerCase().includes(query);
//     item.classList.toggle("d-none", !match);
//   });
// });

const startNewTierList = async (isRestart = null) => {
  // probably want to set all warbond codes to checked just in case
  warbondCodes = [...masterWarbondCodes];
  for (let i = 0; i < warbondCheckboxes.length; i++) {
    warbondCheckboxes[i].checked = true;
  }

  // probably want to reset the filters too

  await filterItemsByWarbond();
};

const populateLooseItems = () => {
  const allItemsList = [
    newPrims,
    newStrats,
    newBoosts,
    newSeconds,
    newArmorPassives,
    newThrows,
  ];
  for (let i = 0; i < allItemsList.length; i++) {
    const items = allItemsList[i];
    for (let j = 0; j < items.length; j++) {
      const item = items[j];
      looseItemsContainer.appendChild(generateItemCard(item, "shop"));
    }
  }
};

const generateItemCard = (item) => {
  let imgDir = "equipment";
  if (item.type === "Stratagem") {
    imgDir = "svgs";
  }
  if (item.category === "armor") {
    imgDir = "armor";
  }
  const card = document.createElement("div");
  card.setAttribute("draggable", "true");
  card.ondragstart = drag;
  card.id = item.internalName;
  card.className = `card tierItem col-2 col-lg-1 pcItemCards ${item.warbondCode}`;
  card.innerHTML = `
    <img
      src="../images/${imgDir}/${item.imageURL}"
      class="img-card-top"
      alt="${item.displayName}"
    />
    <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
      <p class="card-title text-white pcItemCardText">${item.displayName}</p>
    </div>
  `;

  return card;
};

const uploadSaveData = async () => {
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData");
  if (tierMakerSaveData) {
    const currentGame = await getCurrentTierList();

    // the general working arrays
    newStrats = currentGame.newStrats;
    newPrims = currentGame.newPrims;
    newSeconds = currentGame.newSeconds;
    newThrows = currentGame.newThrows;
    newArmorPassives = currentGame.newArmorPassives;
    newBoosts = currentGame.newBoosts;

    dataName = currentGame.dataName;

    await filterItemsByWarbond(true);
    return;
  }
  startNewTierList();
};

const saveProgress = async () => {
  let obj = {};
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData");
  if (!tierMakerSaveData) {
    obj = {
      savedTierLists: [
        {
          newStrats,
          newPrims,
          newSeconds,
          newThrows,
          newArmorPassives,
          newBoosts,

          dataName: `${getCurrentDateTime()}`,
          currentGame: true,

          warbondCodes,
        },
      ],
    };
    localStorage.setItem("tierMakerSaveData", JSON.stringify(obj));
    return;
  }
  const data = JSON.parse(tierMakerSaveData);
  const newSavedTierLists = await data.savedTierLists.map((sg) => {
    if (sg.currentGame === true) {
      sg = {
        ...sg,
        purchasedItems,

        newStrats,
        newPrims,
        newSeconds,
        newThrows,
        newArmorPassives,
        newBoosts,

        dataName: sg.editedName ? sg.dataName : `${getCurrentDateTime()}`,
        currentGame: true,

        warbondCodes,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    savedTierLists: newSavedTierLists,
  };
  localStorage.setItem("tierMakerSaveData", JSON.stringify(obj));
};

const saveDataAndRestart = async () => {
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData");
  if (!tierMakerSaveData) {
    return;
  }
  const savedTierLists = JSON.parse(tierMakerSaveData).savedTierLists;
  // make all saved game data currentGame = false
  let updatedSavedTierLists = await savedTierLists.map((sg) => {
    sg.currentGame = false;
    return sg;
  });

  await startNewTierList(true);

  const newSaveObj = {
    purchasedItems,

    newStrats,
    newPrims,
    newSeconds,
    newThrows,
    newArmorPassives,
    newBoosts,

    dataName: `${getCurrentDateTime()}`,
    currentGame: true,

    warbondCodes,
  };

  updatedSavedTierLists.push(newSaveObj);
  const newtierMakerSaveData = {
    savedTierLists: updatedSavedTierLists,
  };
  await localStorage.setItem(
    "tierMakerSaveData",
    JSON.stringify(newtierMakerSaveData)
  );

  // remove saved lists that weren't changed in any way
  pruneSavedTierLists();
};

// get rid of all lists that have the max amount of loose items?
const pruneSavedTierLists = async () => {
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData");
  if (!tierMakerSaveData) {
    return;
  }
  console.log("pruning!");
  //   const prunedGames = await JSON.parse(tierMakerSaveData).savedTierLists.filter(
  //     (sg) => {
  //       if (

  //       ) {
  //         return sg;
  //       }
  //     }
  //   );
  //   const oldData = JSON.parse(tierMakerSaveData);
  //   const newData = {
  //     ...oldData,
  //     savedTierLists: prunedGames,
  //   };
  //   localStorage.setItem("tierMakerSaveData", JSON.stringify(newData));
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("tierMakerSaveData");
  window.location.reload();
};

const getCurrentTierList = async () => {
  const savedTierLists = JSON.parse(
    localStorage.getItem("tierMakerSaveData")
  ).savedTierLists;
  const currentGame = await savedTierLists.filter((sg) => {
    return sg.currentGame === true;
  });
  if (currentGame.length !== 1) {
    console.log("SAVED GAME DATA CORRUPTED", savedTierLists);
    return;
  }
  return currentGame[0];
};

uploadSaveData();
