//
//


let cartTotal = 0;
let allProducts = [];
let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 20;
const container = document.getElementById('product-container');
const pagination = document.getElementById('pagination');
const banner=  document.getElementById('banner-section');


function renderPage(page) {
    container.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const showProducts = currentProducts.slice(start, end);

    showProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-info';

        const stockText = product.in_stock > 0 ? `in stock：${product.in_stock}` : `<span style="color:red;">out of stock</span>`;
        const isDisabled = product.in_stock > 0 ? '' : 'disabled style="background-color:gray;cursor:not-allowed"';
        productDiv.innerHTML = `
            <img src="${product.image}" class="product-image" alt="${product.name}">
            <div class="product-text">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price} / ${product.unit_quantity}</div>
                <div class="product-stock">${stockText}</div>
                <button class="add-to-cart" ${isDisabled}>
                    <i class="fa fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        `;
        const button = productDiv.querySelector('.add-to-cart');
        if (product.in_stock > 0){
            button.addEventListener('click', ()=>{
                addToCart(product.id);
                }
            )
        }
        // productDiv.querySelector('.add-to-cart').addEventListener('click', () => {
        //     addToCart(product.id);
        // });
        container.appendChild(productDiv);
    });
}

// split page
function createPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.classList.add('active');
        btn.addEventListener('click', () => {
            currentPage = i;
            renderPage(currentPage);
            createPagination();
        });
        pagination.appendChild(btn);
    }
}

// filter category
function loadCategory(category) {

    // banner.style.display='none';
    // container.style.display='grid';
    // pagination.style.display='block';
    const banner = document.getElementById('banner-section');
    const container = document.getElementById('product-container');
    const pagination = document.getElementById('pagination');

    if (banner) banner.style.display = 'none';
    if (container) container.style.display = 'grid';
    if (pagination) pagination.style.display = 'block';

    if (category === 'all') {
        currentProducts = allProducts;
    } else {
        currentProducts = allProducts.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    currentPage = 1;
    updateProduct();
}

// refresh the page
function updateProduct() {
    createPagination();
    renderPage(currentPage);
}
//search the product
function searchProduct(){
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    if(keyword === ''){
        alert('Please enter product name to search.');
        return;
    }
    const result = allProducts.filter(product => product.name.toLowerCase().includes(keyword));
    if(result.length === 0){
        container.innerHTML ='<p style ="text-align:center; font-size:20px;">No matching products found.</p>';
        pagination.innerHTML="";
        banner.style.display='none';
        return;
    }
    currentProducts = result;
    currentPage=1;
    banner.style.display='none';
    updateProduct();
}

// load data
fetch('get_products.php')
    .then(response => response.json())
    .then(products => {
        allProducts = products;
        currentProducts = products;
        updateProduct();
    })
    .catch(err => console.error('loading error:', err));
document.getElementById('searchInput').addEventListener('keydown',function (e){
    if(e.key === 'Enter'){
        searchProduct();
    }
});