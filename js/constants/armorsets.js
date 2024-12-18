const ARMOR_SETS = [
    {
        displayName: "AF-50 Noxious Ranger",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Chemical Agents",
        warbondCode: "warbond8",
        internalName: "af50noxiousranger",
        imageURL: "af50noxiousranger.png"
    },
    {
        displayName: "SR-24 Street Scout",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Urban Legends",
        warbondCode: "warbond10",
        internalName: "sr24streetscout",
        imageURL: "sr24streetscout.png"
    },
    {
        displayName: "SR-18 Road Block",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Urban Legends",
        warbondCode: "warbond10",
        internalName: "sr18roadblock",
        imageURL: "sr18roadblock.png"
    },
    {
        displayName: "B-08 Light Gunner",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "b08lightgunner",
        imageURL: "b08lightgunner.png"
    },
    {
        displayName: "CE-07 Demolition Specialist",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Democratic Detonation",
        warbondCode: "warbond4",
        internalName: "ce07demolitionspecialist",
        imageURL: "ce07demolitionspecialist.png"
    },
    {
        displayName: "CE-67 Titan",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "ce67titan",
        imageURL: "ce67titan.png"
    },
    {
        displayName: "CE-74 Breaker",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "ce74breaker",
        imageURL: "ce74breaker.png"
    },
    {
        displayName: "CM-21 Trench Paramedic",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "cm21trenchparamedic",
        imageURL: "cm21trenchparamedic.png"
    },
    {
        displayName: "CW-4 Arctic Ranger",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Polar Patriots",
        warbondCode: "warbond5",
        internalName: "c4arcticranger",
        imageURL: "c4arcticranger.png"
    },
    {
        displayName: "EX-00 Prototype X",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Cutting Edge",
        warbondCode: "warbond3",
        internalName: "ex00prototypex",
        imageURL: "ex00prototypex.png"
    },
    {
        displayName: "FS-37 Ravager",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "fs37ravager",
        imageURL: "fs37ravager.png"
    },
    {
        displayName: "FS-38 Eradicator",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "fs38eradicator",
        imageURL: "fs38eradicator.png"
    },
    {
        displayName: "I-09 Heatseeker",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Freedom's Flame",
        warbondCode: "warbond7",
        internalName: "i09heatseeker",
        imageURL: "i09heatseeker.png"
    },
    {
        displayName: "PH-9 Predator",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Viper Commandos",
        warbondCode: "warbond6",
        internalName: "ph9predator",
        imageURL: "ph9predator.png"
    },
    {
        displayName: "SC-30 Trailblazer Scout",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "sc30trailblazerscout",
        imageURL: "sc30trailblazerscout.png"
    },
    {
        displayName: "SC-34 Infiltrator",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "sc34infiltrator",
        imageURL: "sc34infiltrator.png"
    },
    {
        displayName: "SC-37 Legionnaire",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "sc37legionnaire",
        imageURL: "sc37legionnaire.png"
    },
    {
        displayName: "UF-16 Inspector",
        type: "Equipment",
        category: "armor",
        tags: ["Light"],
        warbond: "Truth Enforcers",
        warbondCode: "warbond9",
        internalName: "uf16inspector",
        imageURL: "uf16inspector.png"
    },
    {
        displayName: "AF-02 Haz-Master",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Chemical Agents",
        warbondCode: "warbond8",
        internalName: "af02hazmaster",
        imageURL: "af02hazmaster.png"
    },
    {
        displayName: "AF-91 Field Chemist",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "af91fieldchemist",
        imageURL: "af91fieldchemist.png"
    },
    {
        displayName: "B-01 Tactical",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "None",
        warbondCode: "none",
        internalName: "b01tactical",
        imageURL: "b01tactical.png"
    },
    {
        displayName: "B-24 Enforcer",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "b24enforcer",
        imageURL: "b24enforcer.png"
    },
    {
        displayName: "CE-27 Ground Breaker",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Democratic Detonation",
        warbondCode: "warbond4",
        internalName: "ce27groundbreaker",
        imageURL: "ce27groundbreaker.png"
    },
    {
        displayName: "CE-35 Trench Engineer",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "ce35trenchengineer",
        imageURL: "ce35trenchengineer.png"
    },
    {
        displayName: "CE-81 Juggernaut",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "ce81juggernaut",
        imageURL: "ce81juggernaut.png"
    },
    {
        displayName: "CM-09 Bonesnapper",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "cm09bonesnapper",
        imageURL: "cm09bonesnapper.png"
    },
    {
        displayName: "CM-10 Clinician",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "cm10clinician",
        imageURL: "cm10clinician.png"
    },
    {
        displayName: "CM-14 Physician",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "cm14physician",
        imageURL: "cm14physician.png"
    },
    {
        displayName: "CW-9 White Wolf",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "cw9whitewolf",
        imageURL: "cw9whitewolf.png"
    },
    {
        displayName: "DP-00 Tactical",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "None",
        warbondCode: "none",
        internalName: "dp00tactical",
        imageURL: "dp00tactical.png"
    },
    {
        displayName: "DP-11 Champion of the People",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "dp11championofthepeople",
        imageURL: "dp11championofthepeople.png"
    },
    {
        displayName: "AC-1 Dutiful",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: ac1dutiful",
        imageURL: "ac1dutiful.png"
    },
    {
        displayName: "DP-40 Hero of the Federation",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "dp40heroofthefederation",
        imageURL: "dp40heroofthefederation.png"
    },
    {
        displayName: "DP-53 Savior of the Free",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Super Citizen Edition",
        warbondCode: "warbond0",
        internalName: "dp53saviorofthefree",
        imageURL: "dp53saviorofthefree.png"
    },
    {
        displayName: "EX-03 Prototype 3",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Cutting Edge",
        warbondCode: "warbond3",
        internalName: "ex03prototype3",
        imageURL: "ex03prototype3.png"
    },
    {
        displayName: "EX-16 Prototype 16",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Cutting Edge",
        warbondCode: "warbond3",
        internalName: "ex16prototype16",
        imageURL: "ex16prototype16.png"
    },
    {
        displayName: "FS-34 Exterminator",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "fs34exterminator",
        imageURL: "fs34exterminator.png"
    },
    {
        displayName: "I-92 Fire Fighter",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "i92firefighter",
        imageURL: "i92firefighter.png"
    },
    {
        displayName: "I-102 Draconaught",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Freedom's Flame",
        warbondCode: "warbond7",
        internalName: "i102draconaught",
        imageURL: "i102draconaught.png"
    },
    {
        displayName: "PH-56 Jaguar",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "ph56jaguar",
        imageURL: "ph56jaguar.png"
    },
    {
        displayName: "SA-04 Combat Technician",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "sa04combattechnician",
        imageURL: "sa04combattechnician.png"
    },
    {
        displayName: "SA-12 Servo Assisted",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Steeled Veterans",
        warbondCode: "warbond2",
        internalName: "sa12servoassisted",
        imageURL: "sa12servoassisted.png"
    },
    {
        displayName: "SA-25 Steel Trooper",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Steeled Veterans",
        warbondCode: "warbond2",
        internalName: "sa25steeltrooper",
        imageURL: "sa25steeltrooper.png"
    },
    {
        displayName: "SA-15 Drone Master",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "sa15dronemaster",
        imageURL: "sa15dronemaster.png"
    },
    {
        displayName: "TR-7 Ambassador of the Brand",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Pre-order Bonus",
        warbondCode: "preorderbonus",
        internalName: "tr7ambassadorofthebrand",
        imageURL: "tr7ambassadorofthebrand.png"
    },
    {
        displayName: "TR-9 Cavalier of Democracy",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Pre-order Bonus",
        warbondCode: "preorderbonus",
        internalName: "tr9cavalierofdemocracy",
        imageURL: "tr9cavalierofdemocracy.png"
    },
    {
        displayName: "TR-40 Golden Eagle",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "None",
        warbondCode: "none",
        internalName: "tr40goldeneagle",
        imageURL: "tr40goldeneagle.png"
    },
    {
        displayName: "TR-117 Alpha Commander",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Twitch Drop",
        warbondCode: "twitchdrop",
        internalName: "tr117alphacommander",
        imageURL: "tr117alphacommander.png"
    },
    {
        displayName: "UF-50 Bloodhound",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Truth Enforcers",
        warbondCode: "warbond9",
        internalName: "uf50bloodhound",
        imageURL: "uf50bloodhound.png"
    },
    {
        displayName: "UF-84 Doubt Killer",
        type: "Equipment",
        category: "armor",
        tags: ["Medium"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "uf84doubtkiller",
        imageURL: "uf84doubtkiller.png"
    },
    {
        displayName: "AF-52 Lockdown",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "af52lockdown",
        imageURL: "af52lockdown.png"
    },
    {
        displayName: "B-27 Fortified Commando",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "b27fortifiedcommando",
        imageURL: "b27fortifiedcommando.png"
    },
    {
        displayName: "CE-64 Grenadier",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "ce64grenadier",
        imageURL: "ce64grenadier.png"
    },
    {
        displayName: "CE-101 Guerilla Gorilla",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "ce101guerillagorilla",
        imageURL: "ce101guerillagorilla.png"
    },
    {
        displayName: "CM-17 Butcher",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "cm17butcher",
        imageURL: "cm17butcher.png"
    },
    {
        displayName: "CW-22 Kodiak",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Polar Patriots",
        warbondCode: "warbond5",
        internalName: "cw22kodiak",
        imageURL: "cw22kodiak.png"
    },
    {
        displayName: "CW-36 Winter Warrior",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Polar Patriots",
        warbondCode: "warbond5",
        internalName: "cw36winterwarrior",
        imageURL: "cw36winterwarrior.png"
    },
    {
        displayName: "FS-05 Marksman",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "fs05marksman",
        imageURL: "fs05marksman.png"
    },
    {
        displayName: "FS-11 Executioner",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "fs11executioner",
        imageURL: "fs11executioner.png"
    },
    {
        displayName: "FS-23 Battle Master",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Helldivers Mobilize",
        warbondCode: "warbond1",
        internalName: "fs23battlemaster",
        imageURL: "fs23battlemaster.png"
    },
    {
        displayName: "FS-55 Devastator",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Democratic Detonation",
        warbondCode: "warbond4",
        internalName: "fs55devastator",
        imageURL: "fs55devastator.png"
    },
    {
        displayName: "FS-51 Dreadnought",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "fs51dreadnought",
        imageURL: "fs51dreadnought.png"
    },
    {
        displayName: "I-44 Salamander",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Superstore",
        warbondCode: "superstore",
        internalName: "i44salamander",
        imageURL: "i44salamander.png"
    },
    {
        displayName: "PH-202 Twigsnapper",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Viper Commandos",
        warbondCode: "warbond6",
        internalName: "ph202twigsnapper",
        imageURL: "ph202twigsnapper.png"
    },
    {
        displayName: "SA-32 Dynamo",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Steeled Veterans",
        warbondCode: "warbond2",
        internalName: "sa32dynamo",
        imageURL: "sa32dynamo.png"
    },
    {
        displayName: "TR-62 Knight",
        type: "Equipment",
        category: "armor",
        tags: ["Heavy"],
        warbond: "Pre-Order Bonus",
        warbondCode: "preorderbonus",
        internalName: "tr62knight",
        imageURL: "tr62knight.png"
    }
];

/*
    "Super Citizen Edition", // warbond0
    "Helldivers Mobilize",// warbond1
    "Steeled Veterans",// warbond2
    "Cutting Edge",// warbond3
    "Democratic Detonation",// warbond4
    "Polar Patriots",// warbond5
    "Viper Commandos",// warbond6
    "Freedom's Flame",// warbond7
    "Chemical Agents",// warbond8
    "Truth Enforcers"// warbond9
    "Urban Legends" warbond 10
*/
