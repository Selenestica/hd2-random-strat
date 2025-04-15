const acquiredMainItemsAccordion = document.getElementById('acquiredMainItemsAccordion');
const acquiredStarItemsAccordion = document.getElementById('acquiredStarItemsAccordion');

const accordionItem = (cat, index, modifier) => {
  return `
      <div class="accordion-item acquiredItemsAccordionItem my-1">
        <h2 class="accordion-header" id="mainAccordionHeading${index + modifier}">
          <button
            class="accordion-button text-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainAccordionCollapse${index + modifier}"
            aria-expanded="true"
            aria-controls="mainAccordionCollapse${index + modifier}"
          >
            ${cat}
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
  const mainAccordionCats = ['Primaries', 'Stratagems', 'Boosters'];
  const starAccordionCats = ['Secondaries', 'Throwables', 'Armors'];

  for (let i = 0; i < mainAccordionCats.length; i++) {
    acquiredMainItemsAccordion.innerHTML += accordionItem(mainAccordionCats[i], i, 0);
  }

  for (let j = 0; j < starAccordionCats.length; j++) {
    acquiredStarItemsAccordion.innerHTML += accordionItem(starAccordionCats[j], j, 3);
  }
};

genAcquiredItemsAccordions();
