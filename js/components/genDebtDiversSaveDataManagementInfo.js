const debtDiversDataManagementModal = document.getElementById(
  "debtDiversDataManagementModal"
);
const debtDiversDataManagementModalSavesList = document.getElementById(
  "debtDiversDataManagementModalSavesList"
);
const saveDataModalFunctionsDiv = document.getElementById(
  "saveDataModalFunctionsDiv"
);
const saveDataUploadInput = document.getElementById("saveDataUploadInput");
const uploadSaveFileButton = document.getElementById("uploadSaveFileButton");
const saveDataManagementModalInstance = new bootstrap.Modal(
  debtDiversDataManagementModal
);

let uploadedSaveFile = null;

const saveNewSaveFileName = async (index) => {
  const newSaveFileNameInput = document.getElementById("newSaveFileNameInput");
  const saveData = JSON.parse(localStorage.getItem("debtDiversSaveData"));
  if (!saveData) return;
  let savedGames = [...saveData.savedGames];
  const updatedSaveFile = {
    ...savedGames[index],
    dataName: newSaveFileNameInput.value
      ? newSaveFileNameInput.value
      : "Unnamed Save File",
    editedName: true,
  };
  savedGames.splice(index, 1, updatedSaveFile);
  let newSaveObj = { ...saveData, savedGames };
  await localStorage.setItem("debtDiversSaveData", JSON.stringify(newSaveObj));
  debtDiversDataManagementModalSavesList.innerHTML = "";
  genSnLDataManagementModalInfo(true);
};

const editSaveName = (index, oldName) => {
  saveDataModalFunctionsDiv.classList.toggle("d-none", true);
  debtDiversDataManagementModalSavesList.innerHTML = "";
  debtDiversDataManagementModalSavesList.innerHTML = `
    <p class="text-white mb-0">Rename save file:</p>
    <div id="saveDataNameEditDiv" class="my-1 d-flex" style="width: 90%">
      <input type="text" maxlength="50" id="newSaveFileNameInput" class="form-control" value="${oldName}">
      <button type="button" onclick="saveNewSaveFileName(${index})" class="mx-1 btn btn-success btn-sm"><i class="fa-solid fa-check"></i></button>
    </div>
  `;
};

const genSnLDataManagementModalInfo = (savedNewName = null) => {
  const saveData = JSON.parse(localStorage.getItem("debtDiversSaveData"));
  if (!saveData) {
    debtDiversDataManagementModalSavesList.innerHTML =
      "<p class='text-white'>No save data detected. Begin the challenge or upload save data to get started.</p>";
    saveDataManagementModalInstance.show();
    saveDataModalFunctionsDiv.classList.toggle("d-none", true);
    return;
  }
  debtDiversDataManagementModalSavesList.innerHTML = "";
  saveDataModalFunctionsDiv.classList.toggle("d-none", false);
  const savedGames = saveData.savedGames;

  for (let i = 0; i < savedGames.length; i++) {
    const save = savedGames[i];
    const isDisabled = save.currentGame ? "disabled" : "";
    const displayCurrentText = save.currentGame ? "(Current)" : "";
    debtDiversDataManagementModalSavesList.innerHTML += `
      <div class="my-1" id="savedGameOptionDiv${i}">
        <input type="radio" class="btn-check" name="btnradio" id="savedGameOption${i}" autocomplete="off" ${isDisabled}>
        <label id="savedGameOptionLabel${i}" class="btn btn-outline-primary text-white" for="savedGameOption${i}">${save.dataName} ${displayCurrentText}</label>
        <button type="button" onclick="editSaveName(${i},'${save.dataName}')" class="mx-1 btn btn-primary btn-sm"><i class="fa-solid fa-pen-to-square"></i></button>
        <button type="button" onclick="downloadSaveFile(${i}, 'dd')" class="btn btn-primary btn-sm"><i class="fa-solid fa-download"></i></button>
      </div>
    `;
  }
  if (!savedNewName) {
    saveDataManagementModalInstance.show();
  }
};

