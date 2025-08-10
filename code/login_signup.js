

function signup(){
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();

    if(username === '' || password === '' || email === ''){
        alert('Please fill all fields!');
        return;
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        alert('Invalid email format.');
        return;
    }

    fetch ('signup.php',{
        method:'POST',
        headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        body:`username=${username}&password=${password}&email=${email}`
    })
    .then(res=>res.text())
    .then(data=>{
        alert(data);
        if (data.includes('success')) {
            updateNavbar(username);
            closeModal('login');
        }
    });

}
function updateNavbar(username){
    document.getElementById('user-area').innerHTML=`
        <span style="display: flex; align-items: center; gap: 5px">Hi, ${username} | 
        <a href="javascript:void(0)" class="nav-link" onclick="logout() ">Logout</a></span>
        
    `;
}
function login(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    fetch('login.php',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:`username=${username}&password=${password}&email=${email}`
    })
    .then(res=>res.json())
    .then(data=>{
        alert(data.msg);
        if(data.status ==='success'){
            //
            localStorage.setItem('username',username);
            updateNavbar(username);
            closeModal('login');
            loadCart();
            // location.reload();
        }
    })
}



function logout(){
    fetch('logout.php')
        .then(res=> res.text())
        .then(msg=>{
            alert(msg);
            localStorage.removeItem('username');
            location.reload();
        })
}
document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('username');
    if (user) {
        updateNavbar(user);
    }
});