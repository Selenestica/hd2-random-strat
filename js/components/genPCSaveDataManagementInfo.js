const saveDataManagementModal = document.getElementById('saveDataManagementModal');

const genPCSaveDataManagementModalInfo = () => {
  // get save files
  const saveData = localStorage.getItem('penitentCrusadeSaveData');
  console.log(JSON.parse(saveData));

  // display save files
  // let user change name of save file
  // let user choose a save file to populate the website with
  // let user remove save files
  const modal = new bootstrap.Modal(saveDataManagementModal);
  modal.show();
};
