
function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}


function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


function updateCartCounter() {
    const cart = loadCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    
    $('a[href="cart.html"]').each(function() {
        const $cartLink = $(this);
        $cartLink.css('position', 'relative');
        
        let $counter = $cartLink.find('.cart-counter');
        
        if (totalItems > 0) {
            if ($counter.length === 0) {
                $cartLink.append(`<span class="cart-counter">${totalItems}</span>`);
            } else {
                $counter.text(totalItems);
            }
        } else {
            $counter.remove();
        }
    });
}

$(document).ready(function() {
    updateCartCounter();
});


$(document).on('click', '.add-to-cart', function() {
    const $button = $(this);
    const name = $button.data('name');
    const price = parseInt($button.data('price'));
    const img = $button.data('img');

    let cart = loadCart();
    let item = cart.find(p => p.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }

    saveCart(cart);
    updateCartCounter();
});


function renderCart() {
    const $container = $('#cart-container');
    if ($container.length === 0) return;

    let cart = loadCart();
    $container.empty();

    const deliveryCost = 190;
    const taxCost = 50;
    let itemsTotal = 0;
    let itemsCount = 0;

    if (cart.length === 0) {
        $('main').html(`
            <div class="empty-cart">
                <p style="font-size: 3rem; margin-bottom: 20px;">
                <img src="images/photo_empty_cart.png" alt="empty_cart" </p>
                <p>Корзина пуста</p>
                <p style="font-size: 1rem; margin-top: 10px;">
                    <a href="catalogue.html" style="color: #7A9A59; text-decoration: underline;">Вернуться в каталог</a>
                </p>
            </div>
        `);
        updateCartCounter();
        return;
    }

    cart.forEach((item, i) => {
        itemsTotal += item.price * item.qty;
        itemsCount += item.qty;

        $container.append(`
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="cart-item-weight">1 кг</p>
            </div>
            
            <div class="cart-item-price-wrapper">
                <div class="cart-item-price">₽${item.price * item.qty}</div>
                <button onclick="removeItem(${i})" class="remove-btn">
                    <img src="images/mini_cart.svg" alt="Удалить">
                </button>
            </div>
            
            <div class="qty-controls">
                <button onclick="changeQty(${i}, -1)" class="qty-btn">−</button>
                <span class="qty-display">${item.qty}</span>
                <button onclick="changeQty(${i}, 1)" class="qty-btn">+</button>
            </div>
        </div>
    `);
    });

    const total = itemsTotal + deliveryCost + taxCost;

    $('#items-count').text(itemsCount);
    $('#items-total').text('₽' + itemsTotal);
    $('#delivery-cost').text('₽' + deliveryCost);
    $('#tax').text('₽' + taxCost);
    $('#total').text('₽' + total);
    
    updateCartCounter();
}


$(document).ready(function() {
    renderCart();
});


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


$(document).ready(function() {
    $('#clear').on('click', function() {
        localStorage.removeItem('cart');
        renderCart();
    });
});
