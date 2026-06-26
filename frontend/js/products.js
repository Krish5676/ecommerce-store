

const token = localStorage.getItem("token");

const productsContainer =
document.getElementById("productsContainer");

/* ==========================
   LOAD PRODUCTS
========================== */

async function loadProducts(){

try{

const response =
await fetch(
`${API_URL}/products`
);

const products =
await response.json();

renderProducts(products);

}
catch(error){

console.log(error);

}

}

/* ==========================
   RENDER PRODUCTS
========================== */

function renderProducts(products){

productsContainer.innerHTML = "";

products.forEach(product=>{

const imageUrl =
product.image
?
`${API_URL}/uploads/products/${product.image}`
:
"https://via.placeholder.com/300x220";

productsContainer.innerHTML += `

<div class="col-lg-4 mb-4">

<div class="product-card">

<img
src="${imageUrl}"
>

<h4 class="mt-3">
${product.name}
</h4>

<p>
₹${product.price}
</p>

<p>
Stock : ${product.stock}
</p>

<p>

Status :

<span class="badge ${
product.is_active
?
'bg-success'
:
'bg-danger'
}">

${product.is_active
?
'Active'
:
'Inactive'}

</span>

</p>

<div class="d-grid gap-2">

<button
class="btn btn-primary"
onclick="editProduct(${product.id})"
>

Edit

</button>

<button
class="btn btn-danger"
onclick="deleteProduct(${product.id})"
>

Delete

</button>

<button
class="btn btn-warning"
onclick="toggleProduct(${product.id}, ${product.is_active})"
>

${product.is_active
?
'Deactivate'
:
'Activate'}

</button>

</div>

</div>

</div>

`;

});

}

/* ==========================
   SAVE PRODUCT
========================== */
const saveBtn =
document
.getElementById("saveBtn");
if(saveBtn){
    searchBtn.addEventListener(
"click",
searchProducts
);
}
async function saveProduct(){

const productId =
document.getElementById(
"productId"
).value;

const payload = {

subcategory_id:
parseInt(
document.getElementById(
"subcategoryId"
).value
),

name:
document.getElementById(
"productName"
).value,

description:
document.getElementById(
"productDescription"
).value,

price:
parseFloat(
document.getElementById(
"productPrice"
).value
),

stock:
parseInt(
document.getElementById(
"productStock"
).value
),

image:
document.getElementById(
"productImage"
).value

};

try{

if(productId){

await fetch(
`${API_URL}/products/${productId}`,
{
method:"PUT",

headers:{
"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`
},

body:
JSON.stringify(payload)

}
);

alert(
"Product Updated"
);

}else{

await fetch(
`${API_URL}/products/`,
{
method:"POST",

headers:{
"Content-Type":
"application/json",

Authorization:
`Bearer ${token}`
},

body:
JSON.stringify(payload)

}
);

alert(
"Product Created"
);

}

clearForm();

loadProducts();

}
catch(error){

console.log(error);

}

}

/* ==========================
   EDIT PRODUCT
========================== */

async function editProduct(id){

const response =
await fetch(
`${API_URL}/products/${id}`
);

const product =
await response.json();

document.getElementById(
"productId"
).value =
product.id;

document.getElementById(
"subcategoryId"
).value =
product.subcategory_id;

document.getElementById(
"productName"
).value =
product.name;

document.getElementById(
"productDescription"
).value =
product.description;

document.getElementById(
"productPrice"
).value =
product.price;

document.getElementById(
"productStock"
).value =
product.stock;

document.getElementById(
"productImage"
).value =
product.image;

window.scrollTo({
top:0,
behavior:"smooth"
});

}

/* ==========================
   DELETE PRODUCT
========================== */

async function deleteProduct(id){

if(!confirm(
"Delete Product?"
)){
return;
}

await fetch(
`${API_URL}/products/${id}`,
{
method:"DELETE",

headers:{
Authorization:
`Bearer ${token}`
}
}
);

alert(
"Product Deleted"
);

loadProducts();

}

/* ==========================
   ACTIVATE / DEACTIVATE
========================== */

async function toggleProduct(
id,
isActive
){

const endpoint =
isActive
?
`${API_URL}/products/deactivate/${id}`
:
`${API_URL}/products/activate/${id}`;

await fetch(
endpoint,
{
method:"PUT",

headers:{
Authorization:
`Bearer ${token}`
}
}
);

alert(
isActive
?
"Product Deactivated"
:
"Product Activated"
);

loadProducts();

}

/* ==========================
   CLEAR FORM
========================== */

function clearForm(){

document.getElementById(
"productId"
).value="";

document.getElementById(
"subcategoryId"
).value="";

document.getElementById(
"productName"
).value="";

document.getElementById(
"productDescription"
).value="";

document.getElementById(
"productPrice"
).value="";

document.getElementById(
"productStock"
).value="";

document.getElementById(
"productImage"
).value="";

}

/* ==========================
   GLOBAL FUNCTIONS
========================== */

window.editProduct =
editProduct;

window.deleteProduct =
deleteProduct;

window.toggleProduct =
toggleProduct;

/* ==========================
   INIT
========================== */

loadProducts();