const stratagemsContainer = document.getElementById("stratagemsContainer");
const equipmentContainer = document.getElementById("equipmentContainer");

const rollStratagems = () => {
    // get four random numbers that arent the same and get the strats at those indices
    stratagemsContainer.innerHTML = "";
    const fourRandomUniqueNumbers = getFourRandomUniqueNumbers();

    // console.log(stratagemsList[randomStratagemIndex]);
    // stratagemsContainer.innerHTML = `

    // `;
};

const getFourRandomUniqueNumbers = () => {
    let numbers = [];
    let randomNumber = null;
    while (numbers.length < 4) {
        randomNumber = Math.floor(Math.random() * stratagemsList.length);
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber);
        }
    }
};
