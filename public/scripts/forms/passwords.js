/* eslint-disable */
const newPassword = document.querySelector('#newPassword');
const confirmPassword = document.querySelector('#confirmPassword');
const passwordStrength = document.querySelector('#passwordStrength');
const passwordMatch = document.querySelector('#passwordMatch');
const desc = document.querySelectorAll('#desc');

// Events
newPassword.addEventListener('keyup', checkPasswordStrength);
confirmPassword.addEventListener('keyup', checkConfirmPassword);

// Toggle Password
$('.toggle-password').click(function () {
  $(this).toggleClass('fa-eye fa-eye-slash');
  var input = $($(this).attr('toggle'));
  if (input.attr('type') == 'password') {
    input.attr('type', 'text');
  } else {
    input.attr('type', 'password');
  }
});

// Check strength of password

function checkPasswordStrength() {
  const password = newPassword.value;

  let matchedCases = [];
  matchedCases.push('[$@$!%*#?&]'); // Special Charector
  matchedCases.push('[A-Z]'); // Uppercase Alpabates
  matchedCases.push('[0-9]'); // Numbers
  matchedCases.push('[a-z]'); // Lowercase Alphabates

  // Test the Password
  let ctr = 0;
  for (let i = 0; i < matchedCases.length; i++) {
    if (RegExp(matchedCases[i]).test(password)) {
      ctr++;
    }
  }

  // Check the ctr
  let strength = '';
  let color = '';
  switch (ctr) {
    case 1:
      strength = 'Bad';
      color = 'red';
      break;
    case 2:
      strength = 'Weak';
      color = 'red';
      break;
    case 3:
      strength = 'Good';
      color = 'orange';
      break;
    case 4:
      strength = 'Strong';
      color = '#1bd741';
      break;
  }
  console.log(strength);

  if (strength) {
    desc[0].classList.remove('hide');
    passwordStrength.style.color = color;
    passwordStrength.innerHTML = strength;
  }
}

// Confirm Password

function checkConfirmPassword() {
  const passwordNew = newPassword.value;
  console.log(passwordNew);
  const passwordConfirm = confirmPassword.value;

  if (passwordNew === passwordConfirm) {
    desc[1].classList.remove('hide');
    passwordMatch.style.color = '#1bd741';
    passwordMatch.innerHTML = 'Matched';
  } else {
    desc[1].classList.remove('hide');
    passwordMatch.style.color = 'red';
    passwordMatch.innerHTML = 'Wrong';
  }
}
