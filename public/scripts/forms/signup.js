import axios from 'axios';
import { showAlert } from '../utils';

export const signup = async (telNumber, email, password, country) => {
  try {
    const phoneNumber = telNumber.replace(/\W/g, '');
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/signup',
      data: {
        phoneNumber,
        email,
        password,
        country,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!!!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.message);
    console.error(err.message);
  }
};
