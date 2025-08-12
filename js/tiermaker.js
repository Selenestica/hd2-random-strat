const looseItemsContainer = document.getElementById("looseItemsContainer");
const itemsSearchInput = document.getElementById("itemsSearchInput");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");

let OGarmorPassivesList = [...ARMOR_PASSIVES];
let OGstratsList = [...STRATAGEMS];
let OGprimsList = [...PRIMARIES];
let OGboostsList = [...BOOSTERS];
let OGsecondsList = [...SECONDARIES];
let OGthrowsList = [...THROWABLES];

const TIERS = ["S", "A", "B", "C", "D"];
let sList = [];
let aList = [];
let bList = [];
let cList = [];
let dList = [];

// Initialize tier list rows on page load
window.onload = async () => {
  const container = document.getElementById("tierListContainer");
  await TIERS.forEach((label) => {
    const tier = document.createElement("div");
    tier.className = "tier text-white";
    tier.id = label.toLocaleLowerCase() + "List";
    tier.innerHTML = `
      <div class="tierLabel">${label}</div>
      <div class="tierCategories" data-tier="${label}" ondragover="allowDrop(event)" ondrop="drop(event)"></div>
    `;
    container.appendChild(tier);
  });
  populateTierListItems();
};

const populateTierListItems = async () => {
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData");
  if (!tierMakerSaveData) return;

  const currentLists = JSON.parse(tierMakerSaveData).lists.filter(
    (li) => li.currentList === true
  );
  const currentList = currentLists[0];

  console.log(currentList);
  // const tierListIDs = ["sList", "aList", "bList", "cList", "dList"]
  // for (let i = 0; i < tierListIDs.length; i++) {

  // }
};

// MOBILE DRAG FUNCTIONS
let draggedItem = null;
let dragStartPosition = null;
let hasStartedDragging = false;
let cloneElement = null;
const DRAG_THRESHOLD = 10; // Minimum pixels to move before it counts as a drag

const handleTouchStart = (e) => {
  e.preventDefault();
  const touch = e.touches[0];

  dragStartPosition = {
    x: touch.clientX,
    y: touch.clientY,
  };

  hasStartedDragging = false;
  draggedItem = e.currentTarget;
  cloneElement = null;
};

const handleTouchMove = (e) => {
  e.preventDefault();
  const touch = e.touches[0];

  if (!hasStartedDragging) {
    const dx = touch.clientX - dragStartPosition.x;
    const dy = touch.clientY - dragStartPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < DRAG_THRESHOLD) {
      return; // Still not enough movement
    }

    hasStartedDragging = true;

    // Clone only once
    cloneElement = draggedItem.cloneNode(true);
    cloneElement.classList.add("dragging");
    cloneElement.style.position = "absolute";
    cloneElement.style.pointerEvents = "none";
    cloneElement.style.zIndex = "9999";
    cloneElement._original = draggedItem;

    document.body.appendChild(cloneElement);

    // Wait for DOM to render before positioning
    requestAnimationFrame(() => {
      moveDraggedItem(touch);
    });
  } else if (cloneElement) {
    moveDraggedItem(touch);
  }
};

const handleTouchEnd = (e) => {
  e.preventDefault();

  if (!hasStartedDragging || !cloneElement) {
    resetTouchState();
    return;
  }

  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
  const tierContainer = dropTarget?.closest?.(".tierCategories");

  if (tierContainer) {
    const original = cloneElement._original;
    if (original?.parentElement) {
      original.parentElement.removeChild(original);
    }

    cloneElement.classList.remove("dragging");
    cloneElement.style = "";

    tierContainer.appendChild(cloneElement);
    setupCardEvents(cloneElement);
    addItemToTierArray(
      cloneElement.id,
      cloneElement.dataset.type,
      cloneElement.classList[3],
      tierContainer.dataset.tier
    );
  } else {
    cloneElement.remove(); // Not dropped in a valid area
  }

  resetTouchState();
};

const moveDraggedItem = (touch) => {
  const x = touch.clientX + window.scrollX;
  const y = touch.clientY + window.scrollY;

  cloneElement.style.left = `${x - cloneElement.offsetWidth / 2}px`;
  cloneElement.style.top = `${y - cloneElement.offsetHeight / 2}px`;
};

