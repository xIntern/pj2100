<?php

	function check_input($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
	}
    // Sjekker om variablene er tomme
	if (empty($_POST['brukernavn']) || empty($_POST['passord'])) {
		// die('Noen/alle argumenter mangler');
        header('location:/pj2100');
	} else {

        require 'mysql.php';

        // Sender inn variablene til metoden "check_input" for modifiserer strengene for å
        // forhindre SQL-injection.
        // Strengene blir endret til små bokstaver, bortsett fra passord, da fornavnet
        // som ligger i databasen blir brukt som passord. Dette er ikke en god løsning,
        // men da dette er en skoleoppgave, syns jeg det holder i massevis :)
        $brukernavn = check_input(strtolower($_POST['brukernavn']));
        $passord = check_input(ucfirst(strtolower($_POST['passord'])));

        // Legger til mailen bak brukernavnet
        $brukernavn .= '@student.westerdals.no';

        $sql = "SELECT bruker_id, fornavn, epost FROM bruker WHERE epost = '".$brukernavn."' AND fornavn = '".$passord."' LIMIT 1";

        $array = $conn->query($sql);

        if ($array->num_rows > 0) {
            while($row = $array->fetch_assoc()) {
                if (isset($row['bruker_id'])) {
                    // Lager en cookie som inneholder en kryptert bruker-id.
                    setcookie('user_id', sha1($row['bruker_id']), time() + (86400 * 7), "/pj2100");
                    // Sender bruker tilbake til siden
                    header('location:/pj2100');
                }
            }
        }
        $conn->close();
    }

?>
