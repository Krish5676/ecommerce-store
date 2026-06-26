const API_URL = "http://127.0.0.1:8000";

const token =
localStorage.getItem("token");

const wishlistContainer =
document.getElementById(
"wishlistContainer"
);

/* ==========================
   LOAD WISHLIST
========================== */

async function loadWishlist(){

    if(!token){

        window.location.href =
        "login.html";

        return;
    }

    try{

        const response =
        await fetch(

            `${API_URL}/wishlist`,

            {
                headers:{
                    "Authorization":
                    `Bearer ${token}`
                }
            }

        );

        const items =
        await response.json();

        renderWishlist(items);
        console.log(
        JSON.stringify(items,null,2)
        );

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   RENDER
========================== */

function renderWishlist(items){

    wishlistContainer.innerHTML = "";

    if(items.length === 0){

        wishlistContainer.innerHTML = `

        <div class="col-12 text-center">

            <h3>
            Wishlist Is Empty ❤️
            </h3>

        </div>

        `;

        return;
    }

    items.forEach(item=>{
        
        const product =
        item.product || item;

         const imageUrl =
         product.image
         ?
        `${API_URL}/uploads/products/${product.image}`
        :
        "images/hero.png";


        wishlistContainer.innerHTML += `

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

                <div class="d-grid gap-2">

                    <button
                    class="btn btn-dark"
                    onclick="viewProduct(${product.product_id})"
                    >
                    View Product
                    </button>

                    <button
                    class="btn btn-success"
                    onclick="moveToCart(${product.product_id})"
                    >
                    Move To Cart
                    </button>

                    <button
                    class="btn btn-danger"
                    onclick="removeWishlist(${item.wishlist_id})"
                    >
                    Remove
                    </button>

                </div>

            </div>

        </div>

        `;
    console.log(product);

    });

}

/* ==========================
   VIEW PRODUCT
========================== */
function viewProduct(id){

window.location.href =
"product-details.html?id=" + id;

}

/* ==========================
   MOVE TO CART
========================== */

async function moveToCart(productId){

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

                    product_id:productId,

                    quantity:1

                })

            }

        );

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
   GET IMAGE URL
========================== */

function getImageUrl(image){

    return image
    ?
    `${API_URL}/uploads/${image}`
    :
    "assets/images/product-placeholder.png";

}
/* ==========================
   REMOVE WISHLIST
========================== */

async function removeWishlist(id){

    if(
    !confirm(
    "Remove From Wishlist?"
    )
    ){

        return;

    }

    try{

        const response =
        await fetch(

            `${API_URL}/wishlist/${id}`,

            {

                method:"DELETE",

                headers:{

                    "Authorization":
                    `Bearer ${token}`

                }

            }

        );

        if(response.ok){

            loadWishlist();

        }

    }

    catch(error){

        console.log(error);

    }

}

loadWishlist();

const imageUrl =
getImageUrl(item.image);