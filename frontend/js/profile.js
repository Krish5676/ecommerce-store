

const token =
localStorage.getItem("token");

if(!token){

    window.location.href =
    "login.html";

}

/* ==========================
   LOAD PROFILE
========================== */

async function loadProfile(){

    try{

        const response =
        await fetch(

            `${API_URL}/users/me`,

            {

                headers:{

                    "Authorization":
                    `Bearer ${token}`

                }

            }

        );

        const user =
        await response.json();

        document
        .getElementById("name")
        .value =
        user.name || "";

        document
        .getElementById("email")
        .value =
        user.email || "";

        document
        .getElementById("address")
        .value =
        user.address || "";

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   UPDATE PROFILE
========================== */

document
.getElementById(
"saveProfileBtn"
)
.addEventListener(
"click",
async ()=>{

    try{

        const response =
        await fetch(

            `${API_URL}/users/update`,

            {

                method:"PUT",

                headers:{

                    "Content-Type":
                    "application/json",

                    "Authorization":
                    `Bearer ${token}`

                },

                body:JSON.stringify({

                    name:
                    document
                    .getElementById("name")
                    .value,

                    address:
                    document
                    .getElementById("address")
                    .value

                })

            }

        );

        if(response.ok){

            alert(
            "Profile Updated ✅"
            );

        }

        else{

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

/* ==========================
   LOAD ORDERS COUNT
========================== */

async function loadOrdersCount(){

    try{

        const response =
        await fetch(

            `${API_URL}/orders`,

            {

                headers:{

                    "Authorization":
                    `Bearer ${token}`

                }

            }

        );

        const orders =
        await response.json();

        document
        .getElementById(
        "ordersCount"
        )
        .innerText =
        orders.length;

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   LOAD WISHLIST COUNT
========================== */

async function loadWishlistCount(){

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

        const wishlist =
        await response.json();

        document
        .getElementById(
        "wishlistCount"
        )
        .innerText =
        wishlist.length;

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   LOAD CART COUNT
========================== */

async function loadCartCount(){

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

        const cart =
        await response.json();

        document
        .getElementById(
        "cartCount"
        )
        .innerText =
        cart.length;

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   LOGOUT
========================== */

document
.getElementById(
"logoutBtn"
)
.addEventListener(
"click",
()=>{

    localStorage.removeItem(
    "token"
    );

    localStorage.removeItem(
    "user"
    );

    window.location.href =
    "login.html";

});

/* ==========================
   INIT
========================== */

loadProfile();

loadOrdersCount();

loadWishlistCount();

loadCartCount();