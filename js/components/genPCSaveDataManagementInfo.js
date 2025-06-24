const saveDataManagementModal = document.getElementById(
  "saveDataManagementModal"
);
const saveDataManagementModalSavesList = document.getElementById(
  "saveDataManagementModalSavesList"
);
const saveDataModalFunctionsDiv = document.getElementById(
  "saveDataModalFunctionsDiv"
);

const saveNewSaveFileName = async (index) => {
  const newSaveFileNameInput = document.getElementById("newSaveFileNameInput");
  const saveData = JSON.parse(localStorage.getItem("penitentCrusadeSaveData"));
  if (!saveData) return;
  let savedGames = [...saveData.savedGames];
  const updatedSaveFile = {
    ...savedGames[index],
    dataName: newSaveFileNameInput.value ?? savedGames[index].dataName,
    editedName: true,
  };
  savedGames.splice(index, 1, updatedSaveFile);
  let newSaveObj = { ...saveData, savedGames };
  await localStorage.setItem(
    "penitentCrusadeSaveData",
    JSON.stringify(newSaveObj)
  );
  saveDataManagementModalSavesList.innerHTML = "";
  genPCSaveDataManagementModalInfo(true);
};

const editSaveName = (index, oldName) => {
  saveDataModalFunctionsDiv.classList.toggle("d-none", true);
  saveDataManagementModalSavesList.innerHTML = "";
  saveDataManagementModalSavesList.innerHTML = `
    <p class="text-white mb-0">Rename save file:</p>
    <div id="saveDataNameEditDiv" class="my-1 d-flex" style="width: 90%">
      <input type="text" id="newSaveFileNameInput" class="form-control" value="${oldName}">
      <button type="button" onclick="saveNewSaveFileName(${index})" class="mx-1 btn btn-success btn-sm"><i class="fa-solid fa-check"></i></button>
    </div>
  `;
};

const genPCSaveDataManagementModalInfo = (savedNewName = null) => {
  const saveData = JSON.parse(localStorage.getItem("penitentCrusadeSaveData"));
  if (!saveData) return;
  const savedGames = saveData.savedGames;
  saveDataModalFunctionsDiv.classList.toggle("d-none", false);

  for (let i = 0; i < savedGames.length; i++) {
    const save = savedGames[i];
    const isDisabled = save.currentGame ? "disabled" : "";
    const displayCurrentText = save.currentGame ? "(Current)" : "";
    saveDataManagementModalSavesList.innerHTML += `
      <div class="my-1" id="savedGameOptionDiv${i}">
        <input type="radio" class="btn-check" name="btnradio" id="savedGameOption${i}" autocomplete="off" ${isDisabled}>
        <label id="savedGameOptionLabel${i}" class="btn btn-outline-primary text-white" for="savedGameOption${i}">${save.dataName} ${displayCurrentText}</label>
        <button type="button" onclick="editSaveName(${i},'${save.dataName}')" class="ml-1 btn btn-primary btn-sm"><i class="fa-solid fa-pen-to-square"></i></button>
      </div>
    `;
  }

  if (!savedNewName) {
    const modal = new bootstrap.Modal(saveDataManagementModal);
    modal.show();
  }
};

const clearSaveDataManagementModal = () => {
  saveDataManagementModalSavesList.innerHTML = "";
};

const getSavedGameIndex = () => {
  let saveIndex;
  const savedGamesOptions = saveDataManagementModalSavesList.children;
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
    clearSaveDataManagementModal();
    return;
  }

  if (saveIndex !== undefined) {
    // remove data from local storage here
    const penitentCrusadeSaveData = JSON.parse(
      localStorage.getItem("penitentCrusadeSaveData")
    );
    let tempArray = [...penitentCrusadeSaveData.savedGames];
    tempArray.splice(saveIndex, 1);
    let tempObj = {
      ...penitentCrusadeSaveData,
      savedGames: tempArray,
    };
    localStorage.setItem("penitentCrusadeSaveData", JSON.stringify(tempObj));
  }
  clearSaveDataManagementModal();
};

// let user choose a save file to populate the website with
const applySavedGameData = async () => {
  const saveIndex = getSavedGameIndex();
  if (saveIndex === undefined) {
    clearSaveDataManagementModal();
    return;
  }
  // we just want to change the currentGame
  const penitentCrusadeSaveData = JSON.parse(
    localStorage.getItem("penitentCrusadeSaveData")
  );
  let tempArray = [...penitentCrusadeSaveData.savedGames];
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
    ...penitentCrusadeSaveData,
    savedGames: updatedSavedGames,
  };
  localStorage.setItem("penitentCrusadeSaveData", JSON.stringify(newSaveObj));
  // clear everything first
  await getStartingItems();
  startNewRun();
  stratagemAccordionBody.innerHTML = "";
  primaryAccordionBody.innerHTML = "";
  secondaryAccordionBody.innerHTML = "";
  throwableAccordionBody.innerHTML = "";
  armorPassiveAccordionBody.innerHTML = "";
  boosterAccordionBody.innerHTML = "";
  addDefaultItemsToAccordions();
  // then upload the current save
  uploadSaveData();
  clearSaveDataManagementModal();
};
