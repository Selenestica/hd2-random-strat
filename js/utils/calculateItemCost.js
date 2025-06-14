const calculateItemCost = (val, item) => {
  if (val === 1) {
    return item.cost;
  }

  let itemCost = item.cost;
  if (item.onSale) {
    itemCost = Math.ceil(item.cost * 0.5);
  }

  const flatAdditiveValue = (val - 1) * 5;
  const multiplicativeValue = itemCost * val;
  return multiplicativeValue + flatAdditiveValue;
};

// BUG: if item is on sale, and the user goes down to a single use, the cost is calculated as
// if it were not on sale
