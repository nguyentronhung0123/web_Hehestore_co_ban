// File danhmuc.js xu ly logic trang danh muc

document.addEventListener('DOMContentLoaded', function() {
    // Lay tham so category va search tu URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const searchKeyword = urlParams.get('search');

    const titleElement = document.getElementById('category-title');
    const listElement = document.getElementById('category-product-list');
    const noResultElement = document.getElementById('no-result-msg');

    if (!listElement) return;

    // Gop du lieu san pham goc data.js san pham Admin tu them
    const customProducts = JSON.parse(localStorage.getItem('hehe_custom_products')) || [];
    const baseProducts = typeof products !== 'undefined' ? products : [];
    const allProducts = [...baseProducts, ...customProducts];

    let filteredProducts = [];

    // Loc san pham
    if (searchKeyword) {
        if(titleElement) titleElement.innerText = `KET QUA TIM KIEM "${searchKeyword.toUpperCase()}"`;
        filteredProducts = allProducts.filter(p =>
            p.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }
    else if (category) {
        const titles = {
            'iphone': 'TAT CA IPHONE',
            'macbook': 'TAT CA MACBOOK',
            'ipad': 'TAT CA IPAD',
            'phukien': 'TAT CA PHU KIEN'
        };
        if(titleElement) titleElement.innerText = titles[category] || 'DANH MUC SAN PHAM';
        filteredProducts = allProducts.filter(p => p.category === category);
    }
    else {
        if(titleElement) titleElement.innerText = 'TAT CA SAN PHAM';
        filteredProducts = allProducts;
    }

    // In ra man hinh
    if (filteredProducts.length > 0) {
        let html = '';
        filteredProducts.forEach(product => {
            html += `
                <article class="product-item">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                    <div class="product-actions">
                        <a href="chitietsanpham.html?id=${product.id}">Xem chi tiet</a>
                        <button class="add-to-cart-btn" onclick="addToCartDefault(${product.id})">Them vao gio</button>
                    </div>
                </article>
            `;
        });
        listElement.innerHTML = html;
        if(noResultElement) noResultElement.style.display = 'none';
    } else {
        listElement.innerHTML = '';
        if(noResultElement) noResultElement.style.display = 'block';
    }
});