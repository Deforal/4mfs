<?php
session_start();
header("Content-Type: application/json");
require_once("./connect.php");

$userID = intval($_SESSION["user_id"] ?? 0);

if ($userID === 0) {
    echo json_encode(["error" => "User not authenticated"]);
    exit;
}

$sql = $conn -> prepare("SELECT * FROM Offers WHERE User_id = ? and Stage = ?");
$stage = "в корзине";
$sql -> bind_param("is", $userID, $stage);

if ($sql -> execute()) {
    $result = $sql -> get_result();
    $offers = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(["success" => true, "data" => $offers]);
} else {
    echo json_encode(["error" => "error with getting data"]);
}
$sql -> close();
$conn -> close();
?>