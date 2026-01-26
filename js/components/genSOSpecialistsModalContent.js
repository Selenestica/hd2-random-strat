const specialistsList = document.getElementById('specialistsList');
const amountOfSpecsUnlockedText = document.getElementById('amountOfSpecsUnlockedText');

const genSpecialistItemNames = (spec, type) => {
  let elementsList = '';
  let list = [];
  if (type === 'strat') {
    for (let j = 0; j < spec.stratagems.length; j++) {
      list.push(stratagems[spec.stratagems[j]].displayName);
    }
  }
  if (type === 'equip') {
    const { primary, secondary, throwable, armorPassive } = spec;
    list = [
      primaries[primary].displayName,
      secondaries[secondary].displayName,
      throwables[throwable].displayName,
      armorPassives[armorPassive].displayName,
    ];
  }
  for (let i = 0; i < list.length; i++) {
    elementsList += `<li class="text-white">${list[i]}</li>`;
  }
  return elementsList;
};

const genSpecialistCard = (spec, i, currentSpec, latestSpec) => {
  let displayName = spec.displayName;
  if (spec.locked) {
    displayName = 'Locked';
  }
  if (currentSpec.displayName === spec.displayName) {
    displayName += ' (Current)';
  }
  if (latestSpec.displayName === spec.displayName) {
    displayName += `<i class="bi bi-key-fill mx-2 text-warning"></i>`;
  }
  return `
      <div class="card col-lg-3 col-sm-12 specialistCards m-2" id="soSpecialistCard${i}" onclick="${
        spec.locked ? '' : `setSpecialist('${i}')`
      }">
        <div class="card-header">
          <h5 class="text-white specialistHeadersClass" id="specialistHeader${i}">${displayName}</h5>
        </div>
        <div class="card-body ${spec.locked ? 'text-center' : ''}">
          ${
            spec.locked
              ? `<i class="bi bi-question-lg text-white fa-3x"></i>`
              : `
          <p class="text-white mb-0">Stratagems:</p>
          <ul>
            ${genSpecialistItemNames(spec, 'strat')}
          </ul>
          <p class="text-white mb-0">Equipment:</p>
          <ul>
            ${genSpecialistItemNames(spec, 'equip')}
          </ul>`
          }
        </div>
    `;
};

const genSOSpecialistsModalContent = (currSpecialist, latestSpecialist) => {
  specialistsList.innerHTML = '';
  // create specialist cards and add them to an array
  for (let i = 0; i < specialists.length; i++) {
    const card = genSpecialistCard(specialists[i], i, currSpecialist, latestSpecialist);
    specialistsList.innerHTML += card;
  }

  // calculate number of unlocked specialists and update specialist modal header text
  let unlockedSpecialistsAmount = 0;
  for (let j = 0; j < specialists.length; j++) {
    if (!specialists[j].locked) {
      unlockedSpecialistsAmount++;
    }
  }
  amountOfSpecsUnlockedText.innerHTML = `(${unlockedSpecialistsAmount}/${specialists.length} unlocked)`;
};
