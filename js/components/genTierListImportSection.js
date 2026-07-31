let customTierMap = {}; // { internalName: 'tierLabel' } e.g. { "rs422railgun": "s" }

const TIER_LABEL_MAP = {
  0: "s",
  1: "a",
  2: "b",
  3: "c",
  4: "d",
};

const buildCustomTierMap = (tierList) => {
  const map = {};
  for (let i = 0; i < tierList.tiers.length; i++) {
    const tier = tierList.tiers[i];
    // use position in array to determine tier label (s, a, b, c, d...)
    // fall back to the tier's own lab label lowercased if beyond index 4
    const tierLabel = TIER_LABEL_MAP[i] ?? tier.lab.toLowerCase();
    for (let j = 0; j < tier.list.length; j++) {
      map[tier.list[j]] = tierLabel;
    }
  }
  customTierMap = map;
};

const clearCustomTierMap = () => {
  customTierMap = {};
};

const genTierListImportSection = () => {
  const container = document.getElementById("pcTierListImportContainer");
  if (!container) return;

  const tierMakerSaveData = localStorage.getItem("tierMakerSaveData2");
  if (!tierMakerSaveData) {
    container.innerHTML = `<p class="text-white mb-0">No saved tier lists found. Create one in the <a href="../tiermaker" target="_blank">Tier List Maker</a>.</p>`;
    return;
  }

  const lists = JSON.parse(tierMakerSaveData).lists;
  if (!lists || lists.length === 0) {
    container.innerHTML = `<p class="text-white mb-0">No saved tier lists found.</p>`;
    return;
  }

  const savedName = localStorage.getItem("pcCustomTierListName");

  const selectOptions = lists
    .map(
      (list, i) =>
        `<option value="${i}" ${savedName === list.dataName ? "selected" : ""}>${list.dataName}</option>`,
    )
    .join("");

  container.innerHTML = `
    <h5 class="text-white">Custom Tier List</h5>
    <p class="text-white mb-1" style="font-size: 0.85rem">
      Select a saved tier list to use as the rarity table for this run instead of the default tiers.
      Items not in the tier list will use their default tier.
      Only the top four tiers in the tier list will be used, and they will have rarity of S, A, B, C from top to bottom. Feel free to message me if you have any questions :)
    </p>
    <div class="d-flex gap-2 align-items-center">
      <select class="form-select" id="tierListSelect" style="max-width: 300px;">
        <option value="" ${!savedName ? "selected" : ""}>-- None (use defaults) --</option>
        ${selectOptions}
      </select>
      <button class="btn btn-success" type="button" onclick="applyCustomTierList()">Apply</button>
      <button class="btn btn-secondary" type="button" onclick="clearCustomTierList()">Clear</button>
    </div>
    <p class="text-success mt-1 mb-0 ${savedName ? "" : "d-none"}" id="tierListAppliedText">✓ Custom tier list applied!</p>
  `;

  if (savedName) {
    const match = lists.find((l) => l.dataName === savedName);
    if (match) buildCustomTierMap(match);
  }
};

const applyCustomTierList = () => {
  const select = document.getElementById("tierListSelect");
  const appliedText = document.getElementById("tierListAppliedText");
  if (!select.value) {
    clearCustomTierList();
    return;
  }
  const lists = JSON.parse(localStorage.getItem("tierMakerSaveData2")).lists;
  const selectedList = lists[parseInt(select.value)];
  buildCustomTierMap(selectedList);

  customTierListName = selectedList.dataName;
  localStorage.setItem("pcCustomTierListName", selectedList.dataName);

  appliedText.classList.remove("d-none");
  saveProgress();
};

const clearCustomTierList = () => {
  customTierMap = {};
  customTierListName = null;
  localStorage.removeItem("pcCustomTierListName");
  const select = document.getElementById("tierListSelect");
  if (select) select.value = "";
  const appliedText = document.getElementById("tierListAppliedText");
  if (appliedText) appliedText.classList.add("d-none");
};
