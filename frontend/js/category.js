

    const params =
    new URLSearchParams(
    window.location.search
    );

    const categoryId =
    params.get("category");
    console.log(categoryId);
    const subcategoryContainer =
    document.getElementById(
    "subcategoryContainer"
    );

    loadSubcategories();

    async function loadSubcategories(){

        try{

            const response =
            await fetch(

            `${API_URL}/categories/subcategories/${categoryId}`

            );

            const subcategories =
            await response.json();

            renderSubcategories(
            subcategories
            );

        }

        catch(error){

            console.log(error);

        }

    }

    function renderSubcategories(items){

        subcategoryContainer.innerHTML = "";

        items.forEach(item=>{

            subcategoryContainer.innerHTML += `

            <div class="col-md-3">

                <div
                class="card shadow-sm p-4 text-center"
                style="cursor:pointer"
                onclick="openProducts(${item.id})"
                >

                    <h5>
                    ${item.name}
                    </h5>

                </div>

            </div>

            `;

        });

    }

    function openProducts(subcategoryId){

        window.location.href =
        `products.html?subcategory=${subcategoryId}`;

    }

console.log(window.location.href);
console.log(window.location.search);