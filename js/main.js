const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");

const rollStratagems = () => {
    // get random numbers that arent the same and get the strats at those indices
    stratagemsContainer.innerHTML = "";
    // will need to make the first arg below dynamic (3 or 4 or whatever)
    const randomUniqueNumbers = getRandomUniqueNumbers(4, stratagemsList);

    for (let i = 0; i < randomUniqueNumbers.length; i++) {
        const stratagem = stratagemsList[randomUniqueNumbers[i]];
        stratagemsContainer.innerHTML += `
          <div class="col-3 d-flex justify-content-center">
            <div class="card">
              <img
                  src="./images/stratagems/${stratagem.imageURL}"
                  class="img-card-top"
                  alt="${stratagem.displayName}"
              />
              <div class="card-body stratagemNameContainer align-items-center">
                  <p class="card-title">${stratagem.displayName}</p>
              </div>
            </div>
          </div>
        `;
    }
};

const rollEquipment = () => {
    equipmentContainer.innerHTML = "";
    const equipmentLists = [primariesList, secondariesList, grenadesList];
    for (let i = 0; i < equipmentLists.length; i++) {
        const randomNumber = getRandomUniqueNumbers(1, equipmentLists[i]);
        const equipment = equipmentLists[i][randomNumber];
        equipmentContainer.innerHTML += `
        <div class="col-3 d-flex justify-content-center">
          <div class="card">
            <img
                src="./images/equipment/${equipment.imageURL}"
                class="img-card-top"
                alt="${equipment.displayName}"
            />
            <div class="card-body stratagemNameContainer align-items-center">
                <p class="card-title">${equipment.displayName}</p>
            </div>
          </div>
        </div>
      `;
    }
};

const getRandomUniqueNumbers = (max = 4, list) => {
    if (max === 1) {
        return Math.floor(Math.random() * list.length);
    }
    let numbers = [];
    let randomNumber = null;
    while (numbers.length < max) {
        randomNumber = Math.floor(Math.random() * list.length);
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    return numbers;
};
