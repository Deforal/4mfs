<?php
header("Content-Type: application/json");
session_start();
require_once("./connect.php");

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["email"], $data["username"], $data["password"])) {
    echo json_encode(["error" => "Введенная информация не подходит."]);
    exit;
}

// Sanitize input
$email = filter_var($data["email"], FILTER_SANITIZE_EMAIL);
$username = htmlspecialchars($data["username"], ENT_QUOTES, 'UTF-8');
$password = $data["password"];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "Формат почты не подходит."]);
    exit;
}

// Check if user already exists
$stmt = $conn->prepare("SELECT * FROM Users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["error" => "Пользователь с такой почтой уже зарегестрирован."]);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Register user
$stmt = $conn->prepare("INSERT INTO Users (Email, Name, Password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $username, $hashed_password);

if ($stmt->execute()) {
    $stmt = $conn->prepare("SELECT ID, Name, Password, Role, Email, Phone FROM Users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        // If password is hashed in DB, verify it
        if (password_verify($password, $row["Password"])) {
            $_SESSION["user_id"] = $row["ID"];
            $_SESSION["user_name"] = $row["Name"];
            $_SESSION["role"] = $row["Role"];
            $_SESSION["phone"] =$row['Phone'];
            $_SESSION["email"] =$row['Email'];

            echo json_encode([
                "success" => "Регистрация прошла успешно",
                "user" => ["id" => $row["ID"], "name" => $row["Name"], "role" => $row["Role"]]
            ]);
        } 
    }
} else {
    echo json_encode(["error" => "Регистрация не прошла."]);
}

// Close connections
$stmt->close();
$conn->close();
?>
