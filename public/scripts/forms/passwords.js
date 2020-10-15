/* eslint-disable */

import { passwordStrength } from '../../../utils/validation';

const pswdStrength = document.querySelector('#passwordStrength');
const passwordMatch = document.querySelector('#passwordMatch');
const desc = document.querySelectorAll('#password-desc');

// Toggle Password

exports.togglePassword = (toggle) => {
  toggle.classList.toggle('fa-eye-slash');
  const input = document.querySelector(toggle.getAttribute('toggle'));
  if (input.getAttribute('type') === 'password') {
    input.setAttribute('type', 'text');
  } else {
    input.setAttribute('type', 'password');
  }
};

// Check strength of password

exports.checkPasswordStrength = (password) => {
  const ctr = passwordStrength(password);
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
    default:
      strength = '';
      color = '';
      break;
  }

  if (strength === '') {
    desc[0].classList.add('hide');
  } else {
    desc[0].classList.remove('hide');
    pswdStrength.style.color = color;
    pswdStrength.innerHTML = strength;
  }
  return ctr;
};

// Confirm Password

exports.checkConfirmPassword = (newPassword, confirmPassword) => {
  if (confirmPassword === '') {
    desc[1].classList.add('hide');
  } else {
    if (newPassword === confirmPassword) {
      desc[1].classList.remove('hide');
      passwordMatch.style.color = '#1bd741';
      passwordMatch.innerHTML = 'Matched';
    } else {
      desc[1].classList.remove('hide');
      passwordMatch.style.color = 'red';
      passwordMatch.innerHTML = 'Wrong';
    }
  }
};
