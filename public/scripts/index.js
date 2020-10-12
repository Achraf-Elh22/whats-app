/* eslint-disable */
import '@babel/polyfill';

import { otpInput } from './forms/otpInput';
import { telInput, formatTelInput, checkTelInput } from './forms/telInput';
import { checkEmail, showAlert, isPasswordSecure, checkBeforeSubmit } from './utils';
import { togglePassword, checkPasswordStrength, checkConfirmPassword } from './forms/passwords';
import { signup } from '../scripts/forms/signup';
import { startTimer } from '../scripts/forms/countDownTimer';

const resetPasswordForm = document.querySelector('#resetPassword');
const newUserForm = document.querySelector('#newUser');
const digitGroup = document.querySelector('#digit-group');
const togglePwd = document.querySelectorAll('.toggle-password');
const password = document.querySelector('#password');
const newPassword = document.querySelector('#newPassword');
const confirmPassword = document.querySelector('#confirmPassword');
const telinput = document.querySelector('#phone');
const emailInput = document.querySelector('#email');
const timer = document.querySelector('#timer');

// OTP INPUT (verify.html)
if (digitGroup) {
  // Check if the input is number
  digitGroup.querySelectorAll('input').forEach((input) => {
    input.onkeydown = (evt) => {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 97 || charCode > 105)) {
        return false;
      }
      return true;
    };
  });
  //Otp Functionality
  otpInput(digitGroup);
}

// Password
if (togglePwd) {
  togglePwd.forEach((toggle) => {
    toggle.addEventListener('click', function () {
      togglePassword(toggle);
    });
  });
}

// Check password strength and confirm Password (newPassword.html)
if (resetPasswordForm) {
  let ctr;

  newPassword.addEventListener('keyup', function () {
    ctr = checkPasswordStrength(newPassword.value);
  });
  confirmPassword.addEventListener('keyup', function () {
    checkConfirmPassword(newPassword.value, confirmPassword.value);
  });
  // Check before submit that newPassword confirmPassword are equal and the password is not weak
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isPasswordEqual = checkBeforeSubmit(newPassword.value, confirmPassword.value);
    if (!isPasswordEqual) {
      return showAlert('error', "Passwords didn't match. Try again");
    }
    let passwordSecure = isPasswordSecure(
      ctr,
      'Please choose a strong password. Try a mix of letters, number, and symbols'
    );

    if (!passwordSecure) {
      return;
    }
    return resetPasswordForm.submit();
  });
}

// Check the strength of password and Check email  Signup.html
if (newUserForm) {
  let ctr = 0;
  let isEmail;
  const desc = document.querySelector('#email-desc');
  password.addEventListener('keyup', function () {
    ctr = checkPasswordStrength(password.value);
  });

  emailInput.addEventListener('focusout', function () {
    isEmail = checkEmail(emailInput.value);
    if (!isEmail) {
      desc.classList.remove('hide');
    } else {
      desc.classList.add('hide');
    }
  });

  // Check before submit
  newUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { isValidTel, country } = await checkTelInput(telinput.value);

    if (!isValidTel) {
      return showAlert('error', 'Please provide a valid Phone Number');
    }
    if (!isEmail) {
      return showAlert('error', 'Please provide a valid Email');
    }

    const passwordSecure = isPasswordSecure(
      ctr,
      'Please choose a strong password. Try a mix of letters, number, and symbols'
    );
    if (!passwordSecure) {
      return;
    }
    return signup(telinput.value, emailInput.value, password.value, country);
  });
}

// Tell Input
if (telinput) {
  telInput(telinput);
  telinput.addEventListener('focusout', async function () {
    let formatTel = await formatTelInput(telinput.value);
    this.value = formatTel;
  });
}

// timer

if (timer) {
  const fiveMinutes = 60 * 5;
  startTimer(fiveMinutes, timer);
}
