// DOM Elements
const elements = {
  stratagemsContainer: document.getElementById("stratagemsContainer"),
  equipmentContainer: document.getElementById("equipmentContainer"),
  rollStratsButton: document.getElementById("rollStratsButton"),
  warbondCheckboxes: document.getElementsByClassName("warbondCheckboxes"),
  superCitizenCheckBox: document.getElementById("warbond0"),
  oneSupportCheck: document.getElementById("oneSupportCheck"),
  oneBackpackCheck: document.getElementById("oneBackpackCheck"),
  alwaysSupportCheck: document.getElementById("alwaysSupportCheck"),
  alwaysBackpackCheck: document.getElementById("alwaysBackpackCheck"),
  proTipsText: document.getElementById("proTipsText"),
  braschTacticsText: document.getElementById("braschTacticsText"),
};

// Radio button groups
const stratOptionRadios = [
  document.getElementById("onlyEaglesRadio"),
  document.getElementById("noEaglesRadio"),
  document.getElementById("defaultEaglesRadio"),
  document.getElementById("onlyOrbitalsRadio"),
  document.getElementById("noOrbitalsRadio"),
  document.getElementById("defaultOrbitalsRadio"),
  document.getElementById("onlyDefenseRadio"),
  document.getElementById("noDefenseRadio"),
  document.getElementById("defaultDefenseRadio"),
  document.getElementById("onlySupplyRadio"),
  document.getElementById("noSupplyRadio"),
  document.getElementById("defaultSupplyRadio"),
];

// Working lists
let workingLists = {
  prims: [...PRIMARIES],
  seconds: [...SECONDARIES],
  throws: [...THROWABLES],
  boosts: [...BOOSTERS],
  strats: [...STRATAGEMS],
  armorPassives: [...ARMOR_PASSIVES],
  armorSets: [...ARMOR_SETS],
};

let rolledStrats = [];
let proTipCounter = 0;
let checkedWarbonds = new Set(); // Use Set for better performance

// Helper: Get current checkbox states
const getSupplyOptions = () => ({
  oneSupport:
    elements.oneSupportCheck.checked && !elements.oneSupportCheck.disabled,
  oneBackpack:
    elements.oneBackpackCheck.checked && !elements.oneBackpackCheck.disabled,
  alwaysSupport:
    elements.alwaysSupportCheck.checked &&
    !elements.alwaysSupportCheck.disabled,
  alwaysBackpack:
    elements.alwaysBackpackCheck.checked &&
    !elements.alwaysBackpackCheck.disabled,
});

// Initialize event listeners
const initEventListeners = () => {
  // Supply options
  const supplyCheckIds = [
    "oneSupportCheck",
    "oneBackpackCheck",
    "alwaysSupportCheck",
    "alwaysBackpackCheck",
  ];
  supplyCheckIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) =>
        updateLocalStorage(e.target, "supplyAmountOptions"),
      );
    }
  });

  // Stratagem radios
  stratOptionRadios.forEach((radio) => {
    if (radio) {
      radio.addEventListener("change", handleStratRadioChange);
    }
  });

  // Warbond checkboxes
  Array.from(elements.warbondCheckboxes).forEach((cb) => {
    cb.addEventListener("change", handleWarbondChange);
  });

  // Add toggle all warbonds functionality
  const toggleAllButton = document.getElementById("toggleAllWarbonds");
  if (toggleAllButton) {
    toggleAllButton.addEventListener("change", handleToggleAllWarbonds);
  }
};

// Handle stratagem radio changes
const handleStratRadioChange = (e) => {
  updateLocalStorage(e.target, "stratagemOptions");
  updateRadioButtonsState();
};

