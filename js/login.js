$(document).ready(function() {
	var btnSearch = 'a.btn-search';
    // Hvis cookien ikke eksisterer, vis login-boksen og deaktiver søl-knappen
	if (!checkCookie("user_id")) {
		$(btnSearch).attr('disabled', true);
		$(btnSearch).text('Logg inn');
		$('#login').show();
	}
});
// Lager cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
// Returnerer innholdet i en cookie
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
// Sjekker om cookien eksisterer
function checkCookie(cname) {
    // var user = getCookie("user_id");
    if (cname == "") {
    	return false;
    } else {
    	return true;
    }
}
