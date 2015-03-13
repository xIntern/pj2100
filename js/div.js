$(document).ready(function() {
	$('p.credits').click(function() {
		$('ul.credits').slideToggle(500);
	});
	$('a.btn-search').click(function() {
		var kap = $('#select').val();
		if ($('#projektor').prop('checked')) {
			var pro = 1;
		} else { pro = 0; }
		if ($('#pc').prop('checked')) {
			var pc = 1;
		} else { pc = 0; }
		if ($('#tavle').prop('checked')) {
			var bla = 1;
		} else { bla = 0; }
		if (kap > 1 && kap < 5) {
			søk(kap, pro, pc, bla);
		} else {
			$('#select').addClass('required');
		}
	});
	$('#select').change(function() {
		$(this).removeClass('required');
	});
	$('.btn-login').click(function() {
		var bruker = $(this).prev().prev().val();
		var pass = $(this).prev().val();
		$.ajax({
			url: 'php/get_user.php',
			type: 'POST',
			data: { brukernavn:bruker, passord:pass },
			success: function(data) {
				// $('.panel-heading h3').html(data);
				if (checkCookie()) {
					$('.login').hide();
					$('a.btn-search').attr('disabled', false);
					$('a.btn-search').text('Søk');
				}
			}
		});
	});
	function søk(kap, pro, comp, bla) {
		$.ajax({
			url: 'php/get_rooms.php',
			type: 'POST',
			data: { kapasitet:kap, projektor:pro, pc:comp, tavle:bla },
			success: function(data) {
				$('.result thead').html('<tr><th>Romnr.</th><th>Kapasitet</th><th>Projektor</th><th>PC</th><th>Tavle</th></tr>');
				$('.result tbody').html(data);
				$('.result td').click(function() {
					var rom = $(this).parent().children('td:first-child').text();
					// alert('Du har nå booket rom nr: ' + rom);
					booking(rom);
				});
			}
		});
	}
	function booking(rom) {
		var bruker = getCookie('user_id');
        var date = new Date();
        if (date.getMinutes() > 0) {
        	var hrs = 1;
        } else {
        	hrs = 0;
        }
		var dato_fra = date.getFullYear() + '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2) + ' ' + 
            ('00' + Math.ceil(date.getHours() + hrs)).slice(-2) + ':00:00'/* + 
            ('00' + Math.floor(date.getMinutes())).slice(-2) + ':' + 
            ('00' + Math.floor(date.getSeconds())).slice(-2)*/;
        
		var dato_til = date.getFullYear() + '-' +
            ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getDate()).slice(-2) + ' ' + 
            ('00' + Math.ceil((date.getHours() + 2 + hrs))).slice(-2) + ':00:00'/* + 
            ('00' + Math.floor(date.getMinutes())).slice(-2) + ':' + 
            ('00' + Math.floor(date.getSeconds())).slice(-2)*/;
		$.ajax({
			url: 'php/book_room.php',
			type: 'POST',
			data: { romnr:rom, brukerid:bruker, fra:dato_fra, til:dato_til },
			success: function() {
				$(".alert-success").text("Rom " + rom + " reservert");
				$(".alert-success").slideToggle(500).delay(3250).slideToggle(500);
			},
			error: function() {
				$(".alert-danger").text("Noe gikk galt. Prøv igjen");
				$(".alert-danger").slideToggle(500).delay(3250).slideToggle(500);
			}
		});
	}
});