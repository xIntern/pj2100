<?php
	require_once 'mysql.php';

	if (empty($_POST['romnr']) ||
		empty($_POST['brukerid']) ||
		empty($_POST['fra']) ||
		empty($_POST['til'])) {
		echo 'Noen/alle argumenter mangler';
	} else {
		$romnr = $_POST['romnr'];
		$brukerid = $_POST['brukerid'];
		$fra = $_POST['fra'];
		$til = $_POST['til'];

		$sql = "INSERT INTO booking (romnr, bruker_id, booket_fra, booket_til)
				VALUES (".$romnr.", (SELECT bruker_id FROM bruker WHERE SHA1(bruker_id) = '".$brukerid."'), '".$fra."', '".$til."')";

		if ($conn->query($sql) === TRUE) {
			// header('location:/pj2100');
		} else {
		    echo "Error: " . $conn->error;
		}
	}
	$conn->close();
?>
