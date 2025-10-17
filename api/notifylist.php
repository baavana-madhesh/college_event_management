<?php
// Allow frontend to access this API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Include config for DB connection
include 'config.php';

// Check DB connection
if (!isset($conn)) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection not found."
    ]);
    exit;
}

// Get student_id safely
$student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;

if ($student_id === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid student ID."
    ]);
    exit;
}

// Fetch notifications
$sql = "SELECT * FROM notifications 
        WHERE student_id = '$student_id' OR student_id = 'all' 
        ORDER BY id DESC";

$result = $conn->query($sql);

$notifications = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
    }
    echo json_encode([
        "success" => true,
        "notifications" => $notifications
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Query failed: " . $conn->error
    ]);
}
?>
