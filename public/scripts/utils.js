/*eslint-disable*/
import axios from 'axios';
import { IPINFOTOKEN } from '../../config/index';

// Get user Information
export const getUserInfo = async () => {
  try {
    const data = (await axios.get(`https://ipinfo.io?token=${IPINFOTOKEN}`)).data;
    return data;
  } catch (err) {
    console.error('something went wrong 💣💣💣', err.message);
  }
};

// Check Before submit a form
export const checkBeforeSubmit = (newPassword, confirmPassword) =>
  newPassword === confirmPassword ? true : false;

// Alerts
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is success or error
export const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}" >${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

// Validators

// Strength of password
export const passwordStrength = (password) => {
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

  return ctr;
};
// is password secure
export const isPasswordSecure = (ctr, errorMsg) => {
  if (ctr < 3) {
    showAlert('error', errorMsg);
    return false;
  }
  return true;
};

// Email validator
export const checkEmail = (email) => {
  if (email !== '') {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = regex.test(email);
    return isEmail;
  }
};
