// --- CONFIG & STATE ---
const firebaseConfig = {
    apiKey: "AIzaSyAs-EXAMPLE-PLACEHOLDER",
    authDomain: "ici-cest-paris-store.firebaseapp.com",
    databaseURL: "https://ici-cest-paris-store-default-rtdb.firebaseio.com",
    projectId: "ici-cest-paris-store",
    storageBucket: "ici-cest-paris-store.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
}

let products = [];
let cart = [];
let selectedSize = null;

// The "Truly Real" Fallback Data
const fallbackProducts = [
    { id: 1, name: "Ensemble Nike Tech 💚🤍", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-1.fna.fbcdn.net/v/t51.82787-15/612217866_18080234006257992_7913269358075475897_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzgwODY4ODIxNjgwNzIyMjM3NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwNS5zZHIuQzMifQ%3D%3D&_nc_ohc=Qfr-nClZUsMQ7kNvwH1p8VL&_nc_oc=AdmoCL2pP3zc3qJKBVuJzNdcthHZ4QHPhSABCtiIGx2orugqrVuswWRPTfW5vg0kLew&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-1.fna&_nc_gid=5VHWhoKhmFbc0t2fwkzJ6g&oh=00_Afq0Fig-9j9d5Yf9qdkqBD1RDiAIyPRkshdVy-3foLCyXw&oe=69748465", sizes: ["M", "L", "XL", "XXL"], stock: "in" },
    { id: 2, name: "Ensemble Nike x Atletico 💙❤️", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-1.fna.fbcdn.net/v/t51.82787-15/615892372_18080234621257992_3050554319578621501_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=103&ig_cache_key=MzgwODY5NjA5MjMzNDM4NTk1OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTc2Ni5oZHIuQzMifQ%3D%3D&_nc_ohc=Rre9KeILRTcQ7kNvwHCWejz&_nc_oc=AdkDE53Q8FxGPfSHSyeoSwN07oW8MzbCnEU7eb5Ku8lp2mDxevqdMsDco4Y9rJi3cco&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-1.fna&_nc_gid=QJvbO6Nbvs4ph1wPfqi9Ug&oh=00_AfoezD8_m8UjZRsSICzjNRz_0q5D9Ba89lyElKnTvTMGdQ&oe=6974A4F5", sizes: ["M"], stock: "in" },
    { id: 3, name: "Ensemble Nike Noir/Rose 🖤❤️", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-2.fna.fbcdn.net/v/t51.82787-15/612989955_18080316740257992_6861574540520538097_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=MzgwOTQwNTQzNTc3ODM0OTM1MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTU5NS5zZHIuQzMifQ%3D%3D&_nc_ohc=teOBTCKU4mYQ7kNvwFnXpwY&_nc_oc=AdkmEPAa2kMIrqeen4s0mADOHmMpij8kD0PFvKiEpv_8Whs2zbQkxjw7Z34AL5TszSk&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-2.fna&_nc_gid=IKqva_a0WzjJmT0R8rL_sw&oh=00_AfrgzQDYFp9SK_pTC0sf6x8Q8i0n-VmhoUvedQNhuLXr5g&oe=6974A73A", sizes: ["L"], stock: "in" },
    { id: 4, name: "Ensemble Air Max 🩵🖤", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-1.fna.fbcdn.net/v/t51.82787-15/587798499_18080317931257992_2281133955307095287_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=109&ig_cache_key=MzgwOTQxOTI0NTM4MTY3MjIwNQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTc0Ny5oZHIuQzMifQ%3D%3D&_nc_ohc=KGitXYc5basQ7kNvwGxlcta&_nc_oc=AdnrxQU4w12j7laA7HpavyKVuF0cyumMIwMum-FQ-aTawQoZBwztW8j54W2SYxF5Seg&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-1.fna&_nc_gid=cVeyYAC11vAvWrKyckIZrw&oh=00_Afp-7SKOtYQ3IoglObiUP_cxFFlpCpq5cN1Z0Dk7tHreBw&oe=6974B4B6", sizes: ["M", "L"], stock: "in" },
    { id: 5, name: "Ensemble Sénégal 🇸🇳", category: "Homme", price: 38500, displayPrice: "38,500 DA", image: "https://instagram.ftlm1-2.fna.fbcdn.net/v/t51.82787-15/619303050_18080772734257992_1993550259614549432_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=MzgxMzA3MjI4MzA4MjMzNDUwOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTY3Ny5zZHIuQzMifQ%3D%3D&_nc_ohc=rFEX3G6P_YsQ7kNvwHrOwIY&_nc_oc=AdkxY-yHBx2qtddO_hhLSlKySor92CEhRcl1ZqUHrAUHKmrCPBmXN9g8Mmz69SQ1eps&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.ftlm1-2.fna&_nc_gid=Xupo8UsaO1pn5dIgLm4Pow&oh=00_AfrKHbXNFzgrQQeUdydeDZRWjxtP29WMyRp03GByJf09_Q&oe=6974B3A3", sizes: ["XS", "M", "L"], stock: "in" }
];

// --- INITIALIZATION ---
window.onload = () => {
    initApp();
};

async function initApp() {
    console.log("🚀 Initialisation du moteur ici.c'est.PARIS...");

    // 1. Initial Render (Fallbacks First)
    renderProducts(fallbackProducts);

    // 2. Sync with Firebase
    connectToFirebase();

    // 3. Fade out Loading Screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('fade-out');
        triggerReveal();
    }, 2000);
}

function connectToFirebase() {
    if (typeof database === 'undefined' || !database) return;
    database.ref('products').on('value', (snap) => {
        const val = snap.val();
        if (val) {
            products = Object.values(val);
            renderProducts(products);
        }
    });
}

// --- CORE RENDERING ---
function renderProducts(pList) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = pList.map((p, i) => `
        <div class="product-card reveal-item" style="transition-delay: ${i * 0.1}s" onclick="openProductModal(${p.id})">
            <div class="product-image">
                ${p.oldPrice ? '<div class="discount-label">PROMO</div>' : ''}
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/600x600?text=Indisponible'">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>${p.category}</p>
                <div class="product-price">
                    ${p.oldPrice ? `<span style="text-decoration:line-through; font-size:14px; color:#999; margin-right:10px;">${p.oldPrice} DA</span>` : ''}
                    <strong>${p.displayPrice || p.price + ' DA'}</strong>
                </div>
            </div>
        </div>
    `).join('');
    triggerReveal();
}

// --- UI LOGIC ---
function openProductModal(id) {
    const p = products.find(x => x.id === id) || fallbackProducts.find(x => x.id === id);
    if (!p) return;

    selectedSize = null; // Reset selection
    const modal = document.getElementById('product-modal');
    document.getElementById('modal-image').src = p.image;
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-price').textContent = p.displayPrice || p.price + ' DA';

    // Stock Logic
    const badge = document.getElementById('stock-badge');
    badge.textContent = p.stock === 'out' ? 'RUPTURE DE STOCK' : 'EN STOCK ✅';
    badge.className = `stock-badge ${p.stock === 'out' ? 'out' : ''}`;

    // Sizes Logic
    const sizeContainer = document.getElementById('size-options');
    sizeContainer.innerHTML = (p.sizes || ["Standard"]).map(s => `
        <div class="size-pill" onclick="selectSize(this, '${s}')">${s}</div>
    `).join('');

    modal.classList.add('active');

    // WHATSAPP Action
    document.querySelector('.add-to-cart-btn').onclick = () => {
        if (!selectedSize && (p.sizes && p.sizes.length > 0)) {
            alert("Veuillez choisir une taille !");
            return;
        }
        sendToWhatsApp(p);
    };
}

function selectSize(el, size) {
    document.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    selectedSize = size;
}

function sendToWhatsApp(p) {
    const sizeInfo = selectedSize ? ` (Taille: ${selectedSize})` : "";
    const msg = `Salam ici.c'est.PARIS 👋\nJe souhaite commander :\n📦 *${p.name}*${sizeInfo}\n💰 Prix : ${p.displayPrice || p.price + ' DA'}\n\nVeuillez confirmer la disponibilité svp.`;
    window.open(`https://wa.me/213774743573?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- UTILS ---
function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    reveals.forEach(r => observer.observe(r));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.close-modal').onclick = () => document.getElementById('product-modal').classList.remove('active');
    document.getElementById('cart-btn').onclick = () => showNotification("Le panier est en cours d'optimisation... Utilisez Commande Express !");
});

function showNotification(msg) {
    const container = document.getElementById('notification-container');
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;
    n.style.background = 'var(--paris-blue)';
    n.style.color = 'white';
    n.style.padding = '20px';
    n.style.borderRadius = '10px';
    n.style.marginTop = '10px';
    container.appendChild(n);
    setTimeout(() => n.remove(), 4000);
}