const updateRadioButtonsState = () => {
  const onlyRadios = [
    "onlyEaglesRadio",
    "onlyOrbitalsRadio",
    "onlyDefenseRadio",
    "onlySupplyRadio",
  ];
  const activeOnlyRadio = onlyRadios.find(
    (id) => document.getElementById(id)?.checked,
  );

  // Get all supply checkboxes
  const supplyChecks = [
    "oneSupportCheck",
    "oneBackpackCheck",
    "alwaysBackpackCheck",
    "alwaysSupportCheck",
  ];

  if (activeOnlyRadio) {
    // An "only" option is active - disable supply checkboxes
    supplyChecks.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.disabled = true;
    });

    // Get the category (Eagle, Orbital, Defense, Supply)
    const category = activeOnlyRadio.replace("only", "").replace("Radio", "");

    // Disable radios from other categories, keep same category enabled
    stratOptionRadios.forEach((radio) => {
      if (radio) {
        const isSameCategory = radio.id.includes(category);
        const isDefaultForCategory = radio.id === `default${category}Radio`;
        radio.disabled = !(isSameCategory || isDefaultForCategory);
      }
    });
  } else {
    // No "only" option active - enable everything
    supplyChecks.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.disabled = false;
    });

    stratOptionRadios.forEach((radio) => {
      if (radio) radio.disabled = false;
    });
  }
};

// Update the toggle all button state based on individual checkboxes
const updateToggleAllButton = () => {
  const toggleAllButton = document.getElementById("toggleAllWarbonds");
  if (!toggleAllButton) return;

  const allWarbondCheckboxes = document.querySelectorAll(".warbondCheckboxes");
  if (allWarbondCheckboxes.length === 0) return;

  const checkedCount = Array.from(allWarbondCheckboxes).filter(
    (cb) => cb.checked,
  ).length;
  const totalCount = allWarbondCheckboxes.length;

  if (checkedCount === 0) {
    toggleAllButton.checked = false;
    toggleAllButton.indeterminate = false;
  } else if (checkedCount === totalCount) {
    toggleAllButton.checked = true;
    toggleAllButton.indeterminate = false;
  } else {
    toggleAllButton.indeterminate = true;
  }
};

// Handle toggle all warbonds
const handleToggleAllWarbonds = (e) => {
  const isChecked = e.target.checked;
  const allWarbondCheckboxes = document.querySelectorAll(".warbondCheckboxes");

  allWarbondCheckboxes.forEach((checkbox) => {
    if (checkbox.checked !== isChecked) {
      checkbox.checked = isChecked;

      // Update the checkedWarbonds Set
      if (isChecked) {
        checkedWarbonds.add(checkbox.id);
      } else {
        checkedWarbonds.delete(checkbox.id);
      }

      // Update localStorage
      updateLocalStorage(checkbox, "warbondOptions");
    }
  });

  // Filter all items after toggling
  filterItemsByWarbond();

  // Re-roll everything to reflect new warbond selection
  rollEquipment();
  rollStratagems();
  if (typeof rollArmor === "function") rollArmor();
};

// Handle warbond changes
const handleWarbondChange = (e) => {
  updateLocalStorage(e.target, "warbondOptions");

  if (e.target.checked) {
    checkedWarbonds.add(e.target.id);
  } else {
    checkedWarbonds.delete(e.target.id);
  }

  updateToggleAllButton(); // Update the toggle button state
  filterItemsByWarbond();
};

// Filter items by warbond (optimized)
const filterItemsByWarbond = async () => {
  const filterPromises = Object.keys(workingLists).map(async (key) => {
    const originalList =
      key === "strats"
        ? [...STRATAGEMS]
        : key === "prims"
          ? [...PRIMARIES]
          : key === "seconds"
            ? [...SECONDARIES]
            : key === "throws"
              ? [...THROWABLES]
              : key === "boosts"
                ? [...BOOSTERS]
                : key === "armorPassives"
                  ? [...ARMOR_PASSIVES]
                  : [...ARMOR_SETS];

    workingLists[key] = await originalList.filter(
      (item) =>
        checkedWarbonds.has(item.warbondCode) || item.warbondCode === "none",
    );
  });

  await Promise.all(filterPromises);

  // Update armor lists AFTER filtering is complete
  if (typeof updateArmorLists === "function") {
    updateArmorLists(workingLists.armorPassives, workingLists.armorSets);
  }
};

