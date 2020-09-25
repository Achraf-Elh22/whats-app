/*eslint-disable*/

const input = document.querySelector('#phone');

window.intlTelInput(input, {
  allowDropdown: false,
  initialCountry: 'auto',
  geoIpLookup: function (callback) {
    $.get('https://ipinfo.io?token=b896d8680909d3', function () {}, 'jsonp').always(function (
      resp
    ) {
      var countryCode = resp && resp.country ? resp.country : '';
      callback(countryCode);
    });
  },
});
