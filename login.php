<?php
session_start();
header("Content-Type: application/json");
require_once "db.php"; // Database connection

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data["email"], $data["password"])) {
    echo json_encode(["error" => "Invalid credentials."]);
    exit;
}

$email = filter_var($data["email"], FILTER_SANITIZE_EMAIL);
$password = $data["password"];

$stmt = $conn->prepare("SELECT ID, Email, Name, Password, Role FROM Users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user["Password"])) {
    $_SESSION["user_id"] = $user["ID"];
    $_SESSION["role"] = $user["Role"];
    echo json_encode([
        "success" => "Logged in!",
        "user" => ["id" => $user["ID"], "name" => $user["Name"], "role" => $user["Role"]]
    ]);
} else {
    echo json_encode(["error" => "Wrong email or password."]);
}
$stmt->close();
$conn->close();
?>
