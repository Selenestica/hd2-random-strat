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

const filterByType = (type) => {
  console.log(type);
};

const filterByPrice = (type) => {
  const cards = document.querySelectorAll(".bbShopItemCards");
  cards.forEach((card) => {
    card.classList.toggle("d-none");
  });

  //   reset all active classes
  for (let i = 0; i < priceFiltersArray.length; i++) {
    priceFiltersArray[i].classList.remove("active");
  }

  if (type === "onSale") {
    onSaleDropdownItem.classList.toggle("active");
    cards.forEach((card) => {
      const badge = card.querySelector(".costBadges");
      if (!badge.classList.contains("bg-success")) {
        card.classList.toggle("d-none");
      }
    });
  }

  if (type === "purchaseable") {
    purchaseableDropdownItem.classList.toggle("active");
    cards.forEach((card) => {
      const badge = card.querySelector(".costBadges");
      if (credits < parseInt(badge.innerHTML)) {
        card.classList.toggle("d-none");
      }
    });
  }

  if (type === "nonpurchaseable") {
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
  console.log("resetting filters");
};
