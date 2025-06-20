const getIsItemOnSale = () => {
    let onSale = false
    
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    if (randomNumber <= 2) {
        onSale = true
    }

    return onSale
}