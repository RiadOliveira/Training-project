async function addSchedule() {

    const Database = require('../movieDB')
    const createNewSchedule = require('./createNewSchedule')
    const currentYear = new Date().getFullYear()

    const movieSchedule = [{}]

    const movieID = 1;
    
    movieSchedule[0] = {
        timeFrom: '',
        timeTo: '',
        day: 0,
        month: 0,
        year: currentYear,
        language: ''
    }

    const db = await Database

    await createNewSchedule(db, movieSchedule, movieID)
}

addSchedule()