<?php
session_start();
header("Content-Type:application/JSON");
require_once("./connect.php");
$data = json_decode(file_get_contents("php://input"), true);

$userID = intval($_SESSION['user_id']);
$inCart = "в корзине";
$inProcess = "в обработке";

if ($data =="all") {
    $statment = "UPDATE Offers SET Stage = ? WHERE User_id = ? AND Stage = ?";
    $sql = $conn -> prepare($statment);
    $sql -> bind_param("sis", $inProcess, $userID, $inCart);
} else {
    $statment = "UPDATE Offers SET Stage = ? WHERE User_id = ? AND Product_id = ? AND Stage = ?";
    $sql = $conn -> prepare($statment);
    $sql -> bind_param("siis", $inProcess, $userID, intval($data), $inCart);
}

$sql->execute();


if ($sql->affected_rows > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Корзина пуста"]);
}

$sql -> close();
$conn -> close();
?>