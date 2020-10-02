module.exports = function setUser (userData, userBankData, loginConfirm, BankConfirm) {

    for(var ind in userData) {
        userData[ind] = loginConfirm[0][ind]; //Adds all of the user Data to the Object
    } 

    if(BankConfirm[0] != undefined) {
        
        for(var ind in BankConfirm) {

            userBankData[ind] = {cardNumber: '', expirationDate: '', cvv: '', cardName: ''}

            for(var i in userBankData[ind]) {
                userBankData[ind][i] = BankConfirm[ind][i];
            }
        }
    }
}