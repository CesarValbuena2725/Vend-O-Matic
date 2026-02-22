const session = require('express-session')

module.exports = session({
    secret: 'vending-secret',
    resave: false,
    saveUninitialized: true,
})