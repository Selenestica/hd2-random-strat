const getRandomSpecialOpsObjectives = async (enemy) => {
  let objsCopy = await SPECIALOPSOBJECTIVES.map((obj) => ({ ...obj }));
  // illuminate dont have a HVI yet
  if (enemy === "Illuminate") {
    objsCopy.shift();
  }
  objsCopy.sort(() => Math.random() - 0.5);
  let first = objsCopy[0];
  let second = objsCopy[1];

  // reset progress
  first.progress = 0;
  second.progress = 0;

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
