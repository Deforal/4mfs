<?php
$host = "localhost";
$login = "root";
$password = "";
$db = "ZOP";

$conn = new mysqli($host, $login, $password, $db);

if ($conn -> connect_error) {
    die(json_encode("error", "Ошибка подключения к БД"));
}
?>