$(document).ready(function() {
    
    // Skjuler viktig melding hvis cookie eksisterer
    if (getCookie('closed_msg') != '1') {
        $('.melding').show();
    }

    // Lukker "Velg tid"-vinduet
	$('#tid .close').click(function() {
		$('#tid').hide();
	});

	// Vindu med info sklir ned
	$('p.credits').click(function() {
		$('ul.credits').slideToggle(500);
	});

	// Fjerner en klasse fra en select
	$('#select').change(function() {
		$(this).removeClass('required');
	});

	// Kjører metoden "brukervalgt_tid" når innholdet i id'en #dato blir endret
	$('#dato').change(function() {
		brukervalgt_tid($('#tid p.romnr strong').text());
	});

	// Skjuler viktig melding og lagrer at bruker har klikket den vekk i en cookie
    $('.alert-dismissible').click(function() {
        $(this).hide();
        setCookie('closed_msg', '1', '7');
    });
    
    // Sletter en cookie som inneholder SHA1-kryptert bruker-id
    $('.logout').click(function() {
        delete_cookie('user_id', '/');
    });

    // Kjører metoden "bookede_rom" når linken i id'en "oversikt" blir klikket på
    $('#oversikt a').click(function() {
    	bookede_rom();
    });

    // Sender inn informasjon til metoden "booking" og skjuler vinduet med id "tid"
	$('.btn-book').click(function() {
		var valgt_dato = $('#dato').val();
		var valgt_klslett = $('#klokkeslett').val();
		var romnr = $('#tid p.romnr strong').text();
		booking(romnr, valgt_dato + ' ' + valgt_klslett + ':00:00', valgt_dato + ' ' + (parseInt(valgt_klslett) + parseInt($('#varighet').val())) + ':00:00');
		$('#tid').hide();
	});

	// Setter verdier etter hva som er valgt av bruker og sender det til funksjonen "søk"
	// Hvis kapasitet ikke er mellom 2 - 4, blir klassen "required" lagt til i id'en "select"
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

	// Sletter cookie
    function delete_cookie(name, path, domain) {
        var date = new Date();
        if(getCookie(name)) {
            document.cookie = name + "=" +
            ((path) ? ";path=" + path:"") +
            ((domain)?";domain=" + domain:"") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
    }

    // Hvis valgt dato er lik dagens, vil alle klokkeslett før nå ikke bli laget.
    // Hvis ingen klokkeslett innenfor åpningstidene er tilgjengelige, vil "velg en annen dato" bli vist.
    // Hvis valgt dato er senere enn dagens, vil alle tidene innenfor åpningstidene bli laget.
    // Romnummer blir vist i vinduet med id'en "tid"
	function brukervalgt_tid(romnr) {
		var aapner = 7;
		var stenger = 19;
		var kl_dato = new Date();
		var selected_day_of_month = $('#dato').val();
		var selected_day = selected_day_of_month.split('-');

		if (selected_day[(selected_day.length - 1)] == kl_dato.getDate()) {
			if (kl_dato.getHours() < stenger) {
				$('#klokkeslett').html('');
				for (var i = kl_dato.getHours(); i <= stenger; i++) {
					var tid = i;
					if (i < 10) {
						tid = "" + 0 + tid;
					}
					$('#klokkeslett').removeAttr('disabled');
					$('#klokkeslett').append('<option value="' + i + '">' + tid + ':00</option>');
				}
			} else {
				$('#klokkeslett').attr('disabled', 'true');
				$('#klokkeslett').html('<option selected disabled>Velg en annen dato</option>');
			}
		} else {
			$('#klokkeslett').html('');
			for (var i = aapner; i <= stenger; i++) {
				var tid = i;
				if (i < 10) {
					tid = "" + 0 + tid;
				}
				$('#klokkeslett').removeAttr('disabled');
				$('#klokkeslett').append('<option value="' + i + '">' + tid + ':00</option>');
			}
		}
		$('#tid p.romnr').html('(Romnr: <strong>' + romnr + '</strong>)');
	}

	// Sender variabler til php, som gir tilbake et table med informasjonen brukeren søkte etter
	// Lager dato-valg ut i fra dagens dato.
	// Kjører metoden "brukervalgt_tid" og sender med variablen "romnr"
	function søk(kap, pro, comp, bla) {
		$.ajax({
			url: 'php/get_rooms.php',
			type: 'POST',
			data: { kapasitet:kap, projektor:pro, pc:comp, tavle:bla },
			success: function(data) {

				$('#search-result').html(data);
				$('#search-result').slideDown(1000);
				$('.result td').click(function() {

					var romnr = $(this).parent().children('td:first-child').text();

					$('#tid').show();
					var velg_dato = new Date();
					for (var i = 0; i < 30; i++) {
						if (i > 0) {
							velg_dato.setDate((velg_dato.getDate() + 1));
						}
						$('#dato').append('<option value="' + velg_dato.getFullYear() + '-' + (velg_dato.getMonth() + 1) + "-" + velg_dato.getDate() + '">' + velg_dato.getDate() + "/" + (velg_dato.getMonth() + 1) + '</option>');
					}

					brukervalgt_tid(romnr);
				});
			}
		});
	}

	// Mottar variabler som blir sent til php og lagret i databasen.
	// Viser grønn meldig hvis alt ok, og rød hvis noe gikk galt
	function booking(rom, dato_fra, dato_til) {
		var bruker = getCookie('user_id');
		$.ajax({
			url: 'php/book_room.php',
			type: 'POST',
			data: { romnr:rom, brukerid:bruker, fra:dato_fra, til:dato_til },
			success: function() {
				$(".ajax-response.alert-success").text("Rom " + rom + " reservert");
				$(".ajax-response.alert-success").slideToggle(500).delay(3250).slideToggle(500);
			},
			error: function() {
				$(".ajax-response.alert-danger").text("Noe gikk galt. Prøv igjen");
				$(".ajax-response.alert-danger").slideToggle(500).delay(3250).slideToggle(500);
			}
		});
	}

	// Kjører php-scriptet "booked_times.php" som sender tilbake en tabell med oversikt over hvilke
	// rom som er booket i dag.
	function bookede_rom() {
		$.ajax({
			url: 'php/booked_times.php',
			type: 'POST',
			success: function(data) {
				$('.booked').html(data);
				$('.booked').slideToggle(1000);
			},
			error: function() {
				$('#oversikt').after('<p class="small text-center">Kunne ikke hente oversikten</p>');
			}
		});
	}
});
