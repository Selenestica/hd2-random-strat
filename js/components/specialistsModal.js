const specialistsList = document.getElementById('specialistsList');

const setSpecialist = (index) => {
  console.log('Specialist selected:', SPECIALISTS[index].displayName);
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
      <div class="card pcItemCards specialistCards my-2" onclick="setSpecialist('${i}')">
        <div class="card-header">
          <h5 class="text-white">${SPECIALISTS[i].displayName}</h5>
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

genSpecialistsCards();
