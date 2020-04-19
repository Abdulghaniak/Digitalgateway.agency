$(function () {
  // Initialize form validation on the registration form.
  // It has the name attribute "registration"
  // jQuery
  var telInput = $('#phoneInput');
  telInput.intlTelInput({
    separateDialCode: true,
    nationalMode: false,
    formatOnDisplay: true,
    preferredCountries: [],
    allowExtensions: true,
    autoFormat: true,
    autoHideDialCode: false,
    defaultCountry: 'auto',
    numberType: 'MOBILE',
    placeholderNumberType: 'MOBILE',
    preventInvalidNumbers: true,
    separateDialCode: false,
    initialCountry: 'auto',
    utilsScript: '/js/intlTelUtils.js',
    geoIpLookup: function (success, failure) {
      $.get(
        'https://ipinfo.io/json?token=42f18d9300562b',
        function () {},
        'jsonp'
      ).always(function (resp) {
        var countryCode = resp && resp.country ? resp.country : '';
        success(countryCode);
      });
    },
  });
  telInput.on('keyup change', resetIntlTelInput);

  function resetIntlTelInput() {
    if (typeof intlTelInputUtils !== 'undefined') {
      // utils are lazy loaded, so must check
      var currentText = telInput.intlTelInput(
        'getNumber',
        intlTelInputUtils.numberFormat.E164
      );
      if (typeof currentText === 'string') {
        // sometimes the currentText is an object :)
        telInput.intlTelInput('setNumber', currentText); // will autoformat because of formatOnDisplay=true
      }
    }
  }
});

var submitBtn = document.querySelector('#contact-form-submit');
var form = document.querySelector('.login-form');

// submitBtn.addEventListener('click', formBtnClick);

function formBtnClick() {
  // e.preventDefault();
  if (form.checkValidity()) {
    submitForm();
  } else {
    form.querySelector('#hiddenSubmit').click();
  }
}

function submitForm() {
  $.ajax({
    url:
      'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeggPDNHW4RBhy6szZOEyNlFTEiYfNeKTPGHb6AmVE3BZGOKw/formResponse',
    type: 'post',
    data: $('#contact-us').serialize(),
    success: function () {
      alert('worked');
      formSubmitted();
    },
  });
}

function formSubmitted() {
  submitBtn.classList.add('is-loading');
  // Submit the form if its valid
  setTimeout(function () {
    submitBtn.classList.remove('is-loading');
    submitBtn.classList.add('is-success');
    submitBtn.disabled = true;
    submitBtn.removeEventListener('click', formBtnClick);
    $('.contact-header').fadeTo(200, 0);
    $('#contact-form-submit').text('Message Sent').fadeIn(500);
    $('#form-content').animate(
      {
        opacity: 0,
      },
      400,
      function () {
        $(this)
          .html(
            `<div class = "contact-msg bottom-spacing text-center"><h2>Message Sent</h2>
            <p> Thank you for taking the time to contact us.We 'll get back to you shortly.</p> </div>`
          )
          .animate(
            {
              opacity: 1,
            },
            500
          );
      }
    );
  }, 600);
}
