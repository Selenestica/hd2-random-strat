const looseItemsContainer = document.getElementById("looseItemsContainer");
const itemsSearchInput = document.getElementById("itemsSearchInput");
const tierPreview = document.getElementById("tierPreview");
const tierButtonPreviewLabel = document.getElementById(
  "tierButtonPreviewLabel"
);
const tierButtonPreviewSubLabel = document.getElementById(
  "tierButtonPreviewSubLabel"
);
const labelNameInput = document.getElementById("labelNameInput");
const subLabelNameInput = document.getElementById("subLabelNameInput");
const tierColorsList = document.getElementById("tierColorsList");
const reformattedOldDataModal = document.getElementById(
  "reformattedOldDataModal"
);
const tierCustomizationModal = document.getElementById(
  "tierCustomizationModal"
);
const deleteTierButton = document.getElementById("deleteTierButton");
const tierListContainer = document.getElementById("tierListContainer");

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

let customizingTier = null;
let newTierIndex = null;
let tiers = [
  {
    lab: "S",
    subLab: "",
    color: "",
    list: [],
  },
  {
    lab: "A",
    subLab: "",
    color: "",
    list: [],
  },
  {
    lab: "B",
    subLab: "",
    color: "",
    list: [],
  },
  {
    lab: "C",
    subLab: "",
    color: "",
    list: [],
  },
  {
    lab: "D",
    subLab: "",
    color: "",
    list: [],
  },
];

labelNameInput.addEventListener("input", (e) => {
  tierButtonPreviewLabel.innerText = e.target.value;
});

subLabelNameInput.addEventListener("input", (e) => {
  tierButtonPreviewSubLabel.innerText = e.target.value;
});

// make this null when the modal closes so we're ready for whatever comes next
tierCustomizationModal.addEventListener("hidden.bs.modal", async () => {
  customizingTier = null;
  deleteTierButton.classList.toggle("d-none", true);
  labelNameInput.value = "";
  subLabelNameInput.value = "";
  tierButtonPreviewLabel.innerText = "";
  tierButtonPreviewSubLabel.innerText = "";
  tierPreview.style.backgroundColor = "#151c24";
});

