

const token = localStorage.getItem("token");

const cartItemsContainer =
document.getElementById("cartItems");

const totalItemsElement =
document.getElementById("totalItems");

const totalPriceElement =
document.getElementById("totalPrice");

/* ==========================
   LOAD CART
========================== */

async function loadCart(){

    if(!token){

        window.location.href =
        "login.html";

        return;
    }

    try{

        const response =
        await fetch(
            `${API_URL}/cart`,
            {
                headers:{
                    "Authorization":
                    `Bearer ${token}`
                }
            }
        );

        const cartItems =
        await response.json();
        console.log("CART RESPONSE =", JSON.stringify(cartItems, null, 2));
        renderCart(cartItems);

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   RENDER CART
========================== */

    function renderCart(items){

        
        cartItemsContainer.innerHTML = "";

        let totalItems = 0;
        let totalPrice = 0;

        if(items.length === 0){

            cartItemsContainer.innerHTML = `

            <div class="text-center">

                <h3>
                Cart Is Empty
                </h3>

            </div>

            `;

            return;
        }

        items.forEach(item=>{

            totalItems += item.quantity;

            totalPrice +=
            item.price *
            item.quantity;

            const imageUrl =
            item.image
            ?
            `${API_URL}/uploads/products/${item.image}`
            :
            "images/hero.png";
            cartItemsContainer.innerHTML += `

            <div class="card mb-4 border-0 shadow-sm rounded-4">

                <div class="card-body">

                    <div class="row align-items-center">

                        <div class="col-md-2">

                            <img
                            src="${imageUrl}"
                            class="img-fluid rounded"
                            >

                        </div>

                        <div class="col-md-4">

                            <h5>
                            ${item.name}
                            </h5>

                            <p>
                            ₹${item.price}
                            </p>

                        </div>

                        <div class="col-md-3">

                            <div class="d-flex gap-2">

                                <button
                                class="btn btn-outline-dark"
                                onclick="decreaseQty(${item.cart_item_id},${item.quantity})"
                                >
                                -
                                </button>

                                <button
                                class="btn btn-light"
                                >
                                ${item.quantity}
                                </button>

                                <button
                                class="btn btn-outline-dark"
                                onclick="increaseQty(${item.cart_item_id},${item.quantity})"
                                >
                                +
                                </button>

                            </div>

                        </div>

                        <div class="col-md-2">

                            <strong>

                            ₹${item.price * item.quantity}

                            </strong>

                        </div>

                        <div class="col-md-1">

                            <button
                            class="btn btn-danger"
                            onclick="removeItem(${item.cart_item_id})"
                            >

                            <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            `;

        });

        totalItemsElement.innerText =
        totalItems;

        totalPriceElement.innerText =
        `₹${totalPrice}`;

    }

    /* ==========================
   INCREASE QTY
========================== */

async function increaseQty(id,qty){

    await updateQty(
        id,
        qty + 1
    );

}

/* ==========================
   DECREASE QTY
========================== */

async function decreaseQty(id,qty){

    if(qty <= 1){

        return;
    }

    await updateQty(
        id,
        qty - 1
    );

}

/* ==========================
   UPDATE QTY
========================== */

async function updateQty(id,quantity){

    try{

        await fetch(

        `${API_URL}/cart/update/${id}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":
                "application/json",

                "Authorization":
                `Bearer ${token}`

            },

            body:JSON.stringify({

                quantity:quantity

            })

        });

        loadCart();

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   REMOVE ITEM
========================== */

async function removeItem(id){

    if(!confirm(
        "Remove Item From Cart?"
    )){

        return;
    }

    try{

        await fetch(

        `${API_URL}/cart/remove/${id}`,

        {

            method:"DELETE",

            headers:{

                "Authorization":
                `Bearer ${token}`

            }

        });

        loadCart();

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   CHECKOUT
========================== */

document
.getElementById(
"checkoutBtn"
)
.addEventListener(
"click",
()=>{

    window.location.href =
    "checkout.html";

}
);

loadCart();