const resetTouchState = () => {
  draggedItem = null;
  cloneElement = null;
  dragStartPosition = null;
  hasStartedDragging = false;
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
    addItemToTierArray(
      draggedItem.id,
      draggedItem.dataset.type,
      draggedItem.classList[3],
      parentTier.dataset.tier
    );
  }
  // If dropped on empty tier or gap → append to end
  else {
    parentTier.appendChild(draggedItem);
    addItemToTierArray(
      draggedItem.id,
      draggedItem.dataset.type,
      draggedItem.classList[3],
      parentTier.dataset.tier
    );
  }
};

const addItemToTierArray = async (itemId, type, warbondCode, tier) => {
  // will add item to list and saveProgress here

  const tierArrays = [sList, aList, bList, cList, dList];
  await tierArrays.map((ta) => ta.filter((id) => id !== itemId));

  console.log(itemId, type, warbondCode, tier);
  if (tier === "S") {
    sList.push(itemId);
  }
  if (tier === "A") {
    aList.push(itemId);
  }
  if (tier === "B") {
    bList.push(itemId);
  }
  if (tier === "c") {
    cList.push(itemId);
  }
  if (tier === "d") {
    dList.push(itemId);
  }

  saveProgress();
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
      looseItemsContainer.appendChild(generateItemCard(item));
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
    const currentList = await getCurrentTierList();

    // the general working arrays
    sList = currentList.sList;
    aList = currentList.aList;
    bList = currentList.bList;
    cList = currentList.cList;
    dList = currentList.dList;

    dataName = currentList.dataName;

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
      lists: [
        {
          sList,
          aList,
          bList,
          cList,
          dList,

          dataName: `${getCurrentDateTime()}`,
          currentList: true,
        },
      ],
    };
    localStorage.setItem("tierMakerSaveData", JSON.stringify(obj));
    return;
  }
  const data = JSON.parse(tierMakerSaveData);
  const newSavedTierLists = await data.lists.map((sg) => {
    if (sg.currentList === true) {
      sg = {
        ...sg,
        purchasedItems,

        sList,
        aList,
        bList,
        cList,
        dList,

        dataName: sg.editedName ? sg.dataName : `${getCurrentDateTime()}`,
        currentList: true,
      };
    }
    return sg;
  });
  obj = {
    ...obj,
    lists: newSavedTierLists,
  };
  localStorage.setItem("tierMakerSaveData", JSON.stringify(obj));
};

const saveDataAndRestart = async () => {
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData");
  if (!tierMakerSaveData) {
    return;
  }
  const savedTierLists = JSON.parse(tierMakerSaveData).lists;
  // make all saved game data currentList = false
  let updatedSavedTierLists = await savedTierLists.map((sg) => {
    sg.currentList = false;
    return sg;
  });

  await startNewTierList(true);

  const newSaveObj = {
    purchasedItems,

    sList,
    aList,
    bList,
    cList,
    dList,

    dataName: `${getCurrentDateTime()}`,
    currentList: true,
  };

  updatedSavedTierLists.push(newSaveObj);
  const newtierMakerSaveData = {
    lists: updatedSavedTierLists,
  };
  await localStorage.setItem(
    "tierMakerSaveData",
    JSON.stringify(newtierMakerSaveData)
  );

  // remove saved lists that weren't changed in any way
  pruneSavedTierLists();
};

// get rid of all lists that have no items in tier lists
const pruneSavedTierLists = async () => {
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData");
  if (!tierMakerSaveData) {
    return;
  }
  const prunedGames = await JSON.parse(tierMakerSaveData).lists.filter((sg) => {
    if (
      sg.sList.length > 0 ||
      sg.aList.length > 0 ||
      sg.bList.length > 0 ||
      sg.cList.length > 0 ||
      sg.dList.length > 0
    ) {
      return sg;
    }
  });
  const oldData = JSON.parse(tierMakerSaveData);
  const newData = {
    ...oldData,
    lists: prunedGames,
  };
  localStorage.setItem("tierMakerSaveData", JSON.stringify(newData));
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("tierMakerSaveData");
  window.location.reload();
};

const getCurrentTierList = async () => {
  const savedTierLists = JSON.parse(
    localStorage.getItem("tierMakerSaveData")
  ).lists;
  const currentList = await savedTierLists.filter((sg) => {
    return sg.currentList === true;
  });
  if (currentList.length !== 1) {
    console.log("SAVED GAME DATA CORRUPTED", savedTierLists);
    return;
  }
  return currentList[0];
};

uploadSaveData();
