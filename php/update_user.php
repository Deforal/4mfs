<?php
header("Content-Type: application/json");
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = ""; // Change this if needed
$dbname = "ZOP";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Ошибка подключения к базе данных."]));
}

// Check if the user is logged in
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "Вы не авторизованы."]);
    exit;
}

$user_id = $_SESSION["user_id"];

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["field"], $data["value"])) {
    echo json_encode(["error" => "Некорректные данные."]);
    exit;
}

$field = $data["field"];
$value = trim($data["value"]);

// Validate input
if ($field === "Email") {
    $value = filter_var($value, FILTER_SANITIZE_EMAIL);
    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "Некорректный формат email."]);
        exit;
    }
    $sql = "UPDATE Users SET Email = ? WHERE ID = ?";
} elseif ($field === "Phone") {
    if (!preg_match("/^\+?[0-9]{10,15}$/", $value)) {
        echo json_encode(["error" => "Некорректный формат телефона."]);
        exit;
    }
    $sql = "UPDATE Users SET Phone = ? WHERE ID = ?";
} else {
    echo json_encode(["error" => "Неверное поле для обновления."]);
    exit;
}

// Update the database
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $value, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => "Данные обновлены.", "newValue" => $value]);
    if ($field === "Email") {
        $_SESSION["email"] = $value;
    } else {
        $_SESSION["phone"] = $value;
    }
} else {
    echo json_encode(["error" => "Ошибка обновления."]);
}

// Close connections
$stmt->close();
$conn->close();
?>
