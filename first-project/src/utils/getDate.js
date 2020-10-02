module.exports = function getDate(day, month, year) {

    if(day<10 && month<10) {
        var actualDate = `0${day}/0${month}/${year}`
    } else if(day<10) {
        var actualDate = `0${day}/${month}/${year}`
    } else if(month<10) {
        var actualDate= `${day}/0${month}/${year}`
    } else {
        var actualDate = `${day}/${month}/${year}`
    }

    return actualDate;
}