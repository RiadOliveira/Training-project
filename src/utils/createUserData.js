const createUserData = (userData, userBankData, userInf) => {
  for (let ind in userData) {
    userData[ind] = userInf[ind]; //Adds all of the user Data to the Object
  }

  if (!!userInf.cardName) {
    for (let ind in userBankData[0]) {
      userBankData[0][ind] = userInf[ind];
    }
  }
};

module.exports = createUserData;
