document
.getElementById("loginBtn")
.addEventListener(
"click",
loginAdmin
);

function loginAdmin(){

const id =
document.getElementById(
"adminId"
).value.trim();

const password =
document.getElementById(
"adminPassword"
).value.trim();

const errorBox =
document.getElementById(
"errorMessage"
);

errorBox.innerText = "";

if(
id === "admin" &&
password === "admin123"
){

localStorage.setItem(
"adminLoggedIn",
"true"
);

window.location.href =
"admin-dashboard.html";

}
else{

errorBox.innerText =
"Wrong Admin Credentials";

}

}

document
.getElementById("adminPassword")
.addEventListener(
"keypress",
function(e){

if(e.key === "Enter"){

loginAdmin();

}

}
);
