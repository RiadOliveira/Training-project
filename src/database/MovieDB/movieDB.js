const sqlite = require('sqlite-async');

const execute = (db) =>
  db.exec(`
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            producer TEXT,
            poster TEXT,
            synopsis TEXT,
            duration INTEGER,
            ticketValue INTEGER,
            classification TEXT,
            reducedSynopsis TEXT,
            genre TEXT,
            trailerLink TEXT,
            highlightPoster TEXT
        );

        CREATE TABLE IF NOT EXISTS movieSchedule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timeFrom TEXT,
            timeTo TEXT,
            day INTEGER,
            month INTEGER,
            year INTEGER,
            language TEXT,
            movieID INTEGER
        )
    `);

module.exports = sqlite
  .open(__dirname + '/moviesDatabase.sqlite')
  .then(execute);
