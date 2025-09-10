<?php
require "db.php";
/* expects: event_id, student_id */
$body = jinput();
$event_id = intval($body['event_id'] ?? 0);
$student_id = intval($body['student_id'] ?? 0);

if ($event_id<=0 || $student_id<=0) {
  echo json_encode(["success"=>false,"message"=>"Missing fields"]); exit;
}

$q = "INSERT INTO registrations (event_id, student_id) VALUES ($event_id, $student_id)";
if ($conn->query($q)) {
  echo json_encode(["success"=>true]);
} else {
  // duplicate registration -> ignore as success
  if ($conn->errno == 1062) echo json_encode(["success"=>true,"message"=>"Already registered"]);
  else echo json_encode(["success"=>false,"message"=>"Registration failed"]);
}
