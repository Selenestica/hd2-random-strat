const downloadSOScoreSummary = async () => {
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
  const specialOpsSaveData = localStorage.getItem("specialOpsSaveData");
  if (!specialOpsSaveData) return;

  const data = JSON.parse(specialOpsSaveData);
  const { dataName, restarts, specialists, warbondCodes, points } = data;

  let warbondNames = [];
  let specialistsUnlocked = [];

  for (let i = 0; i < specialists.length; i++) {
    if (!specialists[i].locked) {
      specialistsUnlocked.push(specialists[i].displayName);
    }
  }

  for (let j = 0; j < warbondCodes.length; j++) {
    const index = parseInt(warbondCodes[j].replace("warbond", ""), 10);
    warbondNames.push(warbondsList[index]);
  }

  let content = `Special Operations Score Summary\n================================\n\n`;
  content += `Data Name: ${dataName}\n\n`;
  content += `Points Earned: ${points}\n`;
  content += `Restarts: ${restarts}\n\n`;
  content += `Specialists Unlocked: ${specialistsUnlocked.length}\n`;
  content += `${specialistsUnlocked.join(", ")}\n\n`;
  content += `Warbonds Used: ${warbondNames.length}\n`;
  content += `${warbondNames.join(", ")}\n`;

  return { content, dataName };
};
