const { parsePhoneNumber, ParseError } = require('libphonenumber-js/max');

// Check Phone Number and return is the number valid and the international format
exports.telNumber = async (phone, country) => {
  try {
    let phoneNumber = parsePhoneNumber(phone, country);
    const internationalFormat = await phoneNumber.formatInternational();
    const isValidTel = await phoneNumber.isPossible();
    return { isValidTel, internationalFormat };
  } catch (error) {
    if (error instanceof ParseError) {
      // Not a phone number, non-existent country, etc.
      console.log(error.message);
    } else {
      throw error;
    }
  }
};

// check the strenght of password and retunr ctr that could contains scale of 1 ot 4
exports.passwordStrength = (password) => {
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

exports.isSessionExpired = (session, initDate) => {
  // Check if the Session expired
  const timeNow = Math.floor(Date.now() / 1000);

  const isExpired = initDate + 5 * 60 * 1000 < timeNow;
  console.log(isExpired, initDate);
  if (isExpired) {
    session.destroy(function () {
      console.log('TIMEOUT, SESSION HAS BEEN DESTROYED');
    });
  }
  return isExpired;
};
