/* eslint-disable */

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
