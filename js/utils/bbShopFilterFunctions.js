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
const onSaleDropdownItem = document.getElementById("onSaleDropdownItem");
const purchaseableDropdownItem = document.getElementById(
  "purchaseableDropdownItem"
);
const nonPurchaseableDropdownItem = document.getElementById(
  "nonPurchaseableDropdownItem"
);
const priceFiltersArray = [
  onSaleDropdownItem,
  purchaseableDropdownItem,
  nonPurchaseableDropdownItem,
];
const typeFiltersArray = [
  primariesFilterDropdownItem,
  secondariesFilterDropdownItem,
  throwablesFilterDropdownItem,
  armorPassivesFilterDropdownItem,
  boostersFilterDropdownItem,
  stratagemsFilterDropdownItem,
];

const filterByType = (filter) => {
  const cards = document.querySelectorAll(".bbShopItemCards");
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

const filterByPrice = (filter) => {
  const cards = document.querySelectorAll(".bbShopItemCards");
  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.remove("d-none");
  });

  // Reset all filter button active class
  priceFiltersArray.forEach((btn) => btn.classList.remove("active"));

  if (filter === "onSale") {
    onSaleDropdownItem.classList.toggle("active");
    cards.forEach((card) => {
      const badge = card.querySelector(".costBadges");
      if (!badge.classList.contains("bg-success")) {
        card.classList.toggle("d-none");
      }
    });
  }

  if (filter === "purchaseable") {
    purchaseableDropdownItem.classList.toggle("active");
    cards.forEach((card) => {
      const badge = card.querySelector(".costBadges");
      if (credits < parseInt(badge.innerHTML)) {
        card.classList.toggle("d-none");
      }
    });
  }

  if (filter === "nonpurchaseable") {
    nonPurchaseableDropdownItem.classList.toggle("active");
    cards.forEach((card) => {
      const badge = card.querySelector(".costBadges");
      if (credits >= parseInt(badge.innerHTML)) {
        card.classList.toggle("d-none");
      }
    });
  }
};

const resetShopFilters = () => {
  const cards = document.querySelectorAll(".bbShopItemCards");
  // Reset all filters to visible
  cards.forEach((card) => {
    card.classList.remove("d-none");
  });

  // Reset all filter buttons active class
  typeFiltersArray.forEach((btn) => btn.classList.remove("active"));
  priceFiltersArray.forEach((btn) => btn.classList.remove("active"));

  shopSearchInput.value = "";
};
