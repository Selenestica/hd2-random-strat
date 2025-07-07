const showBBCreditsEarnedToast = (credits) => {
  const bbCreditsEarnedToast = document.querySelector('.bbCreditsEarnedToast');
  const toast = new bootstrap.Toast(bbCreditsEarnedToast);

  // Set the toast body content
  document.getElementById('creditsEarnedToastBody').textContent = `${credits} Super Credits Earned`;

  // Show the toast
  toast.show();
};
