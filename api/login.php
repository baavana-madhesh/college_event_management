<?php
// Allow requests from React (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include DB connection
require "db.php";  // <-- make sure db.php is inside api/ folder

// Read JSON input from React
$body = json_decode(file_get_contents("php://input"), true);

$username = $conn->real_escape_string($body['username'] ?? '');
$password = md5($body['password'] ?? ''); // Hash password
$role     = $conn->real_escape_string($body['role'] ?? '');

// Query database
$q = "SELECT id, username, role 
      FROM users 
      WHERE username='$username' 
        AND password='$password' 
        AND role='$role' 
      LIMIT 1";

$res = $conn->query($q);

if ($res && $res->num_rows === 1) {
    $user = $res->fetch_assoc();
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}
