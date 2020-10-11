const { parsePhoneNumber, ParseError } = require('libphonenumber-js/max');

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