const changeTierPreviewColor = (color) => {
  tierPreview.style.backgroundColor = color;
  newColor = color;
};

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

  for (let i = 0; i < tiers.length; i++) {
    const list = tiers[i].list;
    const tierCatElName = "tierCat" + i;
    const tierEl = document.getElementById(tierCatElName);
    const foundItems = await flatItemsList.filter((item) =>
      list.includes(item.internalName)
    );
    if (foundItems.length > 0) {
      for (let j = 0; j < list.length; j++) {
        const item = await foundItems.filter(
          (it) => it.internalName === list[j]
        );
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

const handleTouchEnd = async (e) => {
  e.preventDefault();

  if (!hasStartedDragging || !cloneElement) {
    resetTouchState();
    return;
  }

  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
  const tierContainer = dropTarget?.closest?.(".tierCategories");
  const looseContainer = dropTarget?.closest?.("#looseItemsContainer");

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
  } else if (looseContainer) {
    const original = cloneElement._original;
    if (original?.parentElement) {
      if (original.parentElement.id === "looseItemsContainer") {
        window.location.reload();
        resetTouchState();
        return;
      }
      original.parentElement.removeChild(original);
    }

    cloneElement.classList.remove("dragging");
    cloneElement.style = "";

    looseContainer.appendChild(cloneElement);
    setupCardEvents(cloneElement);
    addItemToTierArray();
    populateLooseItems();
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

const drop = async (e) => {
  e.preventDefault();

  const itemId = e.dataTransfer.getData("text/plain");
  const draggedItem = document.getElementById(itemId);
  if (!draggedItem) return;

  const dropTarget = e.target.closest(".tierItem");
  const parentTier = e.target.closest(".tierCategories");
  const looseContainer = e.target.closest("#looseItemsContainer");

  // Dropped back into loose items pool
  if (looseContainer) {
    if (draggedItem.parentElement?.id === "looseItemsContainer") {
      return;
    }
    looseContainer.appendChild(draggedItem);
    await addItemToTierArray();
    populateLooseItems();
    return;
  }

  if (!parentTier) return;

  // Dropped on another item in a tier
  if (dropTarget && dropTarget !== draggedItem) {
    parentTier.insertBefore(draggedItem, dropTarget);
  }
  // Dropped in empty tier or gap
  else {
    parentTier.appendChild(draggedItem);
  }

  addItemToTierArray();
};

const addItemToTierArray = async () => {
  // empty all the arrays because we're going to repopulate them all with the correct order
  for (let k = 0; k < tiers.length; k++) {
    tiers[k].list = [];
  }

  // maybe just go through every tier element and loop through its children, and save based on that
  const tierCategories = document.querySelectorAll(".tierCategories");
  for (let i = 0; i < tierCategories.length; i++) {
    const tc = tierCategories[i];
    if (tc.children.length > 0) {
      for (let j = 0; j < tc.children.length; j++) {
        const child = tc.children[j];
        tiers[i].list.push(child.id);
      }
    }
  }

  saveProgress();
};

const startNewTierList = async () => {
  tiers = TIERS;
  tierListContainer.innerHTML = "";
  createTiers();
  await populateLooseItems();
};

const populateLooseItems = () => {
  looseItemsContainer.innerHTML = "";
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
  let selectedItems = [];
  for (let j = 0; j < tiers.length; j++) {
    if (tiers[j].list.length > 0) {
      selectedItems.push(...tiers[j].list);
    }
  }
  for (let i = 0; i < allItemsList.length; i++) {
    const items = allItemsList[i];
    for (let j = 0; j < items.length; j++) {
      if (!selectedItems.includes(items[j].internalName)) {
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
    imgDir = "armorpassives";
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

const setNewTierIndex = (index) => {
  newTierIndex = index;
};

const createTiers = async () => {
  if (tierListContainer.children.length === tiers.length) {
    return;
  }
  await tiers.forEach((tr, i) => {
    const tier = document.createElement("div");
    tier.id = `tier${i}`;
    tier.style.backgroundColor = tr.color;
    tier.className = "tier text-white";
    tier.innerHTML = `
      <button type="button" 
          id="tierCustomizationBtn${i}"
          data-bs-toggle="modal"
          data-bs-target="#tierCustomizationModal" 
          class="btn tierLabelButton btn-outline-primary"
          onclick="genTierCustomizationModalContent(${i})"
      >
        <div>
          <span id="tierLabel${i}" class="tierLabel text-white">${tr.lab}</span>
        </div>
        <div>
          <span id="tierSubLabel${i}" class="text-white tierSubLabel">
            ${tr.subLab}
          </span>
        </div>
      </button>
      <div 
        class="tierCategories" 
        id="tierCat${i}" 
        ondragover="allowDrop(event)" 
        ondrop="drop(event)">
      </div>
      <div class="addTierButtonDivs">
        <button
          class="btn btn-success btn-sm addTierButtons"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#tierCustomizationModal"
          onclick="setNewTierIndex(${i})"
        >
          <span><i class="bi bi-arrow-up"></i></span>
        </button>
        <button
          class="btn btn-success btn-sm addTierButtons mt-1"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#tierCustomizationModal"
          onclick="setNewTierIndex(${i + 1})"
        >
          <span><i class="bi bi-arrow-down"></i></span>
        </button>
      </div>
    `;
    tierListContainer.appendChild(tier);
  });
};

const uploadSaveData = async () => {
  const tierMakerSaveDataOld = localStorage.getItem("tierMakerSaveData");
  if (tierMakerSaveDataOld) {
    attemptToReformatOldData(tierMakerSaveDataOld);
  }

  const tierMakerSaveData = await localStorage.getItem("tierMakerSaveData2");
  if (tierMakerSaveData) {
    const currentList = await getCurrentTierList();

    tiers = currentList.tiers;
    dataName = currentList.dataName;
    tierListContainer.innerHTML = "";

    await populateLooseItems();
    await createTiers();
    await populateTierListItems();
    return;
  }
  startNewTierList();
};

const saveProgress = async () => {
  let obj = {};
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData2");
  if (!tierMakerSaveData) {
    obj = {
      lists: [
        {
          tiers,
          dataName: `List #${generateSemiUniqueCode()}`,
          currentList: true,
        },
      ],
    };
    localStorage.setItem("tierMakerSaveData2", JSON.stringify(obj));
    return;
  }
  const data = JSON.parse(tierMakerSaveData);
  const newSavedTierLists = await data.lists.map((sg) => {
    if (sg.currentList === true) {
      sg = {
        ...sg,
        tiers,
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
  localStorage.setItem("tierMakerSaveData2", JSON.stringify(obj));
};

const saveDataAndRestart = async () => {
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData2");
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
    tiers: TIERS,
    dataName: `List #${generateSemiUniqueCode()}`,
    currentList: true,
  };

  updatedSavedTierLists.push(newSaveObj);
  const newTierMakerSaveData = {
    lists: updatedSavedTierLists,
  };
  await localStorage.setItem(
    "tierMakerSaveData2",
    JSON.stringify(newTierMakerSaveData)
  );

  // remove saved lists that weren't changed in any way
  pruneSavedTierLists();
};

// get rid of all lists that have no items in tier lists
const pruneSavedTierLists = async () => {
  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData2");
  if (!tierMakerSaveData) {
    return;
  }
  const prunedGames = await JSON.parse(tierMakerSaveData).lists.filter((sg) => {
    for (let i = 0; i < sg.tiers.length; i++) {
      if (sg.tiers[i].list.length > 0) {
        return sg;
      }
    }
    if (sg.currentList) {
      return sg;
    }
  });
  const oldData = JSON.parse(tierMakerSaveData);
  const newData = {
    ...oldData,
    lists: prunedGames,
  };
  localStorage.setItem("tierMakerSaveData2", JSON.stringify(newData));
};

const clearSaveDataAndRestart = async () => {
  localStorage.removeItem("tierMakerSaveData2");
  window.location.reload();
};

const getCurrentTierList = async () => {
  const savedTierLists = JSON.parse(
    localStorage.getItem("tierMakerSaveData2")
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

const genTierCustomizationModalContent = (index) => {
  customizingTier = index;
  deleteTierButton.classList.toggle("d-none", false);
  const tierData = tiers[index];
  const { lab, subLab, color } = tierData;
  tierPreview.style.backgroundColor = color;
  tierButtonPreviewLabel.innerText = lab;
  tierButtonPreviewSubLabel.innerText = subLab;
  labelNameInput.value = lab;
  subLabelNameInput.value = subLab;
};

const genTierColorOptions = () => {
  tierListColors.forEach((it) => {
    tierColorsList.innerHTML += `
      <li onclick="changeTierPreviewColor('${it.color}')" class="text-white" style="background-color: ${it.color}">${it.name}</li>
    `;
  });
};

const deleteTier = async () => {
  tiers.splice(customizingTier, 1);

  // if theres any items in the tier, then we'll have to add them back to the pool
  await populateLooseItems();
  tierListContainer.innerHTML = "";
  await createTiers();
  await populateTierListItems();
  await saveProgress();

  const modal = bootstrap.Modal.getInstance(tierCustomizationModal);
  modal.hide();
};

const createNewTier = async () => {
  let newColor = "#151c24";
  let newLabel = labelNameInput.value;
  let newSubLabel = subLabelNameInput.value;
  const bgColor = tierPreview.style.backgroundColor;
  if (bgColor) {
    newColor = convertRGBToHex(bgColor);
  }
  const newTier = {
    lab: newLabel,
    subLab: newSubLabel,
    color: newColor,
    list: [],
  };
  tiers.splice(newTierIndex, 0, newTier);
  await saveProgress();
  tierListContainer.innerHTML = "";
  await createTiers();
  populateTierListItems();
};

// this handles editing a tier and creating a new tier
// redirect to create new tier function if customizingTier is null
const saveTierCustomization = async () => {
  if (customizingTier === null) {
    createNewTier();
    return;
  }

  const tierEl = document.getElementById(`tier${customizingTier}`);
  const tierLabelEl = document.getElementById(`tierLabel${customizingTier}`);
  const tierSubLabelEl = document.getElementById(
    `tierSubLabel${customizingTier}`
  );
  let newColor = "#151c24";
  let newLabel = labelNameInput.value;
  let newSubLabel = subLabelNameInput.value;
  const bgColor = tierPreview.style.backgroundColor;
  if (bgColor) {
    newColor = convertRGBToHex(bgColor);
  }

  // cosmetically changes edited tier
  tierEl.style.backgroundColor = newColor;
  tierLabelEl.innerText = newLabel;
  tierSubLabelEl.innerText = newSubLabel;

  // changes the tiers array which will be saved
  let newTiers = [...tiers];
  newTiers = await newTiers.map((tt, i) => {
    if (i === customizingTier) {
      tt.color = newColor;
      tt.lab = newLabel;
      tt.subLab = newSubLabel;
    }
    return tt;
  });

  saveProgress();
  customizingTier = null;
};

const attemptToReformatOldData = async (oldData) => {
  const oldLists = oldData.lists;
  let newLists = [];
  for (let i = 0; i < oldLists.length; i++) {
    let newList = {};
    const { sList, aList, bList, cList, dList, dataName, currentList } =
      oldLists[i];
    const newTiers = [
      {
        lab: "S",
        subLab: "",
        color: "",
        list: sList,
      },
      {
        lab: "A",
        subLab: "",
        color: "",
        list: aList,
      },
      {
        lab: "B",
        subLab: "",
        color: "",
        list: bList,
      },
      {
        lab: "C",
        subLab: "",
        color: "",
        list: cList,
      },
      {
        lab: "D",
        subLab: "",
        color: "",
        list: dList,
      },
    ];
    newList = {
      tiers: newTiers,
      dataName,
      currentList,
    };
    newLists.push(newList);
  }
  const newSaveObj = { lists: newLists };
  await localStorage.setItem("tierMakerSaveData2", JSON.stringify(newSaveObj));
  await localStorage.removeItem("tierMakerSaveData");
  document.addEventListener("DOMContentLoaded", () => {
    const modal = new bootstrap.Modal(reformattedOldDataModal);
    modal.show();
  });
  uploadSaveData();
};

uploadSaveData();
genTierColorOptions();
