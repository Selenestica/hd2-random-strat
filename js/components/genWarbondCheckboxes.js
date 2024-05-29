const warbondsChecklistContainer = document.getElementById(
    "warbondsChecklistContainer"
);
const warbondsList = [
    "Super Citizen Edition",
    "Helldivers Mobilize",
    "Steeled Veterans",
    "Cutting Edge",
    "Democratic Detonation",
    "Polar Patriots"
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
