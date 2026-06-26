

const token =
localStorage.getItem("token");

const ordersContainer =
document.getElementById(
"ordersContainer"
);

/* ==========================
   LOAD ORDERS
========================== */

async function loadOrders(){

    if(!token){

        window.location.href =
        "login.html";

        return;

    }

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

        renderOrders(
        orders
        );

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   RENDER ORDERS
========================== */

function renderOrders(orders){

    ordersContainer.innerHTML = "";

    if(orders.length === 0){

        ordersContainer.innerHTML = `

        <div class="col-12 text-center">

            <h3>
            No Orders Found 📦
            </h3>

        </div>

        `;

        return;
    }

    orders.forEach(order=>{

        let badgeClass = "bg-secondary";

        if(order.status === "Pending"){
            badgeClass = "bg-warning";
        }

        if(order.status === "Processing"){
            badgeClass = "bg-info";
        }

        if(order.status === "Shipped"){
            badgeClass = "bg-primary";
        }

        if(order.status === "Delivered"){
            badgeClass = "bg-success";
        }

        if(order.status === "Cancelled"){
            badgeClass = "bg-danger";
        }

        ordersContainer.innerHTML += `

        <div class="col-lg-6">

            <div class="card shadow border-0">

                <div class="card-body">

                    <h4>
                    Order #${order.order_id}
                    </h4>

                    <p>
                    Total:
                    ₹${order.total_amount}
                    </p>

                    <span class="badge ${badgeClass}">
                    ${order.status}
                    </span>

                    <hr>

                    <div class="d-flex gap-2 flex-wrap">

                        <button
                        class="btn btn-dark"
                        onclick="viewOrder(${order.order_id})"
                        >
                        View
                        </button>

                        <button
                        class="btn btn-danger"
                        onclick="cancelOrder(${order.order_id})"
                        >
                        Cancel
                        </button>

                        <button
                        class="btn btn-warning"
                        onclick="returnOrder(${order.order_id})"
                        >
                        Return
                        </button>

                        <button
                        class="btn btn-secondary"
                        onclick="deleteOrder(${order.order_id})"
                        >
                        Delete
                        </button>

                    </div>

                </div>

            </div>

        </div>

        `;
    });

}
/* ==========================
   CANCEL ORDER
========================== */

async function cancelOrder(id){

    if(
    !confirm(
    "Cancel Order?"
    )
    ){

        return;

    }

    try{

        const response =
        await fetch(

            `${API_URL}/orders/cancel/${id}`,

            {

                method:"PUT",

                headers:{

                    "Authorization":
                    `Bearer ${token}`

                }

            }

        );

        const data =
        await response.json();

        alert(
        data.message ||
        "Order Cancelled"
        );

        loadOrders();

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   RETURN ORDER
========================== */

async function returnOrder(id){

    if(
    !confirm(
    "Return Order?"
    )
    ){

        return;

    }

    try{

        const response =
        await fetch(

            `${API_URL}/orders/return/${id}`,

            {

                method:"PUT",

                headers:{

                    "Authorization":
                    `Bearer ${token}`

                }

            }

        );

        const data =
        await response.json();

        alert(
        data.message ||
        data.detail ||
        "Return Requested"
        );

        loadOrders();

    }

    catch(error){

        console.log(error);

    }

}

/* ==========================
   DELETE ORDER
========================== */

async function removeOrder(id){

    if(
    !confirm(
    "Delete Order?"
    )
    ){

        return;

    }

    try{

        const response =
        await fetch(

            `${API_URL}/orders/${id}`,

            {

                method:"DELETE",

                headers:{

                    "Authorization":
                    `Bearer ${token}`

                }

            }

        );

        const data =
        await response.json();

        alert(
        data.message ||
        "Order Deleted"
        );

        loadOrders();

    }

    catch(error){

        console.log(error);

    }

}

loadOrders();
async function deleteOrder(orderId){

    if(!confirm("Delete this order?")){
        return;
    }

    try{

        const response =
        await fetch(
        `${API_URL}/orders/${orderId}`,
        {
            method:"DELETE",

            headers:{
                "Authorization":
                `Bearer ${token}`
            }
        });

        const data =
        await response.json();

        alert(data.message);

        loadOrders();

    }

    catch(error){

        console.log(error);

    }

}