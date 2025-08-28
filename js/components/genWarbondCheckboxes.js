const warbondsChecklistContainer = document.getElementById(
  "warbondsChecklistContainer"
);
const warbondsList = [
  "Super Citizen Edition", // warbond0
  "Superstore", // warbond1
  "Pre-Order Bonus", // warbond2
  "Helldivers Mobilize", // warbond3
  "Steeled Veterans", // warbond4
  "Cutting Edge", // warbond5
  "Democratic Detonation", // warbond6
  "Polar Patriots", // warbond7
  "Viper Commandos", // warbond8
  "Freedom's Flame", // warbond9
  "Chemical Agents", // warbond10
  "Truth Enforcers", // warbond11
  "Urban Legends", // warbond12
  "Servants of Freedom", // warbond13
  "Borderline Justice", // warbond14
  "Masters of Ceremony", // warbond15
  "Force of Law", // warbond16
  "Control Group", // warbond17
  "KILLZONE", // warbond18
  "Halo ODST", //warbond19
  //"Dust Devils", //warbond20
];

const genWarbondCheckboxes = () => {
  for (let i = 0; i < warbondsList.length; i++) {
    warbondsChecklistContainer.innerHTML += `                                    
          <div class="form-check">
            <input
                class="form-check-input warbondCheckboxes"
                type="checkbox"
                value=""
                id="warbond${i}"
                checked
            />
            <label
                class="form-check-label"
                for="warbond${i}"
            >
                <div>
                    <b class="text-white"
                        >${warbondsList[i]}</b
                    >
                </div>
            </label>
          </div>
      `;
  }
};

genWarbondCheckboxes();
