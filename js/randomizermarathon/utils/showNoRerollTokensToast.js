const showNoRerollTokensToast = () => {
  const noRerollTokensToast = document.querySelector(".noRerollTokensToast");
  const toast = new bootstrap.Toast(noRerollTokensToast);

  // Set the toast body content
  document.getElementById(
    "noRerollTokensToastBody"
  ).textContent = `You have no Re-roll Tokens`;

  // Show the toast
  toast.show();
};
