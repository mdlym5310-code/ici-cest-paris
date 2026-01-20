// Firebase Configuration
// To set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Enable Realtime Database
// 4. Copy your config from Project Settings > General > Your apps

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGnZtxU3qb47Wfa9D33u-NFllnawt4rCY",
    authDomain: "ici-cest-paris-4e9d5.firebaseapp.com",
    databaseURL: "https://ici-cest-paris-4e9d5-default-rtdb.firebaseio.com",
    projectId: "ici-cest-paris-4e9d5",
    storageBucket: "ici-cest-paris-4e9d5.firebasestorage.app",
    messagingSenderId: "307044964156",
    appId: "1:307044964156:web:9fe8757d90a24abe5eb039",
    measurementId: "G-YF7V1CKQVR"
};
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        var database = firebase.database();
        console.log("✅ Firebase initialized successfully");
    } catch (error) {
        console.warn("⚠️ Firebase initialization error:", error);
        console.log("📦 Using fallback data mode");
    }
} else {
    console.log("📦 Firebase SDK not loaded - using fallback data");
}

let products = [];
let cart = [];
let selectedSize = null;

// WhatsApp Configuration
const WHATSAPP_NUMBER = "+213774743573"; // Your WhatsApp number
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`;

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

    // Initialize dynamic features
    initDynamicFeatures();

    // 1. Initial Render (Fallbacks First)
    renderProducts(fallbackProducts);

    // 2. Sync with Firebase
    connectToFirebase();

    // 3. Setup event listeners
    setupEventListeners();

    // 4. Initialize slider
    initSlider();

    // 5. Fade out Loading Screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('fade-out');
        triggerReveal();
        addFloatingElements();
    }, 2000);
}

// Initialize dynamic features
function initDynamicFeatures() {
    // Luxury Cursor Logic
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    if (dot && outline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;

            // Outline follows with a slight delay
            outline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });

            // Hover effects
            const target = e.target;
            const isClickable = target.closest('a') || target.closest('button') || target.closest('.product-card') || target.closest('.size-pill');

            if (isClickable) {
                outline.style.width = '60px';
                outline.style.height = '60px';
                outline.style.background = 'rgba(227, 6, 19, 0.1)';
                outline.style.borderColor = 'var(--paris-red)';
            } else {
                outline.style.width = '30px';
                outline.style.height = '30px';
                outline.style.background = 'transparent';
                outline.style.borderColor = 'var(--paris-blue)';
            }
        });
    }

    // Scroll Progress & Navbar Effects
    const progressBar = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (progressBar) progressBar.style.width = scrolled + "%";

        // Navbar luxury shift
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 10px 30px rgba(0, 51, 102, 0.15)';
            } else {
                navbar.style.padding = '20px 0';
                navbar.style.background = 'rgba(255, 255, 255, 0.85)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    // Smooth parallax (rAF-throttled)
    let parallaxRaf = null;
    window.addEventListener('scroll', () => {
        if (parallaxRaf) return;
        parallaxRaf = requestAnimationFrame(() => {
            parallaxRaf = null;
            const scrolled = window.scrollY || 0;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translate3d(0, ${Math.min(scrolled * 0.25, 80)}px, 0)`;
            }
        });
    }, { passive: true });

    // V4: ELASTIC MAGNETIC BUTTONS (Gooey Physics)
    const magneticItems = document.querySelectorAll('.magnetic');

    // Disable on mobile/touch devices
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    magneticItems.forEach(item => {
        let bounds;

        function rotateToMouse(e) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const leftX = mouseX - bounds.x;
            const topY = mouseY - bounds.y;
            const center = {
                x: leftX - bounds.width / 2,
                y: topY - bounds.height / 2
            };

            // Elastic Spring Effect
            item.style.transform = `
                scale(1.05)
                translate(${center.x * 0.5}px, ${center.y * 0.5}px)
            `;

            // Interactive glow
            const glow = item.querySelector('.glow-effect') || document.createElement('div');
            if (!item.querySelector('.glow-effect')) {
                glow.classList.add('glow-effect');
                glow.style.cssText = `
                    position: absolute; width: 40px; height: 40px;
                    background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
                    border-radius: 50%; pointer-events: none; mix-blend-mode: overlay;
                    transition: opacity 0.3s;
                    transform: translate(-50%, -50%);
                `;
                item.appendChild(glow);
                item.style.overflow = 'hidden';
                if (getComputedStyle(item).position === 'static') item.style.position = 'relative';
            }
            glow.style.left = `${leftX}px`;
            glow.style.top = `${topY}px`;
            glow.style.opacity = '1';
        }

        item.addEventListener('mouseenter', () => {
            bounds = item.getBoundingClientRect();
            document.addEventListener('mousemove', rotateToMouse);
            // Remove lingering transition for snap
            item.style.transition = '';
        });

        item.addEventListener('mouseleave', () => {
            document.removeEventListener('mousemove', rotateToMouse);
            // Elastic Snapback
            item.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            item.style.transform = '';

            const glow = item.querySelector('.glow-effect');
            if (glow) glow.style.opacity = '0';
        });
    });

    // Product card tilt
    document.addEventListener('pointermove', (e) => {
        const card = e.target && e.target.closest ? e.target.closest('.product-card') : null;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        card.style.transform = `translateY(-15px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    }, { passive: true });

    document.addEventListener('pointerleave', (e) => {
        const card = e.target && e.target.closest ? e.target.closest('.product-card') : null;
        if (!card) return;
        card.style.transform = '';
    }, true);
}

// Add floating decorative elements
function addFloatingElements() {
    const body = document.body;
    for (let i = 0; i < 5; i++) {
        const floatEl = document.createElement('div');
        floatEl.style.cssText = `
            position: fixed;
            width: ${Math.random() * 100 + 50}px;
            height: ${Math.random() * 100 + 50}px;
            background: ${i % 2 === 0 ? 'rgba(227, 6, 19, 0.1)' : 'rgba(0, 51, 102, 0.1)'};
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
            filter: blur(40px);
        `;
        body.appendChild(floatEl);
    }
}

// Initialize slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots');
    let currentSlide = 0;

    if (slides.length === 0) return;

    // Create dots
    const dotsContainer = document.getElementById('slider-dots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: ${index === 0 ? 'white' : 'rgba(255,255,255,0.5)'};
                display: inline-block;
                margin: 0 5px;
                cursor: pointer;
                transition: all 0.3s;
            `;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        const dotElements = document.querySelectorAll('.dot');
        dotElements.forEach((dot, i) => {
            dot.style.background = i === index ? 'white' : 'rgba(255,255,255,0.5)';
        });
        currentSlide = index;
    }

    // Auto-rotate slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 5000);
}

