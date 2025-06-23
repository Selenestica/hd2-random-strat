const showBBPurchasedItemToast = (itemName) => {
  const bbPurchaseItemToast = document.querySelector(".bbPurchaseToast");
  const toast = new bootstrap.Toast(bbPurchaseItemToast);

  // Set the toast body content
  document.getElementById(
    "purchasedItemToastBody"
  ).textContent = `${itemName} added to inventory`;

  // Show the toast
  toast.show();
};
