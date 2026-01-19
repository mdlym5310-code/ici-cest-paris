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

    const message = `salam ici.c'est.PARIS khasni hed product: ${product.name} (${product.displayPrice})`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/213774743573?text=${encoded}`, '_blank');
}

// --- NOTIFICATIONS ---
function showNotification(message) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<span>✔️</span> ${message}`;
    container.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
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
    addBtn.textContent = "COMMANDER VIA WHATSAPP";
    addBtn.onclick = () => sendToWhatsApp(productId);
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
