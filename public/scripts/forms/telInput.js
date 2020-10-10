/*eslint-disable*/
import intlTelInput from 'intl-tel-input';
import { AsYouType } from 'libphonenumber-js/max';
import { telNumber } from '../../../utils/validation';
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
  const { isValidTel } = await telNumber(telInput, country);
  return isValidTel;
};
