const downloadSOSaveFile = (fileName) => {
  const saveData = JSON.parse(localStorage.getItem("specialOpsSaveData"));
  if (!saveData) return;
  const file = JSON.stringify(saveData);
  if (!file) return;
  if (file) {
    const blob = new Blob([file], {
      type: "text/json",
    });
    const link = document.createElement("a");

    link.download = `${fileName}.txt`;
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
