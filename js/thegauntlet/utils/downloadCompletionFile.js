const generateMissionsDataText = (missions) => {
  let text = "";
  for (let i = 0; i < missions.length; i++) {
    const {
      stimsUsed,
      reinforcementsUsed,
      stratsUsed,
      difficulty,
      enemy,
      specialist,
      failureReasons,
    } = missions[i];
    text += `-- Mission Difficulty: ${difficulty} --\n`;
    text += `Enemy: ${enemy}\n`;
    text += `Specialist: ${specialist}\n`;
    text += `Stims Used: ${stimsUsed}\n`;
    text += `Reinforcements Used: ${reinforcementsUsed}\n`;
    text += `Stratagems Used: ${stratsUsed}\n`;
    console.log(failureReasons);
    if (failureReasons && failureReasons.length > 0) {
      text += `Mission Failure\n`;
      for (let j = 0; j < failureReasons.length; j++) {
        text += ` * ${failureReasons[j]}\n`;
      }
    }
    text += `\n\n`;
  }
  return text;
};

const generateTextFileContent = async () => {
  const savedGames = JSON.parse(
    localStorage.getItem("theGauntletSaveData"),
  ).savedGames;
  const currentGame = savedGames.filter((sg) => sg.currentGame === true);

  if (currentGame.length !== 1) {
    console.log("SAVED GAME DATA CORRUPTED", savedGames);
    return;
  }

  const {
    restarts,
    stimsAvailable,
    stratsAvailable,
    reinforcementsAvailable,
    missionsData,
  } = currentGame[0];
  const missionsDataText = await generateMissionsDataText(missionsData);

  let text = "";
  text += `The Gauntlet Challenge Summary\n=======================================\n\n`;
  text += "ENDING STATS\n";
  text += `Stims Remaining: ${stimsAvailable}\n`;
  text += `Stratagems Remaining: ${stratsAvailable}\n`;
  text += `Reinforcements Remaining: ${reinforcementsAvailable}\n`;
  text += `Missions Failed: ${restarts}\n\n`;
  text += "MISSIONS BREAKDOWN\n";
  text += `${missionsDataText}`;

  return { text, fileName: currentGame[0].dataName };
};

const downloadCompletionFile = async () => {
  const { text, fileName } = await generateTextFileContent();

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName + ".txt";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
