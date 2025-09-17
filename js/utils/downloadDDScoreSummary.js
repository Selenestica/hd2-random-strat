const downloadDDScoreSummary = async () => {
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
  const debtDiversSaveData = localStorage.getItem("debtDiversSaveData");
  if (!debtDiversSaveData) return;

  const savedGames = JSON.parse(debtDiversSaveData).savedGames;
  const currentGame = savedGames.find((sg) => sg.currentGame === true);
  const {
    endingCredits,
    creditsPerMission,
    failedMissions,
    successfulMissions,
    dataName,
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
  let parScore = (par - totalMissions) * 100;
  if (difficulty === "Medium") {
    difficultyModifier = 250;
    par = 12;
  }
  if (difficulty === "Hard") {
    difficultyModifier = 500;
    par = 15;
  }

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

  let content = `Debt Divers Score Summary - ${difficulty}\n==========================\n\n`;
  content += `Data Name: ${dataName}\n`;
  content += `Date Started: ${dateStarted}\n`;
  content += `Super Samples Collected: ${superSamplesCollected}\n`;
  content += `High Value Items Collected: ${highValueItemsCollected}\n`;
  content += `Stars Earned: ${starsEarned}\n`;
  content += `Number of Accidentals: ${numOfAccidentals}\n`;
  content += `Total Credits Earned: ${totalCreditsEarned}\n`;
  content += `Ending Credits: ${endingCredits}\n`;
  content += `Failed Missions: ${failedMissions}\n`;
  content += `Total Mission Time Remaining: ${totalMissionTimeRemaining}\n\n`;

  content += `Par Modifier: ${parScore}\n`;
  content += `Total Mission Time Remaining: ${totalMissionTimeRemaining}\n`;
  content += `Missions Failed Penalty: ${failedMissions * 50}\n`;
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