const clearSnLDataManagementModal = () => {
  debtDiversDataManagementModalSavesList.innerHTML = "";
  saveDataUploadInput.value = "";
  uploadedSaveFile = null;
};

const getSavedGameIndex = () => {
  let saveIndex;
  const savedGamesOptions = debtDiversDataManagementModalSavesList.children;
  for (let i = 0; i < savedGamesOptions.length; i++) {
    const option = savedGamesOptions[i].children[0];
    if (option.checked) {
      saveIndex = i;
      break;
    }
  }
  return saveIndex;
};

// delete saved game data
const deleteSavedGameData = async () => {
  // get the index of the saved game data
  const saveIndex = getSavedGameIndex();
  if (saveIndex === undefined) {
    clearSnLDataManagementModal();
    return;
  }

  if (saveIndex !== undefined) {
    // remove data from local storage here
    const debtDiversSaveData = JSON.parse(
      localStorage.getItem("debtDiversSaveData")
    );
    let tempArray = [...debtDiversSaveData.savedGames];
    tempArray.splice(saveIndex, 1);
    let tempObj = {
      ...debtDiversSaveData,
      savedGames: tempArray,
    };
    localStorage.setItem("debtDiversSaveData", JSON.stringify(tempObj));
  }
  clearSnLDataManagementModal();
};

// let user choose a save file to populate the website with
const applySavedGameData = async (isUploadedSave = null) => {
  const saveIndex = isUploadedSave ? 0 : getSavedGameIndex();
  if (!isUploadedSave && (saveIndex === undefined || saveIndex === null)) {
    clearSaveDataManagementModal();
    return;
  }
  // we just want to change the currentGame
  const debtDiversSaveData = JSON.parse(
    localStorage.getItem("debtDiversSaveData")
  );
  let tempArray = [...debtDiversSaveData.savedGames];
  const updatedSavedGames = await tempArray.map((sg, i) => {
    if (saveIndex === i) {
      sg.currentGame = true;
      return sg;
    }
    if (saveIndex !== i) {
      sg.currentGame = false;
      return sg;
    }
    return sg;
  });

  const newSaveObj = {
    ...debtDiversSaveData,
    savedGames: updatedSavedGames,
  };
  localStorage.setItem("debtDiversSaveData", JSON.stringify(newSaveObj));
  // clear everything first
  await startNewRun("applyingSave");

  // then upload the current save
  uploadSaveData();
  clearSnLDataManagementModal();
  if (isUploadedSave) {
    saveDataManagementModalInstance.hide();
  }
};

saveDataUploadInput.addEventListener("change", (e) => {
  const uploadedFile = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const fileJSON = JSON.parse(event.target.result);
    // console.log(fileJSON);
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
  if (uploadedSaveFile.currentGame === true) {
    uploadedSaveFile.currentGame = false;
  }
  let obj = {};
  const debtDiversSaveData = localStorage.getItem("debtDiversSaveData");
  // will lead to a situation where there is one saved game that's not set to true. may cause problems we'll see
  if (!debtDiversSaveData) {
    uploadedSaveFile.currentGame = true;
    obj = {
      savedGames: [uploadedSaveFile],
    };
    await localStorage.setItem("debtDiversSaveData", JSON.stringify(obj));
    applySavedGameData(true);
    uploadedSaveFile = null;
    saveDataUploadInput.value = "";
    return;
  }
  let newData = JSON.parse(debtDiversSaveData);
  newData.savedGames.push(uploadedSaveFile);
  await localStorage.setItem("debtDiversSaveData", JSON.stringify(newData));
  debtDiversDataManagementModalSavesList.innerHTML = "";
  genSnLDataManagementModalInfo(true);
  uploadedSaveFile = null;
  saveDataUploadInput.value = "";
};
