<?php
	// Dagens dato formattert "dag mnd år" uten mellomrom
	$idag = date('dmy');
	require '../php/mysql.php';

	// SQL-query
	$sql = 'SELECT fornavn, etternavn, bo.romnr, booket_fra, booket_til
			FROM booking bo
			INNER JOIN rom r ON r.romnr = bo.romnr
			INNER JOIN bruker br ON br.bruker_id = bo.bruker_id
			ORDER BY bo.romnr ASC, booket_fra ASC';

	$array = $conn->query($sql);

	// Skriver ut
	echo '<table class="table table-responsive table-hover oversikt text-center">
			<thead>
				<tr>
					<th>Navn</th>
					<th>Rom</th>
					<th>Fra</th>
					<th>Til</th>
				</tr>
			</thead>
			<tbody>';

	if ($array->num_rows > 0) {
		while($row = $array->fetch_assoc()) {

			// Lager dato-objekt fra tidene i databasen
			$temp_fra = strtotime($row['booket_fra']);
			$temp_til = strtotime($row['booket_til']);

			$db_dag = date('dmy', $temp_fra);

			// Skaffer time og minutter
			$fra = date("H:i", $temp_fra);
			$til = date("H:i", $temp_til);

			// Sammenligner dagens dato og databasens. Skriver kun ut om disse er like
			if ($db_dag == $idag) {

				echo '<tr>
						<td>' . $row['fornavn'] . ' ' . $row['etternavn'] . '</td>
						<td>' . $row['romnr'] . '</td>
						<td>' . $fra . '</td>
						<td>' . $til . '</td>
					</tr>';

			}
		}
	}
	echo '</tbody></table>';
	$conn->close();
?>
