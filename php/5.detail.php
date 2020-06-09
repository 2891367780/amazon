<?php
//设置跨域的header
header('Access-Control-Allow-Origin:*');  //允许跨域的网址，*所有的网址。
header('Access-Control-Allow-Method:POST,GET'); //允许跨域的请求方式。
include "conn.php";

if (isset($_GET['sid'])) {
    $sid = $_GET['sid']; //接收首页传入的sid
    $result = $conn->query("select * from amazonlist where sid=$sid");
    echo json_encode($result->fetch_assoc());
}