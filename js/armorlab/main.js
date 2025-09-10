const helmetsList = document.getElementById("helmetsList");

const genImageCards = async () => {
  // will need to refactor armor sets and armor passives images into separate files
  //   const paths = ["armor", "helmets", "capes"];
};

const generateItemCard = (
  item,
  inModal,
  imgDir,
  currentItemIndex = null,
  type = null,
  missionFailed = false
) => {
  // display the item image in the modal or accordion item
  let mandatoryStratStyle = getMandatoryStratStyle(item.displayName);
  let style = "col-2";
  let modalTextStyle = "pcItemCardText";
  let fcn = "";
  let typeText = "";
  if (inModal) {
    style = "pcModalItemCards col-6";
    modalTextStyle = "";
    fcn = !missionFailed
      ? `claimItem(${currentItemIndex})`
      : `claimPunishment(${currentItemIndex})`;
    typeText = `<p class="card-title fst-italic text-white">${type}</p>`;
  }
  return `
    <div onclick="${fcn}" class="card ${mandatoryStratStyle} d-flex ${style} pcNoHoverItemCards mx-1">
    ${typeText}
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
          <p class="card-title text-white ${modalTextStyle}">${item.displayName}</p>
      </div>
    </div>`;
};