// Setup event listeners
function setupEventListeners() {
    // Category filtering
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            filterProducts(category);

            // Update active state
            document.querySelectorAll('[data-category]').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts(e.target.value);
            }, 300);
        });
    }

    // Close modal on outside click
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal) modal.classList.remove('active');
            const cartDrawer = document.getElementById('cart-drawer');
            if (cartDrawer) cartDrawer.classList.remove('active');
        }
    });
}

// Filter products by category
function filterProducts(category) {
    const allProducts = products.length > 0 ? products : fallbackProducts;
    const filtered = category === 'all'
        ? allProducts
        : allProducts.filter(p => p.category === category);
    renderProducts(filtered);
    showNotification(`Affichage: ${category === 'all' ? 'Tous les produits' : category}`);
}

// Search products
function searchProducts(query) {
    if (!query.trim()) {
        renderProducts(products.length > 0 ? products : fallbackProducts);
        return;
    }

    const allProducts = products.length > 0 ? products : fallbackProducts;
    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filtered);
}

function connectToFirebase() {
    if (typeof database === 'undefined' || !database) {
        console.log("📦 Firebase not available - using fallback data");
        console.log("💡 Tip: Configure Firebase in script.js to enable online product sync");
        return;
    }

    // Check if using placeholder config
    const isPlaceholderConfig = firebaseConfig.apiKey.includes('EXAMPLE') ||
        firebaseConfig.apiKey === 'AIzaSyAs-EXAMPLE-PLACEHOLDER';

    if (isPlaceholderConfig) {
        console.warn("⚠️ Firebase config uses placeholder values!");
        console.log("📝 Update firebaseConfig in script.js with your actual Firebase credentials");
        console.log("📦 Using fallback products until Firebase is configured");
        return;
    }

    try {
        // Test connection first
        database.ref('.info/connected').once('value', (snap) => {
            if (snap.val() === true) {
                console.log("✅ Connected to Firebase - listening for products...");
            } else {
                console.warn("⚠️ Not connected to Firebase");
                showNotification("⚠️ Connexion Firebase échouée - Mode hors ligne", 'warning');
            }
        });

        // Listen for products
        database.ref('products').on('value', (snap) => {
            const val = snap.val();
            if (val) {
                products = Object.values(val);
                renderProducts(products);
                console.log(`✅ Loaded ${products.length} products from Firebase`);
                showNotification(`✅ ${products.length} produits chargés depuis Firebase`, 'success');
            } else {
                console.log("📦 No Firebase data - using fallback");
                console.log("💡 Add products via admin.html to populate Firebase");
            }
        }, (error) => {
            console.error("❌ Firebase error:", error);
            let errorMsg = "⚠️ Erreur de connexion Firebase - Mode hors ligne activé";

            if (error.code === 'PERMISSION_DENIED') {
                errorMsg += "\n\nVérifiez les règles de sécurité Firebase (Realtime Database > Rules)";
            }

            showNotification(errorMsg, 'warning');
        });
    } catch (error) {
        console.error("❌ Firebase connection error:", error);
        showNotification("⚠️ Erreur de connexion Firebase", 'error');
    }
}

