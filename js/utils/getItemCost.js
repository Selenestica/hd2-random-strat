const getItemCost = (item) => {
  let cost = 0;

  // add cost by tier
  if (item.tier === "s") {
    cost += 15;
  } else if (item.tier === "a") {
    cost += 10;
  } else if (item.tier === "b") {
    cost += 5;
  }

  // add cost by item type
  if (
    item.type === "Stratagem" ||
    item.category === "primary" ||
    item.category === "booster"
  ) {
    cost += 12;
  } else if (item.category === "throwable") {
    cost += 5;
  } else if (item.category === "secondary") {
    cost += 3;
  }

  // add randomness from -6 to 7
  const random = Math.floor(Math.random() * 14) - 6;

  // add cost of times purchased
  const timesPurchasedModifier = item.timesPurchased * 5;
  const total = cost + random + timesPurchasedModifier;
  if (total < 1) {
    return 1;
  }
  return total;
};

// starter credits = 100

// TYPES:
// primary = 12
// secondary = 5
// throwable = 5
// stratagem = 12
// armor = 5
// booster = 12

// TIERS:
// s = 15
// a = 10
// b = 5
// c = 0
