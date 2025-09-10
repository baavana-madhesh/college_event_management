<?php
require "db.php";
/*
  Optional query params:
   - scope=all | mine
   - created_by=USER_ID (used when scope=mine)
*/
$scope = $_GET['scope'] ?? 'all';
$created_by = intval($_GET['created_by'] ?? 0);

if ($scope === 'mine' && $created_by > 0) {
  $q = "SELECT e.*, 
           (SELECT COUNT(*) FROM registrations r WHERE r.event_id=e.id) AS registered
        FROM events e WHERE e.created_by=$created_by ORDER BY e.date DESC";
} else {
  $q = "SELECT e.*, 
           (SELECT COUNT(*) FROM registrations r WHERE r.event_id=e.id) AS registered
        FROM events e ORDER BY e.date DESC";
}
$res = $conn->query($q);
$data = [];
while ($row = $res->fetch_assoc()) { $data[] = $row; }
echo json_encode(["success"=>true,"events"=>$data]);
