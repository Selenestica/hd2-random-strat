const squadSpecialistsList = document.getElementById("squadSpecialistsList");
const squadSpecialistInputs = document.getElementsByClassName(
  "squadSpecialistInputs",
);
const allSpecialists = structuredClone(GAUNTLETSPECIALISTS);
const genSquadSpecialistCard = (spec, index) => {
  let displayName = spec.displayName;
  return `
      <div class="card col-lg-3 col-md-5 tgSpecialistCards col-xs-5 m-1">
        <div class="card-header d-flex justify-content-between align-items-center">
          <label class="text-white" for="squadSpecialist${index}">${displayName}</label>
          <input 
            style="margin-left: 0.5rem; min-width: 30px !important" 
            max="3" 
            min="0" 
            value="0" 
            type="number" 
            class="squadSpecialistInputs" 
            id="squadSpecialist${index}" 
          />
        </div>
      </div>
    `;
};

const genSquadSpecialistModalContent = () => {
  // create specialist cards and add them to an array
  for (let i = 0; i < allSpecialists.length; i++) {
    const card = genSquadSpecialistCard(allSpecialists[i], i);
    squadSpecialistsList.innerHTML += card;
  }
};
