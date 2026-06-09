const specialistsList = document.getElementsByClassName("specialistsList");
const specialistPageHeaderText = document.getElementById(
  "specialistPageHeaderText",
);
let specialists = structuredClone(GAUNTLETSPECIALISTS);
const genSpecialistItemNames = (spec, type) => {
  let elementsList = "";
  let list = [];
  if (type === "strat") {
    for (let j = 0; j < spec.stratagems.length; j++) {
      list.push(stratagems[spec.stratagems[j]].displayName);
    }
  }
  if (type === "equip") {
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

const genSpecialistBoons = (spec) => {
  let elementsList = "";
  const { minutes, deaths, extraStrats, stims, booster } = spec;
  let list = [
    { name: "Minutes", val: minutes },
    { val: deaths, name: "Deaths" },
    { val: extraStrats, name: "Stratagems" },
    { val: stims, name: "Stims" },
    { val: booster, name: "Boosters" },
  ];
  for (let i = 0; i < list.length; i++) {
    if (list[i].val !== 0) {
      elementsList += `<li class="text-white">+${list[i].val} ${list[i].name}</li>`;
    }
  }
  return elementsList;
};

const genSpecialistCard = (spec, i, isRestart = null) => {
  let displayName = spec.displayName;
  return `
      <div class="card col-lg-3 col-md-5 col-xs-12 tgSpecialistCards m-2" id="soSpecialistCard${i}">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="text-white mb-0 specialistHeadersClass" id="specialistHeader${i}">${displayName}</h5>
          <button class="btn btn-success" onclick="${`applySpecialist('${i}', '${isRestart}')`}">Select</button>
        </div>
        <div class="card-body">
          <p class="text-white mb-0">Stratagems:</p>
          <ul>
            ${genSpecialistItemNames(spec, "strat")}
          </ul>
          <p class="text-white mb-0">Equipment:</p>
          <ul>
            ${genSpecialistItemNames(spec, "equip")}
          </ul>
          <p class="text-white mb-0">Boons:</p>
          <ul>
            ${genSpecialistBoons(spec)}
          </ul>
        </div>
    `;
};

const genGauntletSpecialistsModalContent = (isRestart = null) => {
  specialistPageHeaderText.innerText =
    "Select a specialist from the list below to begin the challenge.";
  specialistsList[0].innerHTML = "";

  if (isRestart) {
    specialistPageHeaderText.innerText =
      "When restarting a mission, you have the option of changing your specialist. Select a specialist below to continue.";
  }
  // create specialist cards and add them to an array
  for (let i = 0; i < specialists.length; i++) {
    const card = genSpecialistCard(specialists[i], i, isRestart);
    specialistsList[0].innerHTML += card;
  }
};
