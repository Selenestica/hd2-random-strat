const getMissionData = (missionCounter) => {
  if (missionCounter === 1) {
    return {
      text: "5 - Hard",
      stims: -100,
      boosters: 4,
      stratagems: 48,
      deaths: -100,
      minutes: -100,
      obtainHVI: false,
      enemy: "Automatons",
    };
  }
  if (missionCounter === 2) {
    return {
      text: "6 - Extreme",
      stims: 26,
      boosters: 4,
      stratagems: 46,
      deaths: -100,
      minutes: -100,
      obtainHVI: false,
      enemy: "Illuminate",
    };
  }
  if (missionCounter === 3) {
    return {
      text: "7 - Suicide Mission",
      stims: 24,
      boosters: 3,
      stratagems: 44,
      deaths: -100,
      minutes: 10,
      obtainHVI: false,
      enemy: "Terminids",
    };
  }
  if (missionCounter === 4) {
    return {
      text: "8 - Impossible",
      stims: 22,
      boosters: 2,
      stratagems: 42,
      deaths: 6,
      minutes: 8,
      obtainHVI: false,
      enemy: "Illuminate",
    };
  }
  if (missionCounter === 5) {
    return {
      text: "9 - Helldive",
      stims: 20,
      boosters: 1,
      stratagems: 40,
      deaths: 5,
      minutes: 5,
      obtainHVI: false,
      enemy: "Terminids",
    };
  }
  if (missionCounter === 6) {
    return {
      text: "10 - Super Helldive",
      stims: 18,
      boosters: 0,
      stratagems: 38,
      deaths: 4,
      minutes: 0,
      obtainHVI: true,
      enemy: "Automatons",
    };
  }
  if (missionCounter > 6) {
    return {
      text: "Challenge Complete",
      stims: 0,
      boosters: 0,
      stratagems: 0,
      deaths: 0,
      minutes: 0,
      obtainHVI: false,
    };
  }
};
