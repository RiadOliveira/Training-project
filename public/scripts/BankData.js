const verifyDate = () => {
  // Verification of expirationDate
  const expString = exp.value.split('-');

  if (!!expString) {
    submitButton.addEventListener('click', verifyDate);

    if (
      expString[0].length !== 4 ||
      Number(expString[0]) < Number(currentYear)
    ) {
      //Verify if the inputed date is valid
      alert('Data de validade do cartão inválida.');
      submitButton.type = 'button';
    } else if (
      Number(expString[0]) === Number(currentYear) &&
      Number(expString[1]) < Number(currentMonth)
    ) {
      alert('Data de validade do cartão inválida.');
      submitButton.type = 'button';
    } else {
      submitButton.type = 'submit';
    }
  } else {
    submitButton.removeEventListener('click', verifyDate);
  }
};

const dataVerify = () => {
  //Required to Bank Data
  for (let i in userBankData) {
    if (!!userBankData[i].value) {
      userBankData.forEach((ind) => {
        ind.setAttribute('required', '');
      });
    }
  }
};

const noBankData = () => {
  //Verify the presence of Bank Data and remove required if not
  let fields = 0;

  userBankData.forEach((ind) => {
    if (!ind.value) {
      fields++;
    }
  });

  if (fields === userBankData.length) {
    //Activate or desactivate verify date based on the fields filleds by the user
    userBankData.forEach((ind) => {
      ind.removeAttribute('required');
    });

    exp.removeEventListener('focusout', verifyDate);
  } else {
    exp.addEventListener('focusout', verifyDate);
  }
};

const userBankData = document.querySelectorAll('#bank-data input');

userBankData.forEach((ind) => {
  ind.addEventListener('change', dataVerify); //To insert required
  ind.addEventListener('mouseout', noBankData); //To remove required
});

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const exp = userBankData[1];
