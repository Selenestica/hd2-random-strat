const PARTY_DRAFT_KEY = "partyRandomizerDraft";
const PARTY_PREFS_KEY = "partyRandomizerPreferences";
const DRAFT_VERSION = 1;

const CATEGORY_META = {
  primary: { label: "Primary", plural: "Primaries" },
  secondary: { label: "Secondary", plural: "Secondaries" },
  armor: { label: "Armor", plural: "Armor" },
  throwable: { label: "Throwable", plural: "Throwables" },
  booster: { label: "Booster", plural: "Boosters" },
  stratagem: { label: "Stratagem", plural: "Stratagems" },
};

const CATEGORY_ORDER = [
  "primary",
  "secondary",
  "armor",
  "throwable",
  "booster",
  "stratagem",
];

const STRAT_TYPE_GROUPS = [
  { label: "Eagles", key: "Eagles", category: "Eagle" },
  { label: "Orbitals", key: "Orbitals", category: "Orbital" },
  { label: "Defense", key: "Defense", category: "Defense" },
  { label: "Supply", key: "Supply", category: "Supply" },
];

const dom = {
  setupPanel: document.getElementById("setupPanel"),
  draftPanel: document.getElementById("draftPanel"),
  setupError: document.getElementById("setupError"),
  partySize: document.getElementById("partySize"),
  playerNameInputs: document.getElementById("playerNameInputs"),
  categoryToggles: document.getElementById("categoryToggles"),
  armorMode: document.getElementById("armorMode"),
  armorModeGroup: document.getElementById("armorModeGroup"),
  startDraftButton: document.getElementById("startDraftButton"),
  draftHeading: document.getElementById("draftHeading"),
  draftProgress: document.getElementById("draftProgress"),
  activeDraftArea: document.getElementById("activeDraftArea"),
  roundLabel: document.getElementById("roundLabel"),
  currentPlayerPrompt: document.getElementById("currentPlayerPrompt"),
  turnOrder: document.getElementById("turnOrder"),
  poolHelp: document.getElementById("poolHelp"),
  draftPool: document.getElementById("draftPool"),
  confirmPickButton: document.getElementById("confirmPickButton"),
  undoPickButton: document.getElementById("undoPickButton"),
  newDraftButton: document.getElementById("newDraftButton"),
  completionMessage: document.getElementById("completionMessage"),
  loadoutBoard: document.getElementById("loadoutBoard"),
  unusedSection: document.getElementById("unusedSection"),
  unusedOptions: document.getElementById("unusedOptions"),
  optionsDraftNotice: document.getElementById("optionsDraftNotice"),
  stratagemTypeOptions: document.getElementById("stratagemTypeOptions"),
};

let draftState = null;
let selectedItemId = null;

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
};

const getDefaultCategorySettings = () =>
  Object.fromEntries(CATEGORY_ORDER.map((category) => [category, true]));

const loadPreferences = () => {
  const stored = safeParse(localStorage.getItem(PARTY_PREFS_KEY), {});
  return {
    enabledCategories: {
      ...getDefaultCategorySettings(),
      ...(stored.enabledCategories || {}),
    },
    armorMode: ["passive", "set", "size"].includes(stored.armorMode)
      ? stored.armorMode
      : "passive",
  };
};

const savePreferences = () => {
  const enabledCategories = {};
  CATEGORY_ORDER.forEach((category) => {
    enabledCategories[category] = document.getElementById(
      `category-${category}`,
    ).checked;
  });
  localStorage.setItem(
    PARTY_PREFS_KEY,
    JSON.stringify({ enabledCategories, armorMode: dom.armorMode.value }),
  );
};

const getDefaultRandomizerOptions = () => ({
  warbondOptions: Object.fromEntries(
    Array.from(document.querySelectorAll(".warbondCheckboxes"), (checkbox) => [
      checkbox.id,
      true,
    ]),
  ),
  stratagemOptions: Object.fromEntries(
    STRAT_TYPE_GROUPS.flatMap(({ key }) => [
      [`only${key}Radio`, false],
      [`no${key}Radio`, false],
      [`default${key}Radio`, true],
    ]),
  ),
  supplyAmountOptions: {
    oneSupportCheck: false,
    oneBackpackCheck: false,
    alwaysSupportCheck: false,
    alwaysBackpackCheck: false,
  },
});

