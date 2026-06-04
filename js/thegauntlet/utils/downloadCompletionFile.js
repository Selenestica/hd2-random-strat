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
    currentSpecialist,
  } = currentGame[0];

  let text = "";
  text += `The Gauntlet Challenge Summary\n=======================================\n\n`;
  text += `Stims Remaining: ${stimsAvailable}\n`;
  text += `Stratagems Remaining: ${stratsAvailable}\n`;
  text += `Reinforcements Remaining: ${reinforcementsAvailable}\n`;
  text += `Missions Failed: ${restarts}\n`;
  text += `Specialist: ${currentSpecialist.displayName}\n\n`;

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
