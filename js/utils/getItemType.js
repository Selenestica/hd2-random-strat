const getItemType = (item) => {
  if (item.type === "Stratagem") {
    return "stratagem";
  }
  if (item.type === "Warbond") {
    return "warbond";
  }
  return item.category;
};
