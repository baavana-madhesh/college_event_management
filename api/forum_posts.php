<?php
require "db.php";

if ($_SERVER['REQUEST_METHOD']==='GET') {
  $res = $conn->query("SELECT fp.id, fp.title, fp.content, fp.created_at, u.username, u.role
                       FROM forum_posts fp JOIN users u ON u.id=fp.user_id
                       ORDER BY fp.created_at DESC");
  $out=[]; while($row=$res->fetch_assoc()) $out[]=$row;
  echo json_encode(["success"=>true,"posts"=>$out]); exit;
}

if ($_SERVER['REQUEST_METHOD']==='POST') {
  $b = jinput();
  $user_id=intval($b['user_id']??0);
  $title=$conn->real_escape_string($b['title']??'');
  $content=$conn->real_escape_string($b['content']??'');
  if(!$user_id || !$title || !$content){ echo json_encode(["success"=>false,"message"=>"Missing"]); exit; }
  $q="INSERT INTO forum_posts(user_id,title,content) VALUES($user_id,'$title','$content')";
  echo $conn->query($q) ? json_encode(["success"=>true]) : json_encode(["success"=>false,"message"=>"Create failed"]);
}
