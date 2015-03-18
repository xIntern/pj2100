<?php
	require_once 'mysql.php';

	// Får verdier via POST fra AJAX
	$kapasitet = $_POST['kapasitet'];
	$projektor = $_POST['projektor'];
	$pc = $_POST['pc'];
	$tavle = $_POST['tavle'];

	$sql = "SELECT * FROM rom";

	// Lager array for søkefilter
	$filter = array();

	// Legger kun til i array hvis kapasitet er satt
	if (!is_null($kapasitet)) {
		$filter[] = 'kapasitet = ' . $kapasitet;
	}
	// Legger til i array hvis variablen er TRUE/1
	if ($projektor) {
		$filter[] = 'projektor = 1';
	}
	// Legger til i array hvis variablen er TRUE/1
	if ($pc) {
		$filter[] = 'pc = 1';
	}
	// Legger til i array hvis variablen er TRUE/1
	if ($tavle) {
		$filter[] = 'tavle = 1';
	}
	// Legg til filterene i query-variablen
	if (count($filter) > 0) {
		$sql .= ' WHERE ' . implode(' AND ', $filter) . ' ORDER BY projektor ASC, romnr ASC';
	}

	echo '<table class="table table-striped table-hover result">
			<thead>
				<tr>
					<th>Romnr.</th><th>Kapasitet</th><th>Projektor</th><th>PC</th><th>Tavle</th>
				</tr>
			</thead><tbody>';
						

	$array = $conn->query($sql);
	
	if ($array->num_rows > 0) {
	    while($row = $array->fetch_assoc()) {
	    	// Endrer tall til tekst
	    	$pro = ($row['projektor'] != 0) ? 'Ja' : 'Nei' ;
	    	$comp = ($row['pc'] != 0) ? 'Ja' : 'Nei' ;
	    	$bla = ($row['tavle'] != 0) ? 'Ja' : 'Nei' ;

	    	// Skriver ut
	        echo '<tr>
		        <td id="rom">' . $row['romnr'] . '</td>
		        <td>' . $row['kapasitet'] . '</td>
		        <td>' . $pro . '</td>
		        <td>' . $comp . '</td>
		        <td>' . $bla . '</td>
	        </tr>';
	    }
	}
	echo '</tbody></table>';
	$conn->close();
?>
