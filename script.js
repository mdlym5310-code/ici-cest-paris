const products = [
    {
        id: 1,
        name: "Ensemble Nike Tech New (Grey)",
        category: "Men",
        price: 38500,
        displayPrice: "38,500 DA",
        image: "images/lacoste_grey.jpg" // User should rename/upload accordingly
    },
    {
        id: 2,
        name: "Slide ✔️ UPTM Pointure 46 t",
        category: "Shoes",
        price: 20500,
        displayPrice: "20,500 DA",
        image: "images/shoes_orange.jpg"
    },
    {
        id: 3,
        name: "Ensemble Nike Tech New (Green)",
        category: "Men",
        price: 38500,
        displayPrice: "38,500 DA",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 4,
        name: "Sweat-shirt Air Jordan (Black)",
        category: "Men",
        price: 12000,
        displayPrice: "12,000 DA",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 5,
        name: "Pantalon Nike Air (Classic)",
        category: "Men",
        price: 11000,
        displayPrice: "11,000 DA",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 6,
        name: "Sweat-shirt Air Jordan (White)",
        category: "Men",
        price: 12500,
        displayPrice: "12,500 DA",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 7,
        name: "Claquette Lacoste (Original)",
        category: "Shoes",
        price: 12800,
        displayPrice: "12,800 DA",
        image: "https://images.unsplash.com/photo-1603808033192-082d651457bb?auto=format&fit=crop&q=80&w=1000"
    }
];

let cart = [];

// --- RENDERING PRODUCTS ---
function renderProducts(filteredProducts = products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Aucun produit trouvé.</p>`;
        return;
    }

    productGrid.innerHTML = filteredProducts.map((product, index) => `
        <div class="product-card reveal-item" style="transition-delay: ${index * 0.05}s" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x600?text=Paris+Boutique'" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <div class="product-price">${product.displayPrice}</div>
            </div>
        </div>
    `).join('');

    setTimeout(triggerReveal, 100);
}

// --- DYNAMIC SCROLL REVEAL ---
function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    reveals.forEach(reveal => observer.observe(reveal));
}

// --- CATEGORY FILTERING ---
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        document.querySelectorAll('.nav-links a').forEach(l => l.style.color = "var(--cod-gray)");
        e.target.style.color = "var(--shelby-green)";

        if (category === 'all') {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === category);
            renderProducts(filtered);
        }
    });
});

// --- SEARCH ---
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

// --- CART ---
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total-amount');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.querySelector('.close-cart');

function toggleCart() { cartDrawer.classList.toggle('active'); }
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
    if (cartBtn) cartBtn.textContent = `Panier (${cart.length})`;
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.displayPrice}</p>
                <span class="remove-item" onclick="removeFromCart(${index})">Supprimer</span>
            </div>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.textContent = `${total.toLocaleString()} DA`;
}

// --- WHATSAPP ---
const whatsappBtn = document.getElementById('whatsapp-checkout');
if (whatsappBtn) {
    whatsappBtn.onclick = () => {
        if (cart.length === 0) return alert("Votre panier est vide!");
        let message = "Salam ici.c'est.PARIS! Je souhaite commander:\n\n";
        cart.forEach((item, i) => message += `${i + 1}. ${item.name} - ${item.displayPrice}\n`);
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        message += `\nTotal: ${total.toLocaleString()} DA\n\nMerci de me confirmer la livraison.`;
        window.open(`https://wa.me/213774743573?text=${encodeURIComponent(message)}`, '_blank');
    };
}

// --- MODAL ---
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

if (closeModal) closeModal.onclick = () => { modal.classList.remove('active'); document.body.style.overflow = 'auto'; };
window.onclick = (event) => { if (event.target == modal) { modal.classList.remove('active'); document.body.style.overflow = 'auto'; } };

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    triggerReveal();
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
    else navbar.style.boxShadow = 'none';
});