// --- CORE RENDERING ---
function renderProducts(pList) {
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');
    if (!grid) return;

    if (pList.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Update Catalog Count Badge
    const catalogCount = document.getElementById('product-total-count');
    if (catalogCount) catalogCount.textContent = pList.length;

    // Check local storage for wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    grid.innerHTML = pList.map((p, i) => {
        const isWishlisted = wishlist.includes(p.id);

        return `
        <div class="product-card reveal-item" style="transition-delay: ${i * 0.1}s" onclick="openProductModal(${p.id})">
            <div class="product-image">
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlist(${p.id}, this)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
                <button class="quick-shop-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
                    AJOUT RAPIDE
                </button>
                ${p.oldPrice ? '<div class="discount-label">PROMO</div>' : ''}
                <img src="${p.image}" 
                     alt="${p.name}" 
                     loading="lazy"
                     onload="this.classList.add('loaded')"
                     onerror="handleProductImageError(this, '${p.name}')">
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
    `}).join('');
    triggerReveal();
}

// Wishlist Logic
function toggleWishlist(id, btn) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
        btn.classList.remove('active');
        showNotification("Retiré des favoris", "info");
    } else {
        wishlist.push(id);
        btn.classList.add('active');

        // Add particle effect (optional visual flair)
        createParticles(btn.getBoundingClientRect());
        showNotification("Ajouté aux favoris ❤️", "success");
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function createParticles(rect) {
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 8px;
            height: 8px;
            background: var(--paris-red);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(p);

        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50;

        const keyframes = [
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, opacity: 0 }
        ];

        const anim = p.animate(keyframes, { duration: 600, easing: 'ease-out' });
        anim.onfinish = () => p.remove();
    }
}

// Image error handlers
function handleProductImageError(img, productName) {
    img.src = 'https://placehold.co/600x600?text=Image+Indisponible';
    img.classList.add('loaded');
    console.warn(`Image failed to load for product: ${productName}`);
}

function hideImageLoader() {
    const loader = document.getElementById('image-loader');
    if (loader) loader.classList.add('hidden');
}

function handleImageError(img) {
    img.src = 'https://placehold.co/800x800?text=Image+Indisponible';
    hideImageLoader();
}

// --- UI LOGIC ---
let imageZoom = {
    scale: 1,
    panX: 0,
    panY: 0,
    isPanning: false,
    startX: 0,
    startY: 0,
    minScale: 1,
    maxScale: 5,
    wheelHandler: null,
    globalWheelHandler: null
};

