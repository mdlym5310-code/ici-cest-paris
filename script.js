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
        image: "images/shoes_orange.png"
    }
];

function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map(product => `
        <div class="product-card">
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

// Initial Render
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