const readRandomizerOptions = () => {
  const defaults = getDefaultRandomizerOptions();
  const stored = safeParse(localStorage.getItem("randomizerOptions"), {});
  return {
    warbondOptions: {
      ...defaults.warbondOptions,
      ...(stored.warbondOptions || {}),
    },
    stratagemOptions: {
      ...defaults.stratagemOptions,
      ...(stored.stratagemOptions || {}),
    },
    supplyAmountOptions: {
      ...defaults.supplyAmountOptions,
      ...(stored.supplyAmountOptions || {}),
    },
  };
};

const writeRandomizerOption = (group, element) => {
  const options = readRandomizerOptions();
  options[group][element.id] = element.checked;
  localStorage.setItem("randomizerOptions", JSON.stringify(options));
};

const writeAllStratagemOptions = () => {
  const options = readRandomizerOptions();
  document.querySelectorAll(".strat-type-radio").forEach((radio) => {
    options.stratagemOptions[radio.id] = radio.checked;
  });
  localStorage.setItem("randomizerOptions", JSON.stringify(options));
};

const renderStratagemTypeOptions = () => {
  STRAT_TYPE_GROUPS.forEach(({ label, key }) => {
    const column = document.createElement("div");
    column.className = "col-6";
    const heading = document.createElement("h3");
    heading.className = "h5 text-light";
    heading.textContent = label;
    column.appendChild(heading);

    [
      { prefix: "only", label: `Only ${label}` },
      { prefix: "no", label: `No ${label}` },
      { prefix: "default", label: "Default" },
    ].forEach((option) => {
      const wrapper = document.createElement("div");
      wrapper.className = "form-check";
      const input = document.createElement("input");
      input.className = "form-check-input strat-type-radio";
      input.type = "radio";
      input.name = key;
      input.id = `${option.prefix}${key}Radio`;
      input.value = option.prefix;
      const labelElement = document.createElement("label");
      labelElement.className = "form-check-label text-white";
      labelElement.htmlFor = input.id;
      labelElement.textContent = option.label;
      wrapper.append(input, labelElement);
      column.appendChild(wrapper);
    });
    dom.stratagemTypeOptions.appendChild(column);
  });
};

const updateToggleAllWarbonds = () => {
  const toggle = document.getElementById("toggleAllWarbonds");
  const checkboxes = [...document.querySelectorAll(".warbondCheckboxes")];
  const checkedCount = checkboxes.filter((checkbox) => checkbox.checked).length;
  toggle.checked = checkedCount === checkboxes.length;
  toggle.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
};

const updateOptionAvailability = () => {
  const activeOnly = STRAT_TYPE_GROUPS.find(({ key }) =>
    document.getElementById(`only${key}Radio`)?.checked,
  );
  document.querySelectorAll(".supply-option").forEach((checkbox) => {
    checkbox.disabled = Boolean(activeOnly);
  });
  document.querySelectorAll(".strat-type-radio").forEach((radio) => {
    if (!activeOnly) {
      radio.disabled = false;
      return;
    }
    radio.disabled = !radio.id.includes(activeOnly.key);
  });
};

