<?php
session_start();
header("Content-Type: application/json");
require_once("connect.php");
$data = intval(json_decode(file_get_contents("php://input"), true));
if (!$data) {
    echo json_encode(["error" => "Didnt recieve data"]);
    exit;
}
$user = intval($_SESSION['user_id']);
$stage = "в корзине";
$check = $conn -> prepare("SELECT * FROM Offers WHERE Product_id=? AND Stage=? AND User_id = ?");
$check -> bind_param("isi", $data, $stage, $user);
$check -> execute();
$result = $check -> get_result();
if ($row = $result -> fetch_assoc()) {
    if ($row['Count'] <= 1) {
        echo json_encode(["error" => "Cant decrease amount"]);
        exit;
    }
    $count = intval($row['Count'])-1;
    $array = array();
    $array['Count'] = $count;
    $update = $conn -> prepare("UPDATE Offers SET Count=? WHERE Product_id=? AND Stage=? AND User_id = ?");
    $update -> bind_param("iisi", $count, $data, $stage, $user);
    if ($update -> execute()) {
        echo json_encode(["success" => "Amount decreased", "data" => $array]);
    } else {
        echo json_encode(["error" => "Amount decreased"]);
    }
}
$conn -> close();

?>