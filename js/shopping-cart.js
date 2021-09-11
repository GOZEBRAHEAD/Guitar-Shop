// ======== VARIABLES ======== //
const mainContent = document.getElementById("shopping-cart__main__content");
const totalProducts = document.getElementById("total__products");
const totalPrice = document.getElementById("total__prices");

// ======== FUNCIONES ======== //
const deleteGuitar = (botonEliminarGuitarra, index) => {

    botonEliminarGuitarra.addEventListener("click", () => {

        if (localStorage.getItem("itemsCarrito") === null) {
            return;
        }
    
        let actualCart = JSON.parse(localStorage.getItem("itemsCarrito"));

        if (actualCart.length === 1) {

            mainContent.innerHTML = ``;
            totalProducts.innerHTML = "Products selected: 0";
            totalPrice.innerHTML = "Total: $0";
            localStorage.clear();
            return;
        }

        actualCart.splice(index, 1);

        localStorage.setItem("itemsCarrito", JSON.stringify(actualCart));

        loadShoppingCart();
    });
};

const loadShoppingCart = () => {

    if (localStorage.getItem("itemsCarrito") === null) {
        totalProducts.innerHTML = "Products selected: 0";
        totalPrice.innerHTML = "Total: $0";
        return;
    }

    let totalSumProducts = 0, totalSumUSD = 0;

    mainContent.innerHTML = ``;

    const actualCart = JSON.parse(localStorage.getItem("itemsCarrito"));

    let cartSize = actualCart.length;

    for (let i = 0; i < cartSize; i++) {

        const cartItem = document.createElement("div");

        let actualItem = actualCart[i][0];
        let quantityItem = actualCart[i][1];

        cartItem.classList.add("shopping-cart__main__item");

        cartItem.innerHTML = `
        <img class="shopping-cart__main__item__img" src="./img/products/${actualItem.image}" alt="Guitar image" loading="lazy" />

        <p class="shopping-cart__main__item__title">${actualItem.title}</p>

        <p class="shopping-cart__main__item__quantity">(x${quantityItem})</p>

        <p class="shopping-cart__main__item__price">$${actualItem.price}</span></p>

        <button class="shopping-cart__main__item__delete" id="Guitar_${i}">Delete</button>
        `;

        totalSumUSD += actualItem.price * quantityItem;
        totalSumProducts += quantityItem;

        mainContent.appendChild(cartItem);

        const botonEliminarGuitarra = document.getElementById(`Guitar_${i}`);
        deleteGuitar(botonEliminarGuitarra, i);
    }

    totalProducts.innerHTML = `Products selected: ${totalSumProducts}`;
    totalPrice.innerHTML = `Total: $${totalSumUSD}`;
};

// ======== ONLOAD ======== //
window.onload = () => {

    loadShoppingCart();
}