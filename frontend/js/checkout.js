
const token = localStorage.getItem("token");

const addressBox =
document.getElementById("address");

const checkoutItems =
document.getElementById("checkoutItems");

const totalAmount =
document.getElementById("totalAmount");

/* =====================
   AUTH CHECK
===================== */

if(!token){

    window.location.href =
    "login.html";

}

/* =====================
   LOAD PROFILE
===================== */

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
        });

        if(response.ok){

            const user =
            await response.json();

            addressBox.value =
            user.address || "";

        }

    }

    catch(error){

        console.log(error);

    }

}

/* =====================
   UPDATE ADDRESS
===================== */


/* =====================
   LOAD CART
===================== */

let grandTotal = 0;

async function loadCart(){

    try{

        const response =
        await fetch(
        `${API_URL}/cart`,
        {

            headers:{
                "Authorization":
                `Bearer ${token}`
            }

        });

        const items =
        await response.json();

        checkoutItems.innerHTML = "";

        grandTotal = 0;

        items.forEach(item=>{

            const subtotal =
            item.price *
            item.quantity;

            grandTotal += subtotal;

            checkoutItems.innerHTML += `

            <div
            class="d-flex justify-content-between mb-3"
            >

                <div>

                    <strong>
                    ${item.name}
                    </strong>

                    <br>

                    Qty :
                    ${item.quantity}

                </div>

                <div>

                    ₹${subtotal}

                </div>

            </div>

            `;

        });

        totalAmount.innerText =
        `₹${grandTotal}`;

    }

    catch(error){

        console.log(error);

    }

}

/* =====================
   PLACE ORDER
===================== */

document
.getElementById(
"placeOrderBtn"
)
.addEventListener(
"click",
async ()=>{

    const paymentMethod =
    document.querySelector(
    'input[name="payment"]:checked'
    ).value;

    try{

        const response =
        await fetch(
        `${API_URL}/orders/checkout`,
        {
        method:"POST",
        headers:{
        "Content-Type":
        "application/json",

        "Authorization":
        `Bearer ${token}`
    }


        });

        if(response.ok){

            alert(
            "Order Placed Successfully 🎉"
            );

            window.location.href =
            "orders.html";

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

/* =====================
   INIT
===================== */

loadProfile();
loadCart();