const saveDataManagementModal = document.getElementById(
  "saveDataManagementModal"
);
const saveDataManagementModalSavesList = document.getElementById(
  "saveDataManagementModalSavesList"
);
const saveDataModalFunctionsDiv = document.getElementById(
  "saveDataModalFunctionsDiv"
);
const saveDataUploadInput = document.getElementById("saveDataUploadInput");
const uploadSaveFileButton = document.getElementById("uploadSaveFileButton");

let uploadedSaveFile = null;

const saveNewSaveFileName = async () => {
  const newSaveFileNameInput = document.getElementById("newSaveFileNameInput");
  const saveData = JSON.parse(localStorage.getItem("specialOpsSaveData"));
  if (!saveData) return;
  const updatedSaveFile = {
    ...saveData,
    dataName: newSaveFileNameInput.value
      ? newSaveFileNameInput.value
      : "Unnamed Save File",
    editedName: true,
  };
  await localStorage.setItem(
    "specialOpsSaveData",
    JSON.stringify(updatedSaveFile)
  );
  saveDataManagementModalSavesList.innerHTML = "";
  genSOSaveDataManagementModalContent();
};

const editSaveName = (oldName) => {
  saveDataModalFunctionsDiv.classList.toggle("d-none", true);
  saveDataManagementModalSavesList.innerHTML = "";
  saveDataManagementModalSavesList.innerHTML = `
    <p class="text-white mb-0">Rename save file:</p>
    <div id="saveDataNameEditDiv" class="my-1 d-flex" style="width: 90%">
      <input type="text" maxlength="50" id="newSaveFileNameInput" class="form-control" value="${oldName}">
      <button type="button" onclick="saveNewSaveFileName()" class="mx-1 btn btn-success btn-sm"><i class="bi bi-check-lg"></i></button>
    </div>
  `;
};

const genSOSaveDataManagementModalContent = () => {
  const saveData = JSON.parse(localStorage.getItem("specialOpsSaveData"));
  if (!saveData) {
    return;
  }
  saveDataModalFunctionsDiv.classList.toggle("d-none", false);

  saveDataManagementModalSavesList.innerHTML = `
      <div class="my-1" id="soSavedGameOptionDiv">
        <div id="savedGameOptionLabel" class="text-white">${saveData.dataName}</div>
        <button type="button" onclick="editSaveName('${saveData.dataName}')" class="mx-1 btn btn-primary btn-sm"><i class="bi bi-pencil-square"></i></button>
        <button type="button" onclick="downloadSOSaveFile('${saveData.dataName}')" class="btn btn-primary btn-sm"><i class="bi bi-download"></i></button>
      </div>
    `;
};

// delete saved game data
const deleteSavedGameData = async () => {
  await localStorage.removeItem("specialOpsSaveData");
  window.location.reload();
  startNewRun();
};

saveDataUploadInput.addEventListener("change", (e) => {
  const uploadedFile = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const fileJSON = JSON.parse(event.target.result);
    console.log(fileJSON);
    // validate json and structure here
    // if ok, enable upload button
    uploadSaveFileButton.disabled = false;
    uploadedSaveFile = fileJSON;
  };
  reader.onerror = (error) => {
    console.log(error);
  };
  reader.readAsText(uploadedFile);
});

const uploadSaveFile = async () => {
  await localStorage.setItem(
    "specialOpsSaveData",
    JSON.stringify(uploadedSaveFile)
  );
  genSOSaveDataManagementModalContent();
  uploadedSaveFile = null;
  saveDataUploadInput.value = "";
  window.location.reload();
};
