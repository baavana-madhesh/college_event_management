<?php
require "db.php";
/* expects: event_id, student_id, status('present'|'absent'), marked_by */
$body = jinput();
$event_id = intval($body['event_id'] ?? 0);
$student_id = intval($body['student_id'] ?? 0);
$status = ($body['status'] ?? '') === 'present' ? 'present' : 'absent';
$marked_by = intval($body['marked_by'] ?? 0);

if (!$event_id || !$student_id || !$marked_by) {
  echo json_encode(["success"=>false,"message"=>"Missing fields"]); exit;
}

$q = "INSERT INTO attendance (event_id, student_id, status, marked_by)
      VALUES ($event_id, $student_id, '$status', $marked_by)
      ON DUPLICATE KEY UPDATE status=VALUES(status), marked_by=VALUES(marked_by), marked_at=CURRENT_TIMESTAMP";

if ($conn->query($q)) echo json_encode(["success"=>true]);
else echo json_encode(["success"=>false,"message"=>"Failed to mark"]);
