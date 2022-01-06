module.exports = async function (db, { movieData, movieSchedule }) {
  let insertMovieData;

  if (!!movieData.highlightPoster) {
    insertMovieData = await db.run(`
            INSERT INTO movies (
                name,
                producer,
                poster,
                synopsis,
                duration,
                ticketValue,
                classification,
                reducedSynopsis,
                genre,
                trailerLink,
                highlightPoster
            ) VALUES (
                "${movieData.name}",
                "${movieData.producer}",
                "${movieData.poster}",
                "${movieData.synopsis}",
                ${movieData.duration},
                ${movieData.ticketValue},
                "${movieData.classification}",
                "${movieData.reducedSynopsis}",
                "${movieData.genre}",
                "${movieData.trailerLink}",
                "${movieData.highlightPoster}"
            );
        `);
  } else {
    insertMovieData = await db.run(`
            INSERT INTO movies (
                name,
                producer,
                poster,
                synopsis,
                duration,
                ticketValue,
                classification,
                reducedSynopsis,
                genre,
                trailerLink
            ) VALUES (
                "${movieData.name}",
                "${movieData.producer}",
                "${movieData.poster}",
                "${movieData.synopsis}",
                ${movieData.duration},
                ${movieData.ticketValue},
                "${movieData.classification}",
                "${movieData.reducedSynopsis}",
                "${movieData.genre}",
                "${movieData.trailerLink}"
            );
        `);
  }

  const insertMoviesSchedule = await movieSchedule.map(
    async (movieProgram) =>
      await db.run(`
            INSERT INTO movieSchedule (
                timeFrom,
                timeTo,
                day,
                month,
                year,
                language,
                movieID
            ) VALUES (
                "${movieProgram.timeFrom}",
                "${movieProgram.timeTo}",
                ${movieProgram.day},
                ${movieProgram.month},
                ${movieProgram.year},
                "${movieProgram.language}",
                ${insertMovieData.lastID}
            );
        `)
  );

  await Promise.all(insertMoviesSchedule);
};
