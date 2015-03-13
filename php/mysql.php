<?php
$host = 'localhost';
$user = 'root';
$pass = 'wB6JE4M6P8SazDGB';
$db = 'prosjekt_pj2100';

$conn = new mysqli($host, $user, $pass, $db);

$conn->set_charset("utf8");

if ($conn->connect_error) {
	echo $conn->connection_error;
}
?>