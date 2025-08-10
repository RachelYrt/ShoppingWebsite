<?php

session_start();
$host = 'localhost:3307';
$db = 'shop';
$user = 'root';
$pass = '978084';
$dbname = "users";
$conn = new mysqli($host,$user, $pass,$db);
if($conn->connect_error){
    die("connection error" . $conn->connect_error);

}


if(!isset($_SESSION['user_id'])){
    die(json_encode(['status'=>'error','msg'=>'Not logged in']));

}

$user_id = intval($_SESSION['user_id']);
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'add':
        $product_id =  $_POST['product_id'];
        $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;
        if ($product_id <= 0) {
            die(json_encode(['status' => 'error', 'msg' => 'Invalid product']));
        }

        // 查询是否已有该商品
        $stmt = $conn->prepare("SELECT * FROM cart WHERE user_id=? AND product_id=?");
        $stmt->bind_param('ii', $user_id, $product_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $update = $conn->prepare("UPDATE cart SET quantity=quantity+? WHERE user_id=? AND product_id=?");
            $update->bind_param('iii', $quantity, $user_id, $product_id);
            $update->execute();
        } else {
            $insert = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
            $insert->bind_param('iii', $user_id, $product_id, $quantity);
            $insert->execute();
        }

        echo json_encode(['status' => 'success', 'msg' => 'Added to cart!']);
        break;

    case 'get':
        $sql = "SELECT cart.*, products.name, products.image, products.price, products.unit_quantity, products.in_stock 
                FROM cart
                JOIN products ON cart.product_id = products.id
                WHERE cart.user_id=?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $cart = [];
        while ($row = $result->fetch_assoc()) {
            $cart[] = $row;
        }

        echo json_encode(['status' => 'success', 'data' => $cart]);
        break;
    case 'update':
        $product_id = $_POST['product_id'];
        $quantity = $_POST['quantity'];
        $stmt = $conn->prepare("UPDATE cart SET quantity=? WHERE user_id=? AND product_id=?");
        $stmt->bind_param('iii', $quantity, $user_id, $product_id);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'msg' => 'Updated']);
        break;


    case 'remove':
        $product_id = $_POST['product_id'];
        $stmt = $conn->prepare("DELETE FROM cart WHERE user_id=? AND product_id=?");
        $stmt->bind_param('ii', $user_id, $product_id);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'msg' => 'Removed']);
        break;


    case 'clear':
        $stmt = $conn->prepare("DELETE FROM cart WHERE user_id=?");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        echo json_encode(['status' => 'success', 'msg' => 'Cart Cleared']);
        break;

    default:
        echo json_encode(['status' => 'error', 'msg' => 'Invalid action']);


}
?>