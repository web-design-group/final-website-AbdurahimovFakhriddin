
function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Сохранение корзины в localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}



document.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
        let name = e.target.dataset.name;
        let price = parseInt(e.target.dataset.price);
        let img = e.target.dataset.img;

        let cart = loadCart();
        let item = cart.find(p => p.name === name);

        if (item) {
            item.qty++;
        } else {
            cart.push({ name, price, img, qty: 1 });
        }

        saveCart(cart);
    }
});



function renderCart() {
    if (!document.getElementById("cart-container")) return;

    let cart = loadCart();
    let container = document.getElementById("cart-container");
    container.innerHTML = "";

    const deliveryCost = 190;
    const taxCost = 50;
    let itemsTotal = 0;
    let itemsCount = 0;

    if (cart.length === 0) {
        document.querySelector('main').innerHTML = `
            <div class="empty-cart">
                <p style="font-size: 3rem; margin-bottom: 20px;">🛒</p>
                <p>Корзина пуста</p>
                <p style="font-size: 1rem; margin-top: 10px;">
                    <a href="catalogue.html" style="color: #7A9A59; text-decoration: underline;">Вернуться в каталог</a>
                </p>
            </div>
        `;
        return;
    }

    cart.forEach((item, i) => {
        itemsTotal += item.price * item.qty;
        itemsCount += item.qty;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-weight">1 кг</p>
                </div>
                
                <div class="cart-item-price">₽${item.price * item.qty}</div>
                
                <div class="cart-item-controls">
                    <div class="qty-controls">
                        <button onclick="changeQty(${i}, -1)" class="qty-btn">−</button>
                        <span class="qty-display">${item.qty}</span>
                        <button onclick="changeQty(${i}, 1)" class="qty-btn">+</button>
                    </div>
                    <button onclick="removeItem(${i})" class="remove-btn"></button>
                </div>
            </div>
        `;
    });


    const total = itemsTotal + deliveryCost + taxCost;

    document.getElementById("items-count").textContent = itemsCount;
    document.getElementById("items-total").textContent = "₽" + itemsTotal;
    document.getElementById("delivery-cost").textContent = "₽" + deliveryCost;
    document.getElementById("tax").textContent = "₽" + taxCost;
    document.getElementById("total").textContent = "₽" + total;
}


renderCart();


function changeQty(index, delta) {
    let cart = loadCart();
    cart[index].qty += delta;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}



function removeItem(index) {
    let cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}



const clearBtn = document.getElementById("clear");
if (clearBtn) {
    clearBtn.onclick = () => {
        localStorage.removeItem("cart");
        renderCart();
    };
}