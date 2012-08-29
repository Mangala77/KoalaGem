$(document).ready(function() {
    var TZ_COOKIE_NAME = 'tzoffset';
    var options = {
        path: '/',
        expires: 10
    };
    
    // The following code is a subset of 
    // https://github.com/dsimard/jskata/blob/v0.3/src/jskata.timezone.js
    function getDate(month) {
      return new Date((new Date()).getFullYear(), month, 0).getTimezoneOffset();
    }
    tz = Math.max(getDate(0), getDate(6));
    jQuery.cookie(TZ_COOKIE_NAME, tz, options);
});
