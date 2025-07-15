const genSOMissionCompleteModalContent = (objectives) => {
  objectiveInputsContainer.innerHTML = "";

  for (let i = 0; i < objectives.length; i++) {
    const obj = objectives[i];
    if (obj.inputType === "check") {
      objectiveInputsContainer.innerHTML += `
        <div class="form-check py-1">
            <label
                class="form-check-label text-white"
                for="objId-${obj.id}"
            >
                ${obj.inputName}
            </label>
            <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="objId-${obj.id}"
            />
        </div>`;
      continue;
    }
    objectiveInputsContainer.innerHTML += `
        <div class="row d-flex pb-1 align-items-center px-0">
            <p class="text-white mb-0 col-6">
                ${obj.inputName}
            </p>
            <input
                class="form-control col-6 objClass-${obj.id}"
                style="width: 15%; margin-left: 0.5rem"
                type="number"
                value="0"
                id="objId-${obj.id}"
            />
        </div>`;
  }
};
