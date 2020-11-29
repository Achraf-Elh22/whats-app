import axios from 'axios';
import { showAlert } from '../utils';

export const login = async (email, password) => {
  try {
    console.log('login');
    const res = await axios({
      url: '/api/v1/user/login',
      method: 'POST',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Loggin successfully!!!');
      window.setTimeout(() => {
        location.assign('/contact');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