const initializeOptions = () => {
  renderStratagemTypeOptions();
  const options = readRandomizerOptions();
  [options.warbondOptions, options.supplyAmountOptions].forEach((group) => {
    Object.entries(group).forEach(([id, checked]) => {
      const element = document.getElementById(id);
      if (element) element.checked = checked;
    });
  });
  const storedOnlyGroup = STRAT_TYPE_GROUPS.find(
    ({ key }) => options.stratagemOptions[`only${key}Radio`],
  );
  STRAT_TYPE_GROUPS.forEach(({ key }) => {
    const selectedId = storedOnlyGroup
      ? storedOnlyGroup.key === key
        ? `only${key}Radio`
        : `default${key}Radio`
      : options.stratagemOptions[`no${key}Radio`]
        ? `no${key}Radio`
        : `default${key}Radio`;
    document.getElementById(selectedId).checked = true;
  });
  writeAllStratagemOptions();

  document.querySelectorAll(".warbondCheckboxes").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      writeRandomizerOption("warbondOptions", checkbox);
      updateToggleAllWarbonds();
    });
  });
  document.getElementById("toggleAllWarbonds").addEventListener("change", (event) => {
    document.querySelectorAll(".warbondCheckboxes").forEach((checkbox) => {
      checkbox.checked = event.target.checked;
      writeRandomizerOption("warbondOptions", checkbox);
    });
    updateToggleAllWarbonds();
  });
  document.querySelectorAll(".supply-option").forEach((checkbox) => {
    checkbox.addEventListener("change", () =>
      writeRandomizerOption("supplyAmountOptions", checkbox),
    );
  });
  document.querySelectorAll(".strat-type-radio").forEach((radio) => {
    radio.addEventListener("change", () => {
      writeAllStratagemOptions();
      updateOptionAvailability();
    });
  });
  updateToggleAllWarbonds();
  updateOptionAvailability();
};

const renderCategoryToggles = () => {
  const preferences = loadPreferences();
  CATEGORY_ORDER.forEach((category) => {
    const column = document.createElement("div");
    column.className = "col-6 col-md-4 col-lg-2";
    const wrapper = document.createElement("div");
    wrapper.className = "form-check party-category-toggle";
    const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.id = `category-${category}`;
    input.checked = preferences.enabledCategories[category];
    const label = document.createElement("label");
    label.className = "form-check-label text-light";
    label.htmlFor = input.id;
    label.textContent = CATEGORY_META[category].plural;
    wrapper.append(input, label);
    column.appendChild(wrapper);
    dom.categoryToggles.appendChild(column);
    input.addEventListener("change", () => {
      updateArmorModeVisibility();
      savePreferences();
    });
  });
  dom.armorMode.value = preferences.armorMode;
  dom.armorMode.addEventListener("change", savePreferences);
  updateArmorModeVisibility();
};

const updateArmorModeVisibility = () => {
  const enabled = document.getElementById("category-armor")?.checked;
  dom.armorModeGroup.classList.toggle("d-none", !enabled);
};

const renderPlayerInputs = () => {
  const count = Number(dom.partySize.value);
  const existingNames = [...dom.playerNameInputs.querySelectorAll("input")].map(
    (input) => input.value,
  );
  dom.playerNameInputs.replaceChildren();
  for (let index = 0; index < count; index += 1) {
    const column = document.createElement("div");
    column.className = "col-12 col-md-6";
    const input = document.createElement("input");
    input.className = "form-control";
    input.maxLength = 24;
    input.setAttribute("aria-label", `Player ${index + 1} name`);
    input.placeholder = `Helldiver ${index + 1}`;
    input.value = existingNames[index] || `Helldiver ${index + 1}`;
    column.appendChild(input);
    dom.playerNameInputs.appendChild(column);
  }
};

const captureFilterSnapshot = () => {
  const checkedWarbonds = [...document.querySelectorAll(".warbondCheckboxes")]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.id);
  const stratagemOptions = {};
  document.querySelectorAll(".strat-type-radio").forEach((radio) => {
    stratagemOptions[radio.id] = radio.checked;
  });
  const supplyAmountOptions = {};
  document.querySelectorAll(".supply-option").forEach((checkbox) => {
    supplyAmountOptions[checkbox.id] = checkbox.checked && !checkbox.disabled;
  });
  return { checkedWarbonds, stratagemOptions, supplyAmountOptions };
};

const filterByWarbond = (items, snapshot) => {
  const allowed = new Set(snapshot.checkedWarbonds);
  return items.filter(
    (item) => item.warbondCode === "none" || allowed.has(item.warbondCode),
  );
};

const filterStratagemTypes = (items, snapshot) => {
  const onlyGroup = STRAT_TYPE_GROUPS.find(
    ({ key }) => snapshot.stratagemOptions[`only${key}Radio`],
  );
  if (onlyGroup) {
    return items.filter((item) => item.category === onlyGroup.category);
  }
  const excluded = STRAT_TYPE_GROUPS.filter(
    ({ key }) => snapshot.stratagemOptions[`no${key}Radio`],
  ).map(({ category }) => category);
  return items.filter((item) => !excluded.includes(item.category));
};

