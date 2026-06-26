const API_URL = "http://127.0.0.1:8000";

/* ==========================
   LOAD CATEGORIES
========================== */

async function loadCategories(){

try{

const response =
await fetch(
`${API_URL}/categories/`
);

const categories =
await response.json();

const table =
document.getElementById(
"categoryTable"
);

const dropdown =
document.getElementById(
"subcategoryCategory"
);

table.innerHTML = "";
dropdown.innerHTML = "";

categories.forEach(cat=>{

table.innerHTML += `

<tr>

<td>${cat.id}</td>

<td>

<input
type="text"
id="cat-${cat.id}"
value="${cat.name}"
class="form-control"
>

</td>

<td>

<button
class="btn btn-success btn-sm"
onclick="updateCategory(${cat.id})"
>
Update
</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteCategory(${cat.id})"
>
Delete
</button>

<button
class="btn btn-primary btn-sm"
onclick="loadSubcategories(${cat.id})"
>
Sub Categories
</button>

</td>

</tr>

`;

dropdown.innerHTML += `

<option value="${cat.id}">
${cat.name}
</option>

`;

});

}
catch(error){

console.log(error);

}

}

/* ==========================
   ADD CATEGORY
========================== */

document
.getElementById(
"addCategoryBtn"
)
.addEventListener(
"click",
createCategory
);

async function createCategory(){

const name =
document.getElementById(
"categoryName"
).value;

if(!name){
alert("Enter Category Name");
return;
}

const response =
await fetch(
`${API_URL}/categories/`,
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({
name:name
})

}
);

const data =
await response.json();

alert(data.message);

document.getElementById(
"categoryName"
).value = "";

loadCategories();

}

/* ==========================
   UPDATE CATEGORY
========================== */

async function updateCategory(id){

const name =
document.getElementById(
`cat-${id}`
).value;

const response =
await fetch(
`${API_URL}/categories/${id}`,
{
method:"PUT",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({
name:name
})

}
);

const data =
await response.json();

alert(data.message);

loadCategories();

}

/* ==========================
   DELETE CATEGORY
========================== */

async function deleteCategory(id){

if(
!confirm(
"Delete Category?"
)
){
return;
}

const response =
await fetch(
`${API_URL}/categories/${id}`,
{
method:"DELETE"
}
);

const data =
await response.json();

alert(data.message);

loadCategories();

}

/* ==========================
   ADD SUBCATEGORY
========================== */

document
.getElementById(
"addSubCategoryBtn"
)
.addEventListener(
"click",
createSubCategory
);

async function createSubCategory(){

const category_id =
parseInt(
document.getElementById(
"subcategoryCategory"
).value
);

const name =
document.getElementById(
"subcategoryName"
).value;

const response =
await fetch(
`${API_URL}/categories/subcategory`,
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({
category_id,
name
})

}
);

const data =
await response.json();

alert(data.message);

document.getElementById(
"subcategoryName"
).value = "";

loadSubcategories(category_id);

}

/* ==========================
   LOAD SUBCATEGORY
========================== */

async function loadSubcategories(categoryId){

const response =
await fetch(
`${API_URL}/categories/subcategories/${categoryId}`
);

const subcategories =
await response.json();

const table =
document.getElementById(
"subcategoryTable"
);

table.innerHTML = "";

subcategories.forEach(sub=>{

table.innerHTML += `

<tr>

<td>${sub.id}</td>

<td>${sub.category_id}</td>

<td>

<input
type="text"
id="sub-${sub.id}"
value="${sub.name}"
class="form-control"
>

</td>

<td>

<button
class="btn btn-success btn-sm"
onclick="updateSubCategory(${sub.id},${sub.category_id})"
>
Update
</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteSubCategory(${sub.id},${sub.category_id})"
>
Delete
</button>

</td>

</tr>

`;

});

}

/* ==========================
   UPDATE SUBCATEGORY
========================== */

async function updateSubCategory(
id,
category_id
){

const name =
document.getElementById(
`sub-${id}`
).value;

const response =
await fetch(
`${API_URL}/categories/subcategory/${id}`,
{
method:"PUT",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({
category_id,
name
})

}
);

const data =
await response.json();

alert(data.message);

loadSubcategories(category_id);

}

/* ==========================
   DELETE SUBCATEGORY
========================== */

async function deleteSubCategory(
id,
category_id
){

if(
!confirm(
"Delete SubCategory?"
)
){
return;
}

const response =
await fetch(
`${API_URL}/categories/subcategory/${id}`,
{
method:"DELETE"
}
);

const data =
await response.json();

alert(data.message);

loadSubcategories(category_id);

}

/* ==========================
   INIT
========================== */

loadCategories();

window.updateCategory =
updateCategory;

window.deleteCategory =
deleteCategory;

window.loadSubcategories =
loadSubcategories;

window.updateSubCategory =
updateSubCategory;

window.deleteSubCategory =
deleteSubCategory;