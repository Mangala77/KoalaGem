$(function () {

  //Simulate a hover effect on tabs having a submenu
  $('#menu li:has(ul)').live('mouseenter', function(){
    if(!$(this).hasClass('active')) {
      $(this).children('ul').first().css('margin-top', 0);
      $(this).css('background', $(this).children('ul').first().css('background'));
    }
  }).live('mouseleave', function(){
    if(!$(this).hasClass('active')) {
      $(this).css('background', 'none');
    }
  });




  //This part of the script permits to put a margin between the page title (in subwrapper) and the menu
  //ONLY if a submenu and page title overlap
  var submenuVisible = $('#menu li.active>ul:visible');

  //If a submenu is active
  if($(submenuVisible).html() != null) {
    var marginTitleSubmenu = 20;
    var pageTitleRightOffset = $('div#page-title > span').offset().left + $('div#page-title > span').outerWidth();
    var submenuLeftOffset = $(submenuVisible).offset().left;

    if((submenuLeftOffset - marginTitleSubmenu) < pageTitleRightOffset) {
      $('div#page-title').css('margin-top', +$(submenuVisible).outerHeight()+10);
    }
  }

  
  
    
	// This part of the script is only needed for Internet Explorer 6.x
	if($.browser.msie) {

    // Resize the tabs because the default width value in IE6 is 100%.
    // Yet, we want it to adjust to the size of the inner text.
    $('#menu>ul>li').each(function(){
      var textLength = $(this).children('a').first().text().length;
      var tabWidth = (textLength*8)+30;
      $(this).css('width', tabWidth+'px');
      $(this).children('a').first().css('width', tabWidth+'px');
    });

		// Simulate the hover effect on a <li> which is a direct child of a <ul>. Let's call it a "tab"
		// Furthermore, if the tab contain a submenu, the said DOM tree will be displayed
		// right under the tab, simulating the wanted behavior.
		$('#menu>ul>li').live('mouseenter', function() {


			// Simulate a hover effect on the first level <li> on which the mouse is.
			$(this).addClass('menu-li-hover');
			
			// Assuming that there is only one submenu per tab
			var subMenu = $(this).children('ul').first();
			
			if(subMenu.length > 0) {
			
				// In order to situate the submenu, retrieves the absolute position
				// of the <li> containing the submenu
				var liCoords = $(this).offset();
				
				// Creates a coords object needed for the "position" method
				var subMenuCoords = {
					top: liCoords.top + $(this).outerHeight(),
					left: liCoords.left
				};
				
				// Because of a bug remaining unknown, subMenu's ul style isn't considered
				$(subMenu).css('border', 'solid 1px #CCCCCC');
				$(subMenu).css('border-top', '0');
				$(subMenu).css('background', '#FFFFFF');
				
				// Finally, the subMenu is placed and shown
				$(subMenu).position(subMenuCoords);
				$(subMenu).show();
				
				// Forcing the link's style
				$(this).children('a').first().addClass('menu-link-hover');
			}
		});
		
		// Simulate the mouseleave effect intended on a fist level <li>
		// which is : 
		// - remove the "hover" style
		// - hide the submenu, if there is one
		$('#menu>ul>li').live('mouseleave', function() {
			
		  // Removing 
			$(this).removeClass('menu-li-hover');
			$(this).children('a').first().removeClass('menu-link-hover');
			$(this).children('ul').hide();
		});
	}
});