var process=[{id:"discovery",name:"Discovery",icon:"entypo-clipboard",content:"All apps start with an idea, whether it be for a disruptive new start-up or a process improvement in a global enterprise. We help you develop that idea into a viable solution. Then our Discovery process starts which is all about thinking big but starting small, by focusing on a MVP. By creating wireframes, Hifi prototypes and PoC‘s we can continually test the opportunity."},{id:"design",name:"Design",icon:"entypo-picture",content:"Our creative experts focus on visualising an intuitive and engaging app that follows the specific platform and best practice HCI guidelines as well as the latest UI/UX trends.<br>Your website is often the first impression people have of your business. We make sure that it's good impression so you can continue to offer great services and products."},{id:"development",name:"Development",icon:"entypo-monitor",content:"Our dedicated app experts will work through the various development sprints, producing high quality code and creative paying close attention to the documented features. Then our quality control analysts thoroughly test each iteration of development and work closely with the developers to resolve any bugs, ensuring the app meets our stringent test criteria before it is released for UAT"},{id:"deploy",name:"Deploy",icon:"entypo-paper-plane",content:"Whether the app is being released as a beta or to an internal or global audience we support you through each phase of the release cycle, gathering feedback and aligning with third party marketing goals"}],previousTarget=null;$(".process-bucket").click(function(e){var t,o;if(e.preventDefault(),e.stopImmediatePropagation(),this!==previousTarget){$(".process-bucket").not(this).removeClass("selected"),$(this).addClass("selected");for(var n=0;n<process.length;n++)process[n].id===$(this).attr("id")&&(console.log(process[n]),process[n].name,t=process[n].icon,o=process[n].content);$("#process-container").fadeOut(function(){$("#process-container").html(`\n          <span id="process-sm-icon" class="${t}"></span>\n          <p id="process-content">${o}</p>\n        `)}).fadeIn()}return previousTarget=this,!1});var x=0;$(window).scroll(function(){var e=$("#stats-counter").offset().top-window.innerHeight+250;0==x&&$(window).scrollTop()>e&&($(".stats-counter-value").each(function(){var e=$(this),t=e.attr("data-count");$({countNum:e.text()}).animate({countNum:t},{duration:2e3,easing:"swing",step:function(){e.text(Math.floor(this.countNum))},complete:function(){e.text(this.countNum)}})}),x=1)}),jQuery(".toggle .toggle-row").hasClass("active")&&jQuery(".toggle .toggle-row.active").closest(".toggle").find(".toggle-inner").show(),jQuery(".toggle .toggle-row").click(function(){jQuery(this).hasClass("active")?(jQuery(this).removeClass("active").closest(".toggle").find(".toggle-inner").slideUp(200),$(this).find(".panel-link a").text(function(){return $(this).attr("data-text-original")})):(jQuery(this).addClass("active").closest(".toggle").find(".toggle-inner").slideDown(200),$(this).find(".panel-link a").text(function(){return $(this).attr("data-text-swap")}))});