function openProductModal(id) {
    const p = products.find(x => x.id === id) || fallbackProducts.find(x => x.id === id);
    if (!p) return;

    selectedSize = null; // Reset selection
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-image');

    // Reset zoom when opening modal
    imageZoom.scale = 1;
    imageZoom.panX = 0;
    imageZoom.panY = 0;
    applyImageTransform();

    // Show loader and reset image
    const loader = document.getElementById('image-loader');
    if (loader) loader.classList.remove('hidden');
    modalImage.classList.remove('loaded');

    modalImage.src = p.image;
    modalImage.onload = () => {
        hideImageLoader();
        modalImage.classList.add('loaded');
    };
    modalImage.onerror = () => {
        handleImageError(modalImage);
    };

    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-price').textContent = p.displayPrice || p.price + ' DA';

    // Stock Logic
    const badge = document.getElementById('stock-badge');
    badge.textContent = p.stock === 'out' ? 'RUPTURE DE STOCK' : 'EN STOCK ✅';
    badge.className = `stock-badge ${p.stock === 'out' ? 'out' : ''}`;

    // Gallery Logic 📸
    /*
    const existingGallery = document.querySelector('.thumbnails-container');
    if (existingGallery) existingGallery.remove(); // Cleanup old gallery

    if (p.images && p.images.length > 1) {
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'thumbnails-container';
        galleryDiv.innerHTML = p.images.map((img, idx) => `
            <div class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="changeModalImage('${img}', this)">
                <img src="${img}" alt="Thumbnail">
            </div>
        `).join('');

        // Insert after image container
        const imgContainer = document.querySelector('.modal-image-container');
        if (imgContainer) imgContainer.parentNode.insertBefore(galleryDiv, imgContainer.nextSibling);
    }
    */

    // --- CAROUSEL LOGIC (Native Scroll) ---
    const track = document.getElementById('gallery-track');
    // const existingGallery = document.querySelector('.thumbnails-container'); // Already selecting via new logic if needed, but we create fresh.
    const _existingThumbs = document.querySelector('.thumbnails-container');
    if (_existingThumbs) _existingThumbs.remove();

    // Prepare images array
    const imagesToDisplay = (p.images && p.images.length > 0) ? p.images : [p.image];

    // Populate Track
    if (track) {
        track.innerHTML = imagesToDisplay.map((img, idx) => `
            <img src="${img}" class="gallery-slide" data-index="${idx}" decoding="async" loading="lazy" style="scroll-snap-align: center; flex: 0 0 100%; width: 100%; height: 100%; object-fit: cover;">
        `).join('');
    }

    // Create Thumbnails
    if (imagesToDisplay.length > 1) {
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'thumbnails-container';
        galleryDiv.innerHTML = imagesToDisplay.map((img, idx) => `
            <div class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="scrollToSlide(${idx})">
                <img src="${img}" alt="Thumbnail">
            </div>
        `).join('');

        const imgContainer = document.querySelector('.modal-image-container');
        if (imgContainer) imgContainer.parentNode.insertBefore(galleryDiv, imgContainer.nextSibling);

        // Sync Thumbnails on Scroll
        if (track) {
            track.onscroll = () => {
                const index = Math.round(track.scrollLeft / track.clientWidth);
                document.querySelectorAll('.thumbnail').forEach((t, i) => {
                    t.classList.toggle('active', i === index);
                });
            };
        }
    } else {
        if (track) track.onscroll = null;
    }

    // Hide loader
    const loader = document.getElementById('image-loader');
    if (loader) {
        loader.classList.remove('hidden');
        setTimeout(() => loader.classList.add('hidden'), 500);
    }

    // Sizes Logic
    const sizeContainer = document.getElementById('size-options');
    sizeContainer.innerHTML = (p.sizes || ["Standard"]).map(s => `
        <div class="size-pill" onclick="selectSize(this, '${s}')">${s}</div>
    `).join('');

    modal.classList.add('active');

    // Initialize zoom functionality
    initImageZoom();

    // Swipe logic handled by native scroll-snap above

    // Add to Cart / WhatsApp Action
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            if (!selectedSize && (p.sizes && p.sizes.length > 0)) {
                showNotification("Veuillez choisir une taille !", 'warning');
                return;
            }

            // Add to cart
            addToCart(p, selectedSize);

            // Also open WhatsApp
            sendToWhatsApp(p);
        };
    }
}

