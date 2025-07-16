const showSOSpecialistUnlockedToast = (specName) => {
  const specialistUnlockedToast = document.querySelector(
    ".specialistUnlockedToast"
  );
  const toast = new bootstrap.Toast(specialistUnlockedToast);

  // Set the toast body content
  document.getElementById(
    "specialistUnlockedToastBody"
  ).textContent = `${specName} specialist unlocked!`;

  // Show the toast
  toast.show();
};
