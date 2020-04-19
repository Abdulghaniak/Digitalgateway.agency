// $(function () {
// if (isMobile) {
// }
// });

var process = [
  {
    id: 'discovery',
    name: 'Discovery',
    icon: 'entypo-clipboard',
    content:
      'All apps start with an idea, whether it be for a disruptive new start-up or a process improvement in a global enterprise. We help you develop that idea into a viable solution. Then our Discovery process starts which is all about thinking big but starting small, by focusing on a MVP. By creating wireframes, Hifi prototypes and PoC‘s we can continually test the opportunity.',
  },
  {
    id: 'design',
    name: 'Design',
    icon: 'entypo-picture',
    content:
      "Our creative experts focus on visualising an intuitive and engaging app that follows the specific platform and best practice HCI guidelines as well as the latest UI/UX trends.<br>Your website is often the first impression people have of your business. We make sure that it's good impression so you can continue to offer great services and products.",
  },
  {
    id: 'development',
    name: 'Development',
    icon: 'entypo-monitor',
    content:
      'Our dedicated app experts will work through the various development sprints, producing high quality code and creative paying close attention to the documented features. Then our quality control analysts thoroughly test each iteration of development and work closely with the developers to resolve any bugs, ensuring the app meets our stringent test criteria before it is released for UAT',
  },
  {
    id: 'deploy',
    name: 'Deploy',
    icon: 'entypo-paper-plane',
    content:
      'Whether the app is being released as a beta or to an internal or global audience we support you through each phase of the release cycle, gathering feedback and aligning with third party marketing goals',
  },
];

var previousTarget = null;
$('.process-bucket').click(function (e) {
  var processName, processIcon, processContent;
  e.preventDefault();
  e.stopImmediatePropagation();

  if (this !== previousTarget) {
    $('.process-bucket').not(this).removeClass('selected');
    $(this).addClass('selected');

    for (var i = 0; i < process.length; i++) {
      if (process[i].id === $(this).attr('id')) {
        console.log(process[i]);
        processName = process[i].name;
        processIcon = process[i].icon;
        processContent = process[i].content;
      }
    }

    $('#process-container')
      .fadeOut(function () {
        $('#process-container').html(`
          <span id="process-sm-icon" class="${processIcon}"></span>
          <p id="process-content">${processContent}</p>
        `);
      })
      .fadeIn();
  }
  previousTarget = this;
  return false;
});

/* ==========================================================================
    #Stats Section
========================================================================== */
var x = 0;
$(window).scroll(function () {
  var oTop = $('#stats-counter').offset().top - window.innerHeight + 250;
  if (x == 0 && $(window).scrollTop() > oTop) {
    $('.stats-counter-value').each(function () {
      var $this = $(this),
        countTo = $this.attr('data-count');
      $({
        countNum: $this.text(),
      }).animate(
        {
          countNum: countTo,
        },
        {
          duration: 2000,
          easing: 'swing',
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            $this.text(this.countNum);
          },
        }
      );
    });
    x = 1;
  }
});

/* ==========================================================================
    #faq Section
========================================================================== */
if (jQuery('.toggle .toggle-row').hasClass('active')) {
  jQuery('.toggle .toggle-row.active')
    .closest('.toggle')
    .find('.toggle-inner')
    .show();
}
jQuery('.toggle .toggle-row').click(function () {
  if (jQuery(this).hasClass('active')) {
    jQuery(this)
      .removeClass('active')
      .closest('.toggle')
      .find('.toggle-inner')
      .slideUp(200);
    $(this)
      .find('.panel-link a')
      .text(function () {
        return $(this).attr('data-text-original');
      });
  } else {
    jQuery(this)
      .addClass('active')
      .closest('.toggle')
      .find('.toggle-inner')
      .slideDown(200);
    $(this)
      .find('.panel-link a')
      .text(function () {
        return $(this).attr('data-text-swap');
      });
  }
});
