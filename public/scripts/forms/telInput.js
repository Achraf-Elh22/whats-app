/*eslint-disable*/
import intlTelInput from 'intl-tel-input';
import { AsYouType, parsePhoneNumber, ParseError } from 'libphonenumber-js/max';
import { getUserInfo } from '../utils';

const countryCode = async () => (await getUserInfo()).country;

export const telInput = (input) => {
  intlTelInput(input, {
    allowDropdown: false,
    initialCountry: 'auto',
    geoIpLookup: async (callback) => {
      const country = await countryCode();
      callback(country);
    },
  });
};

export const formatTelInput = async (telInput) => {
  const country = await countryCode();
  let tel = new AsYouType(country);
  let formatTel = tel.input(telInput);
  return formatTel;
};

export const checkTelInput = async (telInput) => {
  const country = await countryCode();
  try {
    const phoneNumber = parsePhoneNumber(telInput, country);
    const isValidTel = phoneNumber.isPossible();
    return isValidTel;
  } catch (error) {
    if (error instanceof ParseError) {
      // Not a phone number, non-existent country, etc.
      console.log(error.message);
    } else {
      throw error;
    }
  }
};
