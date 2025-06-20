const budgetBlitzDataManagementModal = document.getElementById('budgetBlitzDataManagementModal');
const budgetBlitzDataManagementModalSavesList = document.getElementById(
  'budgetBlitzDataManagementModalSavesList',
);

const genBudgetBlitzDataManagementModalInfo = () => {
  const saveData = JSON.parse(localStorage.getItem('budgetBlitzSaveData'));
  const savedGames = saveData.savedGames;

  for (let i = 0; i < savedGames.length; i++) {
    const save = savedGames[i];
    const isDisabled = save.currentGame ? 'disabled' : '';
    const displayCurrentText = save.currentGame ? '(Current)' : '';
    budgetBlitzDataManagementModalSavesList.innerHTML += `
      <div class="my-1">
        <input type="radio" class="btn-check" name="btnradio" id="savedGameOption${i}" autocomplete="off" ${isDisabled}>
        <label class="btn btn-outline-primary text-white" for="savedGameOption${i}">${save.dataName} ${displayCurrentText}</label>
      </div>
    `;
  }

  const modal = new bootstrap.Modal(budgetBlitzDataManagementModal);
  modal.show();
};

const clearBudgetBlitzDataManagementModal = () => {
  budgetBlitzDataManagementModalSavesList.innerHTML = '';
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
    const budgetBlitzSaveData = JSON.parse(localStorage.getItem('budgetBlitzSaveData'));
    let tempArray = [...budgetBlitzSaveData.savedGames];
    tempArray.splice(saveIndex, 1);
    let tempObj = {
      ...budgetBlitzSaveData,
      savedGames: tempArray,
    };
    localStorage.setItem('budgetBlitzSaveData', JSON.stringify(tempObj));
  }
  clearBudgetBlitzDataManagementModal();
};

// let user choose a save file to populate the website with
const applySavedGameData = async () => {
  const saveIndex = getSavedGameIndex();
  if (saveIndex === undefined) {
    clearBudgetBlitzDataManagementModal();
    return;
  }
  // we just want to change the currentGame
  const budgetBlitzSaveData = JSON.parse(localStorage.getItem('budgetBlitzSaveData'));
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
  localStorage.setItem('budgetBlitzSaveData', JSON.stringify(newSaveObj));
  // clear everything first
  await startNewRun('applyingSave');

  // then upload the current save
  uploadSaveData();
  clearBudgetBlitzDataManagementModal();
};
