<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["role"]) || $_SESSION["role"] != 1) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once("./connect.php");

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["id"])) {
    echo json_encode(["error" => "Product ID missing."]);
    exit;
}

$id = intval($data["id"]);
$sql = "DELETE FROM Products WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => "Product deleted"]);
} else {
    echo json_encode(["error" => "Error deleting product"]);
}

$stmt->close();
$conn->close();
?>
