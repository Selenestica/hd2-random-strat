const showPointsEarnedToast = (pointsEarned) => {
  const pointsEarnedToast = document.querySelector(".pointsEarnedToast");
  const toast = new bootstrap.Toast(pointsEarnedToast);

  // Set the toast body content
  document.getElementById(
    "pointsEarnedToastBody"
  ).textContent = `${pointsEarned} points earned!`;

  // Show the toast
  toast.show();
};
