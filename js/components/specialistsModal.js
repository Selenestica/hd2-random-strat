const specialistsList = document.getElementById("specialistsList");
const specialistCheckMarks = document.getElementsByClassName(
  "specialistCheckMarks",
);
const specialistNameText = document.getElementById("specialistNameText");
let specialist = null;

const setSpecialist = (index) => {
  // remove the checkmark from all other specialists
  const elements = document.querySelectorAll(".specialistCheckMarks");
  elements.forEach((element) => element.remove());

  // remove green text and/or cyan border from all other specialists
  const specialistHeaders = document.querySelectorAll(
    ".specialistHeadersClass",
  );
  specialistHeaders.forEach((header) => {
    header.classList.remove("text-success");
    header.classList.add("text-white");
  });

  const specialistCards = document.querySelectorAll(".specialistCards");
  specialistCards.forEach((card) => {
    card.style.border = "none";
  });

  // add the checkmark to the selected specialist
  const specialistHeader = document.getElementById(`specialistHeader${index}`);
  const specCardId = document.getElementById(`pcSpecialistCard('${index}')`);
  if (specialistHeader) {
    specialistHeader.innerHTML += `<i class="specialistCheckMarks text-success mx-1 bi bi-check-lg"></i>`;
    specialistHeader.classList.add("text-success");
    specialistHeader.classList.remove("text-white");
  } else {
    // add a thick cyan border around the card
    specCardId.style.border = "2px solid cyan";
  }

  // set the selected specialist
  specialist = index;
};

const genStarterItems = (starterItems) => {
  let items = "";
  for (let i = 0; i < starterItems.length; i++) {
    items += `<li class="text-white">${starterItems[i]}</li>`;
  }
  return items;
};

const genTraits = (traits) => {
  let traitList = [];
  for (let i = 0; i < traits.length; i++) {
    traitList += `<li class="text-white">${traits[i]}</li>`;
  }
  return `
    <p class="text-white">Additionally:</p>
    <ul>
      ${traitList}
    </ul>
  `;
};

const makeCard = (spc, index) => {
  return `
          <div id="pcSpecialistCard('${index}')" class="card col-12 col-sm-6 col-md-6 col-lg-3 specialistCards m-2" onclick="setSpecialist('${index}')">
            <div class="card-header">
              <h5 class="text-white specialistHeadersClass" id="specialistHeader${index}">${
                spc.displayName
              }</h5>
            </div>
            <div class="card-body">
              <p class="text-white">${index === 38 ? "You begin with the following items, and must always have an exosuit equipped" : "You begin with, and must always have equipped:"}</p>
              <ul>
                ${genStarterItems(spc.starterItems)}
              </ul>
              ${spc.traits.length > 0 ? genTraits(spc.traits) : ""}
          </div>
    `;
};

const genSpecialistsCards = () => {
  specialistsList.innerHTML = "";
  if (specialistsList.children.length > 0) {
    return;
  }
  for (let i = 0; i < SPECIALISTS.length; i++) {
    const specWarbonds = SPECIALISTS[i].warbonds;
    if (specWarbonds.length < 1) {
      specialistsList.innerHTML += makeCard(SPECIALISTS[i], i);
      continue;
    }
    let make = true;
    for (let j = 0; j < specWarbonds.length; j++) {
      if (!warbondCodes.includes(specWarbonds[j])) {
        make = false;
      }
    }
    if (make) {
      specialistsList.innerHTML += makeCard(SPECIALISTS[i], i);
    }
  }
};

genSpecialistsCards();
