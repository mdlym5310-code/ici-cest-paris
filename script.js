// --- FIREBASE CONFIGURATION ---
// IMPORTANT: Replace this with your own Firebase Config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyAs-EXAMPLE-PLACEHOLDER",
    authDomain: "ici-cest-paris-store.firebaseapp.com",
    databaseURL: "https://ici-cest-paris-store-default-rtdb.firebaseio.com",
    projectId: "ici-cest-paris-store",
    storageBucket: "ici-cest-paris-store.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
}

// --- PRODUCT STATE ---
let products = [];
let cart = [];

// --- FETCH FROM FIREBASE ---
function syncProducts() {
    if (typeof database === 'undefined') {
        console.warn("Firebase not initialized. Using local fallback.");
        renderProducts(fallbackProducts);
        return;
    }

    database.ref('products').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            products = Object.values(data);
            renderProducts(products);
        } else {
            console.log("No data in Firebase. Loading defaults.");
            renderProducts(fallbackProducts);
        }
    });
}

const fallbackProducts = [
    { id: 1, name: "Nike Tech Grey", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "images/lacoste_grey.jpg" },
    { id: 2, name: "Jordan Sweat Black", category: "Homme", price: 12000, displayPrice: "12,000 DA", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000" }
];

// --- RENDERING PRODUCTS ---
function renderProducts(pList) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = pList.map((product, index) => `
        <div class="product-card reveal-item" style="transition-delay: ${index * 0.05}s" onclick="openProductModal(${product.id})">
            <div class="product-image">
                ${product.oldPrice ? `<div class="discount-label" style="position:absolute; background:var(--paris-red); color:white; padding:5px 10px; z-index:10; font-weight:800; border-radius:0 0 10px 0;">PROMO</div>` : ''}
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x600?text=Paris+Boutique'" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <div class="product-price">
                    ${product.oldPrice ? `<span style="text-decoration:line-through; color:#999; font-size:14px; margin-right:10px;">${product.oldPrice.toLocaleString()} DA</span>` : ''}
                    ${product.displayPrice}
                </div>
            </div>
        </div>
    `).join('');

    setTimeout(triggerReveal, 100);
}

// --- SLIDER SYSTEM ---
let currentSlide = 0;
const slidesContainer = document.querySelector('.slides');
const dotsContainer = document.getElementById('slider-dots');
const slides = document.querySelectorAll('.slide');

if (dotsContainer && slides.length > 0) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    });
}

function goToSlide(index) {
    currentSlide = index;
    if (slidesContainer) slidesContainer.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    if (slides.length > 0) {
        currentSlide = (currentSlide + 1) % 3;
        goToSlide(currentSlide);
    }
}
setInterval(nextSlide, 5000);

// --- WHATSAPP ORDER LOGIC ---
function sendToWhatsApp(productId) {
    const product = products.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
    if (!product) return;

    // Exact phrase requested by user: salam ici.c'est.PARIS khasni hed product
    const message = `salam ici.c'est.PARIS khasni hed product: ${product.name} (${product.displayPrice})`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/213774743573?text=${encoded}`, '_blank');
}

// Global checkout button in cart drawer
const mainCheckoutBtn = document.getElementById('whatsapp-checkout');
if (mainCheckoutBtn) {
    mainCheckoutBtn.onclick = () => {
        if (cart.length === 0) return alert("Votre panier est vide!");
        let message = "salam ici.c'est.PARIS khasni hed products:\n\n";
        cart.forEach((item, i) => message += `${i + 1}. ${item.name} (${item.displayPrice})\n`);
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        message += `\nTotal: ${total.toLocaleString()} DA`;
        window.open(`https://wa.me/213774743573?text=${encodeURIComponent(message)}`, '_blank');
    };
}

// --- MODAL ---
function openProductModal(productId) {
    const product = products.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-price').textContent = product.displayPrice;

    const modal = document.getElementById('product-modal');
    modal.classList.add('active');

    // Update the Add to Cart button to be a direct WhatsApp trigger as per user request
    const addBtn = document.querySelector('.add-to-cart-btn');
    addBtn.textContent = "COMMANDER EXPRESS (WHATSAPP)";
    addBtn.onclick = () => sendToWhatsApp(productId);

    // Also allow adding to the "real" cart if they want to buy multiple
    const secondaryAdd = document.createElement('button');
    secondaryAdd.className = 'icon-btn';
    secondaryAdd.style.marginTop = '10px';
    secondaryAdd.style.width = '100%';
    secondaryAdd.style.background = 'white';
    secondaryAdd.style.color = 'var(--paris-blue)';
    secondaryAdd.style.border = '2px solid var(--paris-blue)';
    secondaryAdd.textContent = "AJOUTER AU PANIER";
    secondaryAdd.onclick = () => {
        addToCart(productId);
        modal.classList.remove('active');
    };

    // Clear old secondaries if any
    const modalInfo = document.querySelector('.modal-info');
    const existing = modalInfo.querySelector('.extra-btn');
    if (existing) existing.remove();
    secondaryAdd.classList.add('extra-btn');
    modalInfo.appendChild(secondaryAdd);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
    cart.push(product);
    updateCartUI();
    showNotification(`${product.name} ajouté au panier !`);
    if (!document.getElementById('cart-drawer').classList.contains('active')) {
        setTimeout(() => document.getElementById('cart-drawer').classList.add('active'), 500);
    }
}

function updateCartUI() {
    const cartBtn = document.getElementById('cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total-amount');

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

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// --- DYNAMIC REVEAL ---
function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    reveals.forEach(reveal => observer.observe(reveal));
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    syncProducts();
    triggerReveal();
});

// Category filtering updated for dynamic list
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        if (category === 'all') renderProducts(products);
        else renderProducts(products.filter(p => p.category === category));
    });
});
