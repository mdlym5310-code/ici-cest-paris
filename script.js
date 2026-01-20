// --- CONFIG & STATE ---
/**
 * Firebase Configuration
 * 
 * To set up Firebase:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project or select existing one
 * 3. Enable Realtime Database
 * 4. Copy your config from Project Settings > General > Your apps
 * 5. Replace the placeholder values below with your actual Firebase config
 * 
 * Security Rules Example (Firebase Console > Realtime Database > Rules):
 * {
 *   "rules": {
 *     "products": {
 *       ".read": true,
 *       ".write": false
 *     }
 *   }
 * }
 */
const firebaseConfig = {
    apiKey: "AIzaSyAs-EXAMPLE-PLACEHOLDER",
    authDomain: "ici-cest-paris-store.firebaseapp.com",
    databaseURL: "https://ici-cest-paris-store-default-rtdb.firebaseio.com",
    projectId: "ici-cest-paris-store",
    storageBucket: "ici-cest-paris-store.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Initialize Firebase if available
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
    // Add parallax effect to hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add mouse move effect to product cards
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            }
        });
    });

    // Reset card transforms on mouse leave
    document.addEventListener('mouseleave', () => {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.style.transform = '';
        });
    });
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
let imageZoom = {
    scale: 1,
    panX: 0,
    panY: 0,
    isPanning: false,
    startX: 0,
    startY: 0,
    minScale: 1,
    maxScale: 5,
    wheelHandler: null
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
    
    modalImage.src = p.image;
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
    
    // Initialize zoom functionality
    initImageZoom();

    // WHATSAPP Action
    document.querySelector('.add-to-cart-btn').onclick = () => {
        if (!selectedSize && (p.sizes && p.sizes.length > 0)) {
            alert("Veuillez choisir une taille !");
            return;
        }
        sendToWhatsApp(p);
    };
}

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
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Create wheel handler function
    imageZoom.wheelHandler = (e) => {
        // Only handle if mouse is over the image area
        const rect = imageContainer.getBoundingClientRect();
        const isOverImage = e.clientX >= rect.left && e.clientX <= rect.right &&
                           e.clientY >= rect.top && e.clientY <= rect.bottom;
        
        if (isOverImage) {
            e.preventDefault();
            e.stopPropagation();
            const delta = e.deltaY > 0 ? -0.15 : 0.15;
            zoomImage(delta, e.clientX, e.clientY);
            return false;
        }
    };
    
    // Attach wheel event to container, wrapper, and image with capture phase
    imageContainer.addEventListener('wheel', imageZoom.wheelHandler, { passive: false, capture: true });
    if (imageWrapper) {
        imageWrapper.addEventListener('wheel', imageZoom.wheelHandler, { passive: false, capture: true });
    }
    modalImage.addEventListener('wheel', imageZoom.wheelHandler, { passive: false, capture: true });
    
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
    imageZoom.scale = Math.max(imageZoom.minScale, Math.min(imageZoom.maxScale, imageZoom.scale + delta));
    
    if (centerX && centerY) {
        const imageContainer = document.querySelector('.modal-image-container');
        if (imageContainer) {
            const rect = imageContainer.getBoundingClientRect();
            const relativeX = centerX - rect.left - rect.width / 2;
            const relativeY = centerY - rect.top - rect.height / 2;
            
            // Calculate zoom point relative to image center
            imageZoom.panX += -relativeX * (imageZoom.scale - oldScale);
            imageZoom.panY += -relativeY * (imageZoom.scale - oldScale);
        }
    }
    
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
    
    // Remove wheel event listeners
    const modalImage = document.getElementById('modal-image');
    const imageContainer = document.querySelector('.modal-image-container');
    const imageWrapper = document.querySelector('.image-zoom-wrapper');
    
    if (imageZoom.wheelHandler) {
        if (imageContainer) {
            imageContainer.removeEventListener('wheel', imageZoom.wheelHandler, { capture: true });
        }
        if (imageWrapper) {
            imageWrapper.removeEventListener('wheel', imageZoom.wheelHandler, { capture: true });
        }
        if (modalImage) {
            modalImage.removeEventListener('wheel', imageZoom.wheelHandler, { capture: true });
        }
        imageZoom.wheelHandler = null;
    }
}

function zoomIn() {
    const container = document.querySelector('.modal-image-container');
    if (container) {
        const rect = container.getBoundingClientRect();
        zoomImage(0.5, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

function zoomOut() {
    const container = document.querySelector('.modal-image-container');
    if (container) {
        const rect = container.getBoundingClientRect();
        zoomImage(-0.5, rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
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
            } else {
                showNotification("Le panier est en cours d'optimisation... Utilisez Commande Express !", 'info');
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
