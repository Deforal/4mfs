<?php
session_start();
header("Content-Type: application/json");

// Database connection
$servername = "localhost";
$username = "root";
$password = ""; // Change this if needed
$dbname = "ZOP";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Ошибка подключения к базе данных."]));
}

// Get JSON data
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data || !isset($data["email"], $data["password"])) {
    echo json_encode(["error" => "Неверные данные."]);
    exit;
}

// Sanitize input
$email = filter_var($data["email"], FILTER_SANITIZE_EMAIL);
$password = $data["password"];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "Неверный формат email."]);
    exit;
}

// Get user from database
$stmt = $conn->prepare("SELECT ID, Name, Password, Role FROM Users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    // If password is hashed in DB, verify it
    if (password_verify($password, $row["Password"])) {
        $_SESSION["user_id"] = $row["ID"];
        $_SESSION["user_name"] = $row["Name"];
        $_SESSION["role"] = $row["Role"];

        echo json_encode([
            "success" => "Вы вошли",
            "user" => ["id" => $row["ID"], "name" => $row["Name"], "role" => $row["Role"]]
        ]);
    } else {
        echo json_encode(["error" => "Неправильный пароль."]);
    }
} else {
    echo json_encode(["error" => "Пользователь не найден."]);
}

// Close connections
$stmt->close();
$conn->close();
?>