const getEnabledCategories = () =>
  Object.fromEntries(
    CATEGORY_ORDER.map((category) => [
      category,
      document.getElementById(`category-${category}`).checked,
    ]),
  );

const generatePools = (partySize, enabledCategories, armorMode, snapshot) => {
  const pools = {};
  const equipmentAmount = partySize + 1;
  const sourceLists = {
    primary: PRIMARIES,
    secondary: SECONDARIES,
    throwable: THROWABLES,
    booster: BOOSTERS,
    armor:
      armorMode === "passive"
        ? ARMOR_PASSIVES
        : armorMode === "set"
          ? ARMOR_SETS
          : ARMOR_SIZES,
  };

  for (const category of PartyDraftEngine.EQUIPMENT_CATEGORIES) {
    if (!enabledCategories[category]) continue;
    if (category === "armor" && armorMode === "size") {
      pools.armor = ARMOR_SIZES.map((item) => item.internalName);
      continue;
    }
    const candidates = filterByWarbond(sourceLists[category], snapshot);
    const selected = PartyDraftEngine.sampleUnique(candidates, equipmentAmount);
    if (!selected) {
      throw new Error(
        `${CATEGORY_META[category].label} needs ${equipmentAmount} unique options, but the current Warbond filters leave ${candidates.length}.`,
      );
    }
    pools[category] = selected.map((item) => item.internalName);
  }

  if (enabledCategories.stratagem) {
    const amount = partySize * 4 + 2;
    const candidates = filterStratagemTypes(
      filterByWarbond(STRATAGEMS, snapshot),
      snapshot,
    );
    if (candidates.length < amount) {
      throw new Error(
        `Stratagems need ${amount} unique options, but the current filters leave ${candidates.length}.`,
      );
    }
    const supply = snapshot.supplyAmountOptions;
    const selected = PartyDraftEngine.sampleConstrainedStratagems(
      candidates,
      amount,
      partySize,
      {
        oneSupport: supply.oneSupportCheck,
        oneBackpack: supply.oneBackpackCheck,
        alwaysSupport: supply.alwaysSupportCheck,
        alwaysBackpack: supply.alwaysBackpackCheck,
      },
    );
    if (!selected) {
      throw new Error(
        `The ${amount}-card Stratagem pool cannot satisfy the selected support weapon and backpack rules. Adjust those options and try again.`,
      );
    }
    pools.stratagem = selected.map((item) => item.internalName);
  }
  return pools;
};

const createEmptyPicks = (players) =>
  Object.fromEntries(
    players.map((player) => [
      player.id,
      {
        primary: null,
        secondary: null,
        armor: null,
        throwable: null,
        booster: null,
        stratagems: [],
      },
    ]),
  );

const showSetupError = (message) => {
  dom.setupError.textContent = message;
  dom.setupError.classList.remove("d-none");
};

const startDraft = () => {
  dom.setupError.classList.add("d-none");
  const partySize = Number(dom.partySize.value);
  const players = [...dom.playerNameInputs.querySelectorAll("input")].map(
    (input, index) => ({
      id: `player-${index + 1}`,
      name: input.value.trim().slice(0, 24) || `Helldiver ${index + 1}`,
    }),
  );
  const enabledCategories = getEnabledCategories();
  const armorMode = dom.armorMode.value;
  const filterSnapshot = captureFilterSnapshot();

  try {
    const pools = generatePools(
      partySize,
      enabledCategories,
      armorMode,
      filterSnapshot,
    );
    const playerOrder = PartyDraftEngine.shuffle(players.map((player) => player.id));
    const turns = PartyDraftEngine.buildTurnQueue(
      playerOrder,
      enabledCategories,
    );
    draftState = {
      version: DRAFT_VERSION,
      status: turns.length ? "drafting" : "complete",
      partySize,
      players,
      playerOrder,
      enabledCategories,
      armorMode,
      filterSnapshot,
      pools,
      turns,
      cursor: 0,
      picks: createEmptyPicks(players),
      history: [],
    };
    selectedItemId = null;
    saveDraft();
    renderDraft();
  } catch (error) {
    showSetupError(error.message);
  }
};

