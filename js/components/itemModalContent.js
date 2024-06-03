const itemModalLabel = document.getElementById("itemModalLabel");
const itemModalBody = document.getElementById("itemModalBody");

const setItemModalContent = (internalName, category) => {
    let listToSearch;
    let imagesSubdirectory = "equipment";
    if (category === "primary") {
        listToSearch = primariesList;
    } else if (category === "secondary") {
        listToSearch = secondariesList;
    } else if (category === "grenade") {
        listToSearch = grenadesList;
    } else if (category === "booster") {
        listToSearch = boostersList;
    } else if (category === "stratagem") {
        listToSearch = stratagemsList;
        imagesSubdirectory = "stratagems";
    }
    const [item] = listToSearch.filter(
        (listItem) => listItem.internalName === internalName
    );
    itemModalLabel.innerText = `
      ${item.displayName}
    `;
    itemModalBody.innerHTML = `
      <img
          src="./images/${imagesSubdirectory}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
    `;
};
