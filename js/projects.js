$(function () {
    //    setTimeout(function () {
    //      $('.loading').fadeOut();      
    //    }, 1000);
    $(window).bind("load", function () {
        $('.loading').fadeOut();
    });
    $(".loading").click(function () {
        toggleFullScreen();
    });

    function toggleFullScreen() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) || // alternative standard method  
            (!document.mozFullScreen && !document.webkitIsFullScreen)) { // current working methods  
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
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

    var SECTION_ONE = 0;
    var SECTION_TWO = 1;
    var SECTION_THREE = 2;
    var SECTION_CAPABILITIES = 3;
    var SECTION_STUDIO = 4;
    var SECTION_WORK = 5;
    var SECTION_CULTURE = 6;
    var SECTION_QUOTES = 7;
    var SECTION_NEWS = 8;
    var SCROLL_SECTION_INDEX = 6; //Change This Every time you want to add a page
    // var SCROLL_SECTION_INDEX = 9;

    var SCROLL_BREAK = 3;
    var SWIPE_MOMENTUM_MULTIPLIER = 160;
    var CONTENT_FADE_DELAY = 200;
    var CONTENT_FADE_DURATION = 750;
    var MOBILE_WIDTH = 640;
    var COMPACT_WIDTH = 900;
    var HOUR_MORNING = 6;
    var HOUR_DAY = 12;
    var HOUR_NIGHT = 20;
    var GREATNESS_ASPECT = 0.542;

    var _sections = [
        $('#firstSection'),
        $('#secondSection'),
        $('#thirdSection'),
        $('#fourthSection'),
        $('#fifthSection'),
        $('#sixthSection')
    ];

    var _sectionIDs = [
        'gas',
        'mavcom',
        'firstclasse',
        'privasia',
        'collection1',
        'collection2'

    ];

    var _sectionHeights = [];
    var _sectionTops = [];
    var _colorChangePoints = [];
    var _deeplink = '';
    var _curSectionIndex = 0;
    var _targetSectionIndex = 0;
    var _curY = 0;
    var _videoInitted = false;
    var _navigating = false;
    var _colorChanging = false;
    var _scrollPos = 0;
    var _swipeLast = 0;
    var _swipeDisabled = false;
    var _scrollDisabled = false;
    var _scrollingAfterNavigation = 0;
    var _timeAfterNavigation = 0;
    var _scrollTimer;
    var _slideDisabled = false;
    var _slidingAfterNavigation = 0;
    var _slideTimeAfterNavigation = 0;
    var _slideTimer;
    var _bouncebackTimer;
    var _forceShowMenu = false;
    var _menuOpen = false;
    var _curWorkSlide = 0;
    var _curQuoteSlide = 0;
    var _curNewsSlide = 0;
    var _initted = false;
    var _assetsLoaded = false; //This to check whether the page loaded or not
    var _firstNav = true;
    var _isMobile = false;
    var _searchOpen = false;
    var _timeOfDayCST;
    var _timeOfDayPST;
    var _isAndroid = false;
    var _isIOS = false;
    var _menuInited = false;
    var intro_animation_ended = false;
    var sideBarOpen = false;


    $.address.init(onDeeplinkInit);
    $.address.change(onDeeplinkChange);

    function iOS() {
        var iDevices = [
            'iPhone Simulator',
            'iPod Simulator',
            'iPhone',
            'iPod'
        ];
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

        //        The Action to hide and view the Menu
        $('#menuButton').click(function () {
            _forceShowMenu = !_forceShowMenu;
            showMenu(_forceShowMenu, true);
        });


        // Search Action (for Search Button)
        $('#searchIcon').click(function (e) {
            toggleSearch();
            return false;
        });

        // Entering a value in search box and Redirecting to the result value (Must change to your website)
        //        $('#searchInput').keypress(function (e) {
        //            if (e.which == 13) {
        //                var val = $('#searchInput').val();
        //                if (val && val.trim() != '') {
        //                    window.location = '/node/' + val;
        //                }
        //            }
        //        });
        // you have to fix the search in the mobile where the search box dosen't display in the menu only
        $('#searchInput').focusout(function () {
            if (_isMobile) {
                if (_searchOpen) {
                    toggleSearch();
                }
                window.scroll(0, 0); //fixes a bug where page gets moved up by mobile browser
            }
        });

        showMenu(false);

        //disable mobile scrolling (Seems like only for the homepage)
        document.ontouchstart = function (e) {
            if (_isMobile && !_isAndroid) {
                e.preventDefault();
            }
        }

        document.ontouchmove = function (e) {
            if (_isMobile && !_isAndroid) {
                e.preventDefault();
            }
        }

        //scroll events (scrolling events)
        document.addEventListener('mousewheel', handleMouseWheel, {
            passive: false
        });

        // $('body').on('mousewheel', handleMouseWheel);

        if (Modernizr.touch) {
            $(document).swipe({
                threshold: 20,
                excludedElements: 'input',
                swipeStatus: handleSwipe
            });
        }

        //prevent arrow keys from moving page in Firefox
        $(document).keydown(function (e) {
            if (e.which >= 37 && e.which <= 40) {
                //only prevent event if search input doesn't have focus
                if (!$('#searchInput').is(':focus'))
                    return false;
            }
        });

        //arrow key navigation (you can add functions for each arrow)
        $(document).keyup(function (e) {
            //ignore navigation if search input has focus
            if ($('#searchInput').is(':focus'))
                return;

            var targetSectionID = 0;

            switch (e.which) {
                //up arrow
                case 38:
                    targetSectionID = Math.max(0, _curSectionIndex - 1);
                    _firstNav = true; //kind of a hack - forces page to scroll when on the free-scrolling section
                    navigate(_sectionIDs[targetSectionID]);
                    return false;
                    break;

                    //down arrow (Remove the -1 if you want it infinite Scrolling)
                case 40:
                    targetSectionID = Math.min(_curSectionIndex + 1, _sections.length - 1);
                    _firstNav = true; //kind of a hack - forces page to scroll when on the free-scrolling section
                    navigate(_sectionIDs[targetSectionID]);
                    return false;
                    break;

                    //left arrow
                case 37:
                    targetSectionID = Math.max(0, _curSectionIndex - 1);
                    _firstNav = true; //kind of a hack - forces page to scroll when on the free-scrolling section
                    navigate(_sectionIDs[targetSectionID]);
                    return false;
                    break;

                    //                    changeSlide('right'); //opposite of swipe direction
                    //                    return false;
                    //                    break;

                    //right arrow
                case 39:
                    targetSectionID = Math.min(_curSectionIndex + 1, _sections.length - 1);
                    _firstNav = true; //kind of a hack - forces page to scroll when on the free-scrolling section
                    navigate(_sectionIDs[targetSectionID]);
                    return false;
                    break;
                    //                    changeSlide('left'); //opposite of swipe direction
                    //                    return false;
                    //                    break;
            }
        });

        /* The Code does not exist in the home page but you can use it to change the css of an element*/
        $('#sectionNews .carousel li').each(function () {

            $(this).mouseenter(function () {
                $(this).find('h2').css({
                    color: '#D71251'
                });
                $(this).addClass('active');
                $(this).css({
                    x: -1,
                    y: -1
                });
            });

            $(this).mouseleave(function () {
                $(this).find('h2').css({
                    color: '#272727'
                });
                $(this).removeClass('active');
                $(this).css({
                    x: 0,
                    y: 0
                });
            });

            $(this).click(function () {
                var anchor = $(this).find('.newsLink');
                if (anchor.length > 0) {
                    var url = anchor.attr('href');
                    if (url) {
                        window.location = url;
                    }
                }
            });

            //shorten summaries
            var sumlen = _isMobile ? 14 : 20;
            var objSummary = $(this).find('p');
            if (objSummary.length == 0) {
                objSummary = $(this).find('h3');
            }
            if (objSummary.length > 0) {
                var strSummary = objSummary.html();
                var arrSummary = strSummary.split(' ');

                if (arrSummary.length > sumlen) {
                    arrSummary = arrSummary.slice(0, sumlen);
                    var newStr = arrSummary.join(' ') + '&hellip;';
                    objSummary.html(newStr);
                }
            }
        });

        if (Modernizr.touch) {
            $('keysIcon').css({
                display: 'none'
            });
        }

        // know where the sectionId is located
        _curSectionIndex = _sectionIDs.indexOf(_deeplink);

        //To update the time for the second section each second (to be a real time)
        setInterval(function () {
            setTime();
        }, 1000);

        onResize();

        $(window).resize(function () {
            onResize();
        });

        $(window).on("orientationchange", function (event) {
            doOnOrientationChange();
        });

        window.scroll(0, 0); //safari maintains scroll position - refreshing the page won't reset it, so need to do it manually

        // $('.firstVideo').show(); // Change the Display to block for the first Video on page load
        // loadLoader();
    } // END INIT()


    //    Image Loader, it will be called when the page loaded (it should load an image - but dosent work for noe)
    // function loadLoader() {
    //     var loaderImage = new Image();
    //     var imgURL = 'http://abdulghaniakhras.com/src/img/main-logo.jpg';
    //     loaderImage.src = imgURL;
    //     loaderImage.onload = function () {
    //         onLoaderLoaded(imgURL);
    //     };
    // }


    // function onLoaderLoaded(imgURL) {
    //     alert('sss')
    //     $('#greatness-dim').attr('src', imgURL); // the id=greaetness-dim dosen't exist in the home page so there is no loader
    //     $('#greatness').attr('src', imgURL); // the id=greaetness dosen't exist in the home page so the load dosen't page

    //     // initVideo(); // Initiate the Videos

    //     // Those if you need to add a sliders in the futur
    //     //      createSlider( 'work' );
    //     //      createSlider( 'quote' );
    //     //      createSlider( 'news' );
    //     //      positionAllSlides();

    //     //added a custom event to Pace to get the progress value (so here you can know if the page fully loaded or not)
    //     // The element for percentage dosent exist in the page you have to add it
    //     Pace.on('change', function (val) {
    //         $('#greatness-postload').css({
    //             width: val + '%'
    //         });

    //         if (!_assetsLoaded && val > 75) {
    //             _assetsLoaded = true; // To change the status that the page loaded
    //             onAlmostLoaded();
    //         }
    //     });
    //     Pace.on('done', function () {
    //         onLoaded();
    //     });

    //     $('#firstSection').fadeIn(); //Just put the first section (Don't fadeIn another thing)
    //     if (_menuInited) {
    //         if ($(window).width() > 1040) {
    //             $('#menuButton').trigger('click');
    //         }
    //     } else {
    //         _menuInited = true;
    //     }
    //     fadeInButtons($('#firstSection'), 'up');
    // }



    // /**
    //  * onAlmostLoaded
    //  */
    // function onAlmostLoaded() {
    //     alert('s');
    //     $('.section').css({
    //         display: 'block'
    //     });
    //     //      if (!_isMobile) $('.arrow.down').fadeIn();
    //     //      else $('#arrow-first').fadeIn();
    //     //      $('#promise').transition({opacity:1});
    //     $('#menuButton').fadeIn();
    //     $('#logo').fadeIn();
    //     // if( !( _isMobile || Modernizr.touch ) ){
    //     //  $('#keysIcon').fadeIn().delay(10000).fadeOut();
    //     // }
    //     gotoSection(_deeplink); //Direct to the sections (based on the link)
    // }



    // /**
    //  * onLoaded
    //  */
    // function onLoaded() {
    //     alert('s');
    //     // $('#greatness-postload').css( { width: '100%' } );
    //     // $('#greatness-preload').transition( { opacity: 0, duration: 2000 } );

    //     doIntroAnimation(); //This to Change the text that you add on the Video

    //     setTimeout(onLoaderAnimComplete, 2000); // todo something when the page fully loaded other than the text animation
    //     // if you want to add something so you have to take the doIntro animation and put it in the end of the ew function
    // }

    // function resetIntro() {
    //     $('#introContent .message.message--3').transition({
    //         opacity: 0,
    //         translate: [0, '-45%'],
    //         duration: 1000
    //     });
    // }

    // function doIntroAnimation() { // the Animation for the words in the first section
    //     var intro_show_timing = 3200;
    //     var intro_trans_timing = 600;
    //     intro_animation_ended = false;
    //     $('#introContent .message.message--3').css({
    //         opacity: 0
    //     });
    //     $('#introContent .message.message--1').transition({
    //         opacity: 1,
    //         translate: [0, '-50%'],
    //         duration: intro_trans_timing,
    //         delay: 500
    //     }, function () {
    //         $('#introContent .message.message--1').transition({
    //             opacity: 0,
    //             translate: [0, '-45%'],
    //             duration: intro_trans_timing,
    //             delay: intro_show_timing
    //         });
    //         $('#introContent .message.message--2').transition({
    //             opacity: 1,
    //             translate: [0, '-50%'],
    //             duration: intro_trans_timing,
    //             delay: intro_show_timing + 500
    //         }, function () {
    //             $('#introContent .message.message--2').transition({
    //                 opacity: 0,
    //                 translate: [0, '-45%'],
    //                 duration: intro_trans_timing,
    //                 delay: intro_show_timing
    //             });
    //             $('#introContent .message.message--3').transition({
    //                 opacity: 1,
    //                 translate: [0, '-50%'],
    //                 duration: intro_trans_timing,
    //                 delay: intro_show_timing + 500
    //             }, function () {
    //                 intro_animation_ended = true;
    //             });
    //         });
    //     });
    // }



    /**
     * onLoaderAnimComplete (Here you can add some action when the page fully loaded)
     */
    function onLoaderAnimComplete() {
        //        alert("ss");
        //      $('#greatness').attr( 'width', '100%' );
    }



    /**
     * initVideo (Initiating the Videos Size and source, it's recommended to upload 3 extensions mp4, ogv, webm)
     * you have to define the source in the HTML as well
     */
    // function initVideo() {
    //     if (Modernizr.video && !_isMobile && !_isIOS) {
    //         var gasBGVideo = new $.backgroundVideo($('#gasVid'), {
    //             "videoid": "gasBGVideo",
    //             "align": "centerXY",
    //             "width": 960,
    //             "height": 540,
    //             "path": "src/videos/",
    //             "filename": "index-gas",
    //             "types": ["mp4", "ogv", "webm"],
    //             "preload": true,
    //             "autoplay": true,
    //             "muted": true,
    //             "loop": true
    //         });

    //         var mavcomBGVideo = new $.backgroundVideo($('#mavcomVid'), {
    //             "videoid": "mavcomBGVideo",
    //             "align": "centerXY",
    //             "width": 960,
    //             "height": 540,
    //             "path": "src/videos/",
    //             "filename": "index-mavcom",
    //             "types": ["mp4", "ogv", "webm"],
    //             "preload": true,
    //             "autoplay": true,
    //             "muted": true,
    //             "loop": true
    //         });

    //         var fcBGVideo = new $.backgroundVideo($('#fcVid'), {
    //             "videoid": "fcBGVideo",
    //             "align": "centerXY",
    //             "width": 960,
    //             "height": 540,
    //             "path": "src/videos/",
    //             "filename": "index-firstclasse",
    //             "types": ["mp4", "ogv", "webm"],
    //             "preload": true,
    //             "autoplay": true,
    //             "muted": true,
    //             "loop": true
    //         });

    //         var privasiaBGVideo = new $.backgroundVideo($('#privasiaVid'), {
    //             "videoid": "privasiaBGVideo",
    //             "align": "centerXY",
    //             "width": 960,
    //             "height": 540,
    //             "path": "src/videos/",
    //             "filename": "index-privasia",
    //             "types": ["mp4", "ogv", "webm"],
    //             "preload": true,
    //             "autoplay": true,
    //             "muted": true,
    //             "loop": true
    //         });
    //         //            var testBGVideo = new $.backgroundVideo($('#testVid'), {
    //         //                   "videoid": "testBGVideo",
    //         //                   "align": "centerXY",
    //         //                   "width": 960,
    //         //                   "height": 540,
    //         //                   "path": "http://thisisdk.com/sites/all/themes/dk2013/templates/custom_front/vid/",
    //         //                   "filename": "smoke",
    //         //                   "types": ["mp4","ogv","webm"]
    //         //                 });

    //         // if( _curSectionIndex != SECTION_ONE ){
    //         //   $('#gasBGVideo')[0].pause();
    //         // }
    //         // if( _curSectionIndex != SECTION_CAPABILITIES ){
    //         //   $('#mavcomBGVideo')[0].pause();
    //         // }
    //         // if( _curSectionIndex != SECTION_CULTURE ){
    //         //   $('#fcBGVideo')[0].pause();
    //         // }
    //         // if( _curSectionIndex != SECTION_STUDIO ){
    //         //   $('#privasiaBGVideo')[0].pause();
    //         // }

    //         _videoInitted = true;
    //     }
    // }



    /**
     * toggleSearch
     * when the user click the search button it display the search text feild
     */
    function toggleSearch() {
        _searchOpen = !_searchOpen;

        if (_searchOpen) // If the searchBox is open do those
        {
            $('#searchIcon').addClass('dark');

            if (_isMobile) {
                $('#searchIcon').transition({
                    x: 75
                });
            } else {
                $('#topMenu li.search').transition({
                    width: 192
                });
                $('#searchInputContainer').transition({
                    opacity: 1
                });
                $('#searchInput').focus();
            }
        } else { // if the search box is closed
            $('#searchInputContainer').transition({
                opacity: 0
            });

            if (_isMobile) {
                $('#searchIcon').removeClass('dark');
                $('#searchIcon').transition({
                    x: 0
                });

                window.scroll(0, 0); //fixes a bug where page gets moved up by mobile browser
            } else {
                $('#topMenu li.search').transition({
                    width: 20
                });

                switch (_curSectionIndex) {
                    case SECTION_ONE:
                    case SECTION_TWO:
                    case SECTION_THREE:
                        //                  case SECTION_CAPABILITIES:
                        //                  case SECTION_CULTURE:
                        //                  case SECTION_WORK:
                        //                  case SECTION_QUOTES:
                        $('#searchIcon').removeClass('dark');
                        break;
                }
            }
            //remove input's focus
            $('#searchInput').blur();
        }
    }


    //  If you want to add Slider
    /* function changeSlide( direction ){
        //prevent multiple slide events
        clearTimeout( _slideTimer );
        _slideDisabled = true;
        _slideTimer = setInterval( function()
        {
            if( _slidingAfterNavigation && _slideTimeAfterNavigation < 1000 )
            {
                _slidingAfterNavigation = false;
                _slideTimeAfterNavigation += 200;
            }
            else
            {
                clearInterval( _slideTimer );
                _slideDisabled = false;
                _slideTimeAfterNavigation = 0;
            }
        }, 200 );

        if( _curSectionIndex == SECTION_WORK )
        {
            _curWorkSlide = getSlideIndex( direction, _curWorkSlide, $('.workSlide') );
            showSlide( $('#workSlideBGs'), _curWorkSlide );
            showSlide( $('#workSlides'), _curWorkSlide );
            updateSlideController( $('#workSlideControl' + _curWorkSlide ) );
            updateSlideArrows( $('#workArrowLeft'), $('#workArrowRight'), _curWorkSlide, $('.workSlide').length );
        }
        else if( _curSectionIndex == SECTION_QUOTES )
        {
            _curQuoteSlide = getSlideIndex( direction, _curQuoteSlide, $('.quoteSlide') );
            showSlide( $('#quoteSlides'), _curQuoteSlide );
            updateSlideController( $('#quoteSlideControl' + _curQuoteSlide ) );
            updateSlideArrows( $('#quoteArrowLeft'), $('#quoteArrowRight'), _curQuoteSlide, $('.quoteSlide').length );
        }
        else if( _curSectionIndex == SECTION_NEWS )
        {
            _curNewsSlide = getSlideIndex( direction, _curNewsSlide, $('.newsSlide') );
            showSlide( $('#newsSlides'), _curNewsSlide );
            updateSlideController( $('#newsSlideControl' + _curNewsSlide ) );
            updateSlideArrows( $('#newsArrowLeft'), $('#newsArrowRight'), _curNewsSlide, $('.newsSlide').length );
        }
    }
    */


    // if you want to add Slider
    /* function getSlideIndex( direction, slideCounter, slideObject ){
    if( direction == 'right' ){
            slideCounter--;
            if( slideCounter < 0 ){
                slideCounter = 0;
            }       
    } else if( direction == 'left' ){
            var lastSlideIndex = slideObject.length - 1;
            slideCounter++;
            if( slideCounter > lastSlideIndex ){
                slideCounter = lastSlideIndex;
            }    
    }
    return slideCounter;
  }
  */


    // This function to add a real time hour based on moment.js
    // refare to this link to change the countries https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    function setTime() {
        var datePST = moment().tz('America/Los_Angeles').format('h:mm a');
        var dateCST = moment().tz('America/Chicago').format('h:mm a');

        $('#timeChicago').html(dateCST);
        $('#timeLosAngeles').html(datePST);
        $('#timeSeattle').html(datePST);

        var hourPST = moment().tz('America/Los_Angeles').hour();
        var hourCST = moment().tz('America/Chicago').hour();

        var todPST;
        var todCST;

        for (var i = 0; i < 2; i++) {
            var h;
            var tod;

            if (i == 0) {
                h = hourPST;
            } else {
                h = hourCST;
            }

            if (h >= HOUR_MORNING && h < HOUR_DAY)
                tod = 'morning';
            else if (h >= HOUR_DAY && h < HOUR_NIGHT)
                tod = 'day';
            else
                tod = 'night';

            if (i == 0)
                todPST = tod;
            else
                todCST = tod;
        }

        if (todCST != _timeOfDayCST || todPST != _timeOfDayPST) {
            _timeOfDayCST = todCST;
            _timeOfDayPST = todPST;

            $('#officeChicago').css({
                backgroundImage: "url('http://thisisdk.com/sites/all/themes/dk2013/templates/custom_front/img/locations/" + todCST + "_chicago.jpg')"
            });
            $('#officeLosAngeles').css({
                backgroundImage: 'url("http://thisisdk.com/sites/all/themes/dk2013/templates/custom_front/img/locations/' + todPST + '_la.jpg")'
            });
            $('#officeSeattle').css({
                backgroundImage: 'url("http://thisisdk.com/sites/all/themes/dk2013/templates/custom_front/img/locations/' + todPST + '_seattle.jpg")'
            });
        }
    }

    //  function createSlider( type )
    //  {
    //      var i = 0;
    //      
    //      $('#'+type+'Slides').children().each( function(){
    //          var index = i;
    //
    //          if( type == 'work' ){
    //              $('#workSlideBGs').append( '<li class="workSlideBG"></li>' );
    //          }
    //          
    //          var li = $('<li id="'+type+'SlideControl' + i++ + '"></li>');
    //
    //          li.click( function( e ){
    //              switch( type )
    //              {
    //                  case 'work':
    //                      _curWorkSlide = index;
    //                      break;
    //                  case 'quote':
    //                      _curQuoteSlide = index;
    //                      break;
    //                  case 'news':
    //                      _curNewsSlide = index;
    //                      break;
    //              }
    //              
    //              if( type == 'work' ){
    //                  showSlide( $('#'+type+'SlideBGs'), index );
    //              }
    //              
    //              showSlide( $('#'+type+'Slides'), index );
    //              
    //              updateSlideController( $(this) );
    //              updateSlideArrows( $('#'+type+'ArrowLeft'), $('#'+type+'ArrowRight'), index, $('.'+type+'Slide').length );
    //              
    //              return false;
    //          });
    //
    //          $('#'+type+'Controls').append( li );
    //      });
    //      
    //      $('#'+type+'ControlsContainer').css( { width: 20 * i } );
    //
    //      var widthControl = 20 * i;
    //
    //      $('#'+type+'ControlsContainer .arrow.left').css( { left: -57 } );
    //      $('#'+type+'ControlsContainer .arrow.right').css( { left: widthControl + 30 } );
    //
    //      $('#'+type+'SlideControl0').addClass( 'active' );
    //  }



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
            height: fullHeight
        });

        var totalH = 0;

        for (var i = 0; i < _sections.length; i++) {
            ht = _sectionHeights[i];
            _sectionTops[i] = totalH;
            _sections[i].css({
                y: totalH,
                width: w,
                height: ht
            });
            totalH += ht;
        }

        _curY = _sectionTops[_curSectionIndex];
        $('#fullPage').css({
            y: -_curY
        });

        if (_curSectionIndex == SECTION_WORK) {
            $('#workBackgroundContainer').css({
                y: 0
            });
            $('#workContentContainer').css({
                y: 0
            });
        }

        _colorChangePoints[0] = {
            y: _sectionTops[SECTION_QUOTES] - 200,
            c1: '#F3F1EE',
            c2: '#272727'
        };
        _colorChangePoints[1] = {
            y: _sectionTops[SECTION_NEWS] - 200,
            c1: '#272727',
            c2: '#F3F1EE'
        };

        //      positionAllSlides();

        if (h > w) { // do a action if the height bigger than the width or the other way arround
            $('#greatnessRelContainer').css({
                width: w * 0.75,
                height: w * 0.75 * GREATNESS_ASPECT
            });
        } else {
            $('#greatnessRelContainer').css({
                width: (h * 0.5) / GREATNESS_ASPECT,
                height: h * 0.5
            });
        }

        var cultureScale = 1;
        var capabilitiesScale = 1;

        if (w <= MOBILE_WIDTH) {
            _isMobile = true;
            cultureScale = w / MOBILE_WIDTH;
        } else {
            _isMobile = false;
        }

        if (!_videoInitted && _assetsLoaded) {
            // initVideo();
        }

        // forceShowMenu( false, false );

        if (w < COMPACT_WIDTH && w > MOBILE_WIDTH) {
            capabilitiesScale = w / COMPACT_WIDTH;
        }
        positionTweetElements();

        if ($(window).width() < 1040) {
            forceShowMenu(false, false);
        } else {
            forceShowMenu(true, false);
        }
    }



    function onScroll(delta, isSwipe, animate) {
        if (_navigating || (_isMobile & _menuOpen)) // If the menu is open from mobile dont apply scroll function
        {
            return;
        }

        //for the "snap" sections we want to accumulate the mouse wheel delta
        if (_curSectionIndex < SCROLL_SECTION_INDEX) {
            _scrollPos = parseInt($('#scrollDummy').css('y'));
            _scrollPos += delta;
            if (Math.abs(_scrollPos) > SCROLL_BREAK) {
                var targetSection = -1;
                if (_scrollPos < 0 && _curSectionIndex < _sections.length - 1) {
                    targetSection = _curSectionIndex - 1;
                }
                //Activate this for infinite Scrolling
                // else if (_scrollPos < 0 && _curSectionIndex < _sections.length) {
                //     targetSection = 0;
                // }
                //Scrolling Down
                // else if (_scrollPos > 0 && _curSectionIndex > 0) {
                else if (_scrollPos > 0) {
                    targetSection = _curSectionIndex + 1;
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

                    navigate(_sectionIDs[targetSection]);
                    bounceBack();
                }
            } else {
                $('#scrollDummy').css({
                    y: _scrollPos
                });

                clearTimeout(_bouncebackTimer);
                _bouncebackTimer = setTimeout(function () {
                    bounceBack();
                }, 300);
            }
        }
    }


    // this to bounce back the scrollingDumy (for the previous function)
    function bounceBack() {
        $('#scrollDummy').transitionStop(true, false);
        $('#scrollDummy').transition({
            y: 0
        });
    }



    // To change the backgroundColor based ont the section
    /*
        function changeBGColor( color ){
            _colorChanging = true;
            $('#sectionQuotes').animate( { backgroundColor: color }, { complete: function(){ _colorChanging = false } } );
            $('#sectionCulture').animate( { backgroundColor: color } );
            $('#sectionNews').animate( { backgroundColor: color } );
        }
        */



    /* Positioning the Slides (If you wanna add slides)
        function positionAllSlides(){
            positionSlides( $('#sectionWork #workSlides'), $('#sectionWork .workSlide'), _curWorkSlide, 1 );
            positionSlides( $('#sectionWork #workSlideBGs'), $('#sectionWork .workSlideBG'), _curWorkSlide, 1 );
            var quoteScale = _isMobile ? 1 : .8;
            positionSlides( $('#sectionQuotes #quoteSlides'), $('#sectionQuotes .quoteSlide'), _curQuoteSlide, quoteScale );
            
        }
        



        function positionSlides( slideContainer, slides, curSlideID, scale ){
            var w = $(window).width() * scale;
            var h = $(window).height();

            slideContainer.css( { x: curSlideID * -w } );
            slides.width( w );
        }
    */


    /* (If you wanna add slides)
        function showSlide( container, slideID ){
            var slide = container.children(':first');
            
            var margin = 2 * parseInt( slide.css( 'margin-right' ) );
            if( isNaN( margin) ) margin = 0;
            
            var border = 2 * parseInt( slide.css( 'border-width' ) );
            if( isNaN( border ) ) border = 0;
            
            container.transition( { x: slideID * -( slide.width() + margin + border ) } );
        }
        



        function updateSlideController( control ){
            var controlContainer = control.siblings().removeClass( 'active' );
            
            control.addClass( 'active' );
        }
        



        function updateSlideArrows( arrowLeft, arrowRight, curSlide, slideCount ){
            var hideLeft = curSlide == 0;
            var hideRight = curSlide == slideCount - 1;

            if( hideLeft )
            {
                arrowLeft.addClass( 'disabled' );
            }
            else
            {
                arrowLeft.removeClass( 'disabled' );
            }

            if( hideRight )
            {
                arrowRight.addClass( 'disabled' );
            }
            else
            {
                arrowRight.removeClass( 'disabled' );
            }
        }
        */




    function onDeeplinkInit(event) { // when the link is intiated
        if (event.value == '' || event.value == '/') {
            $.address.value('/');
        }
    }

    function onDeeplinkChange(event) { //when the page is redirected (The Link Changed)
        _deeplink = event.value;
        // To check if the new link contain / so direct the page to the page requested (same link)
        if (_deeplink.substr(0, 1) == '/') {
            _deeplink = _deeplink.substr(1, _deeplink.length - 1);
        }
        // To check if the new link contain / or undefined or empty direct to the first page
        if (_deeplink == '' || _deeplink == '/' || _deeplink == 'undefined') {
            _deeplink = 'gas';
        }
        // if it dosent start so it will go to the init first else it will direct to the link
        if (!_initted) {
            init();
            gotoSection(_deeplink);
        } else {
            gotoSection(_deeplink);
        }
    }





    function navigate(section) { // open the link and add the / and section to the link
        $.address.value('/' + section);
    }





    function gotoSection(section) { // To open the Content for Section Required based on the sectionId 
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

        //logic for the section we are navigating away from
        switch (_sectionIDs[_curSectionIndex]) {
            case 'gas':
                break;
            case 'mavcom':
                break;
            case 'firstClasse':
                break;
            case 'privasia':
                break;
            case 'collection1':
                break;
            case 'collection2':
                break;
        }

        hideShowVideos(); // Pause the Video When Scroll

        //logic for the section we are navigating to
        switch (_sectionIDs[_targetSectionIndex]) {
            case 'gas':
                $(function () {
                    setTimeout(function () {
                        $('.sectionDescription').css('display', 'block');
                        $('.sectionDescription').addClass('animated fadeInUp');
                        setTimeout(function () {
                            $('.sectionDescription').removeClass('animated fadeInUp');
                        }, 800);
                    }, 50);
                });
                break;

            case 'mavcom':
                $(function () {
                    setTimeout(function () {
                        $('.sectionDescription').css('display', 'block');
                        $('.sectionDescription').addClass('animated fadeInUp');
                        setTimeout(function () {
                            $('.sectionDescription').removeClass('animated fadeInUp');
                        }, 800);
                    }, 50);
                });
                break;
            case 'firstclasse':
                $(function () {
                    setTimeout(function () {
                        $('.sectionDescription').css('display', 'block');
                        $('.sectionDescription').addClass('animated fadeInUp');
                        setTimeout(function () {
                            $('.sectionDescription').removeClass('animated fadeInUp');
                        }, 800);
                    }, 50);
                });
                break;
            case 'privasia':
                $(function () {
                    setTimeout(function () {
                        $('.sectionDescription').css('display', 'block');
                        $('.sectionDescription').addClass('animated fadeInUp');
                        setTimeout(function () {
                            $('.sectionDescription').removeClass('animated fadeInUp');
                        }, 800);
                    }, 50);
                });
                break;
            case 'collection1':
                fadeInContent($('#fifthSection'), direction);
                if (intro_animation_ended) {
                    resetIntro(); // if the animation for the introduction words inded do it again
                }
                break;
            case 'collection2':
                fadeInContent($('#sixthSection'), direction);
                if (intro_animation_ended) {
                    resetIntro(); // if the animation for the introduction words inded do it again
                }
                break;

        }

        setMenuColor(_targetSectionIndex, _firstNav);

        //for the first two sections this snaps to the correct position of the page we're navigating to
        if ((direction == 'down' && _curSectionIndex < SCROLL_SECTION_INDEX) || (direction == 'up' && _targetSectionIndex < SCROLL_SECTION_INDEX)) {
            _scrollPos = 0;
            bScrollToSection = true;
        }
        //for non-snap sections we don't need to wait for the transition animation to switch the current index
        else {
            _curSectionIndex = _targetSectionIndex;
        }

        if (bScrollToSection) {
            if (!_firstNav)
                _swipeDisabled = true;

            scrollTo(_sectionTops[_targetSectionIndex]);
        }

        if (_firstNav) {
            _firstNav = false;
        }
    }



    function positionTweetElements() {
        $('#sectionNews .carousel li.tweet').each(function () {
            var h = $(this).height();
            $(this).find('.tweetSpeakOuter').css({
                top: h + 'px'
            });
            $(this).find('.tweetSpeakInner').css({
                top: h + 'px'
            });
        });
    }



    function hideShowVideos() { // Pause the Video
        if (!Modernizr.video || _isMobile || _isIOS) {
            return;
        }

        $('#gasBGVideo')[0].pause();
        $('#mavcomBGVideo')[0].pause();
        $('#fcBGVideo')[0].pause();
        $('#privasiaBGVideo')[0].pause();

        var fadeTime = 300;

        switch (_sectionIDs[_targetSectionIndex]) {
            case 'gas':
                $('#mavcomVid').fadeOut(fadeTime);
                $('#fcVid').fadeOut(fadeTime);
                $('#gasVid').fadeIn(0);
                // playSectionVideo('gasBGVideo');
                $('#gasBGVideo')[0].play();
                $('#privasiaVid').fadeOut(fadeTime);
                $('#testVid').fadeOut(fadeTime);
                break;
            case 'mavcom':
                $('#gasVid').fadeOut(fadeTime);
                $('#fcVid').fadeOut(fadeTime);
                $('#mavcomVid').fadeIn(0);
                // playSectionVideo('gasBGVideo');
                $('#mavcomBGVideo')[0].play();
                $('#privasiaVid').fadeOut(fadeTime);
                $('#testVid').fadeOut(fadeTime);
                break;
            case 'firstclasse':
                $('#gasVid').fadeOut(fadeTime);
                $('#mavcomVid').fadeOut(fadeTime);
                $('#fcVid').fadeIn(0);
                $('#fcBGVideo')[0].play();
                $('#privasiaVid').fadeOut(fadeTime);
                $('#testVid').fadeOut(fadeTime);
                break;
            case 'privasia':
                $('#gasVid').fadeOut(fadeTime);
                $('#mavcomVid').fadeOut(fadeTime);
                $('#privasiaVid').fadeIn(0);
                $('#privasiaBGVideo')[0].play();
                $('#fcVid').fadeOut(fadeTime);
                $('#testVid').fadeOut(fadeTime);
                break;
            case 'collection1':
                $('#gasVid').fadeOut(fadeTime);
                $('#mavcomVid').fadeOut(fadeTime);
                $('#fcVid').fadeOut(fadeTime);
                $('#privasiaVid').fadeOut(fadeTime);
                break;
            case 'collection2':
                $('#gasVid').fadeOut(fadeTime);
                $('#mavcomVid').fadeOut(fadeTime);
                $('#fcVid').fadeOut(fadeTime);
                $('#privasiaVid').fadeOut(fadeTime);
                break;
        }
    }

    function playSectionVideo(sectionName) {
        var media = document.querySelector("#" + sectionName);

        const playPromise = media.play();
        if (playPromise !== null) {
            playPromise.catch(() => {
                media[0].play();
            })
        }
    }



    // To give a fade animation for the content
    function fadeInContent(section, direction) {
        var y = direction == 'down' ? 20 : -20;
        var delay = 0;
        section.find('.content').children().each(function () {
            $(this).css({
                opacity: 0,
                y: y
            });
            $(this).transition({
                opacity: 1,
                y: 0,
                delay: CONTENT_FADE_DELAY + delay,
                duration: CONTENT_FADE_DURATION
            });
            delay += 100;
        });
    }

    // To give a fade animation for the buttons
    function fadeInButtons(section, direction) {
        var y = direction == 'down' ? 20 : -20;
        var delay = 0;
        section.find('.landing-buttons').children().each(function () {
            $(this).css({
                opacity: 0,
                y: y
            });
            $(this).transition({
                opacity: 1,
                y: 0,
                delay: CONTENT_FADE_DELAY + delay,
                duration: CONTENT_FADE_DURATION
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
            complete: onSlideDone()
        });
    }

    function onSlideDone() {
        _curSectionIndex = _targetSectionIndex;
        _navigating = false;
    }





    function setMenuColor(sectionIndex, bAnimate) { // change the menu color based on the sections
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

        //text color
        if (bAnimate)
            $('#topMenu li a').animate({
                color: menuColor
            });
        else
            $('#topMenu li a').css({
                color: menuColor
            });

        //search icon color
        if (!_searchOpen) {
            if (menuColor == '#ffffff') {
                $('#searchIcon').removeClass('dark');
            } else {
                $('#searchIcon').addClass('dark');
            }
        }

        //hamburger color
        if (bAnimate) {
            $('#menuButton .line').animate({
                borderColor: menuColor
            });
            $('#menuButton .line').animate({
                backgroundColor: menuColor
            });
        } else {
            $('#menuButton .line').css({
                borderColor: menuColor
            });
            $('#menuButton .line').css({
                backgroundColor: menuColor
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
        if (bShow != _menuOpen)
            bToggling = true;

        if (_forceShowMenu)
            bShow = true;

        _menuOpen = bShow;

        var menuOpacity = bShow ? 1 : 0;
        var menuPos = bShow ? 0 : -50;

        if (bShow) {
            $('#topMenu').css({
                display: 'block'
            });
        }

        if (_isMobile && bToggling) {
            menuPos = 0;
            $('#topMenu').css({
                right: 0
            });

            var blur = bShow ? 'blur(2px)' : 'blur(0px)';
            var blur2 = bShow ? 'url(filters.svg#blur-blurry)' : 'none';
            $('#fullPage').transition({
                '-webkit-filter': blur,
                'filter': blur2
            });
        }

        setMenuColor(_curSectionIndex, bAnimate);

        if (bAnimate) {
            if (bShow) {
                $('#topMenu').transition({
                    opacity: menuOpacity,
                    right: menuPos
                });
            } else {
                $('#topMenu').transition({
                    opacity: menuOpacity,
                    right: menuPos
                }, function () {
                    $('#topMenu').css({
                        display: 'none'
                    });
                });
            }
        } else {
            $('#topMenu').css({
                opacity: menuOpacity,
                right: menuPos
            });
            if (!bShow) {
                $('#topMenu').css({
                    display: 'none'
                });
            }
        }

        //menu button
        if (_forceShowMenu) {
            $('#menuButton').addClass('active');
        } else {
            $('#menuButton').removeClass('active');
        }
    }

    // Handling the mouseWheel (For Our situation we dont need it)
    function handleMouseWheel(event) {
        sideBarOpen = $("#sidebar-wrapper").hasClass("active");
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
            if (d < 0)
                scr *= -1;
            if (sideBarOpen) {
                return;
            } else {
                onScroll(d);
            }
        }
        // else if (event.deltaX != 0) {
        //     if (event.deltaX < 0)
        //         changeSlide('left');
        //     else
        //         changeSlide('right');
        // }

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
                var swipeMomentum = distance / duration * SWIPE_MOMENTUM_MULTIPLIER;
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
        //left and right
        // else if (phase == 'end') {
        //     changeSlide(direction);
        // }
    }

    // Show the Burger for the Menu Button
    function showBurger(bShow, bAnimate) {
        var buttonOpacity = bShow ? 1 : 0;
        var buttonPos = bShow ? 0 : -50;

        if (bShow) {
            $('#menuButton').css({
                display: 'block'
            });
        }

        if (bAnimate) {
            if (bShow) {
                $('#menuButton').transition({
                    opacity: buttonOpacity,
                    right: buttonPos
                });
            } else {
                $('#menuButton').transition({
                    opacity: buttonOpacity,
                    right: buttonPos
                }, function () {
                    $('#menuButton').css({
                        display: 'none'
                    });
                });
            }
        } else {
            $('#menuButton').css({
                opacity: buttonOpacity,
                right: buttonPos
            });
            if (!bShow) {
                $('#menuButton').css({
                    display: 'none'
                });
            }
        }
    }
});



// JS for Photo Tilt BackGround
//content of the file named "photoTilt.js"
//        var PhotoTilt = function(options) {
//            'use strict';
//            var imgUrl = options.url,
//                lowResUrl = options.lowResUrl,
//                container = document.getElementById('firstSection'),
//                latestTilt = 0,
//                timeoutID = 0,
//                disableTilt,
//                viewport,
//                imgData,
//                img,
//                imgLoader,
//                delta,
//                centerOffset,
//                tiltBarWidth,
//                tiltCenterOffset,
//                tiltBarIndicatorWidth,
//                tiltBarIndicator,
//                config;
//
//            config = {
//                maxTilt: options.maxTilt || 20,
//                twoPhase: options.lowResUrl || false,
//                reverseTilt: options.reverseTilt || false
//            };
//
//            window.requestAnimationFrame = window.requestAnimationFrame ||
//                window.mozRequestAnimationFrame ||
//                window.webkitRequestAnimationFrame ||
//                window.msRequestAnimationFrame;
//
//            var init = function() {
//
//                var url = config.twoPhase ? lowResUrl : imgUrl;
//
//                generateViewPort();
//
//                preloadImg(url, function() {
//
//                    img = imgLoader.cloneNode(false);
//                    generateImgData();
//                    imgLoader = null;
//
//                    if (config.twoPhase) {
//
//                        preloadImg(imgUrl, function() {
//                            img.src = imgLoader.src;
//                            imgLoader = null;
//                        });
//
//                    }
//
//                    render();
//                    addEventListeners();
//
//                });
//
//            };
//
//            var updatePosition = function() {
//
//                var tilt = latestTilt,
//                    pxToMove;
//
//                if (tilt > 0) {
//                    tilt = Math.min(tilt, config.maxTilt);
//                } else {
//                    tilt = Math.max(tilt, config.maxTilt * -1);
//                }
//
//                if (!config.reverseTilt) {
//                    tilt = tilt * -1;
//                }
//
//                pxToMove = (tilt * centerOffset) / config.maxTilt;
//
//                updateImgPosition(imgData, (centerOffset + pxToMove) * -1);
//
//                updateTiltBar(tilt);
//
//                window.requestAnimationFrame(updatePosition);
//
//            };
//
//            var updateTiltBar = function(tilt) {
//
//                var pxToMove = (tilt * ((tiltBarWidth - tiltBarIndicatorWidth) / 2)) / config.maxTilt;
//                setTranslateX(tiltBarIndicator, (tiltCenterOffset + pxToMove));
//
//            };
//
//            var updateImgPosition = function(imgData, pxToMove) {
//                setTranslateX(img, pxToMove);
//            };
//
//            var addEventListeners = function() {
//
//                if (window.DeviceOrientationEvent) {
//
//                    var averageGamma = [];
//
//                    window.addEventListener('deviceorientation', function(eventData) {
//
//                        if (!disableTilt) {
//
//                            if (averageGamma.length > 8) {
//                                averageGamma.shift();
//                            }
//
//                            averageGamma.push(eventData.gamma);
//
//                            latestTilt = averageGamma.reduce(function(a, b) {
//                                return a + b;
//                            }) / averageGamma.length;
//
//                        }
//
//                    }, false);
//
//                    window.requestAnimationFrame(updatePosition);
//
//                }
//
//                window.addEventListener('resize', function() {
//
//                    container.classList.add('is-resizing');
//                    window.clearTimeout(timeoutID);
//
//                    timeoutID = window.setTimeout(function() {
//
//                        generateViewPort();
//                        container.innerHTML = "";
//                        render();
//                        container.classList.remove('is-resizing');
//
//                    }, 100);
//
//                }, false);
//
//            };
//
//            var setTranslateX = function(node, amount) {
//                node.style.webkitTransform =
//                    node.style.MozTransform =
//                    node.style.msTransform =
//                    node.style.transform = "translateX(" + Math.round(amount) + "px)";
//            };
//
//            var render = function() {
//
//                var mask,
//                    tiltBar,
//                    resizedImgWidth,
//                    tiltBarPadding = 20;
//
//                mask = document.createElement('div');
//                mask.classList.add('mask');
//
//
//                img.height = viewport.height;
//                resizedImgWidth = (imgData.aspectRatio * img.height);
//
//                delta = resizedImgWidth - viewport.width;
//                centerOffset = delta / 2;
//
//                tiltBar = document.createElement('div');
//                tiltBar.classList.add('tilt-bar');
//                tiltBarWidth = viewport.width - tiltBarPadding;
//
//                tiltBarIndicator = document.createElement('div');
//                tiltBarIndicator.classList.add('tilt-indicator');
//
//                tiltBarIndicatorWidth = (viewport.width * tiltBarWidth) / resizedImgWidth;
//                tiltBarIndicator.style.width = tiltBarIndicatorWidth + 'px';
//
//                tiltCenterOffset = ((tiltBarWidth / 2) - (tiltBarIndicatorWidth / 2));
//
//                updatePosition();
//
//                if (tiltCenterOffset > 0) {
//                    disableTilt = false;
//                    tiltBar.appendChild(tiltBarIndicator);
//                    mask.appendChild(tiltBar);
//                    container.classList.remove('disable-transitions');
//                } else {
//                    disableTilt = true;
//                    latestTilt = 0;
//                    container.classList.add('disable-transitions');
//                }
//
//                mask.appendChild(img);
//                container.appendChild(mask);
//
//            };
//
//            var generateViewPort = function() {
//
//                var containerStyle = window.getComputedStyle(container, null);
//
//                viewport = {
//                    width: parseInt(containerStyle.width, 10),
//                    height: parseInt(containerStyle.height, 10)
//                };
//
//            };
//
//            var generateImgData = function() {
//
//                imgData = {
//                    width: imgLoader.width,
//                    height: imgLoader.height,
//                    aspectRatio: imgLoader.width / imgLoader.height,
//                    src: imgLoader.src
//                };
//
//            };
//
//            var preloadImg = function(url, done) {
//
//                imgLoader = new Image();
//                imgLoader.addEventListener('load', done, false);
//                imgLoader.src = url;
//
//            };
//
//            init();
//
//            return {
//                getContainer: function() {
//                    return container;
//                }
//            }
//
//        };
//        // file content end
//
//        (function() {
//            var photoTilt = new PhotoTilt({
//                url: 'http://farm5.staticflickr.com/4016/4251578904_f13592585c_b.jpg',
//                lowResUrl: 'http://farm5.staticflickr.com/4016/4251578904_f13592585c_m.jpg'
//            });
//        })();
//    </script>
//-->
//
//    <!-- Start of Async HubSpot Analytics Code -->
//    <!--
//    <script type="text/javascript">
//        (function(d, s, i, r) {
//            if (d.getElementById(i)) {
//                return;
//            }
//            var n = d.createElement(s),
//                e = d.getElementsByTagName(s)[0];
//            n.id = i;
//            n.src = '//js.hs-analytics.net/analytics/' + (Math.ceil(new Date() / r) * r) + '/1998251.js';
//            e.parentNode.insertBefore(n, e);
//        })(document, "script", "hs-analytics", 300000);