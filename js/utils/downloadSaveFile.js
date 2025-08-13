const downloadSaveFile = (index, type) => {
  let lsData = "budgetBlitzSaveData";
  let listName = "savedGames";
  if (type === "pc") {
    lsData = "penitentCrusadeSaveData";
  }
  if (type === "tm") {
    lsData = "tierMakerSaveData";
    listName = "lists";
  }
  const saveData = JSON.parse(localStorage.getItem(lsData));
  if (!saveData) return;
  const file = JSON.stringify(saveData[listName][index]);
  if (!file) return;
  if (file) {
    const blob = new Blob([file], {
      type: "text/json",
    });
    const link = document.createElement("a");

    link.download = `${lsData}.txt`;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(
      ":"
    );

    const evt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove();
  }
};
