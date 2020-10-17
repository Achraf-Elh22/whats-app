const moment = require('moment');

exports.generateOtp = () => {
  const otp = Math.floor(Math.random() * (1000000 - 100000) + 100000);
  return otp;
};

exports.diffTime = (expTime) => {
  function fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
  }
  const exp = moment(expTime);
  const now = moment(Date.now() / 1000);
  const expDate = exp.diff(now, 'miliseconds');
  const format = fmtMSS(expDate);
  return { expDate, format };
};