// Filter stratagem list based on radio options
const filterStratList = async () => {
  let filteredList = [...workingLists.strats];

  const onlyRadios = [
    { radio: document.getElementById("onlyDefenseRadio"), category: "Defense" },
    { radio: document.getElementById("onlyEaglesRadio"), category: "Eagle" },
    {
      radio: document.getElementById("onlyOrbitalsRadio"),
      category: "Orbital",
    },
    { radio: document.getElementById("onlySupplyRadio"), category: "Supply" },
  ];

  // Check for "only" options first
  for (const { radio, category } of onlyRadios) {
    if (radio?.checked) {
      return filteredList.filter((strat) => strat.category === category);
    }
  }

  // Filter out "no" options
  const noRadios = [
    { radio: document.getElementById("noDefenseRadio"), category: "Defense" },
    { radio: document.getElementById("noEaglesRadio"), category: "Eagle" },
    { radio: document.getElementById("noOrbitalsRadio"), category: "Orbital" },
    { radio: document.getElementById("noSupplyRadio"), category: "Supply" },
  ];

  const categoriesToFilter = noRadios
    .filter(({ radio }) => radio?.checked && !radio.disabled)
    .map(({ category }) => category);

  if (categoriesToFilter.length) {
    filteredList = filteredList.filter(
      (strat) => !categoriesToFilter.includes(strat.category),
    );
  }

  return filteredList;
};

// Get random unique numbers with supply constraints
const getRandomUniqueNumbers = (list, options, amt) => {
  const { oneSupport, oneBackpack, alwaysSupport, alwaysBackpack } = options;
  let hasBackpack = false;
  let hasSupportWeapon = false;
  const numbers = [];

  // Early exit if constraints can't be met
  if (alwaysSupport && !list.some((item) => item.tags?.includes("Weapons"))) {
    console.warn("No support weapons available");
    return [];
  }
  if (
    alwaysBackpack &&
    !list.some((item) => item.tags?.includes("Backpacks"))
  ) {
    console.warn("No backpacks available");
    return [];
  }

  let attempts = 0;
  const maxAttempts = 500;

  while (numbers.length < amt && attempts < maxAttempts) {
    attempts++;
    const randomNumber = Math.floor(Math.random() * list.length);
    const item = list[randomNumber];
    const tags = item.tags || [];
    const isSupport = tags.includes("Weapons");
    const isBackpack = tags.includes("Backpacks");

    // Skip duplicates
    if (numbers.includes(randomNumber)) {
      continue;
    }

    // Check "one support" constraint
    if (oneSupport && hasSupportWeapon && isSupport) {
      continue;
    }

    // Check "one backpack" constraint
    if (oneBackpack && hasBackpack && isBackpack) {
      continue;
    }

    // For "always" constraints, we need to check if this item helps fulfill a needed requirement
    let needed = [];
    if (alwaysSupport && !hasSupportWeapon) needed.push("support");
    if (alwaysBackpack && !hasBackpack) needed.push("backpack");

    // If we have unmet requirements, this item must satisfy at least one of them
    if (needed.length > 0) {
      const satisfiesSupport = needed.includes("support") && isSupport;
      const satisfiesBackpack = needed.includes("backpack") && isBackpack;

      if (!satisfiesSupport && !satisfiesBackpack) {
        continue;
      }
    }

    // If we get here, the item is valid
    numbers.push(randomNumber);
    if (isSupport) hasSupportWeapon = true;
    if (isBackpack) hasBackpack = true;
  }

  if (attempts >= maxAttempts) {
    console.error("Max attempts reached, returning what we have");
  }

  return numbers;
};

// Roll stratagems
const rollStratagems = async () => {
  proTipCounter++;
  if (proTipCounter === 3) rollProTip();

  elements.stratagemsContainer.innerHTML = "";
  const options = getSupplyOptions();
  const filteredList = await filterStratList();

  const indices = getRandomUniqueNumbers(filteredList, options, 4);

  // Clear and refill rolledStrats
  rolledStrats = [];

  indices.forEach((index, position) => {
    const stratagem = filteredList[index];
    rolledStrats.push(stratagem.internalName);

    elements.stratagemsContainer.innerHTML += `
      <div class="col-3 px-1 d-flex justify-content-center">
        <div class="card itemCards" data-internal-name="${stratagem.internalName}" data-category="strat" data-position="${position}">
          <img
              src="../images/svgs/${stratagem.imageURL}"
              class="img-card-top"
              alt="${stratagem.displayName}"
              id="${stratagem.internalName}-randImage"
          />
          <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
              <p class="card-title text-white">${stratagem.displayName}</p>
          </div>
        </div>
      </div>
    `;
  });
};

