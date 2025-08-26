const getMissionText = (num) => {
  if (num === 1) {
    return "Op: 1, Mission: 1";
  }
  if (num === 2) {
    return "Op: 1, Mission: 2";
  }
  if (num === 3) {
    return "Op: 1, Mission: 3";
  }
  if (num === 4) {
    return "Op: 2, Mission: 1";
  }
  if (num === 5) {
    return "Op: 2, Mission: 2";
  }
  if (num === 6) {
    return "Op: 2, Mission: 3";
  }
  if (num === 7) {
    return "Op: 3, Mission: 1";
  }
  if (num === 8) {
    return "Op: 3, Mission: 2";
  }
  if (num === 9) {
    return "Op: 3, Mission: 3";
  }
  if (num >= 10) {
    return "Challenge Complete";
  }
};
