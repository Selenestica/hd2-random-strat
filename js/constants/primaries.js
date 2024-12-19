const PRIMARIES = [
    {
        displayName: "Liberator",
        type: "Equipment",
        category: "primary",
        tags: ["AssaultRifle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "ar23liberator",
        imageURL: "ar23liberator.png"
    },
    {
        displayName: "StA-11 SMG",
        type: "Equipment",
        category: "primary",
        tags: ["Submachinegun"],
        warbond: "None",
        warbondCode: "none",
        internalName: "sta11smg",
        imageURL: "sta11smg.png"
    },
    {
        displayName: "PLAS-39 Accelerator Rifle",
        type: "Equipment",
        category: "primary",
        tags: ["MarksmanRifle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "plas39acceleratorrifle",
        imageURL: "plas39acceleratorrifle.png"
    },
    {
        displayName: "StA-52 Assault Rifle",
        type: "Equipment",
        category: "primary",
        tags: ["AssaultRifle"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "sta52assaultrifle",
        imageURL: "sta52assaultrifle.png"
    },
    {
        displayName: "Liberator Carbine",
        type: "Equipment",
        category: "primary",
        tags: ["AssaultRifle"],
        warbond: "Viper Commandos",
        warbondCode: "warbond6",
        internalName: "ar23aliberatorcarbine",
        imageURL: "ar23aliberatorcarbine.png"
    },
    {
        displayName: "Halt",
        type: "Equipment",
        category: "primary",
        tags: ["Shotgun"],
        warbond: "Truth Enforcers",
        warbondCode: "warbond9",
        internalName: "sg20halt",
        imageURL: "sg20halt.png"
    },
    {
        displayName: "Reprimand",
        type: "Equipment",
        category: "primary",
        tags: ["Submachinegun"],
        warbond: "Truth Enforcers",
        warbondCode: "warbond9",
        internalName: "smg32reprimand",
        imageURL: "smg32reprimand.png"
    },
    {
        displayName: "Constitution",
        type: "Equipment",
        category: "primary",
        tags: ["MarksmanRifle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "r2124constitution",
        imageURL: "r2124constitution.png"
    },
    {
        displayName: "Pummeler",
        type: "Equipment",
        category: "primary",
        tags: ["SubmachineGun"],
        warbond: "Polar Patriots",
        warbondCode: "warbond5",
        internalName: "smg72pummeler",
        imageURL: "smg72pummeler.png"
    },
    {
        displayName: "Purifier",
        type: "Equipment",
        category: "primary",
        tags: ["EnergyWeapon"],
        warbond: "Polar Patriots",
        warbondCode: "warbond5",
        internalName: "plas101purifier",
        imageURL: "plas101purifier.png"
    },
    {
        displayName: "Liberator Penetrator",
        type: "Equipment",
        category: "primary",
        tags: ["AssaultRifle"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "ar23pliberatorpenetrator",
        imageURL: "ar23pliberatorpenetrator.png"
    },
    {
        displayName: "Liberator Concussive",
        type: "Equipment",
        category: "primary",
        tags: ["AssaultRifle"],
        warbond: "Steeled Veterans",
        warbondCode: "warbond2",
        internalName: "ar23cliberatorconcussive",
        imageURL: "ar23cliberatorconcussive.png"
    },
    {
        displayName: "Adjudicator",
        type: "Equipment",
        category: "primary",
        tags: ["AssaultRifle"],
        warbond: "Democratic Detonation",
        warbondCode: "warbond4",
        internalName: "br14adjudicator",
        imageURL: "br14adjudicator.png"
    },
    {
        displayName: "Defender",
        type: "Equipment",
        category: "primary",
        tags: ["SubmachineGun"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "smg37defender",
        imageURL: "smg37defender.png"
    },
    {
        displayName: "Punisher",
        type: "Equipment",
        category: "primary",
        tags: ["Shotgun"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "sg8punisher",
        imageURL: "sg8punisher.png"
    },
    {
        displayName: "Tenderizer",
        type: "Equipment",
        category: "primary",
        tags: ["AssaultRifle"],
        warbond: "Polar Patriots",
        warbondCode: "warbond5",
        internalName: "ar61tenderizer",
        imageURL: "ar61tenderizer.png"
    },
    {
        displayName: "Slugger",
        type: "Equipment",
        category: "primary",
        tags: ["Shotgun"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "sg8sslugger",
        imageURL: "sg8sslugger.png"
    },
    {
        displayName: "Breaker",
        type: "Equipment",
        category: "primary",
        tags: ["Shotgun"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "sg225breaker",
        imageURL: "sg225breaker.png"
    },
    {
        displayName: "Breaker Incendiary",
        type: "Equipment",
        category: "primary",
        tags: ["Shotgun"],
        warbond: "Steeled Veterans",
        warbondCode: "warbond2",
        internalName: "sg225iebreakerincendiary",
        imageURL: "sg225iebreakerincendiary.png"
    },
    {
        displayName: "Breaker Spray & Pray",
        type: "Equipment",
        category: "primary",
        tags: ["Shotgun"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "sg225spbreakerspraynpray",
        imageURL: "sg225spbreakerspraynpray.png"
    },
    {
        displayName: "Knight",
        type: "Equipment",
        category: "primary",
        tags: ["SubmachineGun"],
        warbond: "Super Citizen",
        warbondCode: "warbond0",
        internalName: "mp98knight",
        imageURL: "mp98knight.png"
    },
    {
        displayName: "Diligence",
        type: "Equipment",
        category: "primary",
        tags: ["MarksmanRifle"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "r63diligence",
        imageURL: "r63diligence.png"
    },
    {
        displayName: "Diligence Counter Sniper",
        type: "Equipment",
        category: "primary",
        tags: ["MarksmanRifle"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "r63csdiligencecountersniper",
        imageURL: "r63csdiligencecountersniper.png"
    },
    {
        displayName: "Scythe",
        type: "Equipment",
        category: "primary",
        tags: ["EnergyWeapon"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "las5scythe",
        imageURL: "las5scythe.png"
    },
    {
        displayName: "Sickle",
        type: "Equipment",
        category: "primary",
        tags: ["EnergyWeapon"],
        warbond: "Cutting Edge",
        warbondCode: "warbond3",
        internalName: "las16sickle",
        imageURL: "las16sickle.png"
    },
    {
        displayName: "Scorcher",
        type: "Equipment",
        category: "primary",
        tags: ["EnergyWeapon"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "plas1scorcher",
        imageURL: "plas1scorcher.png"
    },
    {
        displayName: "Punisher Plasma",
        type: "Equipment",
        category: "primary",
        tags: ["EnergyWeapon"],
        warbond: "Cutting Edge",
        warbondCode: "warbond3",
        internalName: "sg8ppunisherplasma",
        imageURL: "sg8ppunisherplasma.png"
    },
    {
        displayName: "Blitzer",
        type: "Equipment",
        category: "primary",
        tags: ["EnergyWeapon"],
        warbond: "Cutting Edge",
        warbondCode: "warbond3",
        internalName: "arc12blitzer",
        imageURL: "arc12blitzer.png"
    },
    {
        displayName: "Dominator",
        type: "Equipment",
        category: "primary",
        tags: ["Explosive"],
        warbond: "Steeled Veterans",
        warbondCode: "warbond2",
        internalName: "jar5dominator",
        imageURL: "jar5dominator.png"
    },
    {
        displayName: "Eruptor",
        type: "Equipment",
        category: "primary",
        tags: ["Explosive"],
        warbond: "Democratic Detonation",
        warbondCode: "warbond4",
        internalName: "r36eruptor",
        imageURL: "r36eruptor.png"
    },
    {
        displayName: "Exploding Crossbow",
        type: "Equipment",
        category: "primary",
        tags: ["Explosive"],
        warbond: "Democratic Detonation",
        warbondCode: "warbond4",
        internalName: "cb9explodingcrossbow",
        imageURL: "cb9explodingcrossbow.png"
    },
    {
        displayName: "Cookout",
        type: "Equipment",
        category: "primary",
        tags: ["Shotgun"],
        warbond: "Freedom's Flame",
        warbondCode: "warbond7",
        internalName: "sg451cookout",
        imageURL: "sg451cookout.png"
    },
    {
        displayName: "Torcher",
        type: "Equipment",
        category: "primary",
        tags: ["Special"],
        warbond: "Freedom's Flame",
        warbondCode: "warbond7",
        internalName: "flam66torcher",
        imageURL: "flam66torcher.png"
    }
];
