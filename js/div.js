$(document).ready(function() {
    
    if (getCookie('closed_msg') != '1') {
        $('.melding').show();
    }

	$('#tid .close').click(function() {
		$('#tid').hide();
	});

	$('p.credits').click(function() {
		$('ul.credits').slideToggle(500);
	});

	$('#select').change(function() {
		$(this).removeClass('required');
	});

	$('#dato').change(function() {
		brukervalgt_tid();
	});
    
    $('.alert-dismissible').click(function() {
        $(this).hide();
        setCookie('closed_msg', '1', '7');
    });
    
    $('.logout').click(function() {
        delete_cookie('user_id', '/');
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
    
    function delete_cookie( name, path, domain ) {
        var date = new Date();
        if(getCookie(name)) {
            document.cookie = name + "=" +
            ((path) ? ";path="+path:"")+
            ((domain)?";domain="+domain:"") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
        }
    }

	function brukervalgt_tid(romnr) {

		var velg_dato = new Date();
		for (var i = 0; i < 30; i++) {
			if (i > 0) {
				velg_dato.setDate((velg_dato.getDate() + 1));
			}
			$('#dato').append('<option value="' + velg_dato.getFullYear() + '-' + velg_dato.getMonth() + "-" + velg_dato.getDate() + '">' + velg_dato.getDate() + "/" + (velg_dato.getMonth() + 1) + '</option>');
		}

		var kl_dato = new Date();
		var selected_day_of_month = $('#dato').val();
		var selected_day = selected_day_of_month.split('-');

		if (selected_day[(selected_day.length - 1)] == kl_dato.getDate()) {
			$('#klokkeslett').html('');
			for (var i = kl_dato.getHours(); i < 24; i++) {
				var tid = i;
				if (i < 10) {
					tid = "" + 0 + tid;
				}
				$('#klokkeslett').append('<option value="' + i + '">' + tid + ':00</option>');
			}
		} else {
			$('#klokkeslett').html('');
			for (var i = 0; i <= 24; i++) {
				var tid = i;
				if (i < 10) {
					tid = "" + 0 + tid;
				}
				$('#klokkeslett').append('<option value="' + i + '">' + tid + ':00</option>');
			}
		}
		$('.btn-book').click(function() {
			booking(romnr, selected_day_of_month + ' ' + $('#klokkeslett').val() + ':00:00', selected_day_of_month + ' ' + (parseInt($('#klokkeslett').val()) + parseInt($('#varighet').val())) + ':00:00');
			$('#tid').hide();
		});
	}

	function søk(kap, pro, comp, bla) {
		$.ajax({
			url: 'php/get_rooms.php',
			type: 'POST',
			data: { kapasitet:kap, projektor:pro, pc:comp, tavle:bla },
			success: function(data) {

				var headers = '<tr><th>Romnr.</th><th>Kapasitet</th><th>Projektor</th><th>PC</th><th>Tavle</th></tr>';
				var table_start = '<table class="table table-striped table-hover result">';
				var table_stop = '</tbody></table>';

				$('.result thead').html(headers);
				$('.result tbody').html(data);
				$('.result tr').click(function() {

					// $(this).append(table_stop);

					var romnr = $(this).children('td:first-child').text();

					brukervalgt_tid(romnr);

					$('#tid').show();
				});
			}
		});
	}
    
	function booking(rom, dato_fra, dato_til) {
		var bruker = getCookie('user_id');
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