// --- SWIPE GALLERY LOGIC ---
// Old swipe logic removed in favor of CSS Scroll Snap
/* 
function initSwipeGallery(product) { ... }
function changeModalImage(src, thumb) { ... }
*/

function initImageZoom() {
    const modalImage = document.getElementById('modal-image');
    const imageContainer = document.querySelector('.modal-image-container');
    const imageWrapper = document.querySelector('.image-zoom-wrapper');
    if (!modalImage || !imageContainer) return;

    // Reset zoom state
    imageZoom.scale = 1;
    imageZoom.panX = 0;
    imageZoom.panY = 0;
    applyImageTransform();

    // Setup zoom control buttons (do this every time modal opens)
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    if (zoomInBtn) {
        zoomInBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            zoomIn();
        };
    }

    if (zoomOutBtn) {
        zoomOutBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            zoomOut();
        };
    }

    if (zoomResetBtn) {
        zoomResetBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetZoom();
        };
    }

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Single global wheel handler (blocks page scroll AND performs zoom)
    // NOTE: We must zoom here because stopping propagation at document-level would otherwise prevent
    // the container-level wheel listeners from ever running.
    imageZoom.globalWheelHandler = (e) => {
        const modal = document.getElementById('product-modal');
        if (!modal || !modal.classList.contains('active')) return;

        const rect = imageContainer.getBoundingClientRect();
        const isOverImage = e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!isOverImage) return;

        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        zoomImage(delta, e.clientX, e.clientY);
        return false;
    };
    document.addEventListener('wheel', imageZoom.globalWheelHandler, { passive: false, capture: true });

    // Mouse down - start panning
    imageContainer.addEventListener('mousedown', (e) => {
        if (imageZoom.scale > 1) {
            imageZoom.isPanning = true;
            imageZoom.startX = e.clientX - imageZoom.panX;
            imageZoom.startY = e.clientY - imageZoom.panY;
            imageContainer.style.cursor = 'grabbing';
        }
    });

    // Mouse move - panning
    imageContainer.addEventListener('mousemove', (e) => {
        if (imageZoom.isPanning && imageZoom.scale > 1) {
            imageZoom.panX = e.clientX - imageZoom.startX;
            imageZoom.panY = e.clientY - imageZoom.startY;
            applyImageTransform();
        }
    });

    // Mouse up - stop panning
    imageContainer.addEventListener('mouseup', () => {
        imageZoom.isPanning = false;
        imageContainer.style.cursor = imageZoom.scale > 1 ? 'grab' : 'zoom-in';
    });

    // Mouse leave - stop panning
    imageContainer.addEventListener('mouseleave', () => {
        imageZoom.isPanning = false;
        imageContainer.style.cursor = imageZoom.scale > 1 ? 'grab' : 'zoom-in';
    });

    // Touch events for mobile pinch zoom
    let lastTouchDistance = 0;

    imageContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            lastTouchDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
        } else if (e.touches.length === 1 && imageZoom.scale > 1) {
            imageZoom.isPanning = true;
            imageZoom.startX = e.touches[0].clientX - imageZoom.panX;
            imageZoom.startY = e.touches[0].clientY - imageZoom.panY;
        }
    }, { passive: false });

    imageContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );

            if (lastTouchDistance > 0) {
                const scaleChange = (distance - lastTouchDistance) * 0.01;
                zoomImage(scaleChange, (touch1.clientX + touch2.clientX) / 2, (touch1.clientY + touch2.clientY) / 2);
            }
            lastTouchDistance = distance;
        } else if (e.touches.length === 1 && imageZoom.isPanning && imageZoom.scale > 1) {
            e.preventDefault();
            imageZoom.panX = e.touches[0].clientX - imageZoom.startX;
            imageZoom.panY = e.touches[0].clientY - imageZoom.startY;
            applyImageTransform();
        }
    }, { passive: false });

    imageContainer.addEventListener('touchend', () => {
        lastTouchDistance = 0;
        imageZoom.isPanning = false;
    });
}

