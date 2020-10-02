async function addSchedule() {

    const Database = require('../movieDB')
    const createNewSchedule = require('./createNewSchedule')
    const currentYear = new Date().getFullYear()

    const movieSchedule = [{}]

    const movieID = 1;
    
    movieSchedule[0] = {
        timeFrom: '21:30',
        timeTo: '24',
        day: 16,
        month: 9,
        year: currentYear,
        language: ''
    }

    const db = await Database

    await createNewSchedule(db, movieID, {movieSchedule})
}

addSchedule()