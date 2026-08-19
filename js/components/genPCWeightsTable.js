const PC_TIER_LABELS = ["S", "A", "B", "C"];

const DEFAULT_PC_WEIGHTS = {
  diff4: [5, 20, 50, 25],
  diff6: [5, 20, 50, 25],
  diff8: [5, 20, 50, 25],
};

// convert individual weights to cumulative breakpoints for getDropRate
const weightsToCumulative = (weights) => {
  const result = [];
  let total = 0;
  for (let i = 0; i < weights.length - 1; i++) {
    total += weights[i];
    result.push(total);
  }
  return result; // e.g. [5, 25, 75]
};

// convert cumulative breakpoints back to individual weights for display
const cumulativeToWeights = (breakpoints) => {
  const weights = [];
  weights.push(breakpoints[0]);
  weights.push(breakpoints[1] - breakpoints[0]);
  weights.push(breakpoints[2] - breakpoints[1]);
  weights.push(100 - breakpoints[2]);
  return weights;
};

let pcWeights = {
  diff4: [...DEFAULT_PC_WEIGHTS.diff4],
  diff6: [...DEFAULT_PC_WEIGHTS.diff6],
  diff8: [...DEFAULT_PC_WEIGHTS.diff8],
};

const updatePCDropRateInputs = () => {
  const diff4Cumulative = weightsToCumulative(pcWeights.diff4);
  const diff6Cumulative = weightsToCumulative(pcWeights.diff6);
  const diff8Cumulative = weightsToCumulative(pcWeights.diff8);
  diff4Input.value = diff4Cumulative.join(",");
  diff6Input.value = diff6Cumulative.join(",");
  diff8Input.value = diff8Cumulative.join(",");
};

const updateDiffTotal = (diff) => {
  const total = pcWeights[diff].reduce((a, b) => a + b, 0);
  const remainder = 100 - total;
  const isValid = total <= 100;
  const totalEl = document.getElementById(`weightTotal_${diff}`);
  if (totalEl) {
    totalEl.className = `fw-bold text-${isValid ? (remainder > 0 ? "warning" : "success") : "danger"}`;
    totalEl.innerHTML = `${total}%${remainder > 0 && isValid ? `<br><small class="text-warning" style="font-size:0.65rem">+${remainder}% wild</small>` : ""}`;
  }
};

const resetPCWeightsToDefault = () => {
  pcWeights = {
    diff4: [...DEFAULT_PC_WEIGHTS.diff4],
    diff6: [...DEFAULT_PC_WEIGHTS.diff6],
    diff8: [...DEFAULT_PC_WEIGHTS.diff8],
  };
  updatePCDropRateInputs();
  genPCWeightsTable();
  saveProgress();
};

const getCurrentDiffWeights = () => {
  if (missionCounter <= 7) return pcWeights.diff4;
  if (missionCounter <= 13) return pcWeights.diff6;
  return pcWeights.diff8;
};

const genPCWeightsTable = () => {
  const container = document.getElementById("pcWeightsTableContainer");
  if (!container) return;

  const locked = !isFirstMission();

  const diffs = [
    { key: "diff4", label: "Diff 4-5" },
    { key: "diff6", label: "Diff 6-7" },
    { key: "diff8", label: "Diff 8-10" },
  ];

  let html = `
    <p class="text-white mb-1" style="font-size: 0.85rem">
        Set the percentage chance for each tier to appear as a reward at each difficulty range.
        If the total is less than 100%, the remaining percentage is a <b class="text-warning">wildcard</b> — 
        a completely random item from any tier.
    </p>
    <p class="text-white mb-2" style="font-size: 0.85rem">
      NOTE: Diff 3 always uses S=0%, A=20%, B=50%, C=30%.
    </p>
    <div class="table-responsive">
      <table class="table table-dark table-bordered table-sm text-center">
        <thead>
          <tr>
            <th class="text-secondary">Tier</th>
            ${diffs.map((d) => `<th class="text-secondary">${d.label}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
  `;

  PC_TIER_LABELS.forEach((tier, tierIndex) => {
    html += `<tr>`;
    html += `<td class="text-white fw-bold">${tier}</td>`;
    diffs.forEach(({ key }) => {
      const value = pcWeights[key][tierIndex];
      html += `
        <td>
          <input
            type="number"
            class="form-control form-control-sm text-center pc-weight-input bg-dark text-white border-secondary"
            style="width: 60px; margin: auto;"
            min="0"
            max="100"
            value="${value}"
            data-tier="${tierIndex}"
            data-diff="${key}"
            ${locked ? "disabled" : ""}
          />
        </td>
      `;
    });
    html += `</tr>`;
  });

  // totals row
  html += `<tr class="border-top border-secondary">`;
  html += `<td class="text-secondary fw-bold">Total</td>`;
  diffs.forEach(({ key }) => {
    const total = pcWeights[key].reduce((a, b) => a + b, 0);
    const remainder = 100 - total;
    const isValid = total <= 100;
    html += `
    <td>
      <span class="fw-bold text-${isValid ? (remainder > 0 ? "warning" : "success") : "danger"}" id="weightTotal_${key}">
        ${total}%${remainder > 0 && isValid ? `<br><small class="text-warning" style="font-size:0.65rem">+${remainder}% wild</small>` : ""}
      </span>
    </td>
  `;
  });
  html += `</tr>`;

  html += `
      </tbody>
    </table>
  </div>
  `;

  if (!locked) {
    html += `
      <button class="btn btn-sm btn-outline-secondary mt-1" onclick="resetPCWeightsToDefault()">
        Reset to Default
      </button>
    `;
  }

  container.innerHTML = html;

  // attach listeners
  document.querySelectorAll(".pc-weight-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const tierIndex = parseInt(e.target.dataset.tier);
      const diff = e.target.dataset.diff;
      let value = parseInt(e.target.value) || 0;

      // only clamp so a single tier can't exceed 100, and total can't exceed 100
      const otherTiersTotal = pcWeights[diff].reduce(
        (sum, w, i) => (i !== tierIndex ? sum + w : sum),
        0,
      );
      const maxAllowed = 100 - otherTiersTotal;
      value = Math.min(Math.max(0, value), maxAllowed);
      e.target.value = value;

      pcWeights[diff][tierIndex] = value;

      updateDiffTotal(diff);
      updatePCDropRateInputs();
      saveProgress();
    });
  });
};
