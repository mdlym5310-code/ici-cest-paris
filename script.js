const products = [
    {
        id: 1,
        name: "Original Street Glide",
        category: "Men's Sneakers",
        price: "15,500 DA",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 2,
        name: "Urban Force Pro",
        category: "Men's Sneakers",
        price: "18,200 DA",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 3,
        name: "Desert Runner XT",
        category: "Women's Running",
        price: "12,900 DA",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 4,
        name: "DLM Classic 1990",
        category: "Streetwear",
        price: "9,500 DA",
        image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 5,
        name: "Altos High Top",
        category: "Lifestyle",
        price: "16,800 DA",
        image: "https://images.unsplash.com/photo-1584486520270-19eca1efcce5?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 6,
        name: "Vibe Mesh Runner",
        category: "Women's Sport",
        price: "11,500 DA",
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=1000"
    },
    {
        id: 7,
        name: "Nouveauté ensemble 🐊 Taille S,L,XXL",
        category: "Men",
        price: "38,500 DA", // 
        image: "images/lacoste_grey.jpg" //
    },
    {
        id: 8,
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
                <img src="${product.image}" alt="${product.name}" loading="lazy">
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
