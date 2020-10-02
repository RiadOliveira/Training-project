module.exports = async function (db, {movieData, movieSchedule}) {

    if(movieData.highlightPoster != '') {

        var insertMovieData = await db.run(`
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
        `)

    } else {

        var insertMovieData = await db.run(`
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
        `)
    }

    const movieID = insertMovieData.lastID

    const insertMoviesSchedule = await movieSchedule.map((movieProgram) => {

        const insertMovieSchedule = db.run(`
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
    })

    await Promise.all(insertMoviesSchedule) 
}