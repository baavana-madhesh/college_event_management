<?php
require "db.php";
/* expects: message, target('all'|'staff'|'students'), created_by */
$body = jinput();
$msg = $conn->real_escape_string($body['message'] ?? '');
$target = $conn->real_escape_string($body['target'] ?? 'all');
$by = intval($body['created_by'] ?? 0);

if (!$msg || !$by) { echo json_encode(["success"=>false,"message"=>"Missing"]); exit; }

$q = "INSERT INTO notifications (message, target, created_by) VALUES ('$msg', '$target', $by)";
echo $conn->query($q) ? json_encode(["success"=>true]) : json_encode(["success"=>false,"message"=>"Send failed"]);
