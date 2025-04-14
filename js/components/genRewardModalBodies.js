const genRewardModalBodies = () => {
  const missionRewardChoices = ['Stratagem', 'Primary', 'Booster'];
  const starsRewardChoices = ['Secondary', 'Throwable', 'Armor'];
  for (let i = 0; i < missionRewardChoices.length; i++) {
    missionCompleteModalBody.innerHTML += `
      <div class="justify-content-center">
        <button class="btn btn-primary m-1" onclick="rollPCMC('${i}')" id="button${missionRewardChoices[i]}" type="button">
          ${missionRewardChoices[i]}
        </button>
      </div>
    `;
  }
  for (let j = 0; j < starsRewardChoices.length; j++) {
    maxStarsModalBody.innerHTML += `
      <div class="justify-content-center">
        <button class="btn btn-primary m-1" onclick="rollPCMS('${j}')" id="button${missionRewardChoices[j]}" type="button">
          ${starsRewardChoices[j]}
        </button>
      </div>
    `;
  }
};

genRewardModalBodies();
