const budgetBlitzDataManagementModal = document.getElementById(
  "budgetBlitzDataManagementModal"
);
const budgetBlitzDataManagementModalSavesList = document.getElementById(
  "budgetBlitzDataManagementModalSavesList"
);
const saveDataModalFunctionsDiv = document.getElementById(
  "saveDataModalFunctionsDiv"
);
const saveDataUploadInput = document.getElementById("saveDataUploadInput");
const uploadSaveFileButton = document.getElementById("uploadSaveFileButton");
const saveDataManagementModalInstance = new bootstrap.Modal(
  budgetBlitzDataManagementModal
);

let uploadedSaveFile = null;

const saveNewSaveFileName = async (index) => {
  const newSaveFileNameInput = document.getElementById("newSaveFileNameInput");
  const saveData = JSON.parse(localStorage.getItem("budgetBlitzSaveData"));
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
  await localStorage.setItem("budgetBlitzSaveData", JSON.stringify(newSaveObj));
  budgetBlitzDataManagementModalSavesList.innerHTML = "";
  genBudgetBlitzDataManagementModalInfo(true);
};

const editSaveName = (index, oldName) => {
  saveDataModalFunctionsDiv.classList.toggle("d-none", true);
  budgetBlitzDataManagementModalSavesList.innerHTML = "";
  budgetBlitzDataManagementModalSavesList.innerHTML = `
    <p class="text-white mb-0">Rename save file:</p>
    <div id="saveDataNameEditDiv" class="my-1 d-flex" style="width: 90%">
      <input type="text" maxlength="50" id="newSaveFileNameInput" class="form-control" value="${oldName}">
      <button type="button" onclick="saveNewSaveFileName(${index})" class="mx-1 btn btn-success btn-sm"><i class="fa-solid fa-check"></i></button>
    </div>
  `;
};

const genBudgetBlitzDataManagementModalInfo = (savedNewName = null) => {
  const saveData = JSON.parse(localStorage.getItem("budgetBlitzSaveData"));
  if (!saveData) {
    budgetBlitzDataManagementModalSavesList.innerHTML =
      "<p class='text-white'>No save data detected. Begin the challenge or upload save data to get started.</p>";
    saveDataManagementModalInstance.show();
    saveDataModalFunctionsDiv.classList.toggle("d-none", true);
    return;
  }
  budgetBlitzDataManagementModalSavesList.innerHTML = "";
  saveDataModalFunctionsDiv.classList.toggle("d-none", false);
  const savedGames = saveData.savedGames;

  for (let i = 0; i < savedGames.length; i++) {
    const save = savedGames[i];
    const isDisabled = save.currentGame ? "disabled" : "";
    const displayCurrentText = save.currentGame ? "(Current)" : "";
    budgetBlitzDataManagementModalSavesList.innerHTML += `
      <div class="my-1" id="savedGameOptionDiv${i}">
        <input type="radio" class="btn-check" name="btnradio" id="savedGameOption${i}" autocomplete="off" ${isDisabled}>
        <label id="savedGameOptionLabel${i}" class="btn btn-outline-primary text-white" for="savedGameOption${i}">${save.dataName} ${displayCurrentText}</label>
        <button type="button" onclick="editSaveName(${i},'${save.dataName}')" class="mx-1 btn btn-primary btn-sm"><i class="fa-solid fa-pen-to-square"></i></button>
        <button type="button" onclick="downloadSaveFile(${i}, 'bb')" class="btn btn-primary btn-sm"><i class="fa-solid fa-download"></i></button>
      </div>
    `;
  }
  if (!savedNewName) {
    saveDataManagementModalInstance.show();
  }
};

const clearBudgetBlitzDataManagementModal = () => {
  budgetBlitzDataManagementModalSavesList.innerHTML = "";
  saveDataUploadInput.value = "";
  uploadedSaveFile = null;
};

const getSavedGameIndex = () => {
  let saveIndex;
  const savedGamesOptions = budgetBlitzDataManagementModalSavesList.children;
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
    clearBudgetBlitzDataManagementModal();
    return;
  }

  if (saveIndex !== undefined) {
    // remove data from local storage here
    const budgetBlitzSaveData = JSON.parse(
      localStorage.getItem("budgetBlitzSaveData")
    );
    let tempArray = [...budgetBlitzSaveData.savedGames];
    tempArray.splice(saveIndex, 1);
    let tempObj = {
      ...budgetBlitzSaveData,
      savedGames: tempArray,
    };
    localStorage.setItem("budgetBlitzSaveData", JSON.stringify(tempObj));
  }
  clearBudgetBlitzDataManagementModal();
};

// let user choose a save file to populate the website with
const applySavedGameData = async (isUploadedSave = null) => {
  const saveIndex = isUploadedSave ? 0 : getSavedGameIndex();
  if (!isUploadedSave && (saveIndex === undefined || saveIndex === null)) {
    clearSaveDataManagementModal();
    return;
  }
  // we just want to change the currentGame
  const budgetBlitzSaveData = JSON.parse(
    localStorage.getItem("budgetBlitzSaveData")
  );
  let tempArray = [...budgetBlitzSaveData.savedGames];
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
    ...budgetBlitzSaveData,
    savedGames: updatedSavedGames,
  };
  localStorage.setItem("budgetBlitzSaveData", JSON.stringify(newSaveObj));
  // clear everything first
  await startNewRun("applyingSave");

  // then upload the current save
  uploadSaveData();
  clearBudgetBlitzDataManagementModal();
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
  const budgetBlitzSaveData = localStorage.getItem("budgetBlitzSaveData");
  // will lead to a situation where there is one saved game that's not set to true. may cause problems we'll see
  if (!budgetBlitzSaveData) {
    uploadedSaveFile.currentGame = true;
    obj = {
      savedGames: [uploadedSaveFile],
    };
    await localStorage.setItem("budgetBlitzSaveData", JSON.stringify(obj));
    applySavedGameData(true);
    uploadedSaveFile = null;
    saveDataUploadInput.value = "";
    return;
  }
  let newData = JSON.parse(budgetBlitzSaveData);
  newData.savedGames.push(uploadedSaveFile);
  await localStorage.setItem("budgetBlitzSaveData", JSON.stringify(newData));
  budgetBlitzDataManagementModalSavesList.innerHTML = "";
  genBudgetBlitzDataManagementModalInfo(true);
  uploadedSaveFile = null;
  saveDataUploadInput.value = "";
};
