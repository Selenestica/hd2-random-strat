const getRandomSpecialOpsObjectives = (enemy) => {
  const objsCopy = [...SPECIALOPSOBJECTIVES];

  // illuminate dont have a HVI yet
  if (enemy === "Illuminate") {
    objsCopy.shift();
  }
  objsCopy.sort(() => Math.random() - 0.5);
  const first = objsCopy[0];
  const second = objsCopy[1];
  const objsList = [first, second];

  // modifier for certain objectives against certain enemies
  if (enemy !== "Automaton") {
    const adjustmentList = [1, 9];
    for (let i = 0; i < objsList.length; i++) {
      if (adjustmentList.includes(objsList[i].id)) {
        objsList[i].goal *= 1.5;
      }
    }
  }

  return [first, second];
};
