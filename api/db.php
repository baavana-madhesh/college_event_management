<?php
// db.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$host = "localhost";
$user = "root";
$pass = ""; // XAMPP default is empty
$db   = "college_events";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["success"=>false,"message"=>"DB connection failed"]);
  exit;
}

function jinput() {
  return json_decode(file_get_contents("php://input"), true) ?? [];
}
