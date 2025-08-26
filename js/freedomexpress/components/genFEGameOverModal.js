const feGameOverModal = document.getElementById("feGameOverModal");
const feGameOverModalBody = document.getElementById("feGameOverModalBody");

const genFEGameOverModal = async () => {
  const freedomExpressSaveData = localStorage.getItem("freedomExpressSaveData");
  if (!freedomExpressSaveData) return;

  const savedGames = JSON.parse(freedomExpressSaveData).savedGames;
  const currentGame = await savedGames.filter((sg) => {
    return sg.currentGame === true;
  })[0];
  const { pointsPerMission, points } = currentGame;

  let averageMissionTime = 0;
  let totalMissionTimeRemaining = 0;
  let highValueItemsCollected = 0;
  let numberOfDeaths = 0;
  let warpPacks = 0;
  let jumpPacks = 0;
  let supplyPacks = 0;
  let frvs = 0;

  for (let j = 0; j < pointsPerMission.length; j++) {
    const missionInfo = pointsPerMission[j];
    const { numOfDeaths, timeRemaining, hviCollected, randomStrat } =
      missionInfo;
    averageMissionTime += timeRemaining;
    totalMissionTimeRemaining += timeRemaining;
    if (hviCollected === true) {
      highValueItemsCollected += 1;
    }
    numberOfDeaths += numOfDeaths;
    if (randomStrat.displayName === "Warp Pack") {
      warpPacks += 1;
    }
    if (randomStrat.displayName === "Jump Pack") {
      jumpPacks += 1;
    }
    if (randomStrat.displayName === "Supply Pack") {
      supplyPacks += 1;
    }
    if (randomStrat.displayName === "Fast Recon Vehicle") {
      frvs += 1;
    }
  }

  averageMissionTime = averageMissionTime / 9;

  feGameOverModalBody.innerHTML += `<h5 class="text-white">Breakdown:</h5>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Number of Deaths: ${numberOfDeaths}</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">High Value Items Collected: ${highValueItemsCollected}</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Average Time Remaining: ${averageMissionTime.toFixed(
    0
  )}%</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Warp Packs: ${warpPacks}</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Jump Packs: ${jumpPacks}</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Supply Packs: ${supplyPacks}</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">FRVs: ${frvs}</p>`;

  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white"><br /></p>`;
  feGameOverModalBody.innerHTML += `<h5 class="text-white">Score:</h5>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Time Remaining Score: +${totalMissionTimeRemaining}</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">High Value Items Score: +${
    highValueItemsCollected * 10
  }</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Deaths Expense: -${numberOfDeaths}</p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white"><br /></p>`;
  feGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Total Score: ${points}</p>`;

  const modal = new bootstrap.Modal(feGameOverModal);
  modal.show();
};

// if the game over modal ever closes, reset the content
feGameOverModal.addEventListener("hidden.bs.modal", () => {
  feGameOverModalBody.innerHTML = "";
});