function zoomImage(delta, centerX, centerY) {
    const oldScale = imageZoom.scale;
    const newScale = Math.max(imageZoom.minScale, Math.min(imageZoom.maxScale, imageZoom.scale + delta));

    if (centerX !== undefined && centerY !== undefined) {
        const imageContainer = document.querySelector('.modal-image-container');
        if (imageContainer) {
            const rect = imageContainer.getBoundingClientRect();
            const relativeX = centerX - rect.left - rect.width / 2;
            const relativeY = centerY - rect.top - rect.height / 2;

            // Calculate zoom point relative to image center
            imageZoom.panX += -relativeX * (newScale - oldScale);
            imageZoom.panY += -relativeY * (newScale - oldScale);
        }
    }

    imageZoom.scale = newScale;
    applyImageTransform();
}

function applyImageTransform() {
    const modalImage = document.getElementById('modal-image');
    const imageContainer = document.querySelector('.modal-image-container');

    if (!modalImage || !imageContainer) return;

    modalImage.style.transform = `translate(${imageZoom.panX}px, ${imageZoom.panY}px) scale(${imageZoom.scale})`;

    if (imageZoom.scale > 1) {
        modalImage.classList.add('zoomed');
        imageContainer.style.cursor = imageZoom.isPanning ? 'grabbing' : 'grab';
    } else {
        modalImage.classList.remove('zoomed');
        imageContainer.style.cursor = 'zoom-in';
        imageZoom.panX = 0;
        imageZoom.panY = 0;
        modalImage.style.transform = 'scale(1)';
    }
}

function resetZoom() {
    imageZoom.scale = 1;
    imageZoom.panX = 0;
    imageZoom.panY = 0;
    applyImageTransform();

    // Remove global wheel handler
    if (imageZoom.globalWheelHandler) {
        document.removeEventListener('wheel', imageZoom.globalWheelHandler, { capture: true });
        imageZoom.globalWheelHandler = null;
    }
}

function zoomIn() {
    const container = document.querySelector('.modal-image-container');
    if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        zoomImage(0.3, centerX, centerY);
    }
}

function zoomOut() {
    const container = document.querySelector('.modal-image-container');
    if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        zoomImage(-0.3, centerX, centerY);
    }
}

function selectSize(el, size) {
    document.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    selectedSize = size;
}

// Cart Functions
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const count = cart.length;
        cartCount.textContent = `Panier (${count})`;
    }
}

function addToCart(product, size) {
    const cartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        displayPrice: product.displayPrice || product.price + ' DA',
        image: product.image,
        size: size || 'Standard',
        quantity: 1
    };

    cart.push(cartItem);
    updateCartCount();
    showNotification(`✅ ${product.name} ajouté au panier !`, 'success');
    updateCartDrawer();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    updateCartDrawer();
    showNotification('Produit retiré du panier', 'info');
}

function updateCartDrawer() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total-amount');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; padding:40px; color:#999;">Votre panier est vide</p>';
        if (cartTotal) cartTotal.textContent = '0 DA';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = total.toLocaleString() + ' DA';

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/80x80'">
            <div style="flex:1;">
                <h4>${item.name}</h4>
                <p>Taille: ${item.size}</p>
                <p><strong>${item.displayPrice}</strong></p>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#dc3545; cursor:pointer; font-size:20px; padding:5px 10px;">×</button>
        </div>
    `).join('');
}

function sendToWhatsApp(p) {
    const sizeInfo = selectedSize ? ` (Taille: ${selectedSize})` : "";
    const msg = `Salam ici.c'est.PARIS 👋\n\nJe souhaite commander :\n📦 *${p.name}*${sizeInfo}\n💰 Prix : ${p.displayPrice || p.price + ' DA'}\n\nVeuillez confirmer la disponibilité svp.`;
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Send cart to WhatsApp
function sendCartToWhatsApp() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide', 'warning');
        return;
    }

    let message = `Salam ici.c'est.PARIS 👋\n\nJe souhaite commander :\n\n`;
    cart.forEach((item, i) => {
        message += `${i + 1}. *${item.name}*\n   Taille: ${item.size}\n   Prix: ${item.displayPrice}\n\n`;
    });
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `💰 Total: ${total.toLocaleString()} DA\n\nVeuillez confirmer la disponibilité svp.`;

    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank');
}

