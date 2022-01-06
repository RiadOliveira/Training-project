const setUser = (userData, userBankData, loginConfirm, BankConfirm) => {
  for (let ind in userData) {
    userData[ind] = loginConfirm[0][ind]; //Adds all of the user Data to the Object
  }

  if (BankConfirm[0] !== undefined) {
    for (let ind in BankConfirm) {
      userBankData[ind] = {
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        cardName: '',
      };

      for (let i in userBankData[ind]) {
        userBankData[ind][i] = BankConfirm[ind][i];
      }
    }
  }
};

module.exports = setUser;
