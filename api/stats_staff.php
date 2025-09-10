<?php
require "db.php";
/* GET ?staff_id= */
$staff_id = intval($_GET['staff_id'] ?? 0);

$eventsCount = 0; $regsCount = 0; $attendancePct = 0;

$r = $conn->query("SELECT COUNT(*) c FROM events WHERE created_by=$staff_id");
$eventsCount = ($r && $r->num_rows)? intval($r->fetch_assoc()['c']) : 0;

$r = $conn->query("SELECT COUNT(*) c FROM registrations r 
                   JOIN events e ON e.id=r.event_id WHERE e.created_by=$staff_id");
$regsCount = ($r && $r->num_rows)? intval($r->fetch_assoc()['c']) : 0;

$r = $conn->query("SELECT 
      SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) AS present,
      COUNT(*) AS total
    FROM attendance a
    JOIN events e ON e.id=a.event_id
    WHERE e.created_by=$staff_id");
if ($r && $r->num_rows) {
  $row = $r->fetch_assoc();
  $present = intval($row['present'] ?? 0);
  $total = intval($row['total'] ?? 0);
  $attendancePct = $total ? round(($present/$total)*100) : 0;
}
echo json_encode([
  "success"=>true,
  "events"=>$eventsCount,
  "registrations"=>$regsCount,
  "attendance"=>$attendancePct
]);
