const passVerify = () => {
  //Verify if the password and the confirm password was identical
  if (passConfirm.value !== password.value) {
    alert('Senhas diferentes.');
    submitButton.type = 'button';
  } else {
    submitButton.type = 'submit';
  }
};

const password = document.getElementById('user-password');
const passConfirm = document.getElementById('confirm-password');
const submitButton = document.getElementById('submit-button');
passConfirm.addEventListener('focusout', passVerify);
