/* eslint-disable */
import '@babel/polyfill';

import { otpInput, formatOtp, submitOtp } from './forms/otpInput';
import { telInput, formatTelInput, checkTelInput } from './forms/telInput';
import {
  checkEmail,
  showAlert,
  isPasswordSecure,
  checkBeforeSubmit,
  resend,
  hideAlert,
} from './utils';
import { togglePassword, checkPasswordStrength, checkConfirmPassword } from './forms/passwords';
import { signup } from './forms/signup';
import { login } from './forms/login';
import { startTimer } from './forms/countDownTimer';
import { readURL, createProfile } from './forms/profile';

const resetPasswordForm = document.querySelector('#resetPassword');
const container = document.querySelector('.container');
const newUserForm = document.querySelector('#newUser');
const digitGroup = document.querySelector('#digit-group');
const togglePwd = document.querySelectorAll('.toggle-password');
const password = document.querySelector('#password');
const newPassword = document.querySelector('#newPassword');
const confirmPassword = document.querySelector('#confirmPassword');
const telinput = document.querySelector('#phone');
const emailInput = document.querySelector('#email');
const timer = document.querySelector('#timer');
const profile = document.querySelector('#profile');
const submitButton = document.querySelector('button[type=submit]');
const profilePicture = document.querySelector('#profilePicture');
const loginForm = document.querySelector('#login');
const contact = document.querySelector('#contact');

if (contact) {
  fetch('http://localhost:3000/api/v1/contact/')
    .then((res) => res.json())
    .then((res) => console.log(res));
}

if (profile) {
  profilePicture.addEventListener('change', function () {
    readURL(this);
  });

  profile.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = profile.querySelector('#username').value;
    const descValue = profile.querySelector('#description').value;

    let description;
    if (descValue !== '') {
      description = descValue;
    }

    createProfile(profilePicture.files[0], username, description);
  });

  submitButton.addEventListener('click', async function () {
    const overall = document.querySelector('.overall');
    const ishinding = overall.classList.contains('hide');

    // set the user name of the overflow animation
    document.querySelector('.username').innerHTML = profile.querySelector('#username').value;

    if (ishinding) {
      overall.classList.remove('hide');
      container.classList.add('hide');

      overall.classList.add('animate__fadeInDown');
    }
    await setTimeout(() => {
      overall.classList.remove('animate__fadeInDown');
      overall.classList.add('animate__fadeOutDown', 'animate__slow');
    }, 5000);
  });
}

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

  const digits = digitGroup.querySelectorAll('input');
  const resendOtpBtn = document.querySelectorAll('.resendOtp-btn');

  console.log(resendOtpBtn);
  resendOtpBtn.forEach((btn) => {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      // button clickable just for 5 seconds
      const sendBy = this.id.split('-')[1];
      await resend(sendBy);
      location.reload();
    });
  });

  digitGroup.addEventListener('submit', function (e) {
    e.preventDefault();
    submitOtp(formatOtp(digits));
  });
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

if (emailInput) {
  let isEmail;
  const desc = document.querySelector('#email-desc');

  emailInput.addEventListener('focusout', function () {
    isEmail = checkEmail(emailInput.value);
    if (!isEmail) {
      desc.classList.remove('hide');
    } else {
      desc.classList.add('hide');
    }
  });
  const form = emailInput.parentElement.parentElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isEmail) {
      return showAlert('error', 'Please provide a valid Email');
    }
  });
}

// Check the strength of password and Check email  Signup.html
if (newUserForm) {
  let ctr = 0;
  password.addEventListener('keyup', function () {
    ctr = checkPasswordStrength(password.value);
  });

  // Check before submit
  newUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { isValidTel, country } = await checkTelInput(telinput.value);

    if (!isValidTel) {
      return showAlert('error', 'Please provide a valid Phone Number');
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
  const time = timer.innerText.split(':'); // for exemple if the input is 2:10  it will return ["2","10"]
  const remainTime = time[0] * 60 + time[1] * 1; // multiple the minutes 2 by 60 to have seconds value
  startTimer(remainTime, timer);
}

// Login Form

if (loginForm) {
  loginForm.addEventListener('submit', () => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    login(email, password);
  });
}

// the only purpose of this is to remove the alert after 7s when using flash to pass the msg from back to front
window.addEventListener('load', () => {
  const alertMsg = document.querySelector('.alert');
  if (alertMsg) window.setTimeout(hideAlert, 7000);
});
