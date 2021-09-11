// ======== CONSTANTS + VARIABLES ======== //
// Constants
const mainContent = document.getElementById("index__main__content");

const applyFilterButton = document.getElementById("btn-filter-styles");
const deleteFilterButton = document.getElementById("btn-delete-styles");

const sortSelection = document.getElementById("sort-selection");
const minPriceSelection = document.getElementById("price-min-selection");
const maxPriceSelection = document.getElementById("price-max-selection");
const brandSelection = document.getElementById("brand-selection");
const categorySelection = document.getElementById("category-selection");

const TOTAL_ELECTRIC_GUITARS = 6;
const TOTAL_COMBO_GUITARS = 2;
const TOTAL_ACOUSTIC_GUITARS = 2;
const TOTAL_ACCESSORIES = 6;

const TOTAL_PRODUCTS =
                    TOTAL_ELECTRIC_GUITARS + 
                    TOTAL_ACOUSTIC_GUITARS + 
                    TOTAL_COMBO_GUITARS + 
                    TOTAL_ACCESSORIES;

const PRODUCTS = [

    // ELECTRIC
    { id: 0, title: "Epiphone Les Paul Traditional Pro IV Limited Edition", price: 449, category: "Electric", brand: "Epiphone", image: "Electric_0.webp" },
    { id: 1, title: "Epiphone Les Paul Special-I Limited-Edition Worn Black", price: 169, category: "Electric", brand: "Epiphone", image: "Electric_1.webp" },
    { id: 2, title: "Gibson Les Paul Standard '60s Unburst", price: 2499, category: "Electric", brand: "Gibson", image: "Electric_2.webp" },
    { id: 3, title: "Squier Bullet Stratocaster Hardtail Limited Edition Red Sparkle", price: 199, category: "Electric", brand: "Fender", image: "Electric_3.webp" },
    { id: 4, title: "Jackson Dinky JS22 DKA Arch Top Natural Snow White", price: 299, category: "Electric", brand: "Jackson", image: "Electric_4.webp" },
    { id: 5, title: "Ibanez JEMJR Steve Vai Signature JEM Series White", price: 499, category: "Electric", brand: "Ibanez", image: "Electric_5.webp" },

    // COMBO
    { id: 6, title: "Squier Stratocaster Pack With Squier Frontman 10G Amp Black", price: 269, category: "Combo", brand: "Fender", image: "Combo_0.webp" },
    { id: 7, title: "Squier Affinity Series Stratocaster HSS Pack with Fender Frontman 15G Amp Candy Apple Red", price: 329, category: "Combo", brand: "Fender", image: "Combo_1.webp" },

    // ACOUSTIC
    { id: 8, title: "Fender CC-60S Concert Acoustic Natural", price: 229, category: "Acoustic", brand: "Fender", image: "Acoustic_0.webp" },
    { id: 9, title: "Fender CC-60SCE All-Mahogany Limited Edition Acoustic-Electric Satin Aged Cognac Burst", price: 349, category: "Acoustic", brand: "Fender", image: "Acoustic_1.webp" },

    // ACCESSORIES
    { id: 10, title: "Mogami Gold Series Instrument Cable 25 ft.", price: 85, category: "Accessories", brand: "Mogami", image: "Accessories_0.webp" },
    { id: 11, title: "Fender Deluxe Hanging Guitar Stand", price: 39, category: "Accessories", brand: "Fender", image: "Accessories_1.webp" },
    { id: 12, title: "Road Runner RRDWA Deluxe Wood Dreadnought Acoustic Case", price: 89, category: "Accessories", brand: "Road Runner", image: "Accessories_2.webp" },
    { id: 13, title: "Gibson Guitar Pick Tin - 50 Standard Picks Medium", price: 23, category: "Accessories", brand: "Gibson", image: "Accessories_3.webp" },
    { id: 14, title: "Fender Champion 20 Guitar Combo Amp Black", price: 139, category: "Accessories", brand: "Fender", image: "Accessories_4.webp" },
    { id: 15, title: "Marshall MG30GFX 30W 1x10 Guitar Combo Amp", price: 239, category: "Accessories", brand: "Marshall", image: "Accessories_5.webp" }

];

const sweetAlertSuccessMessage = {
    position: 'center',
    icon: 'success',
    title: 'Product added to cart!',
    showConfirmButton: false,
    timer: 1500
};

// Variables
let products = PRODUCTS;

