<?php

$host = 'localhost:3307';
$db = 'shop';
$user = 'root';
$pass = '978084';
$dbname = "products";
$conn = new mysqli($host,$user, $pass,$db);

if($conn->connect_error){
    die("connection error" . $conn->connect_error);

}
$sql = "SELECT * FROM products";
$result = $conn->query($sql);
$products = [];
if ($result->num_rows >0){
    while($row = $result->fetch_assoc()){
        $products[] = $row;
    }
}
echo json_encode($products);
$conn->close();
?>
