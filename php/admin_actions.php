<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["role"]) || $_SESSION["role"] != 1) {
    echo json_encode(["error" => "Доступ запрещён"]);
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ZOP";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Ошибка подключения к базе данных."]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["action"])) {
    echo json_encode(["error" => "Неверные данные."]);
    exit;
}

switch ($data["action"]) {
    case "add":
        if (!isset($data["name"], $data["price"], $data["description"])) {
            echo json_encode(["error" => "Все поля должны быть заполнены."]);
            exit;
        }
        $stmt = $conn->prepare("INSERT INTO Products (Name, Special_price Price, Description, Category) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $data["name"], $data["price"], $data["description"]);
        echo json_encode($stmt->execute() ? ["success" => "Продукт добавлен."] : ["error" => "Ошибка добавления."]);
        $stmt->close();
        break;

    case "update":
        if (!isset($data["id"], $data["name"], $data["price"], $data["description"])) {
            echo json_encode(["error" => "Неверные данные."]);
            exit;
        }
        $stmt = $conn->prepare("UPDATE Products SET Name=?, Price=?, Description=? WHERE ID=?");
        $stmt->bind_param("sssi", $data["name"], $data["price"], $data["description"], $data["id"]);
        echo json_encode($stmt->execute() ? ["success" => "Продукт обновлён."] : ["error" => "Ошибка обновления."]);
        $stmt->close();
        break;

    case "delete":
        if (!isset($data["id"])) {
            echo json_encode(["error" => "Неверные данные."]);
            exit;
        }
        $stmt = $conn->prepare("DELETE FROM Products WHERE ID=?");
        $stmt->bind_param("i", $data["id"]);
        echo json_encode($stmt->execute() ? ["success" => "Продукт удалён."] : ["error" => "Ошибка удаления."]);
        $stmt->close();
        break;

    default:
        echo json_encode(["error" => "Неверное действие."]);
}

$conn->close();
?>
