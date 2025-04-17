const saveDataManagementModal = document.getElementById('saveDataManagementModal');
const saveDataManagementModalSavesList = document.getElementById(
  'saveDataManagementModalSavesList',
);

const genPCSaveDataManagementModalInfo = () => {
  // get save files
  const saveData = JSON.parse(localStorage.getItem('penitentCrusadeSaveData'));
  const savedGames = saveData.savedGames;

  for (let i = 0; i < savedGames.length; i++) {
    const save = savedGames[i];
    const isChecked = save.currentGame ? 'checked' : '';
    saveDataManagementModalSavesList.innerHTML += `
      <input type="radio" class="btn-check" name="btnradio" id="savedGameOption${i}" autocomplete="off" ${isChecked}>
      <label class="btn btn-outline-primary text-white" for="savedGameOption${i}">${save.dataName}</label>
    `;
  }

  // let user change name of save file
  // let user choose a save file to populate the website with
  // let user remove save files
  const modal = new bootstrap.Modal(saveDataManagementModal);
  modal.show();
};
