const capesWarbondList = document.getElementById("capesWarbondList");
const armorWarbondList = document.getElementById("armorWarbondList");
const helmetsWarbondList = document.getElementById("helmetsWarbondList");

const genWarbondFilterOptions = () => {
  const lists = [capesWarbondList, armorWarbondList, helmetsWarbondList];
  for (let j = 0; j < lists.length; j++) {
    let cardClass = "capesCards";
    if (j === 1) {
      cardClass = "armorCards";
    }
    if (j === 2) {
      cardClass = "helmetsCards";
    }
    for (let i = 0; i < WARBONDS.length; i++) {
      const option = generateOption(
        WARBONDS[i].warbondCode,
        WARBONDS[i].displayName,
        cardClass
      );
      lists[j].innerHTML += option;
    }
  }
};

const generateOption = (code, name, cardClass) => {
  return `
            <li>
                <a
                    id="onSaleDropdownItem"
                    class="dropdown-item"
                    onclick="filterByWarbond('${code}', '${cardClass}')"
                    href="#"
                    >${name}</a
                >
            </li>
        `;
};

genWarbondFilterOptions();