const getAllItems = () => [
  ...PRIMARIES,
  ...SECONDARIES,
  ...THROWABLES,
  ...BOOSTERS,
  ...STRATAGEMS,
  ...ARMOR_PASSIVES,
  ...ARMOR_SETS,
  ...ARMOR_SIZES,
];

const itemCatalog = new Map(
  getAllItems().map((item) => [item.internalName, item]),
);

const getPlayer = (playerId) =>
  draftState.players.find((player) => player.id === playerId);

const getImagePath = (item) => {
  if (item.type === "Stratagem") return `../images/stratagems/${item.imageURL}`;
  if (item.tags?.includes("ArmorPassive")) {
    return `../images/armorpassives/${item.imageURL}`;
  }
  if (item.category === "armor" && !item.tags?.includes("ArmorSize")) {
    return `../images/armor/${item.imageURL}`;
  }
  return `../images/equipment/${item.imageURL}`;
};

const getArmorSizeIcon = (item) => ({
  light: "bi-shield-minus",
  medium: "bi-shield",
  heavy: "bi-shield-plus",
})[item.internalName] || "bi-shield";

const createItemVisual = (item, compact = false) => {
  const wrapper = document.createElement("div");
  wrapper.className = compact ? "party-item-compact" : "party-item-visual";
  if (item.tags?.includes("ArmorSize")) {
    const icon = document.createElement("i");
    icon.className = `bi ${getArmorSizeIcon(item)} party-size-icon`;
    wrapper.appendChild(icon);
  } else {
    const image = document.createElement("img");
    image.src = getImagePath(item);
    image.alt = "";
    image.loading = "lazy";
    wrapper.appendChild(image);
  }
  const name = document.createElement("span");
  name.textContent = item.displayName;
  wrapper.appendChild(name);
  return wrapper;
};

const getUsedItemIds = (category) =>
  new Set(
    draftState.history
      .filter((pick) => pick.category === category)
      .map((pick) => pick.itemId),
  );

const selectPoolItem = (itemId) => {
  selectedItemId = itemId;
  renderActivePool();
};

const renderActivePool = () => {
  dom.draftPool.replaceChildren();
  const turn = draftState.turns[draftState.cursor];
  if (!turn) return;
  const used = getUsedItemIds(turn.category);
  const reusableArmorSizes =
    turn.category === "armor" && draftState.armorMode === "size";

  draftState.pools[turn.category].forEach((itemId) => {
    const item = itemCatalog.get(itemId);
    const claimed = used.has(itemId) && !reusableArmorSizes;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "party-pool-card";
    button.classList.toggle("is-selected", selectedItemId === itemId);
    button.classList.toggle("is-claimed", claimed);
    button.disabled = claimed;
    button.setAttribute("aria-pressed", selectedItemId === itemId ? "true" : "false");
    button.appendChild(createItemVisual(item));
    if (claimed) {
      const badge = document.createElement("span");
      badge.className = "badge bg-secondary party-claimed-badge";
      badge.textContent = "Claimed";
      button.appendChild(badge);
    } else {
      button.addEventListener("click", () => selectPoolItem(itemId));
    }
    dom.draftPool.appendChild(button);
  });
  dom.confirmPickButton.disabled = !selectedItemId;
};

const renderTurnOrder = (turn) => {
  dom.turnOrder.replaceChildren();
  const turnsThisRound = draftState.turns.filter(
    (candidate) =>
      candidate.category === turn.category && candidate.round === turn.round,
  );
  turnsThisRound.forEach((candidate) => {
    const chip = document.createElement("span");
    chip.className = "party-turn-chip";
    chip.classList.toggle("active", candidate.playerId === turn.playerId);
    chip.textContent = getPlayer(candidate.playerId).name;
    dom.turnOrder.appendChild(chip);
  });
};

