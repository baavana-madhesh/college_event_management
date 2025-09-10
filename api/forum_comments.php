<?php
require "db.php";

if ($_SERVER['REQUEST_METHOD']==='GET') {
  $post_id = intval($_GET['post_id'] ?? 0);
  $res = $conn->query("SELECT c.id,c.content,c.created_at,u.username,u.role
                       FROM forum_comments c JOIN users u ON u.id=c.user_id
                       WHERE c.post_id=$post_id ORDER BY c.created_at ASC");
  $out=[]; while($row=$res->fetch_assoc()) $out[]=$row;
  echo json_encode(["success"=>true,"comments"=>$out]); exit;
}

if ($_SERVER['REQUEST_METHOD']==='POST') {
  $b = jinput();
  $post_id=intval($b['post_id']??0);
  $user_id=intval($b['user_id']??0);
  $content=$conn->real_escape_string($b['content']??'');
  if(!$post_id || !$user_id || !$content){ echo json_encode(["success"=>false,"message"=>"Missing"]); exit; }
  $q="INSERT INTO forum_comments(post_id,user_id,content) VALUES($post_id,$user_id,'$content')";
  echo $conn->query($q) ? json_encode(["success"=>true]) : json_encode(["success"=>false,"message"=>"Comment failed"]);
}
