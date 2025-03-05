<?php
session_start();
header("Content-Type: application/json");

require_once("./connect.php");

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    die(json_encode("error", "Не предоставлен id"));
}
echo($data);

$itemID = intval($data);
$userID = intval($_SESSION["user_id"]);
$stage = "в корзине";

$sql = $conn->prepare("INSERT INTO Offers (User_id, Product_id, Stage) VALUES (?, ?, ?)");
$sql->bind_param("iis", $userID, $itemID, $stage);

if ($sql -> execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Ошибка при добавлении товара"]);
}

$sql -> close();
$conn -> close();

?>