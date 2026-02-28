const viewItemsModalBody = document.getElementById('viewItemsModalBody');
const stratagemsGallery = document.getElementById('stratagemsGallery');
const primariesGallery = document.getElementById('primariesGallery');
const secondariesGallery = document.getElementById('secondariesGallery');
const throwablesGallery = document.getElementById('throwablesGallery');
const boostersGallery = document.getElementById('boostersGallery');
const armorPassivesGallery = document.getElementById('armorPassivesGallery');

const getBadgeColor = (tier) => {
  if (tier === 's') {
    return '#C0392B';
  }
  if (tier === 'a') {
    return '#D4AC0D';
  }
  if (tier === 'b') {
    return '#27AE60';
  }
  if (tier === 'c') {
    return '#2980B9';
  }
};

const genGalleryCard = (item) => {
  let imgDir = 'equipment';
  let badgeColor = getBadgeColor(item.tier);
  if (item.type === 'Stratagem') {
    imgDir = 'svgs';
  }
  if (item.category === 'armor') {
    imgDir = 'armorpassives';
  }
  return `
    <div class="card d-flex col-2 col-lg-1 pcNoHoverItemCards mx-1">
      <img
          src="../images/${imgDir}/${item.imageURL}"
          class="img-card-top"
          alt="${item.displayName}"
      />
      <span 
        class="costBadges translate-middle badge rounded-pill text-dark" 
        style="background-color: ${badgeColor}"
      >
        ${item.tier.toUpperCase()}
      </span>
      <div class="card-body itemNameContainer p-0 p-lg-2 align-items-center">
          <p class="card-title text-white pcItemCardText">${item.displayName}</p>
      </div>
    </div>`;
};

const genItemGalleryModalContent = async () => {
  let prims = [...PRIMARIES];
  let seconds = [...SECONDARIES];
  let throws = [...THROWABLES];
  let boosts = [...BOOSTERS];
  let strats = [...STRATAGEMS];
  let armorPassives = [...ARMOR_PASSIVES];

  const sourceLists = [prims, seconds, throws, boosts, strats, armorPassives];

  const sortedByTierSourceLists = await sourceLists.map((list) => {
    const sortedList = list.sort((a, b) => {
      if (a.tier === b.tier) {
        return 0;
      }
      if (a.tier === 's') {
        return -1;
      }
      if (b.tier === 's') {
        return 1;
      }
      if (a.tier === 'a') {
        return -1;
      }
      if (b.tier === 'a') {
        return 1;
      }
      if (a.tier === 'b') {
        return -1;
      }
      if (b.tier === 'b') {
        return 1;
      }
      if (a.tier === 'c') {
        return -1;
      }
      if (b.tier === 'c') {
        return 1;
      }
      return 0;
    });
    return sortedList;
  });

  sortedByTierSourceLists.forEach((list, i) => {
    list.forEach((item) => {
      if (i === 0) {
        primariesGallery.innerHTML += genGalleryCard(item);
      }
      if (i === 1) {
        secondariesGallery.innerHTML += genGalleryCard(item);
      }
      if (i === 2) {
        throwablesGallery.innerHTML += genGalleryCard(item);
      }
      if (i === 3) {
        boostersGallery.innerHTML += genGalleryCard(item);
      }
      if (i === 4) {
        stratagemsGallery.innerHTML += genGalleryCard(item);
      }
      if (i === 5) {
        armorPassivesGallery.innerHTML += genGalleryCard(item);
      }
    });
  });
};

genItemGalleryModalContent();
