const genGauntletMissionCompleteModalContent = (missionCounter) => {
  const missionData = getMissionData(missionCounter);
  const { text, minutes, obtainHVI } = missionData;
  console.log(text, minutes, obtainHVI);
  const stats = [
    { label: "Stims Used", elId: "stimsUsedInput" },
    { label: "Deaths", elId: "deathsInput" },
    { label: "Stratagems Used", elId: "stratsUsedInput" },
    { label: "High Value Item Obtained", elId: "hviObtainedCheck" },
    { label: "Minutes Remaining", elId: "minutesRemainingInput" },
  ];
  objectiveInputsContainer.innerHTML = "";
  if (missionCounter < 3) {
    stats.pop();
  }
  if (missionCounter < 6) {
    stats.pop();
  }
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    objectiveInputsContainer.innerHTML += `
        <div class="row d-flex pb-1 align-items-center px-0">
            <p class="text-white mb-0 col-6">
                ${stat.label}
            </p>
            <input
                class="form-control col-6"
                style="width: 15%; margin-left: 0.5rem"
                type="number"
                value="0"
                max="1000"
                min="0"
                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                id="objId-${stat.elId}"
            />
        </div>`;
  }
};
