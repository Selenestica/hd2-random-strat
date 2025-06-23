const getMaxSuperSamplesForMission = () => {
  if (missionCounter < 11) {
    return 3;
  } else if (missionCounter < 14) {
    return 4;
  } else if (missionCounter < 17) {
    return 5;
  } else if (missionCounter < 20) {
    return 6;
  }
  return 7;
};

// 3, 4, 5, 6, 7
