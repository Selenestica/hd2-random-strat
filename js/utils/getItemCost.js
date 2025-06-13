const getItemCost = (item) => {
    let cost = 0

    // add cost by tier
    if (item.tier === 's') {
        cost += 15
    } else if (item.tier === 'a') {
        cost += 10
    } else if (item.tier === 'b') {
        cost += 5
    }

    // add cost by item type
    if (item.type === "Stratagem" || item.category === "primary" || item.category === "booster") {
        cost += 10
    } else if (item.category === "secondary" || item.category === "throwable" || item.category === "armor") {
        cost += 5
    }

    // add randomness from -4 to 4
    const random = Math.floor(Math.random() * 9) - 4;
    return cost + random
}

// starter credits = 100

// TYPES:
// primary = 10
// secondary = 5
// throwable = 5
// stratagem = 10
// armor = 5
// booster = 10

// TIERS:
// s = 15
// a = 10
// b = 5
// c = 0