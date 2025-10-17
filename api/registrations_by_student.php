<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Include DB connection
include 'db.php'; // <- use your existing db.php

// Get student_id safely
$student_id = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;

if ($student_id === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid student ID."
    ]);
    exit;
}

// Query registrations
$sql = "SELECT e.* FROM event_register r 
        JOIN events_list e ON r.event_id = e.id 
        WHERE r.student_id = $student_id";
$result = $conn->query($sql);

$events = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
    echo json_encode([
        "success" => true,
        "events" => $events
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "DB error or invalid student ID."
    ]);
}
?>
