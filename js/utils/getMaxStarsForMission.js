const getMaxStarsForMission = (missionCounter) => {
  if (missionCounter < 5) {
    return 3;
  }
  if (missionCounter < 11) {
    return 4;
  }
  return 5;
};