// --- UTILS ---
function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal-item');

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        let delayCount = 0;
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains('active')) {
                // Apply staggered delay for items visible at the same time
                const item = entry.target;
                if (!item.style.transitionDelay) {
                    item.style.transitionDelay = `${delayCount * 0.1}s`;
                    delayCount++;
                }
                item.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(r => observer.observe(r));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.onclick = () => {
            const modal = document.getElementById('product-modal');
            if (modal) {
                modal.classList.remove('active');
                resetZoom(); // Reset zoom when closing modal
                document.body.style.overflow = ''; // Restore body scroll
            }
        };
    }

    // Also restore scroll when clicking outside modal
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                resetZoom();
                document.body.style.overflow = '';
            }
        });
    }

    // Zoom control buttons
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    if (zoomInBtn) zoomInBtn.onclick = zoomIn;
    if (zoomOutBtn) zoomOutBtn.onclick = zoomOut;
    if (zoomResetBtn) zoomResetBtn.onclick = resetZoom;

    const closeCart = document.querySelector('.close-cart');
    if (closeCart) {
        closeCart.onclick = () => {
            const cartDrawer = document.getElementById('cart-drawer');
            if (cartDrawer) cartDrawer.classList.remove('active');
        };
    }

    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.onclick = () => {
            const cartDrawer = document.getElementById('cart-drawer');
            if (cartDrawer) {
                cartDrawer.classList.add('active');
                updateCartDrawer();
            } else {
                showNotification("Le panier est en cours d'optimisation... Utilisez Commande Express !", 'info');
            }
        };
    }

    // WhatsApp checkout button
    const whatsappCheckout = document.getElementById('whatsapp-checkout');
    if (whatsappCheckout) {
        whatsappCheckout.onclick = () => {
            sendCartToWhatsApp();
        };
    }

    // Share button
    const shareBtn = document.getElementById('share-product-btn');
    if (shareBtn) {
        shareBtn.onclick = () => {
            const productName = document.getElementById('modal-name').textContent;
            const shareData = {
                title: `ici.c'est.PARIS | ${productName}`,
                text: `Découvrez ${productName} chez ici.c'est.PARIS - Boutique Premium en Algérie 🇩🇿`,
                url: window.location.href
            };

            if (navigator.share) {
                navigator.share(shareData)
                    .then(() => showNotification("Merci du partage ! ✨", "success"))
                    .catch((err) => console.log('Error sharing:', err));
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
                    .then(() => showNotification("Lien copié ! Partagez-le avec vos amis 🔗", "success"))
                    .catch(() => showNotification("Impossible de copier le lien", "error"));
            }
        };
    }

    // Add smooth scroll to CTA buttons
    document.querySelectorAll('.cta-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productsSection = document.querySelector('.featured-products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

function showNotification(msg, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = msg;

    // Set color based on type
    const colors = {
        'success': 'linear-gradient(135deg, #28a745, #20c997)',
        'warning': 'linear-gradient(135deg, #ffc107, #ff9800)',
        'error': 'linear-gradient(135deg, #dc3545, #c82333)',
        'info': 'linear-gradient(135deg, var(--paris-blue), var(--paris-red))'
    };

    n.style.background = colors[type] || colors.info;
    n.style.color = 'white';
    n.style.padding = '20px 30px';
    n.style.borderRadius = '15px';
    n.style.marginTop = '10px';
    n.style.fontWeight = '700';
    n.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
    n.style.backdropFilter = 'blur(10px)';

    container.appendChild(n);

    // Animate in
    setTimeout(() => n.style.opacity = '1', 10);

    // Remove after delay
    setTimeout(() => {
        n.style.opacity = '0';
        n.style.transform = 'translateX(400px)';
        setTimeout(() => n.remove(), 400);
    }, 4000);
}

// Add number counter animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// --- SOCIAL PROOF: LIVE SALES ---
const salesNames = ["Amine", "Mohamed", "Yacine", "Karim", "Sofiane", "Mehdi", "Walid", "Nassim", "Anis", "Omar"];
const salesCities = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Batna", "Tlemcen", "Béjaïa", "Tizi Ouzou"];
const salesProducts = [
    "Ensemble Nike Tech - Noir",
    "Ensemble Ralph Lauren - Gris",
    "Ensemble Lacoste - Bleu Nuit",
    "Ensemble Under Armour - Kaki",
    "Ensemble Puma - Blanc"
];

function initSalesNotifications() {
    const notification = document.getElementById('sales-notification');
    const message = document.getElementById('sales-message');
    const product = document.getElementById('sales-product');

    if (!notification) return;

    function showSale() {
        // Random Data
        const name = salesNames[Math.floor(Math.random() * salesNames.length)];
        const city = salesCities[Math.floor(Math.random() * salesCities.length)];
        const item = salesProducts[Math.floor(Math.random() * salesProducts.length)];

        // Populate
        message.innerHTML = `<strong>${name}</strong> à <strong>${city}</strong> a commandé`;
        product.textContent = item;

        // Show
        notification.classList.add('active');

        // Play subtle pop
        playNotificationSound();

        // Hide after 5s
        setTimeout(() => {
            notification.classList.remove('active');
        }, 5000);

        // Schedule next (random 15-45s)
        const nextTime = Math.random() * 30000 + 15000;
        setTimeout(showSale, nextTime);
    }

    // Start loop after initial delay
    setTimeout(showSale, 5000);
}

// --- AUDIO UI (ASMR) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function resumeAudio() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

document.addEventListener('click', resumeAudio, { once: true });

function playHoverSound() {
    if (audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime); // Very subtle
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function playClickSound() {
    if (audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function playNotificationSound() {
    if (audioCtx.state === 'suspended') return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
}

function initAudioUI() {
    // Attach to interactive elements
    const interactive = document.querySelectorAll('button, a, .product-card, .size-pill, .wishlist-btn');

    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => playHoverSound());
        el.addEventListener('click', () => playClickSound()); // Note: native click sound might clash, but for now it's fine
    });
}

// Call new initializers
document.addEventListener('DOMContentLoaded', () => {
    initSalesNotifications();
    setTimeout(initAudioUI, 1000); // Wait for DOM to settle
});

function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    if (email && email.includes('@')) {
        showNotification("Bienvenue dans le Club ! 🥂", "success");
        // Play success sound
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);

        document.getElementById('newsletter-email').value = '';
    } else {
        showNotification("Veuillez entrer un email valide", "error");
    }
}

