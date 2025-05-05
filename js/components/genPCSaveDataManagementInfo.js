const saveDataManagementModal = document.getElementById('saveDataManagementModal');
const saveDataManagementModalSavesList = document.getElementById(
  'saveDataManagementModalSavesList',
);

const genPCSaveDataManagementModalInfo = () => {
  const saveData = JSON.parse(localStorage.getItem('penitentCrusadeSaveData'));
  const savedGames = saveData.savedGames;

  for (let i = 0; i < savedGames.length; i++) {
    const save = savedGames[i];
    const isDisabled = save.currentGame ? 'disabled' : '';
    const displayCurrentText = save.currentGame ? '(Current)' : '';
    saveDataManagementModalSavesList.innerHTML += `
      <div class="my-1">
        <input type="radio" class="btn-check" name="btnradio" id="savedGameOption${i}" autocomplete="off" ${isDisabled}>
        <label class="btn btn-outline-primary text-white" for="savedGameOption${i}">${save.dataName} ${displayCurrentText}</label>
      </div>
    `;
  }

  const modal = new bootstrap.Modal(saveDataManagementModal);
  modal.show();
};

const clearSaveDataManagementModal = () => {
  saveDataManagementModalSavesList.innerHTML = '';
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
    const penitentCrusadeSaveData = JSON.parse(localStorage.getItem('penitentCrusadeSaveData'));
    let tempArray = [...penitentCrusadeSaveData.savedGames];
    tempArray.splice(saveIndex, 1);
    let tempObj = {
      ...penitentCrusadeSaveData,
      savedGames: tempArray,
    };
    localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(tempObj));
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
  const penitentCrusadeSaveData = JSON.parse(localStorage.getItem('penitentCrusadeSaveData'));
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
  localStorage.setItem('penitentCrusadeSaveData', JSON.stringify(newSaveObj));
  // clear everything first
  await getStartingItems();
  startNewRun();
  stratagemAccordionBody.innerHTML = '';
  primaryAccordionBody.innerHTML = '';
  secondaryAccordionBody.innerHTML = '';
  throwableAccordionBody.innerHTML = '';
  armorPassiveAccordionBody.innerHTML = '';
  boosterAccordionBody.innerHTML = '';
  addDefaultItemsToAccordions();
  // then upload the current save
  uploadSaveData();
  clearSaveDataManagementModal();
};
