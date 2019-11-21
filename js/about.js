// $(function () {
// if (isMobile) {
// }
// });

var process = [{
    id: "strategy",
    name: "Strategy",
    icon: "entypo-clipboard",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    id: "create",
    name: "Create",
    icon: "entypo-picture",
    content: "2Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    id: "develop",
    name: "Develop",
    icon: "entypo-monitor",
    content: "3Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  },
  {
    id: "deploy",
    name: "Deploy",
    icon: "entypo-paper-plane",
    content: "4Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  }
];

var previousTarget = null;
$(".process-bucket > a").click(function (e) {
  var processName, processIcon, processContent;
  e.preventDefault();
  e.stopImmediatePropagation();

  if (this !== previousTarget) {
    $(".process-bucket > a")
      .not(this)
      .removeClass("selected");
    $(this).addClass("selected");

    var url = $(this).attr("href");
    // $('#process-container').load(url + ' #process-content').hide().fadeToggle(1000);
    for (var i = 0; i < process.length; i++) {
      if (process[i].id === $(this).attr("id")) {
        processName = process[i].name;
        processIcon = process[i].icon;
        processContent = process[i].content;
        console.log(process[i]);
        console.log(processContent);
      }
    }

    $("#process-container")
      .fadeOut(function () {
        $("#process-container").html(`<h4 id="process-title">${processName}</h4>
                    <span id="process-sm-icon" class="${processIcon}"></span>
                    <p id="process-content">${processContent}></p>`);
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
        countNum: $this.text()
      }).animate({
        countNum: countTo
      }, {
        duration: 2000,
        easing: 'swing',
        step: function () {
          $this.text(Math.floor(this.countNum));
        },
        complete: function () {
          $this.text(this.countNum);
        }
      });
    });
    x = 1;
  }
});

/* ==========================================================================
    #faq Section
========================================================================== */
if (jQuery(".toggle .toggle-row").hasClass('active')) {
  jQuery(".toggle .toggle-row.active").closest('.toggle').find('.toggle-inner').show();
}
jQuery(".toggle .toggle-row").click(function () {
  if (jQuery(this).hasClass('active')) {
    jQuery(this).removeClass("active").closest('.toggle').find('.toggle-inner').slideUp(200);
    $(this).find('.panel-link a').text(function () {
      return $(this).attr("data-text-original");
    });
  } else {
    jQuery(this).addClass("active").closest('.toggle').find('.toggle-inner').slideDown(200);
    $(this).find('.panel-link a').text(function () {
      return $(this).attr("data-text-swap");
    });
  }
});