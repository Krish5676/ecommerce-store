/* ==========================
   LOGIN
========================== */

const loginForm =
document.getElementById(
"loginForm"
);

if(loginForm){

loginForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const email =
document.getElementById(
"loginEmail"
).value;

const password =
document.getElementById(
"loginPassword"
).value;

try{

const response =
await fetch(

`${API_URL}/auth/login`,

{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

email,
password

})

}

);

const data =
await response.json();

if(response.ok){

localStorage.setItem(
"token",
data.access_token
);

alert(
"Login Successful"
);

window.location.href =
"index.html";

}else{

alert(
data.message
);

}

}

catch(error){

console.log(error);

}

});
}

/* ==========================
   REGISTER
========================== */

const registerForm =
document.getElementById("registerForm");

if(registerForm){

registerForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const full_name =
document.getElementById(
"registerName"
).value;

const email =
document.getElementById(
"registerEmail"
).value;

const password =
document.getElementById(
"registerPassword"
).value;

const phone =
document.getElementById(
"registerPhone"
).value;

const response =
await fetch(

`${API_URL}/auth/signup`,

{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

full_name,
email,
phone,
password

})

}

);

const data =
await response.json();

alert(
data.message
);

if(response.ok){

window.location.href =
"login.html";

}

});
}