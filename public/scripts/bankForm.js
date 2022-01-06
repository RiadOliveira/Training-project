const verifyDate = () => {
  // Verification of expirationDate
  const expString = exp.value.split('-');

  if (!!expString) {
    submitButton.addEventListener('click', verifyDate);

    if (
      expString[0].length != 4 ||
      Number(expString[0]) < Number(currentYear)
    ) {
      //Verify if the date inputed is valid
      alert('Data de validade do cartão inválida');
      submitButton.type = 'button';
    } else if (
      Number(expString[0]) === Number(currentYear) &&
      Number(expString[1]) < Number(currentMonth)
    ) {
      alert('Data de validade do cartão inválida');
      submitButton.type = 'button';
    } else {
      submitButton.type = 'submit';
    }
  } else {
    submitButton.removeEventListener('click', verifyDate);
  }
};

const noBankData = () => {
  //Verify the presence of Bank Data and remove required if was not filled by the user

  let fields = 0;

  userBankData.forEach((ind) => {
    if (!ind.value) {
      fields++;
    }
  });

  if (fields === userBankData.length) {
    //Activate or desactivate verify date based on the fields filleds by the user
    exp.removeEventListener('focusout', verifyDate);
  } else {
    exp.addEventListener('focusout', verifyDate);
  }
};

const userBankData = document.querySelectorAll('#add-card input');

userBankData.forEach((ind) => {
  ind.addEventListener('mouseout', noBankData);
});

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const exp = userBankData[1];
const submitButton = document.getElementById('submit-button');
