        $(document).ready(function () {
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
            //Skroll animation detector (Skills Section)
            var $skillSection = $('.skills');
            var $window = $(window);
            //            var firstView = 0;

            function check_if_in_view() {
                var window_height = $window.height();
                var window_top_position = $window.scrollTop();
                var window_bottom_position = (window_top_position + window_height);

                $.each($skillSection, function () {
                    var $element = $(this);
                    var element_height = $element.outerHeight();
                    var element_top_position = $element.offset().top;
                    var element_bottom_position = (element_top_position + element_height);

                    //check to see if this current container is within viewport
                    if ((element_bottom_position >= window_top_position) &&
                        (element_top_position <= window_bottom_position)) {
                        //                        if (firstView == 0) {
                        //                            firstView++;
                        $element.addClass('in-view');
                        //                        }
                    } else {
                        $element.removeClass('in-view');
                    }
                });
            }

            $window.on('scroll resize', check_if_in_view);
            $window.trigger('scroll');

            //End Skroll animation detector (Skills Section)

            //Start- AutoCounter Section

            var $autoCounterSection = $('.AutoCounter');
            var firstViewAutoCounter = 0;

            function check_if_inCounter_view() {
                var window_height = $window.height();
                var window_top_position = $window.scrollTop();
                var window_bottom_position = (window_top_position + window_height);

                $.each($autoCounterSection, function () {
                    var $element = $(this);
                    var element_height = $element.outerHeight();
                    var element_top_position = $element.offset().top;
                    var element_bottom_position = (element_top_position + element_height);

                    //check to see if this current container is within viewport
                    if ((element_bottom_position >= window_top_position) &&
                        (element_top_position <= window_bottom_position)) {
                        if (firstViewAutoCounter == 0) {
                            firstViewAutoCounter++;
                            $.fn.jQuerySimpleCounter = function (options) {
                                var settings = $.extend({
                                    start: 0,
                                    end: 100,
                                    easing: 'swing',
                                    duration: 400,
                                    complete: ''
                                }, options);

                                var thisElement = $(this);

                                $({
                                    count: settings.start
                                }).animate({
                                    count: settings.end
                                }, {
                                    duration: settings.duration,
                                    easing: settings.easing,
                                    step: function () {
                                        var mathCount = Math.ceil(this.count);
                                        thisElement.text(mathCount);
                                    },
                                    complete: settings.complete
                                });
                            };


                            $('#number1').jQuerySimpleCounter({
                                end: 12,
                                duration: 3000
                            });
                            $('#number2').jQuerySimpleCounter({
                                end: 55,
                                duration: 3000
                            });
                            $('#number3').jQuerySimpleCounter({
                                end: 359,
                                duration: 2000
                            });
                            $('#number4').jQuerySimpleCounter({
                                end: 246,
                                duration: 2500
                            });
                        }
                    }
                    //                    else {
                    //                        firstViewAutoCounter = 0;
                    //                    }
                });
            }

            $window.on('scroll resize', check_if_inCounter_view);
            $window.trigger('scroll');
            //End- AutoCounter Section



            // Start - Languages Bars


            var $languagesBarSection = $('.languages');
            var firstViewLanguagesBar = 0;

            function check_if_inLanguages_view() {
                var window_height = $window.height();
                var window_top_position = $window.scrollTop();
                var window_bottom_position = (window_top_position + window_height);

                $.each($languagesBarSection, function () {
                    var $element = $(this);
                    var element_height = $element.outerHeight();
                    var element_top_position = $element.offset().top;
                    var element_bottom_position = (element_top_position + element_height);

                    //check to see if this current container is within viewport
                    if ((element_bottom_position >= window_top_position) &&
                        (element_top_position <= window_bottom_position)) {
                        if (firstViewLanguagesBar == 0) {
                            firstViewLanguagesBar++;
                            $('.skill-box').find('b').each(function (i) {
                                return $(this).prop('Counter', 0).animate({
                                    Counter: $(this).parent().data('percent')
                                }, {
                                    duration: 3000,
                                    easing: 'swing',
                                    step: function (now) {
                                        return $(this).text(Math.ceil(now) + '%');
                                    }
                                });
                            });
                            return $('.skill-box .skills-circle li').each(function (i) {
                                var _left, _percent, _right, deg, full_deg, run_duration;
                                _right = $(this).find('.bar-circle-right');
                                _left = $(this).find('.bar-circle-left');
                                _percent = $(this).attr('data-percent');
                                deg = 3.6 * _percent;
                                if (_percent <= 50) {
                                    return _right.animate({
                                        circle_rotate: deg
                                    }, {
                                        step: function (deg) {
                                            $(this).css('transform', 'rotate(' + deg + 'deg)');
                                        },
                                        duration: 3000
                                    });
                                } else {
                                    full_deg = 180;
                                    deg -= full_deg;
                                    run_duration = 3000 * (50 / _percent);
                                    return _right.animate({
                                        circle_rotate: full_deg
                                    }, {
                                        step: function (full_deg) {
                                            $(this).css('transform', 'rotate(' + full_deg + 'deg)');
                                        },
                                        duration: run_duration,
                                        easing: 'linear',
                                        complete: function () {
                                            run_duration -= 3000;
                                            _left.css({
                                                'clip': 'rect(0, 150px, 150px, 75px)',
                                                'background': '#ff913b'
                                            });
                                            return _left.animate({
                                                circle_rotate: deg
                                            }, {
                                                step: function (deg) {
                                                    $(this).css('transform', 'rotate(' + deg + 'deg)');
                                                },
                                                duration: Math.abs(run_duration),
                                                easing: 'linear'
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                    //                    else {
                    //                        firstViewLanguagesBar = 0;
                    //                    }
                });
            }

            $window.on('scroll resize', check_if_inLanguages_view);
            $window.trigger('scroll');
            // End - Languages Bars

            // Download Button - Start
            $(".button-fill").hover(function () {
                $(this).children(".button-inside").addClass('full');
            }, function () {
                $(this).children(".button-inside").removeClass('full');
            });

            // Download Button - End

            // Map Script
            setTimeout(function () {
                //set your google maps parameters
                var $latitude = 3.1009,
                    $longitude = 101.5917,
                    $map_zoom = 12;

                //google map custom marker icon - .png fallback for IE11
                var is_internetExplorer11 = navigator.userAgent.toLowerCase().indexOf('trident') > -1;
                var $marker_url = (is_internetExplorer11) ? 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/148866/cd-icon-location.png' : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/148866/cd-icon-location_1.svg';

                //define the basic color of your map, plus a value for saturation and brightness
                var $main_color = '#2d313f',
                    $saturation = -20,
                    $brightness = 5;

                //we define here the style of the map
                var style = [{
                        //set saturation for the labels on the map
                        elementType: "labels",
                        stylers: [{
                            saturation: $saturation
                        }]
                    }, { //poi stands for point of interest - don't show these lables on the map 
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        //don't show highways lables on the map
                        featureType: 'road.highway',
                        elementType: 'labels',
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        //don't show local road lables on the map
                        featureType: "road.local",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        //don't show arterial road lables on the map
                        featureType: "road.arterial",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        //don't show road lables on the map
                        featureType: "road",
                        elementType: "geometry.stroke",
                        stylers: [{
                            visibility: "off"
                        }]
                    },
                    //style different elements on the map
                    {
                        featureType: "transit",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "poi.government",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "poi.sport_complex",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "poi.attraction",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "poi.business",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "transit.station",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "landscape",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]

                    }, {
                        featureType: "road",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.fill",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }, {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            hue: $main_color
                        }, {
                            visibility: "on"
                        }, {
                            lightness: $brightness
                        }, {
                            saturation: $saturation
                        }]
                    }
                ];

                //set google map options
                var map_options = {
                        center: new google.maps.LatLng($latitude, $longitude),
                        zoom: $map_zoom,
                        panControl: false,
                        zoomControl: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        scrollwheel: false,
                        styles: style,
                    }
                    //inizialize the map
                var map = new google.maps.Map(document.getElementById('google-container'), map_options);
                //add a custom marker to the map				
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng($latitude, $longitude),
                    map: map,
                    visible: true,
                    icon: $marker_url,
                });

                //add custom buttons for the zoom-in/zoom-out on the map
                function CustomZoomControl(controlDiv, map) {
                    //grap the zoom elements from the DOM and insert them in the map 
                    var controlUIzoomIn = document.getElementById('cd-zoom-in'),
                        controlUIzoomOut = document.getElementById('cd-zoom-out');
                    controlDiv.appendChild(controlUIzoomIn);
                    controlDiv.appendChild(controlUIzoomOut);

                    // Setup the click event listeners and zoom-in or out according to the clicked element
                    google.maps.event.addDomListener(controlUIzoomIn, 'click', function () {
                        map.setZoom(map.getZoom() + 1)
                    });
                    google.maps.event.addDomListener(controlUIzoomOut, 'click', function () {
                        map.setZoom(map.getZoom() - 1)
                    });
                }

                var zoomControlDiv = document.createElement('div');
                var zoomControl = new CustomZoomControl(zoomControlDiv, map);

                //insert the zoom div on the top left of the map
                map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);
                // End Map Script

            }, 1500);

            //            setTimeout(function() {
            //                $('.penfolio_preloader').fadeOut();
            //            }, 1000);

            var scroll_speed = 500; // Scroll speed. Set to 0 for instant snap
            var nav_links = $('ul li'); // Nav link elements

            function scroll_to(element) {
                $('html, body').animate({
                    scrollTop: $(element).offset().top - 75 // Scroll to element
                }, scroll_speed);
            }

            nav_links.click(function () {
                var id = $(this).html().toLowerCase(); // Get clicked link
                var target = $('[scroll_target = ' + id + ']'); // Set the target element
                scroll_to(target); // Scroll to target
            });

            /* ====================================================================
	
            Responsive menu

            =======================================================================  */

            // Options

            var r_nav_open = 0; // Init menu closed

            $('.pen_responsive_nav').click(function () {
                if (r_nav_open == 0) {
                    $(this).find('ul').show(); // Show the menu
                    r_nav_open = 1; // Set to open
                } else {
                    $(this).find('ul').hide(); // Hide the menu
                    r_nav_open = 0; // Set to closed
                }
            });

        });

        $(window).ready(function () {

            /* ====================================================================
	
            Mini menu

            =======================================================================  */

            var threshold = $('.penfolio_inner__home').innerHeight() + 50;

            $(window).scroll(function () {
                if ($(document).scrollTop() > threshold) {
                    $('.pen_nav__mini').addClass('nav_active');
                } else {
                    $('.pen_nav__mini').removeClass('nav_active');
                }
            })


            /* ====================================================================
	
            Mini menu

            =======================================================================  */

            function isScrolledIntoView(elem) {
                var $elem = $(elem);
                var $window = $(window);

                var docViewTop = $window.scrollTop();
                var docViewBottom = docViewTop + $window.height();

                var elemTop = $elem.offset().top + 400;
                var elemBottom = elemTop + $elem.height() - 600;
                //console.log(elemTop);
                if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
                    $elem.addClass('bring_in');
                } else {
                    $elem.removeClass('bring_in');
                }
            }

            $(window).scroll(function () {
                $('.pen_card').each(function () {
                    isScrolledIntoView($(this));
                })
            })

            /* ====================================================================
	
            Scroll fade

            =======================================================================  */

            $(window).scroll(function () {
                op = threshold / $(document).scrollTop() - 1;
                $('.pen_intro').css('opacity', op);
            })

        })