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
    die(json_encode(['status' => 'error', 'msg' => 'user is not logged i']));
}
$user_id = intval($_SESSION['user_id']);

$type = isset($_POST['type']) ? $_POST['type'] : 'delivery';

if ($type == 'collection') {
    $collectName = $_POST['collectName'];
    $store = $_POST['store'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];

    // check stock info
    $sql = "SELECT cart.*, products.name, products.in_stock FROM cart JOIN products ON cart.product_id=products.id WHERE cart.user_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()){
        if($row['quantity'] > $row['in_stock']){
            die(json_encode([
                'status' =>'error',
                'msg' => "item {$row['name']} insufficient stock (remaining: {$row['in_stock']})"
            ]));
        }
    }
    // update stock
    $result->data_seek(0);
    while($row = $result->fetch_assoc()){
        $new_stock = $row['in_stock'] - $row['quantity'];
        $updateStock = $conn->prepare("UPDATE products SET in_stock=? WHERE id=?");
        $updateStock->bind_param('ii', $new_stock, $row['product_id']);
        $updateStock->execute();
    }
    // empty cart info
    $clearCart = $conn->prepare("DELETE FROM cart WHERE user_id=?");
    $clearCart->bind_param('i', $user_id);
    $clearCart->execute();

    echo json_encode([
        'status' => 'success',
        'msg' => "Collection order placed successfully!\n\nCollection information:\nName: $collectName\nStore: $store\nPhone: $phone\nEmail: $email"
    ]);
} else {
    $receiptName = $_POST['receiptName'];
    $street = $_POST['street'];
    $city = $_POST['city'];
    $state = $_POST['state'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];

    $sql = "SELECT cart.*, products.name, products.in_stock FROM cart JOIN products ON cart.product_id=products.id WHERE cart.user_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        if ($row['quantity'] > $row['in_stock']) {
            die(json_encode([
                'status' => 'error',
                'msg' => "item {$row['name']} insufficient stock (remaining: {$row['in_stock']})"
            ]));
        }
    }
//    update stock
    $result->data_seek(0);
    while ($row = $result->fetch_assoc()) {
        $new_stock = $row['in_stock'] - $row['quantity'];
        $updateStock = $conn->prepare("UPDATE products SET in_stock=? WHERE id=?");
        $updateStock->bind_param('ii', $new_stock, $row['product_id']);
        $updateStock->execute();
    }
//    empty cart
    $clearCart = $conn->prepare("DELETE FROM cart WHERE user_id=?");
    $clearCart->bind_param('i', $user_id);
    $clearCart->execute();


//stimulate send confirmation email
    echo json_encode([
        'status' => 'success',
        'msg' => "Order submitted successfully！\n\nDelivery information:\nName: $receiptName\nAddress: $street, $city, $state\nPhone: $phone\nEmail: $email"
    ]);
}
?>