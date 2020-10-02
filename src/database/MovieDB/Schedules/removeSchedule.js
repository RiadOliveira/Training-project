async function removeSchedule () {
    const Database = require('../movieDB')

    const MovieID = 1;
    const timeFrom = '16:23';
    const timeTo = '19';
    const day = 16;

    const querySchedule = (`
        DELETE FROM movieSchedule
        WHERE (movieSchedule.movieID = ${MovieID} AND movieSchedule.timeFrom = '${timeFrom}' AND movieSchedule.timeTo = '${timeTo}' AND movieSchedule.day = ${day})
    `)

    const db = await Database;

    await db.run(querySchedule)
}

removeSchedule()