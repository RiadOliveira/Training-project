const Database = require('./movieDB');

const deleteMovies = async () => {
  const MovieID = 2;

  const queryMovie = `
        DELETE FROM movies
        WHERE movies.id = ${MovieID}
    `;

  const querySchedule = `
        DELETE FROM movieSchedule
        WHERE movieSchedule.movieID = ${MovieID}
    `;

  const db = await Database;

  await db.run(queryMovie);
  await db.run(querySchedule);
};

deleteMovies();
