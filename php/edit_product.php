<?php
header("Content-Type: application/json");
session_start();

// Ensure only admins can edit
if (!isset($_SESSION["role"]) || $_SESSION["role"] != 1) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

require_once("./connect.php");

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data["id"], $data["field"], $data["value"])) {
    echo json_encode(["error" => "Invalid data"]);
    exit;
}

// Extract variables
$id = (int) $data["id"];
$field = $data["field"];
$value = trim($data["value"]);

// Sanitize field to prevent SQL injection (allow only specific column names)
$allowed_fields = ["Name", "Special_price", "Price", "Desciption", "Category"];
if (!in_array($field, $allowed_fields)) {
    echo json_encode(["error" => "Invalid field"]);
    exit;
}

// Prepare and execute update statement
$stmt = $conn->prepare("UPDATE Products SET $field = ? WHERE id = ?");
$stmt->bind_param("si", $value, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => "Product updated"]);
} else {
    echo json_encode(["error" => "Update failed"]);
}

// Close connections
$stmt->close();
$conn->close();
?>
