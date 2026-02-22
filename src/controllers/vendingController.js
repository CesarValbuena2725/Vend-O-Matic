const vendingService = require('../services/vendingService')

exports.insertCoin = (req, res, next) => {
    try {
        const { coin } = req.body || {};

        if(typeof coin === 'undefined'){
            return res.status(400).json({
                error: "Coin value required"
            })
        }

        if (coin !== 1) {
            return res.status(400).json({
                error: "Only quarters are accepted"
            });
        }

        const coins = vendingService.insertCoin(req.session);
        res.set('X-Coins', coins);
        res.status(204).send();
    } catch (err) {
        next(err);
    }

};

exports.cancel = (req, res) => {
    const coins = vendingService.returnCoins(req.session);
    res.set('X-Coins', coins);
    res.status(204).send();
}

exports.getInventory = (req, res) => {
    res.json(vendingService.getInventory())
};

exports.getItem = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (!vendingService.isValidId(id)) {
            return res.status(404).json({
                error: 'Invalid item ID'
            });
        }
        res.json(vendingService.getItem(id));
    } catch (err) {
        next(err);
    }
};

exports.purchase = (req, res) => {

    try {
        const id = parseInt(req.params.id);

        if (!vendingService.isValidId(id)) {
            return res.status(404).json({
                error: 'Invalid item ID'
            });
        }

        const result = vendingService.purchase(id, req.session);

        if (result.error === 'out_of_stock') {
            res.set('X-Coins', result.coins)
            return res.status(404).send();
        }

        if (result.error === 'insufficient') {
            res.set('X-Coins', result.coins)
            return res.status(403).send()
        }

        res.set('X-Coins', result.change);
        res.set('X-Inventory-Remaining', result.remaining);

        res.json({ quantity: 1 })

    } catch (err){
        next(err);
    }
}