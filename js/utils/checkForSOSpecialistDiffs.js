const checkForSOSpecialistDiffs = (specs, current, latest) => {
  let unlockedSpecs = [];
  let currentSpecIndex = null;
  let latestSpecIndex = null;

  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    if (!s.locked) {
      unlockedSpecs.push(specs[i].displayName);
    }
  }

  let masterSpecsClone = structuredClone(SPECOPSSPECS);
  // probably want to filter these by warbond as well
  if (masterSpecsClone.length < 1) {
    return;
  }

  let newSpecialistsList = [];
  for (let j = 0; j < masterSpecsClone.length; j++) {
    const spc = masterSpecsClone[j];
    if (!spc.locked) {
      newSpecialistsList.push(spc);
      continue;
    }

    const specWarbonds = spc.warbonds;
    if (specWarbonds.length < 1) {
      newSpecialistsList.push(spc);
      continue;
    }

    let add = true;
    for (let k = 0; k < specWarbonds.length; k++) {
      if (!warbondCodes.includes(specWarbonds[k])) {
        add = false;
        break;
      }
    }
    if (add) {
      newSpecialistsList.push(spc);
    }
  }

  for (let n = 0; n < newSpecialistsList.length; n++) {
    const s = newSpecialistsList[n];
    if (!s.locked) {
      unlockedSpecs.push(n);
    }
    if (s.displayName === current.displayName) {
      currentSpecIndex = n;
    }
    if (s.displayName === latest.displayName) {
      latestSpecIndex = n;
    }
    if (unlockedSpecs.includes(s.displayName)) {
      s.locked = false;
    }
  }

  const newCurrentSpec = newSpecialistsList[currentSpecIndex];
  const newLatestSpec = newSpecialistsList[latestSpecIndex];
  return { newSpecialistsList, newCurrentSpec, newLatestSpec };
};
