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
