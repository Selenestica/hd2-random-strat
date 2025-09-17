const ddGameOverModal = document.getElementById("ddGameOverModal");
const ddGameOverModalBody = document.getElementById("ddGameOverModalBody");

const genDDGameOverModal = async () => {
  const debtDiversSaveData = localStorage.getItem("debtDiversSaveData");
  if (!debtDiversSaveData) return;

  const savedGames = JSON.parse(debtDiversSaveData).savedGames;
  const currentGame = await savedGames.filter((sg) => {
    return sg.currentGame === true;
  })[0];
  const {
    endingCredits,
    creditsPerMission,
    failedMissions,
    successfulMissions,
    dateStarted,
    difficulty,
  } = currentGame;

  let par = 9;
  let totalMissionTimeRemaining = 0;
  let superSamplesCollected = 0;
  let highValueItemsCollected = 0;
  let starsEarned = 0;
  let totalCreditsEarned = 0;
  let numOfDeaths = 0;
  let numOfAccidentals = 0;
  let difficultyModifier = 0;
  let totalMissions = failedMissions + successfulMissions;
  if (difficulty === "Medium") {
    difficultyModifier = 250;
    par = 12;
  }
  if (difficulty === "Hard") {
    difficultyModifier = 500;
    par = 16;
  }
  let parScore = (par - totalMissions) * 100;

  for (let j = 0; j < creditsPerMission.length; j++) {
    const missionInfo = creditsPerMission[j];
    totalMissionTimeRemaining += missionInfo.timeRemaining;
    superSamplesCollected += missionInfo.superSamplesCollected;
    highValueItemsCollected += missionInfo.highValueItemsCollected;
    starsEarned += missionInfo.starsEarned;
    totalCreditsEarned += missionInfo.totalCredits;
    numOfDeaths += missionInfo.numOfDeaths;
    numOfAccidentals += missionInfo.numOfAccidentals;
  }

  const totalScore = parScore + totalMissionTimeRemaining - failedMissions * 50;
  superSamplesCollected += highValueItemsCollected * 2;

  ddGameOverModalBody.innerHTML += `<h5 class="text-white">Breakdown:</h5>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Difficulty: ${difficulty}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Start Time: ${dateStarted}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Stars Earned: ${starsEarned}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Super Samples Collected: ${superSamplesCollected}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Total Credits Earned: ${totalCreditsEarned}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Number of Deaths: ${numOfDeaths}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Number of Accidentals: ${numOfAccidentals}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">High Value Items Collected: ${highValueItemsCollected}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Ending Credits: ${endingCredits}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Missions Failed: ${failedMissions}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white"><br /></p>`;
  ddGameOverModalBody.innerHTML += `<h5 class="text-white">Score:</h5>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Par Modifier: ${parScore}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Total Mission Time Remaining: ${totalMissionTimeRemaining}</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Missions Failed Penalty: (${
    failedMissions * 50
  })</p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white"><br /></p>`;
  ddGameOverModalBody.innerHTML += `<p class="mb-0 text-white">Total Score: ${totalScore}</p>`;

  const modal = new bootstrap.Modal(ddGameOverModal);
  modal.show();
};

// if the game over modal ever closes, reset the content
ddGameOverModal.addEventListener("hidden.bs.modal", () => {
  ddGameOverModalBody.innerHTML = "";
});
