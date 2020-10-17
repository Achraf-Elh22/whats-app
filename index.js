const moment = require('moment');

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
}
const format = fmtMSS(exp);

const initDate = Math.floor(1602928020410 / 1000);
const expDate = moment(initDate + 5 * 60);
const now = moment(Date.now() / 1000);
const exp = expDate.diff(now, 'miliseconds');
console.log(exp, format, Date.now());
