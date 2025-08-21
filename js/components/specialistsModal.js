const specialistsList = document.getElementById('specialistsList');
const specialistCheckMarks = document.getElementsByClassName('specialistCheckMarks');
const specialistNameText = document.getElementById('specialistNameText');
let specialist = null;

const setSpecialist = (index) => {
  // remove the checkmark from all other specialists
  const elements = document.querySelectorAll('.specialistCheckMarks');
  elements.forEach((element) => element.remove());

  // remove green text from all other specialists
  const specialistHeaders = document.querySelectorAll('.specialistHeadersClass');
  specialistHeaders.forEach((header) => {
    header.classList.remove('text-success');
    header.classList.add('text-white');
  });

  // add the checkmark to the selected specialist
  const specialistHeader = document.getElementById(`specialistHeader${index}`);
  specialistHeader.innerHTML += `<i class="fa-solid specialistCheckMarks text-success mx-1 fa-check"></i>`;
  specialistHeader.classList.add('text-success');
  specialistHeader.classList.remove('text-white');

  // set the selected specialist
  specialist = index;
};

const genStarterItems = (starterItems) => {
  let items = '';
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
  if (spc.imageURL.length > 0) {
    return `
          <div id="pcSpecialistCard('${index}')" class="card col-md-5 col-lg-3 col-sm-5 specialistCards m-2" onclick="setSpecialist('${index}')">
                  <img
          src="../images/pcSpecialists/${spc.imageURL}"
          class="img-card-top"
          alt="${spc.displayName}"
      />
          </div>
          `;
  }
  return `
          <div id="pcSpecialistCard('${index}')" class="card col-md-5 col-sm-12 specialistCards m-2" onclick="setSpecialist('${index}')">
            <div class="card-header">
              <h5 class="text-white specialistHeadersClass" id="specialistHeader${index}">${
    spc.displayName
  }</h5>
            </div>
            <div class="card-body">
              <p class="text-white">You begin with, and must always have equipped:</p>
              <ul>
                ${genStarterItems(spc.starterItems)}
              </ul>
              ${spc.traits.length > 0 ? genTraits(spc.traits) : ''}
          </div>
    `;
};

const genSpecialistsCards = () => {
  specialistsList.innerHTML = '';
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
