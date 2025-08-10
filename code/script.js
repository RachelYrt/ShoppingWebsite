

function openModal(id){
    document.getElementById(id).style.display = "block";
}
function closeModal(id){
    document.getElementById(id).style.display = "none";
}
window.onclick = function(event){
    const login = document.getElementById("login");
    const cart = document.getElementById("cartModal");
    if (event.target == login) login.style.display = "none";
    if (event.target == cart) cart.style.display = "none";
}
//contact info
document.addEventListener('DOMContentLoaded',function (){
    const contactInfo = document.querySelector('a[href="#contact"]');
    if(contactInfo){
        contactInfo.addEventListener('click', function (){
            const banner = document.getElementById('banner-section');
            const container = document.getElementById('product-container');
            const pagination = document.getElementById('pagination');
            if(banner) banner.style.display='none';
            if(pagination) pagination.innerHTML = '';
            if(container) {
                container.style.display = 'block';
                 container.innerHTML = `
                <div class="contact-info-single">
                    <div><strong>Address:</strong> The Monica Centre, 48/62 Majors Bay Rd, Concord NSW 2137, Sydney</div>
                    <div><strong>Email:</strong> contact@RS.com</div>
                </div>
            `;
            }
        })
    }
});
