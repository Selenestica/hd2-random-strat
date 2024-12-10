const warbondsChecklistContainer = document.getElementById(
    "warbondsChecklistContainer"
);
const warbondsList = [
    "Super Citizen Edition", // warbond0
    "Helldivers Mobilize", // warbond1
    "Steeled Veterans", // warbond2
    "Cutting Edge", // warbond3
    "Democratic Detonation", // warbond4
    "Polar Patriots", // warbond5
    "Viper Commandos", // warbond6
    "Freedom's Flame", // warbond7
    "Chemical Agents", // warbond8
    "Truth Enforcers" // warbond9
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
                ${i !== 0 ? "checked" : ""}
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
