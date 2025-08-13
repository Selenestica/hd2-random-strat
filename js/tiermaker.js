const looseItemsContainer = document.getElementById("looseItemsContainer");
const itemsSearchInput = document.getElementById("itemsSearchInput");
const warbondCheckboxes = document.getElementsByClassName("warbondCheckboxes");

let OGarmorPassivesList = [...ARMOR_PASSIVES];
let OGstratsList = [...STRATAGEMS];
let OGprimsList = [...PRIMARIES];
let OGboostsList = [...BOOSTERS];
let OGsecondsList = [...SECONDARIES];
let OGthrowsList = [...THROWABLES];
let OGwarbondsList = [...WARBONDS];
let newPrims = [...OGprimsList];
let newBoosts = [...OGboostsList];
let newArmorPassives = [...OGarmorPassivesList];
let newSeconds = [...OGsecondsList];
let newThrows = [...OGthrowsList];
let newStrats = [...OGstratsList];
let newWarbonds = [...OGwarbondsList];

const TIERS = ["S", "A", "B", "C", "D"];
let sList = [];
let aList = [];
let bList = [];
let cList = [];
let dList = [];

const populateTierListItems = async () => {
  const flatItemsList = [
    newPrims,
    newStrats,
    newBoosts,
    newSeconds,
    newArmorPassives,
    newThrows,
    newWarbonds,
  ].flat();

  const tierListObjs = [
    { li: sList, str: "sList" },
    { li: aList, str: "aList" },
    { li: bList, str: "bList" },
    { li: cList, str: "cList" },
    { li: dList, str: "dList" },
  ];
  for (let i = 0; i < tierListObjs.length; i++) {
    const { li, str } = tierListObjs[i];
    const tierEl = document.getElementById(str);
    const foundItems = await flatItemsList.filter((item) =>
      li.includes(item.internalName)
    );
    if (foundItems.length > 0) {
      for (let j = 0; j < li.length; j++) {
        const item = await foundItems.filter((it) => it.internalName === li[j]);
        await tierEl.appendChild(generateItemCard(item[0]));
      }
    }
  }
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
    addItemToTierArray();
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
    addItemToTierArray();
  }
  // If dropped on empty tier or gap → append to end
  else {
    parentTier.appendChild(draggedItem);
    addItemToTierArray();
  }
};

const addItemToTierArray = async () => {
  // empty all the arrays because we're going to repopulate them all with the correct order
  sList = [];
  aList = [];
  bList = [];
  cList = [];
  dList = [];

  // maybe just go through every tier element and loop through its children, and save based on that
  const tierCategories = document.querySelectorAll(".tierCategories");
  for (let i = 0; i < tierCategories.length; i++) {
    const tc = tierCategories[i];
    const tier = tc.dataset.tier;
    if (tc.children.length > 0) {
      for (let j = 0; j < tc.children.length; j++) {
        const child = tc.children[j];
        if (tier === "S") {
          sList.push(child.id);
        }
        if (tier === "A") {
          aList.push(child.id);
        }
        if (tier === "B") {
          bList.push(child.id);
        }
        if (tier === "C") {
          cList.push(child.id);
        }
        if (tier === "D") {
          dList.push(child.id);
        }
      }
    }
  }

  saveProgress();
};

const startNewTierList = async () => {
  // probably want to set all warbond codes to checked just in case
  warbondCodes = [...masterWarbondCodes];
  for (let i = 0; i < warbondCheckboxes.length; i++) {
    warbondCheckboxes[i].checked = true;
  }
  sList = [];
  aList = [];
  bList = [];
  cList = [];
  dList = [];

  const container = document.getElementById("tierListContainer");
  container.innerHTML = "";
  createTiers();
  await populateLooseItems();
};

const populateLooseItems = () => {
  newPrims = [...OGprimsList];
  newBoosts = [...OGboostsList];
  newArmorPassives = [...OGarmorPassivesList];
  newSeconds = [...OGsecondsList];
  newThrows = [...OGthrowsList];
  newStrats = [...OGstratsList];
  newWarbonds = [...OGwarbondsList];
  const allItemsList = [
    newPrims,
    newStrats,
    newBoosts,
    newSeconds,
    newArmorPassives,
    newThrows,
    newWarbonds,
  ];
  const flatTieredItems = [sList, aList, bList, cList, dList].flat();
  for (let i = 0; i < allItemsList.length; i++) {
    const items = allItemsList[i];
    for (let j = 0; j < items.length; j++) {
      if (!flatTieredItems.includes(items[j].internalName)) {
        const item = items[j];
        looseItemsContainer.appendChild(generateItemCard(item));
      }
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
  if (item.type === "Warbond") {
    imgDir = "warbonds";
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

const createTiers = async () => {
  const container = document.getElementById("tierListContainer");
  if (container.children.length === 5) {
    return;
  }
  await TIERS.forEach((label) => {
    const tier = document.createElement("div");
    tier.className = "tier text-white";
    tier.innerHTML = `
      <div class="tierLabel">${label}</div>
      <div class="tierCategories" data-tier="${label}" id="${
      label.toLocaleLowerCase() + "List"
    }" ondragover="allowDrop(event)" ondrop="drop(event)"></div>
    `;
    container.appendChild(tier);
  });
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

    await populateLooseItems();
    await createTiers();
    await populateTierListItems();
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

          dataName: `List #${generateSemiUniqueCode()}`,
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
        sList,
        aList,
        bList,
        cList,
        dList,

        dataName: sg.editedName
          ? sg.dataName
          : `List #${generateSemiUniqueCode()}`,
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

  await startNewTierList();

  const newSaveObj = {
    sList,
    aList,
    bList,
    cList,
    dList,

    dataName: `List #${generateSemiUniqueCode()}`,
    currentList: true,
  };

  updatedSavedTierLists.push(newSaveObj);
  const newTierMakerSaveData = {
    lists: updatedSavedTierLists,
  };
  await localStorage.setItem(
    "tierMakerSaveData",
    JSON.stringify(newTierMakerSaveData)
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
      sg.dList.length > 0 ||
      sg.currentList
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

const toggleItemNameText = () => {
  const itemNameContainers = document.querySelectorAll(".itemNameContainer");
  itemNameContainers.forEach((container) => {
    container.classList.toggle("d-none");
  });
};

uploadSaveData();
