<?php
session_start();
header("Content-Type: application/json");
require_once("./connect.php");

$data = json_decode(file_get_contents("php://input"), true);

$stage = "в корзине";
$userID = intval($_SESSION['user_id']);
if ($data == "all") {
    $statment = "DELETE FROM Offers WHERE User_id = ? AND Stage = ?";
    $sql = $conn -> prepare($statment);
    $sql -> bind_param("is", $userID, $stage);
} else {
    $statment = "DELETE FROM Offers WHERE Product_id = ? AND User_id = ? AND Stage = ?";
    $sql = $conn -> prepare($statment);
    $sql -> bind_param("iis", $data, $userID, $stage);
}
if ($sql -> execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Issue with DB"]);
}

$sql -> close();
$conn -> close();
?>