const createLoadoutSlot = (category, player) => {
  const slot = document.createElement("div");
  slot.className = "party-loadout-slot";
  const label = document.createElement("strong");
  label.textContent = CATEGORY_META[category].label;
  slot.appendChild(label);
  if (!draftState.enabledCategories[category]) {
    const freeChoice = document.createElement("span");
    freeChoice.className = "text-warning";
    freeChoice.textContent = "Free Choice";
    slot.appendChild(freeChoice);
    return slot;
  }

  const pickedId = draftState.picks[player.id][category];
  if (!pickedId) {
    const empty = document.createElement("span");
    empty.className = "text-secondary";
    empty.textContent = "Not drafted";
    slot.appendChild(empty);
    return slot;
  }
  slot.appendChild(createItemVisual(itemCatalog.get(pickedId), true));
  return slot;
};

const renderLoadoutBoard = () => {
  dom.loadoutBoard.replaceChildren();
  const activePlayerId = draftState.turns[draftState.cursor]?.playerId;
  draftState.playerOrder.forEach((playerId) => {
    const player = getPlayer(playerId);
    const column = document.createElement("div");
    column.className = "col-12 col-md-6 col-xl-3";
    const card = document.createElement("article");
    card.className = "party-loadout-card";
    card.classList.toggle("active", activePlayerId === playerId);
    const heading = document.createElement("h3");
    heading.className = "h5 text-light";
    heading.textContent = player.name;
    card.appendChild(heading);

    PartyDraftEngine.EQUIPMENT_CATEGORIES.forEach((category) => {
      card.appendChild(createLoadoutSlot(category, player));
    });

    const stratSlot = document.createElement("div");
    stratSlot.className = "party-loadout-slot";
    const stratLabel = document.createElement("strong");
    stratLabel.textContent = "Stratagems";
    stratSlot.appendChild(stratLabel);
    if (!draftState.enabledCategories.stratagem) {
      const freeChoice = document.createElement("span");
      freeChoice.className = "text-warning";
      freeChoice.textContent = "Free Choice ×4";
      stratSlot.appendChild(freeChoice);
    } else if (!draftState.picks[player.id].stratagems.length) {
      const empty = document.createElement("span");
      empty.className = "text-secondary";
      empty.textContent = "Not drafted";
      stratSlot.appendChild(empty);
    } else {
      const list = document.createElement("div");
      list.className = "party-strat-list";
      draftState.picks[player.id].stratagems.forEach((itemId) => {
        list.appendChild(createItemVisual(itemCatalog.get(itemId), true));
      });
      stratSlot.appendChild(list);
    }
    card.appendChild(stratSlot);
    column.appendChild(card);
    dom.loadoutBoard.appendChild(column);
  });
};

const renderUnusedOptions = () => {
  dom.unusedOptions.replaceChildren();
  CATEGORY_ORDER.forEach((category) => {
    if (!draftState.enabledCategories[category]) return;
    const used = getUsedItemIds(category);
    const unused = draftState.pools[category].filter((itemId) => !used.has(itemId));
    if (!unused.length) return;
    const column = document.createElement("div");
    column.className = "col-12 col-lg-6";
    const group = document.createElement("div");
    group.className = "party-unused-group";
    const heading = document.createElement("h3");
    heading.className = "h6 text-light";
    heading.textContent = CATEGORY_META[category].plural;
    group.appendChild(heading);
    unused.forEach((itemId) => {
      group.appendChild(createItemVisual(itemCatalog.get(itemId), true));
    });
    column.appendChild(group);
    dom.unusedOptions.appendChild(column);
  });
};

