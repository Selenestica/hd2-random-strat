const armorLabSaveDataManagementModal = document.getElementById('armorLabSaveDataManagementModal');
const armorLabSaveDataManagementModalSavesList = document.getElementById(
  'armorLabSaveDataManagementModalSavesList',
);
const saveDataModalFunctionsDiv = document.getElementById('saveDataModalFunctionsDiv');
const saveDataUploadInput = document.getElementById('saveDataUploadInput');
const uploadSaveFileButton = document.getElementById('uploadSaveFileButton');
const saveDataManagementModalInstance = new bootstrap.Modal(armorLabSaveDataManagementModal);
let uploadedSaveFile = null;

const genSaveDataManagementModalContent = () => {
  const saveData = JSON.parse(localStorage.getItem('armorLabSaveData'));
  if (!saveData) {
    armorLabSaveDataManagementModalSavesList.innerHTML =
      "<p class='text-white'>No saved loadouts detected. Save or upload a loadout to get started.</p>";
    saveDataManagementModalInstance.show();
    saveDataModalFunctionsDiv.classList.toggle('d-none', true);
    return;
  }
  armorLabSaveDataManagementModalSavesList.innerHTML = '';
  saveDataModalFunctionsDiv.classList.toggle('d-none', false);
  const loadouts = saveData.loadouts;

  for (let i = 0; i < loadouts.length; i++) {
    const save = loadouts[i];
    armorLabSaveDataManagementModalSavesList.innerHTML += `
      <div class="my-1" id="savedGameOptionDiv${i}">
        <input type="radio" class="btn-check" name="btnradio" id="savedGameOption${i}" autocomplete="off">
        <label id="savedGameOptionLabel${i}" class="btn btn-outline-primary text-white" for="savedGameOption${i}">${save.name}</label>
        <button type="button" onclick="downloadSaveFile(${i}, 'al')" class="btn btn-primary btn-sm"><i class="bi bi-download"></i></button>
      </div>
    `;
  }
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
    return;
  }

  if (saveIndex !== undefined) {
    // remove data from local storage here
    const armorLabSaveData = JSON.parse(localStorage.getItem('armorLabSaveData'));
    let tempArray = [...armorLabSaveData.loadouts];
    tempArray.splice(saveIndex, 1);
    let tempObj = {
      ...armorLabSaveData,
      loadouts: tempArray,
    };
    localStorage.setItem('armorLabSaveData', JSON.stringify(tempObj));
  }
  genSaveDataManagementModalContent();
};

// let user choose a save file to populate the website with
const applySavedGameData = async () => {
  const saveIndex = getSavedGameIndex();
  if (saveIndex === undefined || saveIndex === null) {
    return;
  }
  uploadSaveData(saveIndex);
};

saveDataUploadInput.addEventListener('change', (e) => {
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
  let obj = {};
  const data = localStorage.getItem('armorLabSaveData');
  if (!data) {
    obj = {
      armor: currentArmor,
      helmet: currentHelmet,
      cape: currentCape,
      name: currentLoadoutName,
      loadouts: [uploadedSaveFile],
    };
    await localStorage.setItem('armorLabSaveData', JSON.stringify(obj));
    armorLabSaveDataManagementModalSavesList.innerHTML = '';
    genSaveDataManagementModalContent();
    uploadedSaveFile = null;
    saveDataUploadInput.value = '';
    return;
  }
  let newData = JSON.parse(data);
  newData.loadouts.push(uploadedSaveFile);
  await localStorage.setItem('armorLabSaveData', JSON.stringify(newData));
  armorLabSaveDataManagementModalSavesList.innerHTML = '';
  genSaveDataManagementModalContent();
  uploadedSaveFile = null;
  saveDataUploadInput.value = '';
};

const clearSaveDataAndRestart = async () => {
  await localStorage.removeItem('armorLabSaveData');
  window.location.reload();
};

uploadSaveData();
