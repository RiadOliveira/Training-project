const resetUser = (userData, userBankData) => {
  //To reset the values of logged user when him loggout

  for (let ind in userData) {
    userData[ind] = '';
  }

  if (userBankData.length > 1) {
    userBankData.splice(1, userBankData.length - 1);
  }

  userBankData[0] = {
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    cardName: '',
  };
};

module.exports = resetUser;
