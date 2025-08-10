

let cartItemCount = 0;
// get cart data
function addToCart(productId) {
    let cartTotal = 0;
    fetch('cart.php?action=add', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `product_id=${productId}&quantity=1`
    })
    .then(res => res.json())
    .then(res => {
        alert(res.msg);
        if(res.status === 'success'){
            loadCart();
        }

        });
}

// get cart data and update price
function loadCart() {
    cartItemCount = 0;
    fetch('cart.php?action=get')
        .then(response => response.json())
        .then(res => {
            if(res.status === 'success'){
                const cartItems = res.data;
                cartTotal = 0;
                const cartContent = document.querySelector('#cartModal .pop-up_content');
                cartContent.innerHTML = `
                <span class="close-button" onclick="closeModal('cartModal')">&times;</span>
                <h2>Your cart</h2>
            `;

                if(cartItems.length === 0){
                    cartContent.innerHTML += `<p>No items in cart.</p>`;
                } else {
                    cartItems.forEach(item => {
                        cartItemCount += item.quantity;
                        cartTotal += item.price * item.quantity;
                        cartContent.innerHTML += `
                        <div style="margin-bottom:10px;">
                            <img src="${item.image}" width="50">
                            ${item.name} $${item.price} x 
                            <input type="number" value="${item.quantity}" min="1" 
                                onchange="updateQuantity(${item.product_id}, this.value, ${item.in_stock})">
                            <button onclick="removeItem(${item.product_id})">X</button>
                        </div>
                    `;
                    });
                    cartContent.innerHTML += `
                    <p>Total: $${cartTotal.toFixed(2)}</p>
                    <button onclick="clearCart()">Clear All</button>
                    <button onclick="openOrderModal()">Place an Order</button>
                `;
                }
                document.getElementById('cart-total').textContent = `$${cartTotal.toFixed(2)}`;
            } else {
                cartContent.innerHTML += `<p>No items in cart. </p>`;
                document.getElementById('cart-total').textContent =`$0.00`;
                // alert('Failed to load cart!');
            }
        })
        .catch(e => console.error(e));
}
function openOrderModalWithCheck() {
    if (cartItemCount === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
    }
    document.getElementById('orderModal').style.display = 'block';
}
function updateQuantity(productID, quantity,in_stock){
    const product = allProducts.find(item=>item.id == productID);
    if (quantity < 1){
        alert('Quantity must be at least 1');
        loadCart();
        return;
    }
    if(quantity > in_stock){
        alert('Exceeds stock limit!');
        loadCart();
        return;
    }
    fetch('cart.php?action=update', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `product_id=${productID}&quantity=${quantity}`
    })
        .then(res=> res.json())
        .then(res=> {
            alert(res.msg);
            loadCart();
        });
}

function removeItem(productId){
    fetch('cart.php?action=remove',{
        method: 'POST',
        headers:{'Content-type': 'application/x-www-form-urlencoded'},
        body: `product_id=${productId}`
    })
        .then(res=> res.json())
        .then(res => {
            alert(res.msg);
            loadCart();
        });
}

function clearCart(){
    fetch('cart.php?action=clear')
        .then(res=>res.json())
        .then(res=>{
            alert(res.msg);
            loadCart();
        });
}
function openCollectionModal() {
    document.getElementById('collectionModal').style.display = 'block';

    document.getElementById('collectionForm').onsubmit = function(e) {
        e.preventDefault();
        submitCollection();
    };
}
function submitCollection() {
    const collectName = document.getElementById('collectName').value.trim();
    const store = document.getElementById('store').value.trim();
    const collectPhone = document.getElementById('collectPhone').value.trim();
    const collectEmail = document.getElementById('collectEmail').value.trim();

    if (!collectEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Invalid email format');
        return;
    }

    fetch('place_order.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `collectName=${collectName}&store=${store}&phone=${collectPhone}&email=${collectEmail}&type=collection`
    })
        .then(res => res.json())
        .then(res => {
            alert(res.msg);
            if(res.status === 'success'){
                closeModal('collectionModal');
                loadCart();
            } else {
                alert(res.msg);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Request failed.');
        });
}
function  openOrderModal(){
    document.getElementById('orderModal').style.display = 'block';
}
document.getElementById('orderForm').addEventListener('submit',function (e){
    e.preventDefault();
    const receiptName = document.getElementById('receiptName').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('orderEmail').value.trim();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Invalid email format');
        return;
    }
    fetch('place_order.php',{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `receiptName=${receiptName}&street=${street}&city=${city}&state=${state}&phone=${phone}&email=${email}`
    })
        .then(res=>res.json())
        .then(res=>{
            alert(res.msg);
            if(res.status === 'success'){
                closeModal('orderModal');
                loadCart();
            }else if(res.status === 'error'){
                alert(res.msg);
            }
        })
})
function openOrderModalWithCheck() {
    if (cartItemCount === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
    }
    document.getElementById('orderModal').style.display = 'block';
}

function openCollectionModalWithCheck() {
    if (cartItemCount === 0) {
        alert("Your cart is empty. Please add items before making a collection.");
        return;
    }
    document.getElementById('collectionModal').style.display = 'block';

    document.getElementById('collectionForm').onsubmit = function(e) {
        e.preventDefault();
        submitCollection();
    };
}
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.addEventListener('DOMContentLoaded',loadCart);