const getIsItemOnSale = (difficulty) => {
  let onSale = false;
  let max = 2;
  if (difficulty === "Easy") {
    max = 3;
  }
  if (difficulty === "Hard") {
    max = 1;
  }
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  if (randomNumber <= max) {
    onSale = true;
  }

  return onSale;
};
