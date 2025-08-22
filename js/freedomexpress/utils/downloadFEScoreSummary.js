const downloadFEScoreSummary = async () => {
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
  const freedomExpressSaveData = localStorage.getItem("freedomExpressSaveData");
  if (!freedomExpressSaveData) return;

  const data = JSON.parse(freedomExpressSaveData);

  // will want to capture values for each mission and display them here
  const { dataName, points } = data;

  let content = `Freedom Express Score Summary\n================================\n\n`;
  content += `Data Name: ${dataName}\n\n`;
  content += `Points Earned: ${points}\n`;

  return { content, dataName };
};
