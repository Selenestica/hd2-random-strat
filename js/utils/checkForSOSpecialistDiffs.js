const checkForSOSpecialistDiffs = (specs, current, latest) => {
  let unlockedSpecs = [];
  let currentSpecIndex = null;
  let latestSpecIndex = null;

  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    if (!s.locked) {
      unlockedSpecs.push(i);
    }
    if (s.displayName === current.displayName) {
      currentSpecIndex = i;
    }
    if (s.displayName === latest.displayName) {
      latestSpecIndex = i;
    }
  }

  let newSpecList = structuredClone(SPECOPSSPECS);
  for (let j = 0; j < unlockedSpecs.length; j++) {
    newSpecList[unlockedSpecs[j]].locked = false;
  }

  const newCurrentSpec = newSpecList[currentSpecIndex];
  const newLatestSpec = newSpecList[latestSpecIndex];
  return { newSpecList, newCurrentSpec, newLatestSpec };
};
