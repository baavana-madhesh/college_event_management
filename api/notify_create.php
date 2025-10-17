<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'config.php';

if (!isset($conn)) {
    echo json_encode(["success" => false, "message" => "DB connection failed."]);
    exit;
}

// Read POST JSON
$data = json_decode(file_get_contents("php://input"), true);
$student_id = $data['student_id'] ?? 'all';
$title = $data['title'] ?? '';
$message = $data['message'] ?? '';

if (!$title || !$message) {
    echo json_encode(["success" => false, "message" => "Title or message missing."]);
    exit;
}

$sql = "INSERT INTO notifications (student_id, title, message) VALUES ('$student_id', '$title', '$message')";

if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Notification sent successfully."]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}
?>
