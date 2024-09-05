// -------------------- INITIALIZATION --------------------
window.onload = initializeCart;

// Initialize cart from localStorage
function initializeCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCartItems(cart);
}

// -------------------- CART MANAGEMENT --------------------
function displayCartItems(cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total');

    if (!cartItemsContainer || !totalSpan) {
        console.error('Cart items container or total span not found.');
        return;
    }

    cartItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
                <button onclick="removeFromCart(${index})">Remove</button>
            </div>`;
        cartItemsContainer.appendChild(itemDiv);
    });

    totalSpan.textContent = `₹${total.toFixed(2)}`;
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(cart);
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(cart);
    showDynamicIsland('Product removed from cart!', true);
}

// -------------------- DYNAMIC ISLAND --------------------
function showDynamicIsland(message, isRemoval) {
    const dynamicIsland = document.querySelector('.dynamic-island');

    if (!dynamicIsland) {
        console.error('Dynamic Island element not found');
        return;
    }

    const messageElement = dynamicIsland.querySelector('.message');
    if (messageElement) {
        messageElement.textContent = message;
    } else {
        console.error('Message element not found inside Dynamic Island');
    }

    dynamicIsland.classList.add('show');
    dynamicIsland.classList.toggle('remove-item', isRemoval);
    dynamicIsland.classList.toggle('add-item', !isRemoval);

    setTimeout(() => {
        dynamicIsland.classList.remove('show', 'add-item', 'remove-item');
    }, 2000); // 2 seconds
}

// -------------------- THEME MANAGEMENT --------------------
const body = document.querySelector('body');
const btn = document.querySelector('.btn');
const icon = document.querySelector('.btn__icon');

function store(value) {
    localStorage.setItem('darkmode', value);
}

function load() {
    const darkmode = localStorage.getItem('darkmode');

    if (!darkmode) {
        store(false);
        icon.classList.add('fa-sun');
    } else if (darkmode === 'true') {
        body.classList.add('darkmode');
        icon.classList.add('fa-moon');
    } else if (darkmode === 'false') {
        icon.classList.add('fa-sun');
    }
}

load();

btn.addEventListener('click', () => {
    body.classList.toggle('darkmode');
    icon.classList.add('animated');

    store(body.classList.contains('darkmode'));

    if (body.classList.contains('darkmode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    setTimeout(() => {
        icon.classList.remove('animated');
    }, 500);
});

// -------------------- PRODUCT HANDLING --------------------
const jsonURL = 'products.json';

fetch(jsonURL)
    .then(response => response.json())
    .then(data => {
        const productsContainer = document.getElementById('products-container');

        if (!productsContainer) {
            console.error('Products container not found.');
            return;
        }

        productsContainer.innerHTML = ''; // Clear existing content

        data.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>₹${parseFloat(product.price).toFixed(2)}</p>
                <button class="add-to-cart-btn" 
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-image="${product.image}">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);
        });

        // Attach event listeners for add-to-cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', () => {
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));
                const image = button.getAttribute('data-image');
                addToCart(name, price, image);
            });
        });
    })
    .catch(error => console.error('Error loading products:', error));

// -------------------- SEARCH FUNCTIONALITY --------------------
document.getElementById('search-btn').addEventListener('click', () => {
    const searchInput = document.getElementById('search-bar').value;
    if (searchInput.trim()) {
        showSearchIsland();
    }
});

function showSearchIsland() {
    const searchIsland = document.querySelector('.dynamic-island.search-island');

    if (!searchIsland) {
        console.error('Search Dynamic Island element not found');
        return;
    }

    searchIsland.classList.add('show');
    searchIsland.classList.remove('remove-item');

    setTimeout(() => {
        searchIsland.classList.remove('show');
    }, 2000); // 2 seconds
}

// -------------------- UTILITY FUNCTIONS --------------------
function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.name === name);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(cart);
    showDynamicIsland('Product added to cart!', false);
}

function navigateTo(url) {
    window.location.href = url;
}
