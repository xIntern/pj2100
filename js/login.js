$(document).ready(function() {
	var btnSearch = 'a.btn-search';
	if (!checkCookie()) {
		$(btnSearch).attr('disabled', true);
		$(btnSearch).text('Logg inn');
		$('#login').show();
	}
});
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
function checkCookie() {
    var user = getCookie("user_id");
    if (user == "") {
    	return false;
    } else {
    	return true;
    }
}
