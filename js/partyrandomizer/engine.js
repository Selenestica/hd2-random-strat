(function (root, factory) {
  const engine = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = engine;
  }
  if (root) {
    root.PartyDraftEngine = engine;
  }
})(typeof window !== "undefined" ? window : globalThis, function () {
  const EQUIPMENT_CATEGORIES = [
    "primary",
    "secondary",
    "armor",
    "throwable",
    "booster",
  ];

  const shuffle = (values, rng = Math.random) => {
    const result = [...values];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      [result[index], result[swapIndex]] = [
        result[swapIndex],
        result[index],
      ];
    }
    return result;
  };

  const rotate = (values, offset) => {
    if (!values.length) return [];
    const normalized = ((offset % values.length) + values.length) % values.length;
    return [...values.slice(normalized), ...values.slice(0, normalized)];
  };

  const sampleUnique = (values, amount, rng = Math.random) => {
    if (amount < 0 || values.length < amount) return null;
    return shuffle(values, rng).slice(0, amount);
  };

  const buildTurnQueue = (playerOrder, enabledCategories) => {
    if (!playerOrder.length) return [];

    const turns = [];
    let rotation = 0;

    EQUIPMENT_CATEGORIES.forEach((category) => {
      if (!enabledCategories[category]) return;
      const categoryOrder = rotate(playerOrder, rotation);
      categoryOrder.forEach((playerId, pickIndex) => {
        turns.push({ category, playerId, round: 0, pickIndex });
      });
      rotation = (rotation + 1) % playerOrder.length;
    });

    if (enabledCategories.stratagem) {
      const baseOrder = rotate(playerOrder, rotation);
      for (let round = 0; round < 4; round += 1) {
        const roundOrder = round % 2 === 0 ? baseOrder : [...baseOrder].reverse();
        roundOrder.forEach((playerId, pickIndex) => {
          turns.push({
            category: "stratagem",
            playerId,
            round,
            pickIndex,
          });
        });
      }
    }

    return turns;
  };

  const getRange = (onlyOne, always, partySize, poolSize) => ({
    min: always ? partySize : 0,
    max: onlyOne ? partySize : poolSize,
  });

  const sampleConstrainedStratagems = (
    candidates,
    amount,
    partySize,
    options,
    rng = Math.random,
  ) => {
    if (candidates.length < amount) return null;

    const support = getRange(
      options.oneSupport,
      options.alwaysSupport,
      partySize,
      amount,
    );
    const backpack = getRange(
      options.oneBackpack,
      options.alwaysBackpack,
      partySize,
      amount,
    );
    const list = shuffle(candidates, rng);
    const suffixSupport = Array(list.length + 1).fill(0);
    const suffixBackpack = Array(list.length + 1).fill(0);

    for (let index = list.length - 1; index >= 0; index -= 1) {
      suffixSupport[index] =
        suffixSupport[index + 1] +
        Number(list[index].tags?.includes("Weapons"));
      suffixBackpack[index] =
        suffixBackpack[index + 1] +
        Number(list[index].tags?.includes("Backpacks"));
    }

    const memo = new Map();
    const canComplete = (index, slotsLeft, supportCount, backpackCount) => {
      const key = `${index}|${slotsLeft}|${supportCount}|${backpackCount}`;
      if (memo.has(key)) return memo.get(key);

      if (
        supportCount > support.max ||
        backpackCount > backpack.max ||
        list.length - index < slotsLeft ||
        supportCount + slotsLeft < support.min ||
        backpackCount + slotsLeft < backpack.min ||
        supportCount + suffixSupport[index] < support.min ||
        backpackCount + suffixBackpack[index] < backpack.min
      ) {
        memo.set(key, false);
        return false;
      }

      if (slotsLeft === 0) {
        const valid =
          supportCount >= support.min &&
          supportCount <= support.max &&
          backpackCount >= backpack.min &&
          backpackCount <= backpack.max;
        memo.set(key, valid);
        return valid;
      }

      if (index >= list.length) {
        memo.set(key, false);
        return false;
      }

      const item = list[index];
      const nextSupport =
        supportCount + Number(item.tags?.includes("Weapons"));
      const nextBackpack =
        backpackCount + Number(item.tags?.includes("Backpacks"));
      const includeFirst = rng() >= 0.5;
      const include = () =>
        canComplete(index + 1, slotsLeft - 1, nextSupport, nextBackpack);
      const exclude = () =>
        canComplete(index + 1, slotsLeft, supportCount, backpackCount);
      const valid = includeFirst
        ? include() || exclude()
        : exclude() || include();
      memo.set(key, valid);
      return valid;
    };

    if (!canComplete(0, amount, 0, 0)) return null;

    const selected = [];
    let index = 0;
    let supportCount = 0;
    let backpackCount = 0;
    while (selected.length < amount && index < list.length) {
      const item = list[index];
      const slotsLeft = amount - selected.length;
      const nextSupport =
        supportCount + Number(item.tags?.includes("Weapons"));
      const nextBackpack =
        backpackCount + Number(item.tags?.includes("Backpacks"));
      const canInclude = canComplete(
        index + 1,
        slotsLeft - 1,
        nextSupport,
        nextBackpack,
      );
      const canExclude = canComplete(
        index + 1,
        slotsLeft,
        supportCount,
        backpackCount,
      );
      const include = canInclude && (!canExclude || rng() >= 0.5);

      if (include) {
        selected.push(item);
        supportCount = nextSupport;
        backpackCount = nextBackpack;
      }
      index += 1;
    }

    return selected.length === amount ? selected : null;
  };

  return {
    EQUIPMENT_CATEGORIES,
    buildTurnQueue,
    rotate,
    sampleConstrainedStratagems,
    sampleUnique,
    shuffle,
  };
});
