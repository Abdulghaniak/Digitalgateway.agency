var submitBtn = document.querySelector('#contact-form-submit');
var form = document.querySelector('.login-form');

submitBtn.addEventListener('click', formBtnClick);

function formBtnClick() {
    // e.preventDefault();
    if (form.checkValidity()) {
        submitForm();
    } else {
        form.querySelector('#hiddenSubmit').click();
    }
}

function submitForm() {
    submitBtn.classList.add('is-loading');

    // Submit the form if its valid
    setTimeout(function () {
        submitBtn.classList.add('is-success');
        submitBtn.classList.remove('is-loading');
        submitBtn.removeEventListener('click', formBtnClick);
        $('#contact-form-submit').text('Message Sent').fadeIn(500);
        // $('#form-content').animate({
        //     'opacity': 0
        // }, 400, function () {
        //     $(this).html(`<div class = "contact-msg bottom-spacing text-center"><h2>Message Sent</h2>
        //     <p> Thank you for taking the time to contact us.We 'll get back to you shortly.</p> </div>`)
        //         .animate({
        //             'opacity': 1
        //         }, 500);
        // });
        setTimeout(function () {
            form.submit();
        }, 2000);
    }, 300);
}