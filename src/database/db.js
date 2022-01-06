const sqlite = require('sqlite-async');

const executeDB = (db) =>
  db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            userEmail TEXT,
            userCPF INTEGER,
            userPassword TEXT,
            userCEP INTEGER,
            userAdress TEXT,
            userAdressNumber INTEGER,
            userNeighborhood TEXT
        );

        CREATE TABLE IF NOT EXISTS userBankData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cardNumber INTEGER,
            expirationDate TEXT,
            cvv INTEGER,
            cardName TEXT,
            user_id INTEGER
        );
    `);

module.exports = sqlite
  .open(__dirname + '/userDatabase.sqlite')
  .then(executeDB);
