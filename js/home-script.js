$(function () {
  var isMobile = false;
  var controller = null;
  var maxWidth = 769;
  var wh = window.innerHeight;

  if ($(window).width() < maxWidth) {
    isMobile = true;
  }


  // services
  $(".service").click(function () {
    var serviceDescription = $(this)
    var serviceMain = $(this).find('.service-main');
    var serviceImg = $(this).find('.service-main').find('img');
    var serviceDescription = $(this).find('.service-description');
    var serviceDescriptionList = $(this).find('.service-description li');
    var mainTweenProps = {
      scale: .05,
      transform: 'translate(0,0) scale(0.85)',
      top: 0,
      left: 0
    };
    var desTweenProps = {
      opacity: 1,
      visibility: 'visible'
    };
    var reverseMainTween = {
      scale: .05,
      transform: 'translate(-50%,-50%) scale(1)',
      top: '50%',
      left: '50%'
    };
    var reverseDesTween = {
      opacity: 0
    };

    if (window.innerWidth < 992) {
      reverseMainTween = {
        scale: .05,
        transform: 'translate(0%,25%) scale(1)'
      };
    }
    var firstTween, secondTween;
    if (!$(this).hasClass("active")) {
      $(this).addClass("active");
      TweenMax.to(serviceMain, .6, mainTweenProps);
      // TweenMax.to(serviceDescription, .6, desTweenProps);
      var staggerTween = TweenMax.staggerFromTo(serviceDescriptionList, 0.42,
        {
          scale: 0,
        },
        {
          scale: 1,
          opacity: 1
        },
        0.4
      );
    } else {
      $(this).removeClass("active");
      TweenMax.killTweensOf(serviceDescriptionList);
      TweenMax.to(serviceMain, .6, reverseMainTween);
      TweenMax.to(serviceDescriptionList, .6, reverseDesTween);
    }
  });

  initScrollMagic();

  // this solution prevents the controller from being initialized/destroyed more than once
  // $(window).resize(function () {
  //   var wWidth = $(window).width();
  //   if (wWidth < maxWidth) {
  //     if (controller !== null && controller !== undefined) {
  //       // completely destroy the controller
  //       // TweenMax.killAll();
  //       TweenMax.set(".client-logo img", {
  //         clearProps: "all"
  //       });
  //       tweenDG.clear();
  //       controller = controller.destroy(true);
  //     }
  //   } else if (wWidth >= maxWidth) {
  //     console.log(controller);
  //     if (controller === null || controller === undefined) {
  //       // reinitialize ScrollMagic only if it is not already initialized
  //       initScrollMagic();
  //     }
  //   }
  // });
});

// ScrollMagicz
function initScrollMagic() {
  var tweenDG = new TimelineMax();
  var $clientLogo = $('.client-logo img');
  var triggerEndExtra = 1.7;
  // initialize scrollmagic
  controller = new ScrollMagic.Controller();

  // Design System
  tweenDG
    .from($clientLogo, 1, {
      opacity: 0,
      scale: 0
    });
  if (isMobile) {
    triggerEndExtra = 1.8
  }


  new ScrollMagic.Scene({
      triggerElement: ".clients",
      triggerHook: 'onEnter',
      duration: $('.clients').height() * triggerEndExtra
    })
    .setClassToggle('.clients', 'fade-in')
    // .addIndicators({
    //   name: 'fade scene',
    //   colorTrigger: 'green'
    // })
    .setTween(tweenDG)
    .addTo(controller);
}