// --- V4: MATRIX DECODE TEXT ---
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";

function matrixReveal(element) {
    const originalText = element.dataset.originalText || element.innerText;
    if (!element.dataset.originalText) element.dataset.originalText = originalText;

    let iterations = 0;
    const interval = setInterval(() => {
        element.innerText = originalText.split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return matrixChars[Math.floor(Math.random() * matrixChars.length)];
            })
            .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
            element.innerText = originalText; // Ensure final cleanup
        }

        iterations += 1 / 3; // Speed
    }, 30);
}

// Attach Matrix to Headers
const observerOptionsV4 = { threshold: 0.5 };
const matrixObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            matrixReveal(entry.target);
            matrixObserver.unobserve(entry.target);
        }
    });
}, observerOptionsV4);

document.querySelectorAll('h2').forEach(h => matrixObserver.observe(h));

// --- V4: CHAOS CART EXPLOSION 💥 ---
function triggerChaosParticles(x, y) {
    // V5 Optimization: Reduce count on mobile/small screens
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 40; // 40 on Desktop, 15 on Mobile
    const colors = ['#E30613', '#003366', '#FFFFFF', '#FFD700']; // Brand colors + Gold

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'chaos-particle';
        document.body.appendChild(p);

        // Initial Position
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Physics
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 150 + 50; // Explosion speed
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;

        // Animation
        p.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 800 + 400,
            easing: 'cubic-bezier(0, .9, .57, 1)',
        }).onfinish = () => p.remove();
    }
}

// Override generic click to catch add-to-cart buttons for V4 effect
document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn') ||
        e.target.closest('.add-to-cart-btn') ||
        e.target.classList.contains('quick-shop-btn')) {

        const rect = e.target.getBoundingClientRect();
        // Trigger explosion at click position or button center
        const x = e.clientX || (rect.left + rect.width / 2);
        const y = e.clientY || (rect.top + rect.height / 2);

        triggerChaosParticles(x, y);
    }
});
