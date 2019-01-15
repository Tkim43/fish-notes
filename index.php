<?php
require_once('mysql_credentials.php');

$output = [
    "success" => true,
    "number" => 11,
    "code" => "code"
];

$json_output = json_encode($output);
print($json_output);

?>