// Roll equipment
const rollEquipment = () => {
  proTipCounter++;
  if (proTipCounter === 3) rollProTip();

  elements.equipmentContainer.innerHTML = "";
  const equipmentCategories = ["prims", "seconds", "throws", "boosts"];

  equipmentCategories.forEach((category) => {
    const list = workingLists[category];

    if (!list?.length) {
      elements.equipmentContainer.innerHTML += `<div class="col-3 d-flex justify-content-center"><div class="card itemCards"></div></div>`;
      return;
    }

    const randomIndex = Math.floor(Math.random() * list.length);
    const item = list[randomIndex];

    elements.equipmentContainer.innerHTML += `
      <div class="col-3 px-1 d-flex justify-content-center">
        <div class="card itemCards" data-internal-name="${item.internalName}" data-category="${item.category}">
          <img
              src="../images/equipment/${item.imageURL}"
              class="img-card-top"
              alt="${item.displayName}"
              id="${item.internalName}-randImage"
          />
          <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
              <p class="card-title text-white">${item.displayName}</p>
          </div>
        </div>
      </div>
    `;
  });
};

// Reroll individual item (fixed for support/backpack constraints)
const rerollItem = async (internalName, category) => {
  if (category === "strat") {
    const options = getSupplyOptions();
    const filteredList = await filterStratList();

    // Find the clicked card
    const clickedCard = document.querySelector(
      `.card[data-internal-name="${internalName}"][data-category="strat"]`,
    );
    if (!clickedCard) return;

    // Get all stratagem cards
    const allStratCards = Array.from(
      document.querySelectorAll("#stratagemsContainer .card"),
    );
    const currentPosition = allStratCards.indexOf(clickedCard);

    // Get current items from DOM (their display names)
    const currentDisplayNames = allStratCards.map(
      (card) => card.querySelector(".card-title")?.innerText,
    );

    // Get the full current items
    const currentItems = currentDisplayNames
      .map((name) => filteredList.find((s) => s.displayName === name))
      .filter(Boolean);

    const currentItem = currentItems[currentPosition];
    if (!currentItem) return;

    // Check other items (excluding the one being rerolled)
    const otherItems = currentItems.filter(
      (_, index) => index !== currentPosition,
    );
    const hasSupportInOthers = otherItems.some((s) =>
      s?.tags?.includes("Weapons"),
    );
    const hasBackpackInOthers = otherItems.some((s) =>
      s?.tags?.includes("Backpacks"),
    );

    // Build available items based on constraints
    let availableItems = [...filteredList];

    // Remove the current item to avoid rolling the same one
    availableItems = availableItems.filter(
      (item) => item.internalName !== currentItem.internalName,
    );

    // Remove any items that are already in OTHER slots (prevent duplicates)
    const otherItemInternalNames = otherItems.map((item) => item.internalName);
    availableItems = availableItems.filter(
      (item) => !otherItemInternalNames.includes(item.internalName),
    );

    // Apply "one support" constraint
    if (options.oneSupport && hasSupportInOthers) {
      availableItems = availableItems.filter(
        (item) => !item.tags?.includes("Weapons"),
      );
    }

    // Apply "one backpack" constraint
    if (options.oneBackpack && hasBackpackInOthers) {
      availableItems = availableItems.filter(
        (item) => !item.tags?.includes("Backpacks"),
      );
    }

    // Apply "always support" constraint
    if (options.alwaysSupport && !hasSupportInOthers) {
      availableItems = availableItems.filter((item) =>
        item.tags?.includes("Weapons"),
      );
    }

    // Apply "always backpack" constraint
    if (options.alwaysBackpack && !hasBackpackInOthers) {
      availableItems = availableItems.filter((item) =>
        item.tags?.includes("Backpacks"),
      );
    }

    if (availableItems.length === 0) {
      console.warn("No valid items available");
      return;
    }

    // Pick random new item
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const newItem = availableItems[randomIndex];

    // Update the DOM
    const img = clickedCard.querySelector("img");
    const nameP = clickedCard.querySelector(".card-title");

    if (img && nameP) {
      img.src = `../images/svgs/${newItem.imageURL}`;
      nameP.innerText = newItem.displayName;

      // Update data attribute
      clickedCard.dataset.internalName = newItem.internalName;

      // Update rolledStrats array
      if (rolledStrats[currentPosition]) {
        rolledStrats[currentPosition] = newItem.internalName;
      }
    }
  } else {
    // Handle equipment rerolls - also prevent duplicates
    const clickedCard = document.querySelector(
      `.card[data-internal-name="${internalName}"][data-category="${category}"]`,
    );
    if (!clickedCard) return;

    const categoryMap = {
      primary: "prims",
      secondary: "seconds",
      throwable: "throws",
      booster: "boosts",
    };

    const listKey = categoryMap[category];
    let list = workingLists[listKey];

    if (list?.length) {
      // Remove current item to avoid rolling the same one
      let availableItems = list.filter(
        (item) => item.internalName !== internalName,
      );

      // For equipment, also prevent duplicates within the same category
      // Get all equipment cards in the same container
      const allEquipmentCards = Array.from(
        document.querySelectorAll("#equipmentContainer .card"),
      );
      const otherEquipmentNames = allEquipmentCards
        .filter((card) => card !== clickedCard)
        .map((card) => card.querySelector(".card-title")?.innerText)
        .filter(Boolean);

      // Remove items that are already used in other equipment slots
      availableItems = availableItems.filter(
        (item) => !otherEquipmentNames.includes(item.displayName),
      );

      if (availableItems.length === 0) {
        console.warn("No unique equipment available");
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableItems.length);
      const newItem = availableItems[randomIndex];

      const img = clickedCard.querySelector("img");
      const nameP = clickedCard.querySelector(".card-title");

      if (img && nameP) {
        img.src = `../images/equipment/${newItem.imageURL}`;
        nameP.innerText = newItem.displayName;
        clickedCard.dataset.internalName = newItem.internalName;
      }
    }
  }
};

