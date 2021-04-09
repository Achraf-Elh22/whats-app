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

// format message documents for the frontend
exports.formatMessages = (data) => {
  let result = [];

  /*
    the way result look like if it process message doc
  [
    [
      {user_A_MSg},
      {user_A_MSg},
      {user_A_MSg}
    ],
    [
      {user_B_MSg}
    ],
    [
      {user_A_MSg},
      {user_A_MSg}
    ],
  ]
  
  */

  for (let i = 0; i < data.length; i++) {
    if (i == 0) {
      result.push([data[0]]);
    } else {
      // check the last array in result and then choose any object because they have the same senderId
      // after that we will check if the object sender === with the next message
      // if they are equel then we will added to the same array

      if (result[result.length - 1][0].senderId == data[i].senderId) {
        result[result.length - 1].push(data[i]);
      } else {
        // if not we will add new arry with message => this mean that the other user who send message
        result.push([data[i]]);
      }
    }
  }

  // Get the last msg with some conditions:
  // Shoedn't have status send for the user B if its been send By user A
  const lastMsg = (result) => {
    return result.filter((msg) => msg.status != 'send');
  };

  return { result, lastMsg: lastMsg(result[result.length - 1]) };
};

// Get the last message from document
exports.lastMsg = (data, signedUser) => {
  let res = [];

  // will take the value of the userId in message
  let usr = '';

  for (let idx = 0; idx < data.length; idx++) {
    if (usr || usr == '') {
      // Message
      let lm = data[idx];
      // currentUser
      usr = idx == 0 ? lm.senderId.toString() : usr;

      //  Check the message is send by the same user
      if (!(idx > 0 && usr != lm.senderId)) {
        // If message has been send by user to someone else we want to push all the message to result array
        // and format Date res
        if (usr == signedUser) res.push({ ...lm, dateRes: this.formatDateRes(lm.createdAt) });

        // If message has been send by other user we want only messages with status received and seeing
        if (usr != signedUser && (lm.status == 'seeing' || lm.status == 'received'))
          res.push({ ...lm, dateRes: this.formatDateRes(lm.createdAt) });

        if (
          usr != signedUser &&
          lm.status == 'send' &&
          usr != data[0].lastMsg[idx + 1].senderId &&
          res.length == 0
        ) {
          usr = lastMsg[idx + 1].senderId;
        }
      } else {
        // Reason for assign undefined to usr is just way to exist loop
        usr = undefined;
      }
    }
  }

  return res;
};

//  UI error template response
exports.errorRes = (
  errorCode = 501,
  errorHeader = 'Not implemented',
  errorDesc = '',
  errorLink,
  errorText,
  title = 'Error'
) => {
  return {
    title,
    errorCode,
    errorHeader,
    errorDesc,
    errorLink,
    errorText,
  };
};

// Format the res date
exports.formatDateRes = (createdAt) => {
  let date = moment(createdAt);
  let now = moment(Date.now());

  // Difference between date and now
  let diffDate = now.diff(date, 'minutes');

  let dateRes;

  // 1440 min = 24h = Day
  // Date format = 12:10
  if (diffDate <= 1440) {
    dateRes = date.format('HH:mm');
  }
  // 2880min = 48h = 2 Day
  // date format = yesterday
  else if (diffDate > 1440 && diffDate <= 2880) {
    dateRes = 'Yesterday';
  }
  // 10080min = 7 Day
  // date format = Monday, Tuesday, .....
  else if (diffDate > 2880 && diffDate <= 10080) {
    dateRes = date.format('dddd');
  }
  // date Format = 01/01/2020
  else {
    dateRes = date.format('D/M/YYYY');
  }

  return dateRes;
};
