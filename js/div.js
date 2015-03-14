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
					$('#login').hide();
					$('a.btn-search').attr('disabled', false);
					$('a.btn-search').text('Søk');
				}
			}
		});
	});

	$('#dato').change(function() {
		brukervalgt_tid();
	});

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
					// console.log("Før btn-klikk: " + romnr);

					brukervalgt_tid(romnr);

					$('#tid').show();

					// $(this).append(table_stop + table_start + '<thead><tr><td>Klokkeslett</td></tr></thead><tbody>');
					// for (var i = 0; i <= 24; i++) {
					// 	$(this).append('<tr><td style="padding-left: 20px;">' + i + ':00</td></tr>');
					// };
					// $(this).append('</tbody></table>' + table_start + headers + '<tbody>');

					// alert('Du har nå booket rom nr: ' + rom);
					// ledig_tid(rom);
				});
			}
		});
	}

	function tid(rom) {
		$.ajax({
			url: 'php/get_free_times.php',
			type: 'POST',
			data: { rom : 'value1' },
			success: function(data) {
				$();
			}
		});
		
	}

	function booking(rom, dato_fra, dato_til) {
		var bruker = getCookie('user_id');
  //       var date = new Date();
  //       if (date.getMinutes() > 0) {
  //       	var hrs = 1;
  //       } else {
  //       	hrs = 0;
  //       }
		// var dato_fra = date.getFullYear() + '-' +
  //           ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
  //           ('00' + date.getDate()).slice(-2) + ' ' + 
  //           ('00' + Math.ceil(date.getHours() + hrs)).slice(-2) + ':00:00' + 
  //           ('00' + Math.floor(date.getMinutes())).slice(-2) + ':' + 
  //           ('00' + Math.floor(date.getSeconds())).slice(-2);
        
		// var dato_til = date.getFullYear() + '-' +
  //           ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
  //           ('00' + date.getDate()).slice(-2) + ' ' + 
  //           ('00' + Math.ceil((date.getHours() + 2 + hrs))).slice(-2) + ':00:00'/* + 
  //           ('00' + Math.floor(date.getMinutes())).slice(-2) + ':' + 
  //           ('00' + Math.floor(date.getSeconds())).slice(-2)*/;
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