// Make rerollItem available globally
window.rerollItem = rerollItem;

// Local storage management
const updateLocalStorage = (element, type) => {
  const randomizerOptions = JSON.parse(
    localStorage.getItem("randomizerOptions") || "{}",
  );

  randomizerOptions[type] = {
    ...randomizerOptions[type],
    [element.id]: element.checked,
  };

  localStorage.setItem("randomizerOptions", JSON.stringify(randomizerOptions));
};

const checkLocalStorageForOptionsPreferences = async () => {
  const stored = localStorage.getItem("randomizerOptions");

  if (!stored) {
    const defaultOptions = {
      warbondOptions: Object.fromEntries(
        Array.from({ length: 25 }, (_, i) => [`warbond${i}`, true]),
      ),
      stratagemOptions: {
        onlyEaglesRadio: false,
        noEaglesRadio: false,
        defaultEaglesRadio: true,
        onlyOrbitalsRadio: false,
        noOrbitalsRadio: false,
        defaultOrbitalsRadio: true,
        onlyDefenseRadio: false,
        noDefenseRadio: false,
        defaultDefenseRadio: true,
        onlySupplyRadio: false,
        noSupplyRadio: false,
        defaultSupplyRadio: true,
      },
      supplyAmountOptions: {
        oneBackpackCheck: false,
        oneSupportCheck: false,
        alwaysBackpackCheck: false,
        alwaysSupportCheck: false,
      },
    };
    localStorage.setItem("randomizerOptions", JSON.stringify(defaultOptions));
    await applyStoredOptionsToLists(defaultOptions);
    return;
  }

  const data = JSON.parse(stored);
  await applyStoredOptionsToLists(data);
};

const applyStoredOptionsToLists = async (options) => {
  // Apply checkbox states
  for (const category in options) {
    for (const id in options[category]) {
      const element = document.getElementById(id);
      if (element) element.checked = options[category][id];
    }
  }

  // Rebuild checkedWarbonds set
  checkedWarbonds.clear();
  Array.from(elements.warbondCheckboxes).forEach((cb) => {
    if (cb.checked) checkedWarbonds.add(cb.id);
  });

  updateToggleAllButton(); // Update the toggle button state after loading
  await filterItemsByWarbond();
  updateRadioButtonsState();
};

// Utility functions
const rollProTip = () => {
  if (typeof PRO_TIPS !== "undefined" && PRO_TIPS?.length) {
    const randomTip = PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)];
    elements.proTipsText.innerHTML = randomTip;
    proTipCounter = 0;
  }
};

const randomizeAll = async () => {
  await checkLocalStorageForOptionsPreferences();
  updateToggleAllButton(); // Ensure toggle button reflects current state
  rollEquipment();
  await rollStratagems();
  if (typeof rollArmor === "function") rollArmor();
  rollProTip();
};

// Initialize
initEventListeners();
randomizeAll();
