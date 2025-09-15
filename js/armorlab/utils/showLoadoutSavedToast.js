const showLoadoutSavedToast = (name) => {
  const loadoutSavedToast = document.querySelector(".loadoutSavedToast");
  const toast = new bootstrap.Toast(loadoutSavedToast);

  // Set the toast body content
  document.getElementById(
    "loadoutSavedToastBody"
  ).textContent = `${name} loadout saved`;

  // Show the toast
  toast.show();
};
