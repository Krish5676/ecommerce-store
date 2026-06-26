async function loadDashboard(){

try{

const products =
await fetch(
`${API_URL}/products/`
).then(r=>r.json());

document.getElementById(
"productsCount"
).innerText =
products.length;

const categories =
await fetch(
`${API_URL}/categories/`
).then(r=>r.json());

document.getElementById(
"categoriesCount"
).innerText =
categories.length;

const users =
await fetch(
`${API_URL}/users/`
).then(r=>r.json());

document.getElementById(
"usersCount"
).innerText =
users.length;

const token =
localStorage.getItem("token");

const orders =
await fetch(
`${API_URL}/orders/all`,
{
headers:{
Authorization:
`Bearer ${token}`
}
}
).then(r=>r.json());

document.getElementById(
"ordersCount"
).innerText =
orders.length;

}
catch(error){

console.log(error);

}

}

loadDashboard();
