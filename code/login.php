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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $email = trim($_POST['email']);

//    if (empty($username) || empty($password) || empty($email)) {
//        echo "All fields are required!";
//        exit;
//    }
//
//    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
//        echo "Invalid email format!";
//        exit;
//    }
    if (empty($username) || empty($password) || empty($email)) {
        echo json_encode(['status' => 'error', 'msg' => 'All fields are required!']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'msg' => 'Invalid email format!']);
        exit;
    }

    // search databas
//    $sql = "SELECT * FROM users WHERE username='$username' AND email='$email'";
//    $result = mysqli_query($conn, $sql);
//
//    if ($row = mysqli_fetch_assoc($result)) {
//        if (password_verify($password, $row['password'])){
//            session_start();
//            $_SESSION['user_id'] = $row['id'];
//            $_SESSION['username'] = $username;
//            echo json_encode(['status'=>'success', 'msg'=>'Login success!']);
//        }else {
//            echo "Invalid password!";
//        }
//
//
//    }
//    else{
//        echo "Invalid username or email!";
//    }
    $sql = "SELECT * FROM users WHERE username=? AND email=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ss', $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($password, $row['password'])) {
            session_start();
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $username;
            echo json_encode(['status' => 'success', 'msg' => 'Login success!']);
        } else {
            echo json_encode(['status' => 'error', 'msg' => 'Invalid password!']);
        }
    } else {
        echo json_encode(['status' => 'error', 'msg' => 'Invalid username or email!']);
    }
}
?>