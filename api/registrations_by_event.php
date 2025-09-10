<?php
require "db.php";
/* GET ?event_id= */
$event_id = intval($_GET['event_id'] ?? 0);
$q = "SELECT r.id, u.id AS student_id, u.username, u.full_name, u.dept
      FROM registrations r 
      JOIN users u ON u.id=r.student_id
      WHERE r.event_id=$event_id
      ORDER BY u.username";
$res = $conn->query($q);
$out=[]; while($row=$res->fetch_assoc()) $out[]=$row;
echo json_encode(["success"=>true,"registrations"=>$out]);
