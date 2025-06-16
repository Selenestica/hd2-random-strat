const getItemType = (item) => {
  if (item.type === "Stratagem") {
    return "stratagem";
  }
  return item.category;
};
