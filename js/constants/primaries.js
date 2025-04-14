const PRIMARIES = [
  {
    displayName: 'Liberator',
    type: 'Equipment',
    category: 'primary',
    tags: ['AssaultRifle'],
    warbond: 'None',
    warbondCode: 'none',
    internalName: 'ar23liberator',
    imageURL: 'ar23liberator.png',
    tier: 'b',
  },
  {
    displayName: 'StA-11 SMG',
    type: 'Equipment',
    category: 'primary',
    tags: ['Submachinegun'],
    warbond: 'None',
    warbondCode: 'none',
    internalName: 'sta11smg',
    imageURL: 'sta11smg.png',
    tier: 'b',
  },
  {
    displayName: 'PLAS-39 Accelerator Rifle',
    type: 'Equipment',
    category: 'primary',
    tags: ['MarksmanRifle'],
    warbond: 'None',
    warbondCode: 'none',
    internalName: 'plas39acceleratorrifle',
    imageURL: 'plas39acceleratorrifle.png',
    tier: 'c',
  },
  {
    displayName: 'StA-52 Assault Rifle',
    type: 'Equipment',
    category: 'primary',
    tags: ['AssaultRifle'],
    warbond: 'Superstore',
    warbondCode: 'warbond11',
    internalName: 'sta52assaultrifle',
    imageURL: 'sta52assaultrifle.png',
    tier: 'b',
  },
  {
    displayName: 'Liberator Carbine',
    type: 'Equipment',
    category: 'primary',
    tags: ['AssaultRifle'],
    warbond: 'Viper Commandos',
    warbondCode: 'warbond6',
    internalName: 'ar23aliberatorcarbine',
    imageURL: 'ar23aliberatorcarbine.png',
    tier: 'b',
  },
  {
    displayName: 'Halt',
    type: 'Equipment',
    category: 'primary',
    tags: ['Shotgun'],
    warbond: 'Truth Enforcers',
    warbondCode: 'warbond9',
    internalName: 'sg20halt',
    imageURL: 'sg20halt.png',
    tier: 'a',
  },
  {
    displayName: 'Reprimand',
    type: 'Equipment',
    category: 'primary',
    tags: ['Submachinegun'],
    warbond: 'Truth Enforcers',
    warbondCode: 'warbond9',
    internalName: 'smg32reprimand',
    imageURL: 'smg32reprimand.png',
    tier: 'a',
  },
  {
    displayName: 'Constitution',
    type: 'Equipment',
    category: 'primary',
    tags: ['MarksmanRifle'],
    warbond: 'None',
    warbondCode: 'none',
    internalName: 'r2124constitution',
    imageURL: 'r2124constitution.png',
    tier: 'c',
  },
  {
    displayName: 'Pummeler',
    type: 'Equipment',
    category: 'primary',
    tags: ['SubmachineGun'],
    warbond: 'Polar Patriots',
    warbondCode: 'warbond5',
    internalName: 'smg72pummeler',
    imageURL: 'smg72pummeler.png',
    tier: 'a',
  },
  {
    displayName: 'Purifier',
    type: 'Equipment',
    category: 'primary',
    tags: ['EnergyWeapon'],
    warbond: 'Polar Patriots',
    warbondCode: 'warbond5',
    internalName: 'plas101purifier',
    imageURL: 'plas101purifier.png',
    tier: 's',
  },
  {
    displayName: 'Liberator Penetrator',
    type: 'Equipment',
    category: 'primary',
    tags: ['AssaultRifle'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'ar23pliberatorpenetrator',
    imageURL: 'ar23pliberatorpenetrator.png',
    tier: 'a',
  },
  {
    displayName: 'Liberator Concussive',
    type: 'Equipment',
    category: 'primary',
    tags: ['AssaultRifle'],
    warbond: 'Steeled Veterans',
    warbondCode: 'warbond2',
    internalName: 'ar23cliberatorconcussive',
    imageURL: 'ar23cliberatorconcussive.png',
    tier: 'b',
  },
  {
    displayName: 'Adjudicator',
    type: 'Equipment',
    category: 'primary',
    tags: ['AssaultRifle'],
    warbond: 'Democratic Detonation',
    warbondCode: 'warbond4',
    internalName: 'br14adjudicator',
    imageURL: 'br14adjudicator.png',
    tier: 'a',
  },
  {
    displayName: 'Defender',
    type: 'Equipment',
    category: 'primary',
    tags: ['SubmachineGun'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'smg37defender',
    imageURL: 'smg37defender.png',
    tier: 'b',
  },
  {
    displayName: 'Punisher',
    type: 'Equipment',
    category: 'primary',
    tags: ['Shotgun'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'sg8punisher',
    imageURL: 'sg8punisher.png',
    tier: 'b',
  },
  {
    displayName: 'Tenderizer',
    type: 'Equipment',
    category: 'primary',
    tags: ['AssaultRifle'],
    warbond: 'Polar Patriots',
    warbondCode: 'warbond5',
    internalName: 'ar61tenderizer',
    imageURL: 'ar61tenderizer.png',
    tier: 'a',
  },
  {
    displayName: 'Slugger',
    type: 'Equipment',
    category: 'primary',
    tags: ['Shotgun'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'sg8sslugger',
    imageURL: 'sg8sslugger.png',
    tier: 'b',
  },
  {
    displayName: 'Breaker',
    type: 'Equipment',
    category: 'primary',
    tags: ['Shotgun'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'sg225breaker',
    imageURL: 'sg225breaker.png',
    tier: 'b',
  },
  {
    displayName: 'Breaker Incendiary',
    type: 'Equipment',
    category: 'primary',
    tags: ['Shotgun'],
    warbond: 'Steeled Veterans',
    warbondCode: 'warbond2',
    internalName: 'sg225iebreakerincendiary',
    imageURL: 'sg225iebreakerincendiary.png',
    tier: 's',
  },
  {
    displayName: 'Breaker Spray & Pray',
    type: 'Equipment',
    category: 'primary',
    tags: ['Shotgun'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'sg225spbreakerspraynpray',
    imageURL: 'sg225spbreakerspraynpray.png',
    tier: 'b',
  },
  {
    displayName: 'Knight',
    type: 'Equipment',
    category: 'primary',
    tags: ['SubmachineGun'],
    warbond: 'Super Citizen',
    warbondCode: 'warbond0',
    internalName: 'mp98knight',
    imageURL: 'mp98knight.png',
    tier: 'b',
  },
  {
    displayName: 'Diligence',
    type: 'Equipment',
    category: 'primary',
    tags: ['MarksmanRifle'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'r63diligence',
    imageURL: 'r63diligence.png',
    tier: 'b',
  },
  {
    displayName: 'Diligence Counter Sniper',
    type: 'Equipment',
    category: 'primary',
    tags: ['MarksmanRifle'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'r63csdiligencecountersniper',
    imageURL: 'r63csdiligencecountersniper.png',
    tier: 'a',
  },
  {
    displayName: 'Deadeye',
    type: 'Equipment',
    category: 'primary',
    tags: ['MarksmanRifle'],
    warbond: 'Borderline Justice',
    warbondCode: 'warbond12',
    internalName: 'r6deadeye',
    imageURL: 'r6deadeye.png',
    tier: 'a',
  },
  {
    displayName: 'Scythe',
    type: 'Equipment',
    category: 'primary',
    tags: ['EnergyWeapon'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'las5scythe',
    imageURL: 'las5scythe.png',
    tier: 'c',
  },
  {
    displayName: 'Sickle',
    type: 'Equipment',
    category: 'primary',
    tags: ['EnergyWeapon'],
    warbond: 'Cutting Edge',
    warbondCode: 'warbond3',
    internalName: 'las16sickle',
    imageURL: 'las16sickle.png',
    tier: 'a',
  },
  {
    displayName: 'Scorcher',
    type: 'Equipment',
    category: 'primary',
    tags: ['EnergyWeapon'],
    warbond: 'Helldivers Mobilize',
    warbondCode: 'warbond1',
    internalName: 'plas1scorcher',
    imageURL: 'plas1scorcher.png',
    tier: 'a',
  },
  {
    displayName: 'Punisher Plasma',
    type: 'Equipment',
    category: 'primary',
    tags: ['EnergyWeapon'],
    warbond: 'Cutting Edge',
    warbondCode: 'warbond3',
    internalName: 'sg8ppunisherplasma',
    imageURL: 'sg8ppunisherplasma.png',
    tier: 'a',
  },
  {
    displayName: 'Blitzer',
    type: 'Equipment',
    category: 'primary',
    tags: ['EnergyWeapon'],
    warbond: 'Cutting Edge',
    warbondCode: 'warbond3',
    internalName: 'arc12blitzer',
    imageURL: 'arc12blitzer.png',
    tier: 's',
  },
  {
    displayName: 'Dominator',
    type: 'Equipment',
    category: 'primary',
    tags: ['Explosive'],
    warbond: 'Steeled Veterans',
    warbondCode: 'warbond2',
    internalName: 'jar5dominator',
    imageURL: 'jar5dominator.png',
    tier: 'b',
  },
  {
    displayName: 'Eruptor',
    type: 'Equipment',
    category: 'primary',
    tags: ['Explosive'],
    warbond: 'Democratic Detonation',
    warbondCode: 'warbond4',
    internalName: 'r36eruptor',
    imageURL: 'r36eruptor.png',
    tier: 'a',
  },
  {
    displayName: 'Exploding Crossbow',
    type: 'Equipment',
    category: 'primary',
    tags: ['Explosive'],
    warbond: 'Democratic Detonation',
    warbondCode: 'warbond4',
    internalName: 'cb9explodingcrossbow',
    imageURL: 'cb9explodingcrossbow.png',
    tier: 's',
  },
  {
    displayName: 'Cookout',
    type: 'Equipment',
    category: 'primary',
    tags: ['Shotgun'],
    warbond: "Freedom's Flame",
    warbondCode: 'warbond7',
    internalName: 'sg451cookout',
    imageURL: 'sg451cookout.png',
    tier: 'a',
  },
  {
    displayName: 'Torcher',
    type: 'Equipment',
    category: 'primary',
    tags: ['Special'],
    warbond: "Freedom's Flame",
    warbondCode: 'warbond7',
    internalName: 'flam66torcher',
    imageURL: 'flam66torcher.png',
    tier: 'b',
  },
  {
    displayName: 'LAS-17 Double Edge Sickle',
    type: 'Equipment',
    category: 'primary',
    tags: ['EnergyWeapon'],
    warbond: 'Servants of Freedom',
    warbondCode: 'warbond11',
    internalName: 'las17doubleedgesickle',
    imageURL: 'las17doubleedgesickle.png',
    tier: 'a',
  },
];
