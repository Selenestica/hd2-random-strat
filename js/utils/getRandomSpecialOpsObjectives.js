const SPECIALOPSOBJECTIVES = [
  {
    name: "Extract with the High-Value Item 1 time",
    goal: 1,
    progress: 0,
    id: 0,
  },
  { name: "Kill a total of X enemies", goal: 300, progress: 0, id: 1 },
  { name: "Die less than X times", goal: 8, progress: 0, id: 2 },
  { name: "Collect X common samples", goal: 20, progress: 0, id: 3 },
  { name: "Collect X rare samples", goal: 12, progress: 0, id: 4 },
  { name: "Collect X super samples", goal: 7, progress: 0, id: 5 },
  { name: "Have less than X accidentals", goal: 4, progress: 0, id: 6 },
  { name: "Earn X stars", goal: 12, progress: 0, id: 7 },
  {
    name: "Have an average of more than X% mission time remaining",
    goal: 33,
    progress: 0,
    id: 8,
  },
  { name: "Perform X melee kills", goal: 20, progress: 0, id: 9 },
];

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

// - kill X (225 - 500) enemies (less for bot planets)
// - die less than X times
// - collect X amount of common/rare/super/total samples
// - have less than X accidentals
// - earn X amount of stars
// - have an average of less than X amount of time remaining
// - collect 1 high tier item?
// - have X amount of melee kills
