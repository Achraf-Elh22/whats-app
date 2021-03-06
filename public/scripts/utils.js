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

// Send
export const resend = async (sendBy = 'EMAIL') => {
  await axios.post('/api/v1/user/send', { sendBy });
};