const renderDraft = () => {
  dom.setupPanel.classList.add("d-none");
  dom.draftPanel.classList.remove("d-none");
  dom.optionsDraftNotice.classList.remove("d-none");
  dom.undoPickButton.disabled = draftState.history.length === 0;
  dom.draftProgress.textContent = `${draftState.cursor} of ${draftState.turns.length} picks complete`;
  renderLoadoutBoard();

  if (draftState.status === "complete") {
    dom.draftHeading.textContent = "Party draft complete";
    dom.activeDraftArea.classList.add("d-none");
    dom.completionMessage.classList.remove("d-none");
    dom.unusedSection.classList.remove("d-none");
    renderUnusedOptions();
    return;
  }

  dom.draftHeading.textContent = "Draft in progress";
  dom.activeDraftArea.classList.remove("d-none");
  dom.completionMessage.classList.add("d-none");
  dom.unusedSection.classList.add("d-none");
  const turn = draftState.turns[draftState.cursor];
  const player = getPlayer(turn.playerId);
  const roundText =
    turn.category === "stratagem"
      ? `Stratagem round ${turn.round + 1} of 4`
      : CATEGORY_META[turn.category].label;
  dom.roundLabel.textContent = roundText;
  dom.currentPlayerPrompt.textContent = `${player.name}, choose your ${CATEGORY_META[turn.category].label.toLowerCase()}`;
  dom.poolHelp.textContent =
    turn.category === "armor" && draftState.armorMode === "size"
      ? "Armor sizes may be chosen by more than one player."
      : "Claimed options are unavailable to the rest of the party.";
  renderTurnOrder(turn);
  renderActivePool();
};

const confirmPick = () => {
  if (!draftState || !selectedItemId || draftState.status !== "drafting") return;
  const turn = draftState.turns[draftState.cursor];
  const used = getUsedItemIds(turn.category);
  const reusableArmorSizes =
    turn.category === "armor" && draftState.armorMode === "size";
  if (used.has(selectedItemId) && !reusableArmorSizes) return;
  if (!draftState.pools[turn.category].includes(selectedItemId)) return;

  const record = {
    turnIndex: draftState.cursor,
    playerId: turn.playerId,
    category: turn.category,
    itemId: selectedItemId,
  };
  if (turn.category === "stratagem") {
    draftState.picks[turn.playerId].stratagems.push(selectedItemId);
  } else {
    draftState.picks[turn.playerId][turn.category] = selectedItemId;
  }
  draftState.history.push(record);
  draftState.cursor += 1;
  if (draftState.cursor >= draftState.turns.length) {
    draftState.status = "complete";
  }
  selectedItemId = null;
  saveDraft();
  renderDraft();
};

const undoPick = () => {
  if (!draftState?.history.length) return;
  const record = draftState.history.pop();
  if (record.category === "stratagem") {
    const picks = draftState.picks[record.playerId].stratagems;
    const index = picks.lastIndexOf(record.itemId);
    if (index >= 0) picks.splice(index, 1);
  } else {
    draftState.picks[record.playerId][record.category] = null;
  }
  draftState.cursor = record.turnIndex;
  draftState.status = "drafting";
  selectedItemId = null;
  saveDraft();
  renderDraft();
};

const saveDraft = () => {
  localStorage.setItem(PARTY_DRAFT_KEY, JSON.stringify(draftState));
};

