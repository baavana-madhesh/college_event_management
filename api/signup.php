<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

require "db.php";

$body = json_decode(file_get_contents("php://input"), true);

$full_name = $conn->real_escape_string($body['full_name'] ?? '');
$dept = $conn->real_escape_string($body['dept'] ?? '');
$role = $conn->real_escape_string($body['role'] ?? '');
$username = $conn->real_escape_string($body['username'] ?? '');
$password = md5($body['password'] ?? '');

if (!$full_name || !$dept || !$role || !$username || !$password) {
  echo json_encode(["success" => false, "message" => "All fields are required"]);
  exit();
}

// Check if username already exists
$check = $conn->query("SELECT id FROM users WHERE username='$username'");
if ($check && $check->num_rows > 0) {
  echo json_encode(["success" => false, "message" => "Username already exists"]);
  exit();
}

// Insert new user
$q = "INSERT INTO users (username, password, full_name, dept, role)
      VALUES ('$username', '$password', '$full_name', '$dept', '$role')";

if ($conn->query($q)) {
  echo json_encode(["success" => true, "message" => "Signup successful"]);
} else {
  echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
}
?>
