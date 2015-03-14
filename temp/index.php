<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>PJ2100 - Oversikt</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="../css/bootstrap.min.css">
	<link rel="stylesheet" href="../css/style.css">
</head>
<body>

	<div class="container temp">
		<div class="row">
			<div class="col-lg-2"></div>
			<div class="col-lg-8">
				<div class="well text-center">
					<?php
						require '../php/mysql.php';

						$sql = 'SELECT fornavn, etternavn, bo.romnr, booket_fra, booket_til
								FROM booking bo
								INNER JOIN rom r ON r.romnr = bo.romnr
								INNER JOIN bruker br ON br.bruker_id = bo.bruker_id';

						$array = $conn->query($sql);


						if ($array->num_rows > 0) {
							while($row = $array->fetch_assoc()) {

								$temp_fra = strtotime($row['booket_fra']);
								$temp_til = strtotime($row['booket_til']);

								$fra = date("D d-m H:i:s", $temp_fra);
								$til = date("D d-m H:i:s", $temp_til);

								echo '<p>' . $row['fornavn'] . ' ' . $row['etternavn'] . ' har booket romnr: <strong>' . $row['romnr'] . '</strong> fra ' . $fra . ' til ' . $til . '</p>';
							}
						}
						$conn->close();
					?>
				</div>
			</div>
			<div class="col-lg-2"></div>
		</div>
	</div>
	
</body>
</html>