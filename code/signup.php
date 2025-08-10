<?php

$host = 'localhost:3307';
$db = 'shop';
$user = 'root';
$pass = '978084';
$dbname = "users";
$conn = new mysqli($host,$user, $pass,$db);

if($conn->connect_error){
    die("connection error" . $conn->connect_error);

}
if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $username = trim($_POST['username']);
    $password = trim(password_hash($_POST['password'],PASSWORD_DEFAULT));
    $email = trim($_POST['email']);

    if (empty($username) || empty($password) || empty($email)) {
        echo "All fields are required!";
        exit;
    }
    if (!filter_var($email,FILTER_VALIDATE_EMAIL)) {
        echo"Invalid email format!";
        exit;
    }
}
$sql = "SELECT * FROM users WHERE email='$email'";
$result = mysqli_query($conn,$sql);

if (mysqli_num_rows($result) >0){
    echo "account already exists!";
}else{
    $insert = "INSERT INTO users (username, password, email) VALUES ('$username','$password','$email')";
    if (mysqli_query($conn, $insert)){
        echo "Register success!";
    }else{
        echo "Register failed!";
    }
}

?>
