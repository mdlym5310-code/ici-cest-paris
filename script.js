const products = [
    {
        id: 1,
        name: "Nouveauté ensemble 🐊 Taille S,L,XXL",
        category: "Men",
        price: 38500,
        displayPrice: "38,500 DA",
        image: "images/lacoste_grey.jpg"
    },
    {
        id: 2,
        name: "Slide ✔️ UPTM Pointure 46 t",
        category: "Shoes",
        price: 20500,
        displayPrice: "20,500 DA",
        image: "images/shoes_orange.jpg"
    }
];

let cart = [];

// --- RENDERING PRODUCTS ---
function renderProducts(filteredProducts = products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found.</p>`;
        return;
    }

    productGrid.innerHTML = filteredProducts.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x600?text=Upload+Photo'" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <div class="product-price">${product.displayPrice}</div>
            </div>
        </div>
    `).join('');
}

// --- CATEGORY FILTERING ---
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');

        // Remove active class from all (if any) and add to clicked
        document.querySelectorAll('.nav-links a').forEach(l => l.style.opacity = "0.5");
        e.target.style.opacity = "1";

        if (category === 'all') {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category || (category === 'Sale' && p.displayPrice.includes('Sale')));
            renderProducts(filtered);
        }
    });
});

// --- SEARCH FUNCTIONALITY ---
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filtered);
    });
}

// --- CART SYSTEM ---
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-amount');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.querySelector('.close-cart');

function toggleCart() {
    cartDrawer.classList.toggle('active');
}

if (cartBtn) cartBtn.onclick = toggleCart;
if (closeCart) closeCart.onclick = toggleCart;

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
    if (!cartDrawer.classList.contains('active')) toggleCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    // Update Cart Button Count
    if (cartBtn) cartBtn.textContent = `Cart (${cart.length})`;

    // Render Items
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.displayPrice}</p>
                <span class="remove-item" onclick="removeFromCart(${index})">Remove</span>
            </div>
        </div>
    `).join('');

    // Update Total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.textContent = `${total.toLocaleString()} DA`;
}

// --- WHATSAPP CHECKOUT ---
const whatsappBtn = document.getElementById('whatsapp-checkout');
if (whatsappBtn) {
    whatsappBtn.onclick = () => {
        if (cart.length === 0) {
            alert("Your bag is empty!");
            return;
        }

        let message = "Salam DLMSTREET! I want to order:\n\n";
        cart.forEach((item, i) => {
            message += `${i + 1}. ${item.name} - ${item.displayPrice}\n`;
        });

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        message += `\nTotal: ${total.toLocaleString()} DA\n\nPlease let me know the delivery details.`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappNumber = "213XXXXXXXXX"; // OWNER SHOULD CHANGE THIS
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    };
}

// --- PRODUCT MODAL ---
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
let currentModalProductId = null;

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    currentModalProductId = productId;

    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-price').textContent = product.displayPrice;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

document.querySelector('.add-to-cart-btn').onclick = () => {
    if (currentModalProductId) {
        addToCart(currentModalProductId);
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

if (closeModal) {
    closeModal.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});
