const genBBGameOverModal = async () => {
  const bbGameOverModalBody = document.getElementById("bbGameOverModalBody");
  const budgetBlitzSaveData = localStorage.getItem("budgetBlitzSaveData");
  if (!budgetBlitzSaveData) return;

  const savedGames = JSON.parse(budgetBlitzSaveData).savedGames;
  const currentGame = await savedGames.filter((sg) => {
    return sg.currentGame === true;
  })[0];
  const {
    credits,
    failedMissions,
    successfulMissions,
    purchasedItems,
    dateStarted,
  } = currentGame;

  let refundedItemsCredits = 0;
  for (let i = 0; i < purchasedItems.length; i++) {
    const quantity = purchasedItems[i].quantity;
    let cost = purchasedItems[i].cost;
    if (cost > 5) {
      cost = 5;
    }
    refundedItemsCredits += cost * quantity;
  }

  let creditsSubtractedForMissionsFailed = 150 * failedMissions;

  bbGameOverModalBody.innerHTML += `<p class="text-white">Missions Completed: ${successfulMissions}</p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white">Missions Failed: ${failedMissions}</p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white">Start Time: ${dateStarted}</p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white">End Time: ${getCurrentDateTime()}</p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white"><br /></p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white">Ending Credits: ${credits}</p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white">Credits from Refunded Equipment: ${refundedItemsCredits}</p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white">Missions Failed Penalty: -${creditsSubtractedForMissionsFailed}</p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white"><br /></p>`;
  bbGameOverModalBody.innerHTML += `<p class="text-white">Total Score: ${
    credits + refundedItemsCredits - creditsSubtractedForMissionsFailed
  }</p>`;

  const modal = new bootstrap.Modal(bbGameOverModal);
  modal.show();
};
