<?php
header('content-type:text/html;charset=utf-8');
//1.php连接mysql
//连接数据库的类：mysqli(主机名,用户名,密码,数据库名称)
define('HOST', 'localhost'); //主机名
define('USERNAME', 'root'); //用户名
define('PASSWORD', 'root'); //密码
define('DBNAME', 'amazon'); //数据库名称
$conn = @new mysqli(HOST, USERNAME, PASSWORD, DBNAME);
//@符号：php的容错处理(一般情况是自己定义了错误类型，使用)。(js里面也有-try...catch...finally)
if ($conn->connect_error) {
    die('数据库连接错误' . $conn->connect_error);
}

//如果出现中文乱码，需要设置字符编码(数据库的数据)。
$conn->query('SET NAMES UTF8'); //执行括号里面的语句