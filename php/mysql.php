<?php
$host = 'tjener';
$user = 'brukernavn';
$pass = 'passord';
$db = 'database';

$conn = new mysqli($host, $user, $pass, $db);

$conn->set_charset("utf8");

if ($conn->connect_error) {
	echo $conn->connection_error;
}
?>