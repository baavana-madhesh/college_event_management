<?php
include('db.php');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['student_id'])) {
    echo json_encode(["status" => "error", "message" => "Student ID missing"]);
    exit;
}

$student_id = $data['student_id'];
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$department = $data['department'] ?? '';

$sql = "UPDATE students 
        SET name=?, email=?, phone=?, department=?
        WHERE id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssi", $name, $email, $phone, $department, $student_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Profile updated successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update profile"]);
}

$stmt->close();
$conn->close();
?>
