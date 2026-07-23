const acquiredMainItemsAccordion = document.getElementById(
  "acquiredMainItemsAccordion",
);
const acquiredStarItemsAccordion = document.getElementById(
  "acquiredStarItemsAccordion",
);

const CATEGORY_COLORS = {
  Primaries: "border-secondary",
  Stratagems: "border-secondary",
  Boosters: "border-secondary",
  Secondaries: "border-secondary",
  Throwables: "border-secondary",
  Armors: "border-secondary",
};

const accordionItem = (cat, index, modifier) => {
  const borderClass = CATEGORY_COLORS[cat] ?? "border-secondary";
  return `
    <div class="accordion-item acquiredItemsAccordionItem my-1 border-start border-1 ${borderClass}">
      <h2 class="accordion-header" id="mainAccordionHeading${index + modifier}">
        <button
          class="accordion-button text-white"
          type="button"
          aria-expanded="true"
          onclick="populateShowAllItemsModal('${cat}AccordionBody')"
        >
          <span class="badge me-2" style="background-color: var(--bs-${borderClass.replace("border-", "")})">
            ${cat}
          </span>
        </button>
      </h2>
      <div
        id="mainAccordionCollapse${index + modifier}"
        class="accordion-collapse collapse show"
        aria-labelledby="mainAccordionHeading${index + modifier}"
      >
        <div class="accordion-body d-flex row" id="${cat}AccordionBody"></div>
      </div>
    </div>
  `;
};

const genAcquiredItemsAccordions = () => {
  const mainAccordionCats = ["Primaries", "Stratagems", "Boosters"];
  const starAccordionCats = ["Secondaries", "Throwables", "Armors"];

  for (let i = 0; i < mainAccordionCats.length; i++) {
    acquiredMainItemsAccordion.innerHTML += accordionItem(
      mainAccordionCats[i],
      i,
      0,
    );
  }

  for (let j = 0; j < starAccordionCats.length; j++) {
    acquiredStarItemsAccordion.innerHTML += accordionItem(
      starAccordionCats[j],
      j,
      3,
    );
  }
};

genAcquiredItemsAccordions();
