const challengeCardsContainer = document.getElementById('challengeCardsContainer');
const toolCardsContainer = document.getElementById('toolCardsContainer');

const genSplashPageCards = (type) => {
  let container = challengeCardsContainer;
  let list = [
    {
      displayName: 'Randomizer',
      internalName: 'randomizer',
      icon: 'fa-arrows-spin',
      iconClasses: 'color-changer',
    },
    {
      displayName: 'Penitent Crusade',
      internalName: 'penitentcrusade',
      icon: 'fa-skull-crossbones',
      iconClasses: '',
    },
    {
      displayName: 'Budget Blitz',
      internalName: 'budgetblitz',
      icon: 'fa-sack-dollar',
      iconClasses: 'text-success',
    },
    // {
    //   displayName: "Debt Divers",
    //   internalName: "debtdivers",
    //   icon: "fa-landmark",
    //   iconClasses: "text-secondary",
    // },
    {
      displayName: 'Special Ops',
      internalName: 'specialops',
      icon: 'fa-person-rifle',
      iconClasses: 'text-primary',
    },
  ];
  if (type === 'tools') {
    list = [
      // {
      //   displayName: "Randomizer",
      //   internalName: "randomizer",
      //   icon: "fa-arrows-spin",
      //   iconClasses: "color-changer",
      // },
      {
        displayName: 'Tier List Maker',
        internalName: 'tierListMaker',
        icon: 'fa-table-list',
        iconClasses: 'text-info',
      },
    ];
    container = toolCardsContainer;
  }

  for (let i = 0; i < list.length; i++) {
    const li = list[i];
    const card = document.createElement('a');
    card.href = `./${li.internalName}`;
    card.className = `card col-5 bg-none m-1 p-2 text-center challengeCards`;
    card.innerHTML = `
    <i class="${li.iconClasses ? li.iconClasses : 'text-danger'} fa-solid fa-7x ${li.icon}"></i>
    <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
      <p class="card-title text-white pcItemCardText">${li.displayName}</p>
    </div>
  `;
    container.appendChild(card);
  }
};

genSplashPageCards('challenges');
genSplashPageCards('tools');
