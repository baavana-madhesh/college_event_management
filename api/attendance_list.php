<?php
// Allow React (or any frontend) to access this API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Include config for DB connection
include 'db.php';

// Check if $conn exists
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

// Fetch attendance records
$sql = "SELECT * FROM attendance WHERE student_id = '$student_id'";
$result = $conn->query($sql);

$records = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $records[] = $row;
    }
    echo json_encode([
        "success" => true,
        "records" => $records
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Query failed: " . $conn->error
    ]);
}
?>
