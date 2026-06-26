const API_URL = "http://127.0.0.1:8000";

const productsContainer =
document.getElementById(
"allProductsContainer"
);

const searchInput =
document.getElementById(
"searchInput"
);

let allProducts = [];

/* ==========================
   LOAD PRODUCTS
========================== */

async function loadProducts(){

    try{

        const response =
        await fetch(
        `${API_URL}/products`
        );

        let products =
        await response.json();

        const params =
        new URLSearchParams(
        window.location.search
        );

        const subcategoryId =
        params.get("subcategory");

        if(subcategoryId){

            products =
            products.filter(product =>

                product.subcategory_id ==
                subcategoryId

            );

        }

        allProducts = products;

        renderProducts(
        allProducts
        );

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

    if(products.length === 0){

        productsContainer.innerHTML = `

        <div class="col-12 text-center">

            <h4>
            No Products Found
            </h4>

        </div>

        `;

        return;

    }

    products.forEach(product=>{

        const imageUrl =
        product.image
        ?
        `${API_URL}/uploads/products/${product.image}`
        :
        "images/hero.jpg";

        productsContainer.innerHTML += `

        <div class="col-lg-3 col-md-6">

            <div class="product-card">

                <img
                src="${imageUrl}"
                alt="${product.name}"
                >

                <h3>
                ${product.name}
                </h3>

                <p>
                ₹${product.price}
                </p>

                <div
                class="d-grid gap-2"
                >

                    <button
                    class="btn btn-dark"
                    onclick="viewProduct(${product.id})"
                    >
                    View Product
                    </button>

                    <button
                    class="btn btn-outline-dark"
                    onclick="addToCart(${product.id})"
                    >
                    Add To Cart
                    </button>

                    <button
                    class="btn btn-outline-danger"
                    onclick="addToWishlist(${product.id})"
                    >
                    ❤️ Wishlist
                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

/* ==========================
   SEARCH
========================== */

searchInput.addEventListener(
"keyup",
()=>{

    const keyword =
    searchInput.value.toLowerCase();

    const filtered =
    allProducts.filter(product=>

        product.name
        .toLowerCase()
        .includes(keyword)

    );

    renderProducts(
    filtered
    );

});

/* ==========================
   VIEW PRODUCT
========================== */

function viewProduct(id){

    window.location.href =
    `product-details.html?id=${id}`;

}

/* ==========================
   ADD TO CART
========================== */

async function addToCart(id){

    const token =
    localStorage.getItem(
    "token"
    );

    if(!token){

        alert(
        "Please Login First"
        );

        return;
    }

    try{

        const response =
        await fetch(
        `${API_URL}/cart/add`,
        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json",

                "Authorization":
                `Bearer ${token}`
            },

            body:JSON.stringify({

                product_id:id,

                quantity:1

            })

        });

        if(response.ok){

            alert(
            "Added To Cart 🛒"
            );

        }else{

            const error =
            await response.json();

            alert(
            error.detail
            );

        }

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   ADD TO WISHLIST
========================== */

async function addToWishlist(id){

    const token =
    localStorage.getItem(
    "token"
    );

    if(!token){

        alert(
        "Please Login First"
        );

        return;
    }

    try{

        const response =
        await fetch(
        `${API_URL}/wishlist/add`,
        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json",

                "Authorization":
                `Bearer ${token}`
            },

            body:JSON.stringify({

                product_id:id

            })

        });

        if(response.ok){

            alert(
            "Added To Wishlist ❤️"
            );

        }else{

            const error =
            await response.json();

            alert(
            error.detail
            );

        }

    }

    catch(error){

        console.log(error);

    }

}

loadProducts();