<?php
require "db.php";
$body = jinput();
/*
  expects: title, description, date(YYYY-MM-DD), capacity, created_by (user id)
*/
$title = $conn->real_escape_string($body['title'] ?? '');
$description = $conn->real_escape_string($body['description'] ?? '');
$date = $conn->real_escape_string($body['date'] ?? '');
$capacity = intval($body['capacity'] ?? 100);
$created_by = intval($body['created_by'] ?? 0);

if (!$title || !$date || !$created_by) {
  echo json_encode(["success"=>false,"message"=>"Missing fields"]); exit;
}

$q = "INSERT INTO events (title, description, date, capacity, created_by)
      VALUES ('$title', '$description', '$date', $capacity, $created_by)";
if ($conn->query($q)) {
  echo json_encode(["success"=>true, "id"=>$conn->insert_id]);
} else {
  echo json_encode(["success"=>false, "message"=>"Failed to create"]);
}
