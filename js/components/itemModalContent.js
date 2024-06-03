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
    console.log(item, internalName, listToSearch);
    itemModalBody.innerHTML = `
      <div class="col-3 d-flex justify-content-center">
        <div class="card itemCards">
          <img
              src="./images/${imagesSubdirectory}/${item.imageURL}"
              class="img-card-top"
              alt="${item.displayName}"
          />
          <div class="card-body itemNameContainer align-items-center">
              <p class="card-title text-white">${item.displayName}</p>
          </div>
        </div>
      </div>
    `;
};
