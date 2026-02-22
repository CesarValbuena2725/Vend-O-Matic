const inventory = [5, 5, 5] //represents stock
const PRICE = 2

function isValidId(id){
    return Number.isInteger(id) && id >=0 && id < inventory.length
}

function insertCoin(session) {
    session.coins = (session.coins || 0) + 1;
    return session.coins
}

function returnCoins(session) {
    const coins = session.coins || 0;
    session.coins = 0;
    return coins;
}

function getInventory() {
    return inventory
}

function getItem(id) {
    return inventory[id]
}

function purchase(id, session) {
    
    const coins = session.coins || 0;
    if (inventory[id] === 0) {
        return { error: 'out_of_stock', coins }
    }

    if (coins < PRICE) {
        return { error: 'insufficient', coins }
    }

    inventory[id]--; //decrease available stock
    const change = coins - PRICE;
    session.coins = 0

    return {
        success: true,
        change,
        remaining: inventory[id]
    };
}

module.exports = {
    insertCoin,
    returnCoins,
    getInventory,
    getItem,
    purchase,
    isValidId
}