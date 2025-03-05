<?php
session_start();
header("Content-Type: application/json");

require_once("./connect.php");

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    die(json_encode(["error" => "Не предоставлен id"]));
}

$itemID = intval($data);
$userID = intval($_SESSION["user_id"]);
$stage = "в корзине";

// Check if the item is already in the cart
$checkSql = $conn->prepare("SELECT Count FROM Offers WHERE User_id = ? AND Product_id = ? AND Stage = ?");
$checkSql->bind_param("iis", $userID, $itemID, $stage);
$checkSql->execute();
$result = $checkSql->get_result();
$checkSql->close();

if ($row = $result->fetch_assoc()) {
    // Item exists, increase the count
    $newCount = $row['Count'] + 1;
    $updateSql = $conn->prepare("UPDATE Offers SET Count = ? WHERE User_id = ? AND Product_id = ? AND Stage = ?");
    $updateSql->bind_param("iiis", $newCount, $userID, $itemID, $stage);
    $success = $updateSql->execute();
    $updateSql->close();
} else {
    // Item does not exist, insert a new one with count = 1
    $insertSql = $conn->prepare("INSERT INTO Offers (User_id, Product_id, Stage) VALUES (?, ?, ?)");
    $insertSql->bind_param("iis", $userID, $itemID, $stage);
    $success = $insertSql->execute();
    $insertSql->close();
}

$conn->close();

if ($success) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Ошибка при добавлении товара"]);
}
?>
