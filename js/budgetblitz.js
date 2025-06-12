const mainViewButtons = document.getElementsByClassName('mainViewButtons')

for (let z = 0; z < mainViewButtons.length; z++) {
  mainViewButtons[z].addEventListener('change', (e) => {
    if (e.target.checked) {
        toggleItemsView(e.srcElement.id)
    }
  });
}

const toggleItemsView = (btnId) => {
    if (btnId === "inventoryButton") {
        console.log("inv")
    }
    if (btnId === "shopButton") {
        console.log("shop")
    }
}