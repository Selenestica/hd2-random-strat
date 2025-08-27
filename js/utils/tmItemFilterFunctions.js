const primariesFilterDropdownItem = document.getElementById(
  "primariesFilterDropdownItem"
);
const secondariesFilterDropdownItem = document.getElementById(
  "secondariesFilterDropdownItem"
);
const throwablesFilterDropdownItem = document.getElementById(
  "throwablesFilterDropdownItem"
);
const stratagemsFilterDropdownItem = document.getElementById(
  "stratagemsFilterDropdownItem"
);
const armorPassivesFilterDropdownItem = document.getElementById(
  "armorPassivesFilterDropdownItem"
);
const boostersFilterDropdownItem = document.getElementById(
  "boostersFilterDropdownItem"
);
const warbondsFilterList = document.getElementById("warbondsFilterList");

const typeFiltersArray = [
  primariesFilterDropdownItem,
  secondariesFilterDropdownItem,
  throwablesFilterDropdownItem,
  armorPassivesFilterDropdownItem,
  boostersFilterDropdownItem,
  stratagemsFilterDropdownItem,
];

const filterByType = (filter) => {
  const cards = document.querySelectorAll(".tierItem");
  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.remove("d-none");
  });

  // Reset all filter buttons active class
  typeFiltersArray.forEach((btn) => btn.classList.remove("active"));

  cards.forEach((card) => {
    if (filter !== card.dataset.type) {
      card.classList.toggle("d-none");
    }
  });
};

const filterByWarbond = (wbCode) => {
  const cards = document.querySelectorAll(".tierItem");
  const wbCards = document.querySelectorAll(`.warbond${wbCode}`);

  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.add("d-none");
  });

  // Reset all filter buttons active class
  typeFiltersArray.forEach((btn) => btn.classList.remove("active"));

  wbCards.forEach((card) => {
    card.classList.toggle("d-none");
  });
};

const resetItemFilters = () => {
  const cards = document.querySelectorAll(".tierItem");
  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.remove("d-none");
  });

  // Reset all filter buttons active class
  typeFiltersArray.forEach((btn) => btn.classList.remove("active"));

  //   shopSearchInput.value = "";
  // populateLooseItems();
};
