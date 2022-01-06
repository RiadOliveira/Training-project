module.exports = async function (db, movieID, { movieSchedule }) {
  const insertMoviesSchedule = await movieSchedule.map((movieProgram) =>
    db.run(`
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
                ${movieID}
            );
        `)
  );

  await Promise.all(insertMoviesSchedule);
};
