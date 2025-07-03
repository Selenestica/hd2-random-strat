// double the actual maximum to account for Sample Scanner booster
const getMaxSuperSamplesForMission = () => {
  if (missionCounter < 11) {
    return 6;
  } else if (missionCounter < 14) {
    return 8;
  } else if (missionCounter < 17) {
    return 10;
  } else if (missionCounter < 20) {
    return 12;
  }
  return 14;
};
