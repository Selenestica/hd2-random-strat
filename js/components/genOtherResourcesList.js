const otherResourcesList = document.getElementById("otherResourcesList");

const genOtherResourcesList = () => {
  const resources = [
    {
      displayName: "Helldive.Live",
      url: "https://helldive.live",
      description: "A project that shows live, detailed player loadout data",
    },
    {
      displayName: "Divers-Lab.io",
      url: "https://divers-lab.io",
      description: "Loadout saver, randomizer, and analyzer",
    },
    {
      displayName: "Democracy Hub",
      url: "https://democracy-hub.net",
      description: "A resource for loadouts, stats, and theorycrafting",
    },
    {
      displayName: "Helldivers Hub",
      url: "https://helldivers-hub.com",
      description: "A community hub for managing and sharing loadouts",
    },
    {
      displayName: "Helldivers Wiki",
      url: "https://helldivers.wiki.gg",
      description:
        "A comprehensive online database covering Helldivers and Helldivers 2",
    },
    {
      displayName: "hd2random.com",
      url: "https://hd2random.com",
      description: "Another customizeable, ad-free loadout randomizer",
    },
  ];

  for (let i = 0; i < resources.length; i++) {
    const { url, displayName, description } = resources[i];
    const resItem = `
    <li class="text-white"><a target="_blank" href="${url}">${displayName}</a><span class="text-white"> - ${description}</span></li>
  `;
    otherResourcesList.innerHTML += resItem;
  }
};

genOtherResourcesList();
