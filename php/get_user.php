<?php

	function check_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
	}

	require 'mysql.php';

	$brukernavn = check_input(strtolower($_POST['brukernavn']));
	$passord = check_input(ucfirst(strtolower($_POST['passord'])));

	$brukernavn .= '@student.westerdals.no';

	$sql = "SELECT bruker_id, fornavn, epost FROM bruker WHERE epost = '".$brukernavn."' AND fornavn = '".$passord."' LIMIT 1";

	$array = $conn->query($sql);

	if ($array->num_rows > 0) {
	    while($row = $array->fetch_assoc()) {
	    	if (isset($row['bruker_id'])) {
	    		setcookie('user_id', hash(sha1, $row['bruker_id']), time() + (86400 * 7), "/");
	    	}
	    }
	}
	$conn->close();

?>
