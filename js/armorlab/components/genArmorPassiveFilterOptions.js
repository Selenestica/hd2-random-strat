const armorPassiveListOptions = document.getElementById(
  "armorPassiveListOptions"
);

const genArmorPassiveFilterOptions = () => {
  for (let i = 0; i < ARMOR_PASSIVES.length; i++) {
    const option = generateArmorPassiveOption(ARMOR_PASSIVES[i].displayName);
    armorPassiveListOptions.innerHTML += option;
  }
};

const generateArmorPassiveOption = (name) => {
  return `
            <li>
                <a
                    id="onSaleDropdownItem"
                    class="dropdown-item"
                    onclick="filterByPassive('${name}')"
                    href="#"
                    >${name}</a
                >
            </li>
        `;
};

genArmorPassiveFilterOptions();
