// --- FIREBASE CONFIGURATION ---
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
    try {
        firebase.initializeApp(firebaseConfig);
        var database = firebase.database();
    } catch (e) {
        console.warn("Firebase Init Error:", e);
    }
}

let products = [];
let cart = [];

// Fallback products - ALWAYS available if Firebase is empty or fails
const fallbackProducts = [
    { id: 1, name: "Ensemble Nike Tech 💚🤍", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-1.fna.fbcdn.net/v/t51.82787-15/612217866_18080234006257992_7913269358075475897_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzgwODY4ODIxNjgwNzIyMjM3NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwNS5zZHIuQzMifQ%3D%3D&_nc_ohc=Qfr-nClZUsMQ7kNvwH1p8VL&_nc_oc=AdmoCL2pP3zc3qJKBVuJzNdcthHZ4QHPhSABCtiIGx2orugqrVuswWRPTfW5vg0kLew&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-1.fna&_nc_gid=5VHWhoKhmFbc0t2fwkzJ6g&oh=00_Afq0Fig-9j9d5Yf9qdkqBD1RDiAIyPRkshdVy-3foLCyXw&oe=69748465" },
    { id: 2, name: "Ensemble Nike x Atletico 💙❤️", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-1.fna.fbcdn.net/v/t51.82787-15/615892372_18080234621257992_3050554319578621501_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=103&ig_cache_key=MzgwODY5NjA5MjMzNDM4NTk1OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTc2Ni5oZHIuQzMifQ%3D%3D&_nc_ohc=Rre9KeILRTcQ7kNvwHCWejz&_nc_oc=AdkDE53Q8FxGPfSHSyeoSwN07oW8MzbCnEU7eb5Ku8lp2mDxevqdMsDco4Y9rJi3cco&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-1.fna&_nc_gid=QJvbO6Nbvs4ph1wPfqi9Ug&oh=00_AfoezD8_m8UjZRsSICzjNRz_0q5D9Ba89lyElKnTvTMGdQ&oe=6974A4F5" },
    { id: 3, name: "Ensemble Nike Noir/Rose 🖤❤️", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-2.fna.fbcdn.net/v/t51.82787-15/612989955_18080316740257992_6861574540520538097_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzgwOTQwNTQzNTc3ODM0OTM1MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTU5NS5zZHIuQzMifQ%3D%3D&_nc_ohc=teOBTCKU4mYQ7kNvwFnXpwY&_nc_oc=AdkmEPAa2kMIrqeen4s0mADOHmMpij8kD0PFvKiEpv_8Whs2zbQkxjw7Z34AL5TszSk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-2.fna&_nc_gid=IKqva_a0WzjJmT0R8rL_sw&oh=00_AfrgzQDYFp9SK_pTC0sf6x8Q8i0n-VmhoUvedQNhuLXr5g&oe=6974A73A" },
    { id: 4, name: "Ensemble Air Max 🩵🖤", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-1.fna.fbcdn.net/v/t51.82787-15/587798499_18080317931257992_2281133955307095287_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=109&ig_cache_key=MzgwOTQxOTI0NTM4MTY3MjIwNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTc0Ny5oZHIuQzMifQ%3D%3D&_nc_ohc=KGitXYc5basQ7kNvwGxlcta&_nc_oc=AdnrxQU4w12j7laA7HpavyKVuF0cyumMIwMum-FQ-aTawQoZBwztW8j54W2SYxF5Seg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-1.fna&_nc_gid=cVeyYAC11vAvWrKyckIZrw&oh=00_Afp-7SKOtYQ3IoglObiUP_cxFFlpCpq5cN1Z0Dk7tHreBw&oe=6974B4B6" },
    { id: 5, name: "Ensemble Sénégal 🇸🇳", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-2.fna.fbcdn.net/v/t51.82787-15/619303050_18080772734257992_1993550259614549432_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=MzgxMzA3MjI4MzA4MjMzNDUwOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTY3Ny5zZHIuQzMifQ%3D%3D&_nc_ohc=rFEX3G6P_YsQ7kNvwHrOwIY&_nc_oc=AdkxY-yHBx2qtddO_hhLSlKySor92CEhRcl1ZqUHrAUHKmrCPBmXN9g8Mmz69SQ1eps&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-2.fna&_nc_gid=Xupo8UsaO1pn5dIgLm4Pow&oh=00_AfrKHbXNFzgrQQeUdydeDZRWjxtP29WMyRp03GByJf09_Q&oe=6974B3A3" }
];

function syncProducts() {
    // Show fallbacks immediately while waiting for Firebase
    renderProducts(fallbackProducts);

    if (typeof database === 'undefined' || !database) {
        console.warn("Database not ready.");
        return;
    }

    try {
        database.ref('products').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                products = Object.values(data);
                renderProducts(products);
            } else {
                console.log("Firebase empty, using fallbacks.");
                renderProducts(fallbackProducts);
            }
        }, (error) => {
            console.error("Firebase sync error:", error);
            renderProducts(fallbackProducts);
        });
    } catch (err) {
        console.error("Firebase runtime error:", err);
        renderProducts(fallbackProducts);
    }
}

function renderProducts(pList) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    // Clear the grid before rendering new items
    productGrid.innerHTML = '';

    if (!pList || pList.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Aucun produit trouvé.</p>';
        return;
    }

    productGrid.innerHTML = pList.map((product, index) => {
        // Handle potential missing data in custom products
        const name = product.name || "Produit sans nom";
        const price = product.displayPrice || (product.price ? product.price.toLocaleString() + " DA" : "Contactez-nous");
        const img = product.image || 'https://placehold.co/600x600?text=Paris+Boutique';

        return `
            <div class="product-card reveal-item" style="transition-delay: ${index * 0.05}s" onclick="openProductModal(${product.id || index})">
                <div class="product-image">
                    ${product.oldPrice ? `<div class="discount-label">PROMO</div>` : ''}
                    <img src="${img}" alt="${name}" onerror="this.src='https://placehold.co/600x600?text=Paris+Boutique'" loading="lazy">
                </div>
                <div class="product-info">
                    <h3>${name}</h3>
                    <p>${product.category || 'Général'}</p>
                    <div class="product-price">
                        ${product.oldPrice ? `<span style="text-decoration:line-through; color:#999; font-size:14px; margin-right:10px;">${product.oldPrice.toLocaleString()} DA</span>` : ''}
                        ${price}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    setTimeout(triggerReveal, 100);
}

// SLIDER LOGIC
let currentSlide = 0;
function goToSlide(index) {
    const slidesContainer = document.querySelector('.slides');
    const dots = document.querySelectorAll('.dot');
    currentSlide = index;
    if (slidesContainer) slidesContainer.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        currentSlide = (currentSlide + 1) % 3;
        goToSlide(currentSlide);
    }
}
setInterval(nextSlide, 5000);

// WHATSAPP INTEGRATION
function sendToWhatsApp(productId) {
    const product = products.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
    if (!product) return;
    const message = `salam ici.c'est.PARIS khasni hed product: ${product.name} (${product.displayPrice || product.price})`;
    window.open(`https://wa.me/213774743573?text=${encodeURIComponent(message)}`, '_blank');
}

// GLOBAL CART LOGIC
function addToCart(productId) {
    const product = products.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
    if (!product) return;
    cart.push(product);
    updateCartUI();
    showNotification(`${product.name} ajouté au panier!`);
}

function updateCartUI() {
    const cartBtn = document.getElementById('cart-btn');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-amount');

    if (cartBtn) cartBtn.textContent = `Panier (${cart.length})`;

    if (cartItems) {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" onerror="this.src='https://placehold.co/100x100'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.displayPrice || item.price + " DA"}</p>
                    <span onclick="removeFromCart(${index})" style="cursor:pointer; color:red; font-size:12px; font-weight:800; text-transform:uppercase;">Supprimer</span>
                </div>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + (parseInt(item.price) || 0), 0);
    if (cartTotal) cartTotal.textContent = `${total.toLocaleString()} DA`;
}

function removeFromCart(i) {
    cart.splice(i, 1);
    updateCartUI();
}

// MODAL LOGIC
function openProductModal(productId) {
    const product = products.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const mImg = document.getElementById('modal-image');
    const mName = document.getElementById('modal-name');
    const mCat = document.getElementById('modal-category');
    const mPrice = document.getElementById('modal-price');
    const addBtn = document.querySelector('.add-to-cart-btn');

    if (mImg) mImg.src = product.image;
    if (mName) mName.textContent = product.name;
    if (mCat) mCat.textContent = product.category;
    if (mPrice) mPrice.textContent = product.displayPrice || product.price + " DA";

    if (modal) modal.classList.add('active');

    if (addBtn) {
        addBtn.onclick = () => {
            sendToWhatsApp(productId);
            modal.classList.remove('active');
        };
    }

    // Add extra "Add to Cart" button if not exists
    const modalInfo = document.querySelector('.modal-info');
    if (modalInfo && !modalInfo.querySelector('.extra-btn')) {
        const btn = document.createElement('button');
        btn.className = 'icon-btn extra-btn';
        btn.style.marginTop = '15px'; btn.style.width = '100%';
        btn.style.background = 'white'; btn.style.color = 'var(--paris-blue)'; btn.style.border = '2px solid var(--paris-blue)';
        btn.textContent = "AJOUTER AU PANIER";
        btn.onclick = () => {
            addToCart(productId);
            modal.classList.remove('active');
        };
        modalInfo.appendChild(btn);
    }
}

// UTILS
function showNotification(msg) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    container.appendChild(n);
    setTimeout(() => {
        n.style.opacity = '0';
        setTimeout(() => n.remove(), 500);
    }, 3000);
}

function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-item');
    const observer = new IntersectionObserver(e => e.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    }), { threshold: 0.1 });
    reveals.forEach(r => observer.observe(r));
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    syncProducts();
    triggerReveal();

    // UI Events
    const cartBtn = document.getElementById('cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCart = document.querySelector('.close-cart');
    const closeModal = document.querySelector('.close-modal');
    const whatsappCheckout = document.getElementById('whatsapp-checkout');

    if (cartBtn && cartDrawer) cartBtn.onclick = () => cartDrawer.classList.toggle('active');
    if (closeCart && cartDrawer) closeCart.onclick = () => cartDrawer.classList.remove('active');
    if (closeModal) closeModal.onclick = () => document.getElementById('product-modal').classList.remove('active');

    if (whatsappCheckout) {
        whatsappCheckout.onclick = () => {
            if (cart.length === 0) return alert("Votre panier est vide!");
            let message = "salam ici.c'est.PARIS khasni hed products:\n\n";
            cart.forEach((item, i) => message += `${i + 1}. ${item.name} (${item.displayPrice || item.price})\n`);
            window.open(`https://wa.me/213774743573?text=${encodeURIComponent(message)}`, '_blank');
        };
    }
});

// CATEGORY FILTERS
document.querySelectorAll('.nav-links a').forEach(link => {
    link.onclick = (e) => {
        e.preventDefault();
        const cat = e.target.getAttribute('data-category');
        const sourceData = (products && products.length > 0) ? products : fallbackProducts;

        if (cat === 'all') renderProducts(sourceData);
        else renderProducts(sourceData.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase()));
    };
});
