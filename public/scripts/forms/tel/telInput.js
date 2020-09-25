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

// Toggle
$('.toggle-password').click(function () {
  $(this).toggleClass('fa-eye fa-eye-slash');
  var input = $($(this).attr('toggle'));
  if (input.attr('type') == 'password') {
    input.attr('type', 'text');
  } else {
    input.attr('type', 'password');
  }
});
