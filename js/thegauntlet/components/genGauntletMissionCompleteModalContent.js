const genGauntletMissionCompleteModalContent = () => {
  const buckets = [
    { label: "Stims Used", elId: "stimsUsedInput" },
    { label: "Deaths", elId: "deathsInput" },
    { label: "Stratagems Used", elId: "stratsUsedInput" },
  ];
  objectiveInputsContainer.innerHTML = "";

  for (let i = 0; i < buckets.length; i++) {
    const bucket = buckets[i];
    objectiveInputsContainer.innerHTML += `
        <div class="row d-flex pb-1 align-items-center px-0">
            <p class="text-white mb-0 col-6">
                ${bucket.label}
            </p>
            <input
                class="form-control col-6"
                style="width: 15%; margin-left: 0.5rem"
                type="number"
                value="0"
                max="1000"
                min="0"
                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                id="objId-${bucket.elId}"
            />
        </div>`;
  }
};