const isValidSavedDraft = (candidate) => {
  if (
    !candidate ||
    candidate.version !== DRAFT_VERSION ||
    !Array.isArray(candidate.players) ||
    candidate.players.length < 1 ||
    candidate.players.length > 4 ||
    candidate.partySize !== candidate.players.length ||
    !Array.isArray(candidate.playerOrder) ||
    !Array.isArray(candidate.turns) ||
    !Array.isArray(candidate.history) ||
    !candidate.pools ||
    !candidate.picks ||
    candidate.cursor < 0 ||
    candidate.cursor > candidate.turns.length
  ) {
    return false;
  }

  const playerIds = candidate.players.map((player) => player.id);
  if (
    candidate.players.some(
      (player) =>
        typeof player.id !== "string" || typeof player.name !== "string",
    ) ||
    new Set(playerIds).size !== playerIds.length ||
    candidate.playerOrder.length !== playerIds.length ||
    new Set(candidate.playerOrder).size !== playerIds.length ||
    candidate.playerOrder.some((playerId) => !playerIds.includes(playerId)) ||
    CATEGORY_ORDER.some(
      (category) => typeof candidate.enabledCategories?.[category] !== "boolean",
    ) ||
    !["passive", "set", "size"].includes(candidate.armorMode)
  ) {
    return false;
  }

  const expectedTurns = PartyDraftEngine.buildTurnQueue(
    candidate.playerOrder,
    candidate.enabledCategories,
  );
  if (JSON.stringify(expectedTurns) !== JSON.stringify(candidate.turns)) {
    return false;
  }

  for (const category of CATEGORY_ORDER) {
    if (!candidate.enabledCategories[category]) continue;
    const pool = candidate.pools[category];
    const expectedSize =
      category === "stratagem"
        ? candidate.partySize * 4 + 2
        : category === "armor" && candidate.armorMode === "size"
          ? 3
          : candidate.partySize + 1;
    const validCategoryIds = new Set(
      category === "primary"
        ? PRIMARIES.map((item) => item.internalName)
        : category === "secondary"
          ? SECONDARIES.map((item) => item.internalName)
          : category === "throwable"
            ? THROWABLES.map((item) => item.internalName)
            : category === "booster"
              ? BOOSTERS.map((item) => item.internalName)
              : category === "stratagem"
                ? STRATAGEMS.map((item) => item.internalName)
                : (candidate.armorMode === "passive"
                    ? ARMOR_PASSIVES
                    : candidate.armorMode === "set"
                      ? ARMOR_SETS
                      : ARMOR_SIZES
                  ).map((item) => item.internalName),
    );
    if (
      !Array.isArray(pool) ||
      pool.length !== expectedSize ||
      new Set(pool).size !== pool.length ||
      pool.some((itemId) => !validCategoryIds.has(itemId))
    ) {
      return false;
    }
  }

  if (
    candidate.history.length !== candidate.cursor ||
    candidate.status !==
      (candidate.cursor === candidate.turns.length ? "complete" : "drafting")
  ) {
    return false;
  }

  const replayedPicks = createEmptyPicks(candidate.players);
  const usedByCategory = Object.fromEntries(
    CATEGORY_ORDER.map((category) => [category, new Set()]),
  );
  for (let index = 0; index < candidate.history.length; index += 1) {
    const record = candidate.history[index];
    const turn = candidate.turns[index];
    const reusableArmorSize =
      record?.category === "armor" && candidate.armorMode === "size";
    if (
      !record ||
      record.turnIndex !== index ||
      record.playerId !== turn.playerId ||
      record.category !== turn.category ||
      !candidate.pools[record.category]?.includes(record.itemId) ||
      (usedByCategory[record.category].has(record.itemId) && !reusableArmorSize)
    ) {
      return false;
    }
    usedByCategory[record.category].add(record.itemId);
    if (record.category === "stratagem") {
      replayedPicks[record.playerId].stratagems.push(record.itemId);
    } else {
      replayedPicks[record.playerId][record.category] = record.itemId;
    }
  }

  return JSON.stringify(replayedPicks) === JSON.stringify(candidate.picks);
};

const restoreDraft = () => {
  const stored = safeParse(localStorage.getItem(PARTY_DRAFT_KEY), null);
  if (!stored) return false;
  if (!isValidSavedDraft(stored)) {
    localStorage.removeItem(PARTY_DRAFT_KEY);
    return false;
  }
  draftState = stored;
  selectedItemId = null;
  renderDraft();
  return true;
};

const beginNewDraft = () => {
  if (
    draftState &&
    !window.confirm("Start a new draft? The current party draft will be cleared.")
  ) {
    return;
  }
  localStorage.removeItem(PARTY_DRAFT_KEY);
  draftState = null;
  selectedItemId = null;
  dom.draftPanel.classList.add("d-none");
  dom.setupPanel.classList.remove("d-none");
  dom.optionsDraftNotice.classList.add("d-none");
  dom.setupError.classList.add("d-none");
};

const initialize = () => {
  initializeOptions();
  renderCategoryToggles();
  renderPlayerInputs();
  dom.partySize.addEventListener("change", renderPlayerInputs);
  dom.startDraftButton.addEventListener("click", startDraft);
  dom.confirmPickButton.addEventListener("click", confirmPick);
  dom.undoPickButton.addEventListener("click", undoPick);
  dom.newDraftButton.addEventListener("click", beginNewDraft);
  restoreDraft();
};

initialize();
