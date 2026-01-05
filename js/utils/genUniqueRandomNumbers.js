const getUniqueRandomNumbers = (min, max, count = 3) => {
  if (max - min + 1 < count) {
    throw new Error(
      "Range is too small for the number of unique values requested"
    );
  }

  const numbers = new Set();

  while (numbers.size < count) {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(rand);
  }

  return [...numbers];
};
