const STRATAGEMS = [
    {
        displayName: "Airburst Rocket Launcher",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons", "Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "rl77airburstrocketlauncher",
        imageURL: "rl77airburstrocketlauncher.svg"
    },
    {
        displayName: "TX-41 Sterilizer",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "Chemical Agents",
        warbondCode: "warbond8",
        internalName: "tx41sterilizer",
        imageURL: "tx41sterilizer.svg"
    },
    {
        displayName: "AX/TX-13 Dog Breath",
        type: "Stratagem",
        category: "Supply",
        tags: ["Backpacks"],
        warbond: "Chemical Agents",
        warbondCode: "warbond8",
        internalName: "axtx13guarddogdogbreath",
        imageURL: "axtx13guarddogdogbreath.svg"
    },
    {
        displayName: "Autocannon",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons", "Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "ac8autocannon",
        imageURL: "ac8autocannon.svg"
    },
    {
        displayName: "Expendable Anti-Tank",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "eat17expendableantitank",
        imageURL: "eat17expendableantitank.svg"
    },
    {
        displayName: "Flamethrower",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "flam40flamethrower",
        imageURL: "flam40flamethrower.svg"
    },
    {
        displayName: "Laser Cannon",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "las98lasercannon",
        imageURL: "las98lasercannon.svg"
    },
    {
        displayName: "Stalwart",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "m105stalwart",
        imageURL: "m105stalwart.svg"
    },
    {
        displayName: "Machine Gun",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "mg43machinegun",
        imageURL: "mg43machinegun.svg"
    },
    {
        displayName: "Arc Thrower",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "arc3arcthrower",
        imageURL: "arc3arcthrower.svg"
    },
    {
        displayName: "grenade Launcher",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "gl21grenadelauncher",
        imageURL: "gl21grenadelauncher.svg"
    },
    {
        displayName: "Anti-Material Rifle",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "apw1antimaterielrifle",
        imageURL: "apw1antimaterielrifle.svg"
    },
    {
        displayName: "Railgun",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "rs422railgun",
        imageURL: "rs422railgun.svg"
    },
    {
        displayName: "Recoilless Rifle",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons", "Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "gr8recoillessrifle",
        imageURL: "gr8recoillessrifle.svg"
    },
    {
        displayName: "Spear",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons", "Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "faf14spear",
        imageURL: "faf14spear.svg"
    },
    {
        displayName: "Quasar Cannon",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "las99quasarcannon",
        imageURL: "las99quasarcannon.svg"
    },
    {
        displayName: "Heavy Machine Gun",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "mg206heavymachinegun",
        imageURL: "mg206heavymachinegun.svg"
    },
    {
        displayName: "Guard Dog Laser",
        type: "Stratagem",
        category: "Supply",
        tags: ["Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "axlas5guarddogrover",
        imageURL: "axlas5guarddogrover.svg"
    },
    {
        displayName: "Guard Dog Bullets",
        type: "Stratagem",
        category: "Supply",
        tags: ["Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "ad334guarddog",
        imageURL: "ad334guarddog.svg"
    },
    {
        displayName: "Jump Pack",
        type: "Stratagem",
        category: "Supply",
        tags: ["Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "lift850jumppack",
        imageURL: "lift850jumppack.svg"
    },
    {
        displayName: "Supply Pack",
        type: "Stratagem",
        category: "Supply",
        tags: ["Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "b1supplypack",
        imageURL: "b1supplypack.svg"
    },
    {
        displayName: "Shield Generator Pack",
        type: "Stratagem",
        category: "Supply",
        tags: ["Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "sh20shieldgeneratorpack",
        imageURL: "sh20shieldgeneratorpack.svg"
    },
    {
        displayName: "Ballistic Shield Backpack",
        type: "Stratagem",
        category: "Supply",
        tags: ["Backpacks"],
        warbond: "None",
        warbondCode: "none",
        internalName: "sh20ballisticshieldbackpack",
        imageURL: "sh20ballisticshieldbackpack.svg"
    },
    {
        displayName: "Patriot Exosuit",
        type: "Stratagem",
        category: "Supply",
        tags: ["Vehicles"],
        warbond: "None",
        warbondCode: "none",
        internalName: "exo45patriotexosuit",
        imageURL: "exo45patriotexosuit.svg"
    },
    {
        displayName: "Emancipator Exosuit",
        type: "Stratagem",
        category: "Supply",
        tags: ["Vehicles"],
        warbond: "None",
        warbondCode: "none",
        internalName: "exo49emancipatorexosuit",
        imageURL: "exo49emancipatorexosuit.svg"
    },
    {
        displayName: "Eagle Strafing Run",
        type: "Stratagem",
        category: "Eagle",
        tags: ["Eagle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "eaglestrafingrun",
        imageURL: "eaglestrafingrun.svg"
    },
    {
        displayName: "Eagle Airstrike",
        type: "Stratagem",
        category: "Eagle",
        tags: ["Eagle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "eagleairstrike",
        imageURL: "eagleairstrike.svg"
    },
    {
        displayName: "Eagle Cluster Bomb",
        type: "Stratagem",
        category: "Eagle",
        tags: ["Eagle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "eagleclusterbomb",
        imageURL: "eagleclusterbomb.svg"
    },
    {
        displayName: "Eagle Napalm Strike",
        type: "Stratagem",
        category: "Eagle",
        tags: ["Eagle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "eaglenapalmstrike",
        imageURL: "eaglenapalmstrike.svg"
    },
    {
        displayName: "Eagle Smoke Strike",
        type: "Stratagem",
        category: "Eagle",
        tags: ["Eagle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "eaglesmokestrike",
        imageURL: "eaglesmokestrike.svg"
    },
    {
        displayName: "Eagle 110mm Rocket Pods",
        type: "Stratagem",
        category: "Eagle",
        tags: ["Eagle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "eagle110mmrocketpods",
        imageURL: "eagle110mmrocketpods.svg"
    },
    {
        displayName: "Eagle 500kg Bomb",
        type: "Stratagem",
        category: "Eagle",
        tags: ["Eagle"],
        warbond: "None",
        warbondCode: "none",
        internalName: "eagle500kgbomb",
        imageURL: "eagle500kgbomb.svg"
    },
    {
        displayName: "Orbital Precision Strike",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalprecisionstrike",
        imageURL: "orbitalprecisionstrike.svg"
    },
    {
        displayName: "Orbital Napalm Barrage",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalnapalmbarrage",
        imageURL: "orbitalnapalmbarrage.svg"
    },
    {
        displayName: "Orbital Airburst Strike",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalairburststrike",
        imageURL: "orbitalairburststrike.svg"
    },
    {
        displayName: "Orbital 120mm HE Barrage",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbital120mmhebarrage",
        imageURL: "orbital120mmhebarrage.svg"
    },
    {
        displayName: "Orbital 380mm HE Barrage",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbital380mmhebarrage",
        imageURL: "orbital380mmhebarrage.svg"
    },
    {
        displayName: "Orbital Walking Barrage",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalwalkingbarrage",
        imageURL: "orbitalwalkingbarrage.svg"
    },
    {
        displayName: "Orbital Laser",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitallaser",
        imageURL: "orbitallaser.svg"
    },
    {
        displayName: "Orbital Railcannon Strike",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalrailcannonstrike",
        imageURL: "orbitalrailcannonstrike.svg"
    },
    {
        displayName: "Orbital Gatling Barrage",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalgatlingbarrage",
        imageURL: "orbitalgatlingbarrage.svg"
    },
    {
        displayName: "Orbital Gas Strike",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalgasstrike",
        imageURL: "orbitalgasstrike.svg"
    },
    {
        displayName: "Orbital EMS Strike",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalemsstrike",
        imageURL: "orbitalemsstrike.svg"
    },
    {
        displayName: "Orbital Smoke Strike",
        type: "Stratagem",
        category: "Orbital",
        tags: ["Orbital"],
        warbond: "None",
        warbondCode: "none",
        internalName: "orbitalsmokestrike",
        imageURL: "orbitalsmokestrike.svg"
    },
    {
        displayName: "Tesla Tower",
        type: "Stratagem",
        category: "Defense",
        tags: ["Emplacement"],
        warbond: "None",
        warbondCode: "none",
        internalName: "teslatower",
        imageURL: "teslatower.svg"
    },
    {
        displayName: "Mortar Sentry",
        type: "Stratagem",
        category: "Defense",
        tags: ["Sentry"],
        warbond: "None",
        warbondCode: "none",
        internalName: "mortarsentry",
        imageURL: "mortarsentry.svg"
    },
    {
        displayName: "EMS Mortar Sentry",
        type: "Stratagem",
        category: "Defense",
        tags: ["Sentry"],
        warbond: "None",
        warbondCode: "none",
        internalName: "emsmortarsentry",
        imageURL: "emsmortarsentry.svg"
    },
    {
        displayName: "Machine Gun Sentry",
        type: "Stratagem",
        category: "Defense",
        tags: ["Sentry"],
        warbond: "None",
        warbondCode: "none",
        internalName: "machinegunsentry",
        imageURL: "machinegunsentry.svg"
    },
    {
        displayName: "Gatling Sentry",
        type: "Stratagem",
        category: "Defense",
        tags: ["Sentry"],
        warbond: "None",
        warbondCode: "none",
        internalName: "gatlingsentry",
        imageURL: "gatlingsentry.svg"
    },
    {
        displayName: "Anti-Personnel Minefield",
        type: "Stratagem",
        category: "Defense",
        tags: ["Emplacement"],
        warbond: "None",
        warbondCode: "none",
        internalName: "antipersonnelminefield",
        imageURL: "antipersonnelminefield.svg"
    },
    {
        displayName: "Incendiary Mines",
        type: "Stratagem",
        category: "Defense",
        tags: ["Emplacement"],
        warbond: "None",
        warbondCode: "none",
        internalName: "incendiarymines",
        imageURL: "incendiarymines.svg"
    },
    {
        displayName: "Shield Generator Relay",
        type: "Stratagem",
        category: "Defense",
        tags: ["Emplacement"],
        warbond: "None",
        warbondCode: "none",
        internalName: "shieldgeneratorrelay",
        imageURL: "shieldgeneratorrelay.svg"
    },
    {
        displayName: "HMG Emplacement",
        type: "Stratagem",
        category: "Defense",
        tags: ["Emplacement"],
        warbond: "None",
        warbondCode: "none",
        internalName: "hmgemplacement",
        imageURL: "hmgemplacement.svg"
    },
    {
        displayName: "Autocannon Sentry",
        type: "Stratagem",
        category: "Defense",
        tags: ["Sentry"],
        warbond: "None",
        warbondCode: "none",
        internalName: "autocannonsentry",
        imageURL: "autocannonsentry.svg"
    },
    {
        displayName: "Rocket Sentry",
        type: "Stratagem",
        category: "Defense",
        tags: ["Sentry"],
        warbond: "None",
        warbondCode: "none",
        internalName: "rocketsentry",
        imageURL: "rocketsentry.svg"
    },
    {
        displayName: "MLS-4X Commando Rocket Launcher",
        type: "Stratagem",
        category: "Supply",
        tags: ["Weapons"],
        warbond: "None",
        warbondCode: "none",
        internalName: "mls4xcommandorocketlauncher",
        imageURL: "mls4xcommandorocketlauncher.svg"
    },
    {
        displayName: "Anti-Tank Mines",
        type: "Stratagem",
        category: "Defense",
        tags: ["Emplacement"],
        warbond: "None",
        warbondCode: "none",
        internalName: "antitankmines",
        imageURL: "antitankmines.svg"
    }
];