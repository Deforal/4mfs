<?php
session_start();
header("Content-Type: application/json");
require_once("connect.php");
$user_id = intval($_SESSION["user_id"]);
$stage = 'в корзине';
$sql = "SELECT * FROM Offers WHERE Stage != ? AND $user_id = ?";
$data = $conn -> prepare($sql);
$data-> bind_param("si", $stage, $user_id);
$data->execute();
$rows = $data->get_result();
$array = array();
while ($row = $rows->fetch_assoc()) {
    $array[] = $row;
}
if ($array[0]) {
    echo json_encode(["success" => "Прошлые заказы получены", "data" => $array]);
} else {
    echo json_encode(["error" => "Couldnt get rows"]);
}
?>