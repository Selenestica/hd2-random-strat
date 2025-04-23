const specialistsList = document.getElementById('specialistsList');
const specialistCheckMarks = document.getElementsByClassName('specialistCheckMarks');
const specialistNameText = document.getElementById('specialistNameText');
let selectedSpecialist = null;

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
  selectedSpecialist = index;
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

const genSpecialistsCards = () => {
  if (specialistsList.children.length > 0) {
    return;
  }
  for (let i = 0; i < SPECIALISTS.length; i++) {
    specialistsList.innerHTML += `
      <div class="card pcItemCards col-md-5 col-sm-12 specialistCards m-2" onclick="setSpecialist('${i}')">
        <div class="card-header">
          <h5 class="text-white specialistHeadersClass" id="specialistHeader${i}">${
      SPECIALISTS[i].displayName
    }</h5>
        </div>
        <div class="card-body">
          <p class="text-white">You begin with, and must always have equipped:</p>
          <ul>
            ${genStarterItems(SPECIALISTS[i].starterItems)}
          </ul>
          ${SPECIALISTS[i].traits.length > 0 ? genTraits(SPECIALISTS[i].traits) : ''}
        </div>
    `;
  }
};

const applySpecialist = () => {
  if (selectedSpecialist === null) {
    return;
  }
  specialistNameText.innerHTML = SPECIALISTS[selectedSpecialist].displayName;
};

genSpecialistsCards();
