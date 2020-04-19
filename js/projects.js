$(function () {
  $(window).bind('load', function () {
    $('.loading').fadeOut();
  });

  var SECTION_TWO = 1;
  var SECTION_THREE = 2;
  var SECTION_NEWS = 8;
  var SCROLL_SECTION_INDEX = 11; //Change This Every time you want to add a page
  // var SCROLL_SECTION_INDEX = 9;

  var SCROLL_BREAK = 3;
  var SWIPE_MOMENTUM_MULTIPLIER = 160;
  var CONTENT_FADE_DELAY = 200;
  var CONTENT_FADE_DURATION = 750;
  var MOBILE_WIDTH = 640;
  var COMPACT_WIDTH = 900;

  var _sections = [
    $('#pruSection'),
    $('#anycubedSection'),
    $('#sseSection'),
    $('#lgSection'),
    $('#sgSection'),
    $('#wilmarSection'),
    $('#gasSection'),
    $('#mavcomSection'),
    $('#fcSection'),
    $('#privasiaSection'),
    $('#col1Section'),
    $('#col2Section'),
  ];

  var _sectionIDs = [
    'prudential',
    'anycubed',
    'sse',
    'lg',
    'seagames',
    'wilmar',
    'gas',
    'mavcom',
    'firstclasse',
    'privasia',
    'collection1',
    'collection2',
  ];

  var _sectionHeights = [];
  var _sectionTops = [];
  var _deeplink = '';
  var _curSectionIndex = 0;
  var _targetSectionIndex = 0;
  var _curY = 0;
  var _videoInitted = false;
  var _navigating = false;
  var _scrollPos = 0;
  var _swipeLast = 0;
  var _swipeDisabled = false;
  var _scrollDisabled = false;
  var _scrollingAfterNavigation = 0;
  var _timeAfterNavigation = 0;
  var _scrollTimer;
  var _slideDisabled = false;
  var _bouncebackTimer;
  var _forceShowMenu = false;
  var _menuOpen = false;
  var _initted = false;
  var _assetsLoaded = false; //This to check whether the page loaded or not
  var _firstNav = true;
  var _isMobile = false;
  var _isAndroid = false;
  var _isIOS = false;
  var intro_animation_ended = false;
  var sideBarOpen = false;

  $.address.init(onDeeplinkInit);
  $.address.change(onDeeplinkChange);

  function iOS() {
    var iDevices = ['iPhone Simulator', 'iPod Simulator', 'iPhone', 'iPod'];
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()) {
        return true;
      }
    }
    return false;
  }

  // INIT //

  function init() {
    _initted = true;

    //Recognising the Device
    _isIOS = iOS();

    if (navigator.userAgent.toLowerCase().indexOf('android') >= 0) {
      _isAndroid = true;
    }

    FastClick.attach(document.body);

    if ($(window).width() <= MOBILE_WIDTH) {
      _isMobile = true;
    }

    if (!_isMobile) {
      loadVideos();
    }

    //The Action to hide and view the Menu
    $('#menuButton').click(function () {
      _forceShowMenu = !_forceShowMenu;
      showMenu(_forceShowMenu, true);
    });

    showMenu(false);

    //disable mobile scrolling
    document.ontouchstart = function (e) {
      if (_isMobile && !_isAndroid) {
        e.preventDefault();
      }
    };

    document.ontouchmove = function (e) {
      if (_isMobile && !_isAndroid) {
        e.preventDefault();
      }
    };

    //scroll events (scrolling events)
    document.addEventListener('mousewheel', handleMouseWheel, {
      passive: false,
    });

    // $('body').on('mousewheel', handleMouseWheel);

    if (Modernizr.touch) {
      $(document).swipe({
        threshold: 20,
        excludedElements: '#sidebar-wrapper',
        swipeStatus: handleSwipe,
      });
    }

    //arrow key navigation (you can add functions for each arrow)
    $(document).keyup(function (e) {
      var targetSectionID = 0;

      switch (e.which) {
        //up arrow
        case 38:
          targetSectionID = Math.max(0, _curSectionIndex - 1);
          _firstNav = true; //kind of a hack - forces page to scroll when on the free-scrolling section
          navigate(_sectionIDs[targetSectionID]);
          return false;

        //down arrow (Remove the -1 if you want it infinite Scrolling)
        case 40:
          targetSectionID = Math.min(
            _curSectionIndex + 1,
            _sections.length - 1
          );
          _firstNav = true; //kind of a hack - forces page to scroll when on the free-scrolling section
          navigate(_sectionIDs[targetSectionID]);
          return false;

        //left arrow
        case 37:
          targetSectionID = Math.max(0, _curSectionIndex - 1);
          _firstNav = true; //kind of a hack - forces page to scroll when on the free-scrolling section
          navigate(_sectionIDs[targetSectionID]);
          return false;

        //                    changeSlide('right'); //opposite of swipe direction
        //                    return false;
        //                    break;

        //right arrow
        case 39:
          targetSectionID = Math.min(
            _curSectionIndex + 1,
            _sections.length - 1
          );
          _firstNav = true; //kind of a hack - forces page to scroll when on the free-scrolling section
          navigate(_sectionIDs[targetSectionID]);
          return false;
        //                    changeSlide('left'); //opposite of swipe direction
        //                    return false;
        //                    break;
      }
    });

    // know where the sectionId is located
    _curSectionIndex = _sectionIDs.indexOf(_deeplink);

    onResize();

    $(window).resize(function () {
      onResize();
    });

    $(window).on('orientationchange', function (event) {
      doOnOrientationChange();
    });

    window.scroll(0, 0); //safari maintains scroll position - refreshing the page won't reset it, so need to do it manually

    // $('.firstVideo').show(); // Change the Display to block for the first Video on page load
    // loadLoader();
  } // END INIT()

  const loadVideos = () => {
    const sources = document.querySelectorAll('video.bg-video source');
    // Define the video object this source is contained inside
    for (var i = 0; i < sources.length; i++) {
      sources[i].setAttribute('src', sources[i].getAttribute('data-src'));
    }
    const videos = document.querySelectorAll('video.bg-video');
    videos.forEach((video) => {
      // Loading the videos using videojs API to load
      video.load();
    });
  };

  // if the orientation changed from landscape to portrait or the other way around
  function doOnOrientationChange() {
    switch (window.orientation) {
      case -90:
      case 90:
        location.reload();
        break;
      default:
        location.reload();
        break;
    }
  }

  // when the webpage is resized
  function onResize() {
    var w = $(window).width();
    var h = window.innerHeight ? window.innerHeight : $(window).height();
    var ht;
    var fullHeight = 0;

    for (var j = 0; j < _sections.length; j++) {
      _sectionHeights[j] = h;
      fullHeight += _sectionHeights[j];
    }

    $('#fullPage').css({
      height: fullHeight,
    });

    var totalH = 0;

    for (var i = 0; i < _sections.length; i++) {
      ht = _sectionHeights[i];
      _sectionTops[i] = totalH;
      _sections[i].css({
        y: totalH,
        width: w,
        height: ht,
      });
      totalH += ht;
    }

    _curY = _sectionTops[_curSectionIndex];
    $('#fullPage').css({
      y: -_curY,
    });

    if (w <= MOBILE_WIDTH) {
      _isMobile = true;
      cultureScale = w / MOBILE_WIDTH;
    } else {
      _isMobile = false;
    }

    if (!_videoInitted && _assetsLoaded) {
      // initVideo();
    }

    if (w < COMPACT_WIDTH && w > MOBILE_WIDTH) {
      capabilitiesScale = w / COMPACT_WIDTH;
    }

    if ($(window).width() < 1040) {
      forceShowMenu(false, false);
    } else {
      forceShowMenu(true, false);
    }
  }

  function onScroll(delta, isSwipe) {
    if (_navigating || _isMobile & _menuOpen) {
      // If the menu is open from mobile dont apply scroll function
      return;
    }

    //for the "snap" sections we want to accumulate the mouse wheel delta
    if (_curSectionIndex <= SCROLL_SECTION_INDEX) {
      console.log(`Current Index: ${_curSectionIndex}`);
      console.log(`Scroll Section Index: ${SCROLL_SECTION_INDEX}`);
      _scrollPos = parseInt($('#scrollDummy').css('y'));
      _scrollPos += delta;
      if (Math.abs(_scrollPos) > SCROLL_BREAK) {
        var targetSection = -1;
        if (_scrollPos < 0 && _curSectionIndex < _sections.length) {
          // Change the following if the swipe direction didn't work well
          if (isSwipe) {
            targetSection = _curSectionIndex + 1;
          } else {
            targetSection = _curSectionIndex - 1;
          }
        }
        //Activate this for infinite Scrolling
        // else if (_scrollPos < 0 && _curSectionIndex < _sections.length) {
        //   targetSection = 0;
        // }
        //Scrolling Down
        // else if (_scrollPos > 0 && _curSectionIndex > 0) {
        else if (_scrollPos > 0) {
          // Change the following if the swipe direction didn't work well
          targetSection = _curSectionIndex - 1;
          if (isSwipe) {
            targetSection = _curSectionIndex - 1;
          } else {
            targetSection = _curSectionIndex + 1;
          }
        }

        if (targetSection != -1) {
          clearTimeout(_bouncebackTimer);
          clearTimeout(_scrollTimer);
          _scrollDisabled = true;
          _scrollTimer = setInterval(function () {
            if (_scrollingAfterNavigation && _timeAfterNavigation < 1000) {
              _scrollingAfterNavigation = false;
              _timeAfterNavigation += 200;
            } else {
              clearInterval(_scrollTimer);
              _scrollDisabled = false;
              _timeAfterNavigation = 0;
            }
          }, 200);
          let targetNavSection = _sectionIDs[targetSection];
          if (!targetNavSection) {
            targetNavSection = _sectionIDs[0];
          }
          navigate(targetNavSection);
          bounceBack();
        }
      } else {
        $('#scrollDummy').css({
          y: _scrollPos,
        });

        clearTimeout(_bouncebackTimer);
        _bouncebackTimer = setTimeout(function () {
          bounceBack();
        }, 300);
      }
    } else {
      targetSection = 'prudential';
      if (targetSection != -1) {
        clearTimeout(_bouncebackTimer);
        clearTimeout(_scrollTimer);
        _scrollDisabled = true;
        _scrollTimer = setInterval(function () {
          if (_scrollingAfterNavigation && _timeAfterNavigation < 1000) {
            _scrollingAfterNavigation = false;
            _timeAfterNavigation += 200;
          } else {
            clearInterval(_scrollTimer);
            _scrollDisabled = false;
            _timeAfterNavigation = 0;
          }
        }, 200);

        navigate(_sectionIDs[targetSection]);
        bounceBack();
      }
    }
  }

  // this to bounce back the scrollingDumy (for the previous function)
  function bounceBack() {
    $('#scrollDummy').transitionStop(true, false);
    $('#scrollDummy').transition({
      y: 0,
    });
  }

  function onDeeplinkInit(event) {
    // when the link is intiated
    if (event.value == '' || event.value == '/') {
      $.address.value('/');
    }
  }

  function onDeeplinkChange(event) {
    //when the page is redirected (The Link Changed)
    _deeplink = event.value;
    // To check if the new link contain / so direct the page to the page requested (same link)
    if (_deeplink.substr(0, 1) == '/') {
      _deeplink = _deeplink.substr(1, _deeplink.length - 1);
    }
    // To check if the new link contain / or undefined or empty direct to the first page
    if (_deeplink == '' || _deeplink == '/' || _deeplink == 'undefined') {
      _deeplink = 'prudential';
    }
    // if it dosent start so it will go to the init first else it will direct to the link
    if (!_initted) {
      init();
      gotoSection(_deeplink);
    } else {
      gotoSection(_deeplink);
    }
  }

  function navigate(section) {
    // open the link and add the / and section to the link
    $.address.value('/' + section);
  }

  function gotoSection(section) {
    // To open the Content for Section Required based on the sectionId
    //if there is an error, ignore the request
    if (!section || section == 'undefined') {
      return;
    }

    var bScrollToSection = false;

    //if we are navigating to the same section we're already on...
    if (section == _sectionIDs[_curSectionIndex] || _firstNav) {
      //the first time we navigate to a section (or refresh the page) we want to continue
      if (_firstNav) {
        bScrollToSection = true;
      } else {
        return;
      }
    }

    //get the target section index and jQuery object
    _targetSectionIndex = _sectionIDs.indexOf(section);

    var direction = _targetSectionIndex < _curSectionIndex ? 'up' : 'down';

    hideShowVideos(); // Pause the Video When Scroll

    //logic for the section we are navigating to
    if (_sectionIDs[_targetSectionIndex] === 'collection1') {
      fadeInContent($('#col1Section'), direction);
      if (intro_animation_ended) {
        resetIntro(); // if the animation for the introduction words inded do it again
      }
    } else if (_sectionIDs[_targetSectionIndex] === 'collection2') {
      fadeInContent($('#col2Section'), direction);
      if (intro_animation_ended) {
        resetIntro(); // if the animation for the introduction words inded do it again
      }
    } else {
      $(function () {
        setTimeout(function () {
          $('.sectionDescription').css('display', 'block');
          $('.sectionDescription').addClass('animated fadeInUp');
          setTimeout(function () {
            $('.sectionDescription').removeClass('animated fadeInUp');
          }, 800);
        }, 50);
      });
    }

    setMenuColor(_targetSectionIndex, _firstNav);

    //for the first two sections this snaps to the correct position of the page we're navigating to
    if (
      (direction == 'down' && _curSectionIndex < SCROLL_SECTION_INDEX) ||
      (direction == 'up' && _targetSectionIndex < SCROLL_SECTION_INDEX)
    ) {
      _scrollPos = 0;
      bScrollToSection = true;
    }
    //for non-snap sections we don't need to wait for the transition animation to switch the current index
    else {
      _curSectionIndex = _targetSectionIndex;
    }

    if (bScrollToSection) {
      if (!_firstNav) _swipeDisabled = true;

      scrollTo(_sectionTops[_targetSectionIndex]);
    }

    if (_firstNav) {
      _firstNav = false;
    }
  }

  function hideShowVideos() {
    // Pause the Video
    if (!Modernizr.video || _isMobile || _isIOS) {
      return;
    }

    $('.bg-video')[0].pause();

    var fadeTime = 300;

    switch (_sectionIDs[_targetSectionIndex]) {
      case 'prudential':
        $('.bg-videos').fadeOut(fadeTime);
        $('#pruVid').fadeIn(0);
        $('#pruBGVideo')[0].play();
        break;
      case 'anycubed':
        $('.bg-videos').fadeOut(fadeTime);
        $('#anycubedVid').fadeIn(0);
        $('#anycubedBGVideo')[0].play();
        break;
      case 'sse':
        $('.bg-videos').fadeOut(fadeTime);
        $('#sseVid').fadeIn(0);
        $('#sseBGVideo')[0].play();
        break;
      case 'lg':
        $('.bg-videos').fadeOut(fadeTime);
        $('#lgVid').fadeIn(0);
        $('#lgBGVideo')[0].play();
        break;
      case 'seagames':
        $('.bg-videos').fadeOut(fadeTime);
        $('#sgVid').fadeIn(0);
        $('#sgBGVideo')[0].play();
        break;
      case 'wilmar':
        $('.bg-videos').fadeOut(fadeTime);
        $('#wilmarVid').fadeIn(0);
        $('#wilmarBGVideo')[0].play();
        break;
      case 'gas':
        $('.bg-videos').fadeOut(fadeTime);
        $('#gasVid').fadeIn(0);
        $('#gasBGVideo')[0].play();
        break;
      case 'mavcom':
        $('#mavcomVid').fadeIn(0);
        $('#mavcomBGVideo')[0].play();
        break;
      case 'firstclasse':
        $('#fcVid').fadeIn(0);
        $('#fcBGVideo')[0].play();
        break;
      case 'privasia':
        $('.bg-videos').fadeOut(fadeTime);
        $('#privasiaVid').fadeIn(0);
        $('#privasiaBGVideo')[0].play();
        break;
      case 'collection1':
        $('.bg-videos').fadeOut(fadeTime);
        break;
      case 'collection2':
        $('.bg-videos').fadeOut(fadeTime);
        break;
    }
  }

  function playSectionVideo(sectionName) {
    var media = document.querySelector('#' + sectionName);

    const playPromise = media.play();
    if (playPromise !== null) {
      playPromise.catch(() => {
        media[0].play();
      });
    }
  }

  // To give a fade animation for the content
  function fadeInContent(section, direction) {
    var y = direction == 'down' ? 20 : -20;
    var delay = 0;
    section
      .find('.content')
      .children()
      .each(function () {
        $(this).css({
          opacity: 0,
          y: y,
        });
        $(this).transition({
          opacity: 1,
          y: 0,
          delay: CONTENT_FADE_DELAY + delay,
          duration: CONTENT_FADE_DURATION,
        });
        delay += 100;
      });
  }

  /*Both of the follwing functions for scrolling*/
  function scrollTo(y) {
    _navigating = true;

    _curY = y;
    $('#fullPage').transition({
      y: -_curY,
      delay: 0,
      complete: onSlideDone(),
    });
  }

  function onSlideDone() {
    _curSectionIndex = _targetSectionIndex;
    _navigating = false;
  }

  function setMenuColor(sectionIndex, bAnimate) {
    // change the menu color based on the sections
    var menuColor = '#ffffff';
    switch (sectionIndex) {
      case SECTION_NEWS:
        menuColor = '#ce5d5d';
        break;

      case SECTION_TWO:
        if (!_isMobile) menuColor = '#ffffff';
        break;
      case SECTION_THREE:
        if (!_isMobile) menuColor = '#ffffff';
        break;
    }

    //force color to be white if mobile and menu is open
    if (_isMobile && _menuOpen) {
      menuColor = '#ffffff';
    }

    //hamburger color
    if (bAnimate) {
      $('#menuButton .line').animate({
        borderColor: menuColor,
      });
      $('#menuButton .line').animate({
        backgroundColor: menuColor,
      });
    } else {
      $('#menuButton .line').css({
        borderColor: menuColor,
      });
      $('#menuButton .line').css({
        backgroundColor: menuColor,
      });
    }
  }

  // To show force showing the menu
  function forceShowMenu(bShow, bAnimate) {
    _forceShowMenu = bShow;
    showMenu(bShow, bAnimate);
  }

  // Show the Header Menu Sections
  function showMenu(bShow, bAnimate) {
    var bToggling = false;
    if (bShow != _menuOpen) bToggling = true;

    if (_forceShowMenu) bShow = true;

    _menuOpen = bShow;

    var menuOpacity = bShow ? 1 : 0;
    var menuPos = bShow ? 0 : -50;

    setMenuColor(_curSectionIndex, bAnimate);

    //menu button
    if (_forceShowMenu) {
      $('#menuButton').addClass('active');
    } else {
      $('#menuButton').removeClass('active');
    }
  }

  function handleMouseWheel(event) {
    sideBarOpen = $('#sidebar-wrapper').hasClass('active');
    if (_scrollDisabled) {
      _scrollingAfterNavigation = true;
      return false;
    }

    if (_slideDisabled) {
      _slidingAfterNavigation = true;
      return false;
    }

    if (event.deltaY != 0) {
      var d = event.deltaY;

      var scr = 1;
      if (d < 0) scr *= -1;
      if (sideBarOpen) {
        return;
      } else {
        onScroll(d);
      }
    }

    return false;
  }

  // Handle the Swip Based on the direction
  function handleSwipe(event, phase, direction, distance, duration, fingers) {
    if (_swipeDisabled) {
      if (phase == 'end') {
        _swipeDisabled = false;
      }

      return;
    }

    //we want the difference from the last event
    if (phase == 'start') {
      _swipeLast = 0;
    }
    //up and down
    if (direction == 'up' || direction == 'down') {
      //calculate momentum
      if (phase == 'end' && _curSectionIndex >= SCROLL_SECTION_INDEX) {
        var swipeMomentum = (distance / duration) * SWIPE_MOMENTUM_MULTIPLIER;
        if (direction == 'up') {
          swipeMomentum *= -1;
        }
        onScroll(swipeMomentum, true, true);
      }
      //scroll by delta
      else {
        var delta = distance - _swipeLast;
        if (direction == 'up') {
          delta *= -1;
        }
        _swipeLast = distance;

        onScroll(delta, true);
      }
    }
  }
});

// Toggle Full Screen
$('.loading').click(function () {
  toggleFullScreen();
});

function toggleFullScreen() {
  if (
    (document.fullScreenElement && document.fullScreenElement !== null) || // alternative standard method
    (!document.mozFullScreen && !document.webkitIsFullScreen)
  ) {
    // current working methods
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
