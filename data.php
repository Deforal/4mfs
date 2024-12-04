<?php
// data.php
header('Content-Type: application/json'); // Set the content type to JSON

$servername = "localhost";
$username = "root";
$password = ""; // No password
$dbname = "ZOP";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to fetch data from the Products table
$sql = "SELECT * FROM Products"; // Ensure that the table name is correct
$result = $conn->query($sql);
$data = array();

if ($result->num_rows > 0) {
    // Fetch all rows
    while($row = $result->fetch_assoc()) {
        array_push($data, $row);
    }
}

// Close connection
$conn->close();

// Return JSON data
echo json_encode($data);
?>