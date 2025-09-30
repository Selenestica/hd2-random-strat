const filterByType = (type) => {
  const cards = document.querySelectorAll(".armorCards");
  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.remove("d-none");
  });
  cards.forEach((card) => {
    if (!card.classList.contains(type)) {
      card.classList.toggle("d-none");
    }
  });
};

const filterByWarbond = (code, cardClass) => {
  const cards = document.querySelectorAll(`.${cardClass}`);
  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.remove("d-none");
  });
  cards.forEach((card) => {
    if (!card.classList.contains(code)) {
      card.classList.toggle("d-none");
    }
  });
};

const filterByPassive = (name) => {
  const cards = document.querySelectorAll(`.armorCards`);
  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.remove("d-none");
  });
  cards.forEach((card) => {
    if (card.dataset.armorpassive !== name) {
      card.classList.toggle("d-none");
    }
  });
};

const resetFilters = (cat) => {
  const cards = document.querySelectorAll(`.${cat}Cards`);
  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.remove("d-none");
  });

  let list = helmetsList;
  let searchInput = helmetSearchInput;
  if (cat === "armor") {
    list = armorList;
    searchInput = armorSearchInput;
  }
  if (cat === "capes") {
    list = capesList;
    searchInput = capeSearchInput;
  }

  searchInput.value = "";
};
