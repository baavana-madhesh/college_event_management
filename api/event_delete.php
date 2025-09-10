<?php
require "db.php";
$body = jinput();
$event_id = intval($body['event_id'] ?? 0);
if ($event_id<=0) { echo json_encode(["success"=>false,"message"=>"Invalid id"]); exit; }
if ($conn->query("DELETE FROM events WHERE id=$event_id")) {
  echo json_encode(["success"=>true]);
} else {
  echo json_encode(["success"=>false,"message"=>"Delete failed"]);
}
