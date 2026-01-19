const products = [
    {
        id: 1,
        name: "Nouveauté ensemble 🐊 Taille S,L,XXL",
        category: "Men",
        price: "38,500 DA",
        image: "images/lacoste_grey.jpg"
    },
    {
        id: 2,
        name: "Slide ✔️ UPTM Pointure 46 t",
        category: "Shoes",
        price: "20,500 DA",
        image: "images/shoes_orange.jpg"
    }
];

// --- RENDERING PRODUCTS ---
function renderProducts(filteredProducts = products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found for this search.</p>`;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x600?text=Upload+Photo'" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <div class="product-price">${product.price}</div>
            </div>
        </div>
    `).join('');
}

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

// --- PRODUCT MODAL LOGIC ---
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');

function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modal-image').src = product.image;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-category').textContent = product.category;
    document.getElementById('modal-price').textContent = product.price;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
}

if (closeModal) {
    closeModal.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
}

// Close modal when clicking outside
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

// Simple Scroll Effect for Navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});
