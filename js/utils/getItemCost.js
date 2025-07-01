const getItemCost = (difficulty, item) => {
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
    cost += 2;
  }

  // add randomness from -5 to 5
  let highNumber = 16;
  if (difficulty === "Easy") {
    highNumber = 6;
  }
  if (difficulty === "Hard") {
    highNumber = 26;
  }
  const random = Math.floor(Math.random() * highNumber) - 5;

  // add cost of times purchased
  const timesPurchasedModifier = item.timesPurchased * 5;
  const total = cost + random + timesPurchasedModifier;
  if (total < 1) {
    return 1;
  }
  return total;
};
