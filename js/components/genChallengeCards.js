const challengeCardsContainer = document.getElementById(
  "challengeCardsContainer"
);

const genChallengeCards = () => {
  const challenges = [
    {
      displayName: "Randomizer",
      internalName: "randomizer",
      icon: "fa-arrows-spin",
      iconClasses: "color-changer",
    },
    {
      displayName: "Penitent Crusade",
      internalName: "penitentcrusade",
      icon: "fa-skull-crossbones",
      iconClasses: "",
    },
    {
      displayName: "Budget Blitz",
      internalName: "budgetblitz",
      icon: "fa-sack-dollar",
      iconClasses: "text-success",
    },
    {
      displayName: "Special Ops",
      internalName: "specialops",
      icon: "fa-person-rifle",
      iconClasses: "text-primary",
    },
  ];

  for (let i = 0; i < challenges.length; i++) {
    const challenge = challenges[i];
    const card = document.createElement("a");
    card.href = `./${challenge.internalName}`;
    card.className = `card col-5 bg-none m-1 p-2 text-center challengeCards`;
    card.innerHTML = `
    <i class="${
      challenge.iconClasses ? challenge.iconClasses : "text-danger"
    } fa-solid fa-7x ${challenge.icon}"></i>
    <div class="card-body itemNameContainer align-items-center">
      <p class="card-title text-white pcItemCardText">${
        challenge.displayName
      }</p>
    </div>
  `;
    challengeCardsContainer.appendChild(card);
  }
};

genChallengeCards();
