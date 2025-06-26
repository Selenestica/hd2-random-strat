const downloadBBScoreTXT = async () => {
  const { content, dataName } = await generateTXTContent();

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${dataName}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateTXTContent = async () => {
  const budgetBlitzSaveData = localStorage.getItem("budgetBlitzSaveData");
  if (!budgetBlitzSaveData) return;

  const savedGames = JSON.parse(budgetBlitzSaveData).savedGames;
  const currentGame = savedGames.find((sg) => sg.currentGame === true);
  const {
    creditsPerMission,
    failedMissions,
    dataName,
    dateStarted,
    dateEnded,
  } = currentGame;

  let averageMissionTime = 0;
  let superSamplesCollected = 0;
  let highValueItemsCollected = 0;
  let starsEarned = 0;
  let totalCreditsEarned = 0;
  let totalScore = 0;
  const creditsSubtractedForMissionsFailed = 200 * failedMissions;

  for (const mission of creditsPerMission) {
    averageMissionTime += mission.timeRemaining;
    superSamplesCollected += mission.superSamplesCollected;
    highValueItemsCollected += mission.highValueItemsCollected;
    starsEarned += mission.starsEarned;
    totalCreditsEarned += mission.totalCredits;
  }

  superSamplesCollected += highValueItemsCollected * 2;
  averageMissionTime = averageMissionTime / creditsPerMission.length;
  totalScore = totalCreditsEarned - creditsSubtractedForMissionsFailed;

  let content = `Budget Blitz Score Summary\n==========================\n\n`;
  content += `Data Name: ${dataName}\n`;
  content += `Date Started: ${dateStarted}\n`;
  content += `Date Ended: ${dateEnded}\n`;
  content += `Super Samples Collected: ${superSamplesCollected}\n`;
  content += `High Value Items Collected: ${highValueItemsCollected}\n`;
  content += `Stars Earned: ${starsEarned}\n`;
  content += `Total Credits Earned: ${totalCreditsEarned}\n`;
  content += `Average Mission Time Remaining: ${averageMissionTime.toFixed(
    0
  )}%\n`;
  content += `Credits Subtracted (Missions Failed): ${creditsSubtractedForMissionsFailed}\n`;
  content += `Total Score: ${totalScore}\n\n`;

  creditsPerMission.forEach((mission, index) => {
    content += `Mission ${index + 1}:\n`;
    for (const [key, value] of Object.entries(mission)) {
      content += `  ${key}: ${value}\n`;
    }
    content += `\n`;
  });

  return { content, dataName };
};
