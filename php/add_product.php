<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["role"]) || $_SESSION["role"] != 1) {
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ZOP";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed."]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["name"], $data["price"], $data["desc"], $data["category"])) {
    echo json_encode(["error" => "Missing product data."]);
    exit;
}

$name = $data["name"];
$special_price = isset($data["special_price"]) ? $data["special_price"] : null;
$price = $data["price"];
$desc = isset($data["desc"]) ? $data["desc"] : null;
$category = $data["category"];

$sql = "INSERT INTO Products (Name, Special_price, Price, Desciption, Category) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sddss", $name, $special_price, $price, $desc, $category);

if ($stmt->execute()) {
    echo json_encode(["success" => "Product added"]);
} else {
    echo json_encode(["error" => "Error adding product"]);
}

$stmt->close();
$conn->close();
?>
