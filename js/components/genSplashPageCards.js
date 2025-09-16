const challengeCardsContainer = document.getElementById('challengeCardsContainer');
const toolCardsContainer = document.getElementById('toolCardsContainer');

const genSplashPageCards = (type) => {
  let container = challengeCardsContainer;
  let list = [
    {
      displayName: 'Penitent Crusade',
      internalName: 'penitentcrusade',
      icon: 'skull-and-crossbones',
    },
    {
      displayName: 'Budget Blitz',
      internalName: 'budgetblitz',
      icon: 'dollar-circle-list',
    },
    {
      displayName: 'Freedom Express',
      internalName: 'freedomexpress',
      icon: 'stopwatch',
    },
    {
      displayName: 'Special Ops',
      internalName: 'specialops',
      icon: 'soldier',
    },
  ];
  if (type === 'tools') {
    list = [
      {
        displayName: 'Randomizer',
        internalName: 'randomizer',
        icon: 'dice',
      },
      {
        displayName: 'Tier List Maker',
        internalName: 'tiermaker',
        icon: 'list',
      },
      {
        displayName: 'Armor Lab',
        internalName: 'armorlab',
        icon: 'armor',
      },
    ];
    container = toolCardsContainer;
  }

  for (let i = 0; i < list.length; i++) {
    const li = list[i];
    const card = document.createElement('a');
    card.href = `./${li.internalName}`;
    card.className = `card col-5 col-lg-4 bg-none m-1 p-2 text-center challengeCards`;
    card.innerHTML = `
    <img class="img-fluid svgIconStyles" src="../images/iconSVGs/${li.icon}.svg" />
    <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
      <p class="card-title text-white pcItemCardText">${li.displayName}</p>
    </div>
  `;
    container.appendChild(card);
  }
};

genSplashPageCards('challenges');
genSplashPageCards('tools');
