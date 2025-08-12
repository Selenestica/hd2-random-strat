const looseItemsContainer = document.getElementById("looseItemsContainer");
const itemsSearchInput = document.getElementById("itemsSearchInput");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");

let OGarmorPassivesList = [...ARMOR_PASSIVES];
let OGstratsList = [...STRATAGEMS];
let OGprimsList = [...PRIMARIES];
let OGboostsList = [...BOOSTERS];
let OGsecondsList = [...SECONDARIES];
let OGthrowsList = [...THROWABLES];

const tiers = ["S", "A", "B", "C", "D"];
document.addEventListener("contextmenu", (e) => e.preventDefault());

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
};

// MOBILE DRAG FUNCTIONS
let draggedItem = null;

const handleTouchStart = (e) => {
  e.preventDefault();

  const original = e.currentTarget;
  draggedItem = original.cloneNode(true);
  draggedItem.classList.add("dragging");
  draggedItem.style.position = "absolute";
  draggedItem.style.pointerEvents = "none";
  draggedItem.style.zIndex = "9999";

  // Store reference to original so we can remove it later
  draggedItem._original = original;

  document.body.appendChild(draggedItem);
  moveDraggedItem(e.touches[0]);
};

const handleTouchMove = (e) => {
  e.preventDefault();
  if (!draggedItem) return;
  moveDraggedItem(e.touches[0]);
};

const handleTouchEnd = (e) => {
  e.preventDefault();
  if (!draggedItem) return;

  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
  const tierContainer = dropTarget?.closest?.(".tierCategories");

  if (tierContainer) {
    // Remove original from wherever it was
    const original = draggedItem._original;
    if (original && original.parentElement) {
      original.parentElement.removeChild(original);
    }

    // Drop the clone
    draggedItem.classList.remove("dragging");
    draggedItem.style = "";
    tierContainer.appendChild(draggedItem);

    // Re-bind touch/drag handlers
    setupCardEvents(draggedItem);
  } else {
    // Not dropped in a valid spot: remove the clone
    draggedItem.remove();
  }

  draggedItem = null;
};

const moveDraggedItem = (touch) => {
  draggedItem.style.left = `${touch.clientX - draggedItem.offsetWidth / 2}px`;
  draggedItem.style.top = `${touch.clientY - draggedItem.offsetHeight / 2}px`;
};
// END MOBILE DRAG FUNCTIONS

const allowDrop = (e) => {
  e.preventDefault();
};

const drag = (e) => {
  e.dataTransfer.setData("text/plain", e.currentTarget.id);
};

const drop = (e) => {
  e.preventDefault();

  const itemId = e.dataTransfer.getData("text/plain");
  const draggedItem = document.getElementById(itemId);
  if (!draggedItem) return;

  let dropTarget = e.target.closest(".tierItem");
  const parentTier = e.target.closest(".tierCategories");

  if (!parentTier) return;

  // If dropped on another item → insert before it
  if (dropTarget && dropTarget !== draggedItem) {
    parentTier.insertBefore(draggedItem, dropTarget);
  }
  // If dropped on empty tier or gap → append to end
  else {
    parentTier.appendChild(draggedItem);
  }
};

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

const startNewTierList = async () => {
  // probably want to set all warbond codes to checked just in case
  warbondCodes = [...masterWarbondCodes];
  for (let i = 0; i < warbondCheckboxes.length; i++) {
    warbondCheckboxes[i].checked = true;
  }

  // maybe just do a reload here
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

const setupCardEvents = (card) => {
  // Enable native dragging for desktop
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    card.setAttribute("draggable", "true");
    card.ondragstart = drag;
  } else {
    card.setAttribute("draggable", "false");
  }

  card.addEventListener("touchstart", handleTouchStart, { passive: false });
  card.addEventListener("touchmove", handleTouchMove, { passive: false });
  card.addEventListener("touchend", handleTouchEnd, { passive: false });
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
  card.dataset.type = getItemType(item);
  card.id = item.internalName;
  card.className = `card tierItem pcItemCards ${item.warbondCode}`;
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
  setupCardEvents(card);
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
