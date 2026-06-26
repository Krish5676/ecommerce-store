const API_URL = "http://127.0.0.1:8000";

const params = new URLSearchParams(
window.location.search
);

const productId =
params.get("id");

/* ======================
   LOAD PRODUCT
====================== */

async function loadProduct(){

    try{

        const response =
        await fetch(
        `${API_URL}/products/${productId}`
        );

        const product =
        await response.json();

        document.getElementById(
        "productName"
        ).innerText =
        product.name;

        document.getElementById(
        "productPrice"
        ).innerText =
        `₹${product.price}`;

        document.getElementById(
        "productDescription"
        ).innerText =
        product.description;

       const image =
        product.image
        ?
        `${API_URL}/uploads/products/${product.image}`
        :
        "images/hero.png";
        document.getElementById(
        "productImage"
        ).src = image;

        loadRelatedProducts();

    }

    catch(error){

        console.log(error);

    }

}

/* ======================
   RELATED PRODUCTS
====================== */

async function loadRelatedProducts(){

    try{

        const response =
        await fetch(
        `${API_URL}/products`
        );

        const products =
        await response.json();

        const container =
        document.getElementById(
        "relatedProducts"
        );

        container.innerHTML = "";

        products
        .filter(
        item =>
        item.id != productId
        )
        .slice(0,4)
        .forEach(product=>{

            const image =
            product.image
            ?
            `${API_URL}/uploads/products/${product.image}`
            :
            "images/hero.";

            container.innerHTML += `

            <div class="col-lg-3 col-md-6">

                <div class="product-card">

                    <img
                    src="${image}"
                    alt="${product.name}"
                    >

                    <h3>
                    ${product.name}
                    </h3>

                    <p>
                    ₹${product.price}
                    </p>

                    <button
                    class="btn btn-dark"
                    onclick="goProduct(${product.id})"
                    >
                    View
                    </button>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

/* ======================
   GO PRODUCT
====================== */

function goProduct(id){

    window.location.href =
    `product-details.html?id=${id}`;

}

/* ======================
   ADD TO CART
====================== */

document.getElementById(
"addCartBtn"
).addEventListener(
"click",
async ()=>{

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

                product_id:
                parseInt(productId),

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

});

/* ======================
   WISHLIST
====================== */

document.getElementById(
"wishlistBtn"
).addEventListener(
"click",
async ()=>{

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

                product_id:
                parseInt(productId)

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

});

/* ======================
   BUY NOW
====================== */

document.getElementById(
"buyNowBtn"
).addEventListener(
"click",
()=>{

    window.location.href =
    `checkout.html?product_id=${productId}`;

});

loadProduct();