// ======== FUNCIONES ======== //
const startFilterButtons = () => {

    applyFilterButton.addEventListener("click", () => {

        products = PRODUCTS;

        // ======== FILTRO DE PRECIO ======== //
        const priceMinSelected = parseInt(minPriceSelection.value) || 0;
        const priceMaxSelected = parseInt(maxPriceSelection.value) || 2500;

        if (priceMinSelected < 0 || priceMaxSelected < 0) {
            alert("ERROR: the price must be greater than or equal to 0.");
            return;
        }
        else if (priceMinSelected > 2500 || priceMaxSelected > 2500) {
            alert("ERROR: the price must be less than or equal to 0.");
            return;
        }
        else if (priceMaxSelected <= priceMinSelected) {
            alert("ERROR: the minimum price must be less than the higher price.");
            return;
        }

        products = products.filter(actualItem => 
            actualItem.price >= priceMinSelected && actualItem.price <= priceMaxSelected);

        // ======== FILTRO DE MARCA ======== //
        const brandSelected = brandSelection.value;

        // Si seleccionó una marca específica
        if (brandSelected !== "All") {
            
            products = products.filter(actualItem => actualItem.brand === brandSelected);
        }

        // ======== FILTRO DE CATEGORIA ======== //
        const categorySelected = categorySelection.value;

        if (categorySelected !== "All") {

            products = products.filter(actualItem => actualItem.category === categorySelected);
        }

        // ======== LLAMADO A FUNCION ======== //
        loadGuitars();
    });

    deleteFilterButton.addEventListener("click", () => {

        minPriceSelection.value = "";
        maxPriceSelection.value = "";
        sortSelection.selectedIndex = 0;
        brandSelection.selectedIndex = 0;
        categorySelection.selectedIndex = 0;

        products = PRODUCTS;
        loadGuitars();
    });
};

const startSortBar = () => {

    sortSelection.addEventListener("change", (e) => {

        const valueSelected = e.target.value;

        switch (valueSelected) {

            case "masRelevante":

                products.sort((a, b) => a.id - b.id);
                break;
    
            case "menorPrecio":
            case "mayorPrecio":

                products.sort((a, b) => (valueSelected === "menorPrecio") ? 
                                            (a.price - b.price) : (b.price - a.price));
                break;
        }
        
        loadGuitars();
    });
};

const addToCart = (btnAddProduct, actualProduct) => {

    btnAddProduct.addEventListener("click", () => {

        let actualCart = JSON.parse(localStorage.getItem("itemsCarrito")) || [];

        // Cada item del carrito tendrá el objeto guitarra y un contador de cantidades.
        let finalItem = [actualProduct, 1];

        // Si el carrito no tiene ningun producto, directamente lo meto dentro
        if (actualCart.length === 0) {

            actualCart.push(finalItem);
        }
        else {

            let auxIndexItem = 0;

            if (actualCart.some(actualElement => {
                    auxIndexItem++;
                    return actualElement[0].id === actualProduct.id;
                })) {
                
                actualCart[auxIndexItem - 1][1]++;
            }
            else {

                actualCart.push(finalItem);
            }
        }

        // Guardo en el localStorage el carrito
        localStorage.setItem("itemsCarrito", JSON.stringify(actualCart));

        // Muestro animación de SweetAlert
        Swal.fire(sweetAlertSuccessMessage);
    });
};

const loadGuitars = () => {

    mainContent.innerHTML = ``;

    let totalProducts = products.length;

    for (let i = 0; i < totalProducts; i++) {

        const newGuitarContent = document.createElement("div");

        newGuitarContent.classList.add("index__main__card");

        let actualProduct = products[i];

        newGuitarContent.innerHTML = `
        <img class="index__main__card__img" src="./img/products/${actualProduct.image}" alt="Guitar image" loading="lazy" />

        <p class="index__main__card__title">${actualProduct.title}</p>

        <p class="index__main__card__price">$<span id="guitar_price">${actualProduct.price}</span></p>

        <button class="index__main__card__buy" id="Product_${actualProduct.id}">Add to cart</button>
        `;

        mainContent.appendChild(newGuitarContent);

        const btnAddProduct = document.getElementById(`Product_${actualProduct.id}`);
        addToCart(btnAddProduct, actualProduct);
    }
};

// ======== ONLOAD ======== //
window.onload = () => {

    startFilterButtons();

    startSortBar();

    loadGuitars();
};