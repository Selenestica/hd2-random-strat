const armorLabSaveDataManagementModal = document.getElementById(
  "armorLabSaveDataManagementModal"
);
const armorLabSaveDataManagementModalSavesList = document.getElementById(
  "armorLabSaveDataManagementModalSavesList"
);
const saveDataModalFunctionsDiv = document.getElementById(
  "saveDataModalFunctionsDiv"
);
const saveDataUploadInput = document.getElementById("saveDataUploadInput");
const uploadSaveFileButton = document.getElementById("uploadSaveFileButton");
const saveDataManagementModalInstance = new bootstrap.Modal(
  armorLabSaveDataManagementModal
);
let uploadedSaveFile = null;

const saveNewSaveFileName = async (index) => {
  const newSaveFileNameInput = document.getElementById("newSaveFileNameInput");
  const saveData = JSON.parse(localStorage.getItem("armorLabSaveData"));
  if (!saveData) return;
  let lists = [...saveData.lists];
  const updatedSaveFile = {
    ...lists[index],
    dataName: newSaveFileNameInput.value
      ? newSaveFileNameInput.value
      : "Unnamed Save File",
    editedName: true,
  };
  lists.splice(index, 1, updatedSaveFile);
  let newSaveObj = { ...saveData, lists };
  await localStorage.setItem("armorLabSaveData", JSON.stringify(newSaveObj));
  armorLabSaveDataManagementModalSavesList.innerHTML = "";
  genALSaveDataManagementModalInfo(true);
};

const editSaveName = (index, oldName) => {
  saveDataModalFunctionsDiv.classList.toggle("d-none", true);
  armorLabSaveDataManagementModalSavesList.innerHTML = "";
  armorLabSaveDataManagementModalSavesList.innerHTML = `
    <p class="text-white mb-0">Rename save file:</p>
    <div id="saveDataNameEditDiv" class="my-1 d-flex" style="width: 90%">
      <input type="text" maxlength="50" id="newSaveFileNameInput" class="form-control" value="${oldName}">
      <button type="button" onclick="saveNewSaveFileName(${index})" class="mx-1 btn btn-success btn-sm"><i class="bi bi-check-lg"></i></button>
    </div>
  `;
};

const genALSaveDataManagementModalInfo = (savedNewName = null) => {
  const saveData = JSON.parse(localStorage.getItem("armorLabSaveData"));
  if (!saveData) {
    armorLabSaveDataManagementModalSavesList.innerHTML =
      "<p class='text-white'>No save data detected. Start a list or upload a list to get started.</p>";
    saveDataManagementModalInstance.show();
    saveDataModalFunctionsDiv.classList.toggle("d-none", true);
    return;
  }
  armorLabSaveDataManagementModalSavesList.innerHTML = "";
  saveDataModalFunctionsDiv.classList.toggle("d-none", false);
  const lists = saveData.lists;

  for (let i = 0; i < lists.length; i++) {
    const save = lists[i];
    const isDisabled = save.currentList ? "disabled" : "";
    const displayCurrentText = save.currentList ? "(Current)" : "";
    armorLabSaveDataManagementModalSavesList.innerHTML += `
      <div class="my-1" id="savedGameOptionDiv${i}">
        <input type="radio" class="btn-check" name="btnradio" id="savedGameOption${i}" autocomplete="off" ${isDisabled}>
        <label id="savedGameOptionLabel${i}" class="btn btn-outline-primary text-white" for="savedGameOption${i}">${save.dataName} ${displayCurrentText}</label>
        <button type="button" onclick="editSaveName(${i},'${save.dataName}')" class="mx-1 btn btn-primary btn-sm"><i class="bi bi-pencil-square"></i></button>
        <button type="button" onclick="downloadSaveFile(${i}, 'tm')" class="btn btn-primary btn-sm"><i class="bi bi-download"></i></button>
      </div>
    `;
  }
  if (!savedNewName) {
    saveDataManagementModalInstance.show();
  }
};

const cleararmorLabSaveDataManagementModal = () => {
  armorLabSaveDataManagementModalSavesList.innerHTML = "";
  saveDataUploadInput.value = "";
  uploadedSaveFile = null;
};

const getSavedGameIndex = () => {
  let saveIndex;
  const savedGamesOptions = armorLabSaveDataManagementModalSavesList.children;
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
    cleararmorLabSaveDataManagementModal();
    return;
  }

  if (saveIndex !== undefined) {
    // remove data from local storage here
    const armorLabSaveData = JSON.parse(
      localStorage.getItem("armorLabSaveData")
    );
    let tempArray = [...armorLabSaveData.lists];
    tempArray.splice(saveIndex, 1);
    let tempObj = {
      ...armorLabSaveData,
      lists: tempArray,
    };
    localStorage.setItem("armorLabSaveData", JSON.stringify(tempObj));
  }
  cleararmorLabSaveDataManagementModal();
};

// let user choose a save file to populate the website with
const applySavedGameData = async (isUploadedSave = null) => {
  const saveIndex = isUploadedSave ? 0 : getSavedGameIndex();
  if (!isUploadedSave && (saveIndex === undefined || saveIndex === null)) {
    clearSaveDataManagementModal();
    return;
  }
  // we just want to change the currentList
  const armorLabSaveData = JSON.parse(localStorage.getItem("armorLabSaveData"));
  let tempArray = [...armorLabSaveData.lists];
  const updatedSavedGames = await tempArray.map((sg, i) => {
    if (saveIndex === i) {
      sg.currentList = true;
      return sg;
    }
    if (saveIndex !== i) {
      sg.currentList = false;
      return sg;
    }
    return sg;
  });

  const newSaveObj = {
    ...armorLabSaveData,
    lists: updatedSavedGames,
  };
  localStorage.setItem("armorLabSaveData", JSON.stringify(newSaveObj));
  // clear everything first
  await startNewTierList();

  // then upload the current save
  uploadSaveData();
  cleararmorLabSaveDataManagementModal();
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
  if (uploadedSaveFile.currentList === true) {
    uploadedSaveFile.currentList = false;
  }
  let obj = {};
  const armorLabSaveData = localStorage.getItem("armorLabSaveData");
  // will lead to a situation where there is one saved game that's not set to true. may cause problems we'll see
  if (!armorLabSaveData) {
    uploadedSaveFile.currentList = true;
    obj = {
      lists: [uploadedSaveFile],
    };
    await localStorage.setItem("armorLabSaveData", JSON.stringify(obj));
    applySavedGameData(true);
    uploadedSaveFile = null;
    saveDataUploadInput.value = "";
    return;
  }
  let newData = JSON.parse(armorLabSaveData);
  newData.lists.push(uploadedSaveFile);
  await localStorage.setItem("armorLabSaveData", JSON.stringify(newData));
  armorLabSaveDataManagementModalSavesList.innerHTML = "";
  genALSaveDataManagementModalInfo(true);
  uploadedSaveFile = null;
  saveDataUploadInput.value = "";
};
