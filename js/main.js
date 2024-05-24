const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");

const rollStratagems = () => {
    // get random numbers that arent the same and get the strats at those indices
    stratagemsContainer.innerHTML = "";
    const randomUniqueNumbers = getRandomUniqueNumbers();

    for (let i = 0; i < randomUniqueNumbers.length; i++) {
        console.log(stratagemsList[randomUniqueNumbers[i]]);
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

const getRandomUniqueNumbers = (max = 4) => {
    let numbers = [];
    let randomNumber = null;
    while (numbers.length < max) {
        randomNumber = Math.floor(Math.random() * stratagemsList.length);
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
    return numbers;
};
