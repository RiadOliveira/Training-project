module.exports = function createUserData(userData, userBankData, userInf) {

    for(var ind in userData) {
        userData[ind] = userInf[ind]; //Adds all of the user Data to the Object
    } 

    if(userInf.cardName != '') {
        for(var ind in userBankData[0]) {
            userBankData[0][ind] = userInf[ind];
        }
    }
}