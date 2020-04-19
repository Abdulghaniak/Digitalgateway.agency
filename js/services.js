$(function () {
  $('.service-container').each(function () {
    if (window.innerWidth < 992) {
      jQuery(this).find('.service-graphic').prependTo(this);
    }
  });
  if (!isMobile) {
    initScrollMagic();
  }
});

var firstTween = new TimelineMax(),
  secondTween = new TimelineMax(),
  thirdTween = new TimelineMax();
var $firstContent = $('#firstServiceSection .service-content'),
  $firstGraphic = $('#firstServiceSection .service-graphic'),
  $secondContent = $('#secondServiceSection .service-content'),
  $secondGraphic = $('#secondServiceSection .service-graphic'),
  $thirdContent = $('#thirdServiceSection .service-content'),
  $thirdGraphic = $('#thirdServiceSection .service-graphic');

function initScrollMagic() {
  // initialize scrollmagic
  controller = new ScrollMagic.Controller();

  firstTween
    .from(
      $firstContent,
      1,
      {
        opacity: 0,
        top: '-40%',
        scale: 0,
      },
      '0'
    )
    .from(
      $firstGraphic,
      1,
      {
        opacity: 0,
        bottom: '-30%',
        scale: 0,
      },
      '0'
    );

  new ScrollMagic.Scene({
    triggerElement: '#firstServiceSection',
    triggerHook: 'onEnter',
    duration: $('#firstServiceSection').height() * 1.1,
  })
    .setTween(firstTween)
    .addTo(controller);

  secondTween
    .from(
      $secondContent,
      1,
      {
        opacity: 0,
        top: '-40%',
        scale: 0,
      },
      '0'
    )
    .from(
      $secondGraphic,
      1,
      {
        opacity: 0,
        bottom: '-30%',
        scale: 0,
      },
      '0'
    );
  new ScrollMagic.Scene({
    triggerElement: '#secondServiceSection',
    triggerHook: 'onEnter',
    duration: $('#secondServiceSection').height() * 1.1,
  })
    .setTween(secondTween)
    .addTo(controller);

  thirdTween
    .from(
      $thirdContent,
      1,
      {
        opacity: 0,
        top: '-40%',
        scale: 0,
      },
      '0'
    )
    .from(
      $thirdGraphic,
      1,
      {
        opacity: 0,
        bottom: '-30%',
        scale: 0,
      },
      '0'
    );
  new ScrollMagic.Scene({
    triggerElement: '#thirdServiceSection',
    triggerHook: 'onEnter',
    duration: $('#thirdServiceSection').height() * 1.1,
  })
    .setTween(thirdTween)
    .addTo(controller);
}
