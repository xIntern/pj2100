<?php
	$idag = date('dmy');
	require '../php/mysql.php';

	$sql = 'SELECT fornavn, etternavn, bo.romnr, booket_fra, booket_til
			FROM booking bo
			INNER JOIN rom r ON r.romnr = bo.romnr
			INNER JOIN bruker br ON br.bruker_id = bo.bruker_id
			ORDER BY bo.romnr ASC, booket_fra ASC';

	$array = $conn->query($sql);


	if ($array->num_rows > 0) {
		while($row = $array->fetch_assoc()) {

			$temp_fra = strtotime($row['booket_fra']);
			$temp_til = strtotime($row['booket_til']);

			$db_dag = date('dmy', $temp_fra);

			$fra = date("D d-m H:i:s", $temp_fra);
			$til = date("D d-m H:i:s", $temp_til);

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
	$conn->close();
?>