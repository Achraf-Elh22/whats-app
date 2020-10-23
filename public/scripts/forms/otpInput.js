/* eslint-disable */
import axios from 'axios';
import { showAlert } from '../utils';

exports.otpInput = (digitGroup) => {
  const digits = digitGroup.querySelectorAll('input');
  digits.forEach((digit) => {
    digit.addEventListener('keyup', function (e) {
      if (e.code === 'Backspace' || e.code === 'ArrowLeft') {
        let prev = digitGroup.querySelector(`input#${this.dataset.previous}`);
        if (!!prev) {
          prev.select();
        }
      } else if (
        (e.code >= '0' && e.code <= '9') ||
        (e.code >= 'Numpad0' && e.code <= 'Numpad9') ||
        e.code === 'ArrowRight'
      ) {
        let next = digitGroup.querySelector(`input#${this.dataset.next}`);

        if (!!next) {
          next.select();
        } else {
          digitGroup.querySelector('button#btn-submit').focus();
        }
      }
    });
  });
};

exports.formatOtp = (fields) => {
  let otps = [];
  fields.forEach((el) => otps.push(el.value));
  const otp = parseInt(otps.join().replace(/,/g, ''));
  return otp;
};

exports.submitOtp = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/verify',
      data: { otpCode: data },
    });
    if (res.data.status === 'success') {
      showAlert('success', res.data.message);
      window.setTimeout(() => {
        location.assign('/profile');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
    if (error.response.data.message.startsWith('You made alot of attempts')) {
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }
};
