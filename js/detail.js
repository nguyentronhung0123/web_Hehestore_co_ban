// ==========================================================
// FILE: detail.js - Xử lý logic cho trang Chi tiết sản phẩm
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Lấy ID sản phẩm từ tham số 'id' trên URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // Tìm sản phẩm trong mảng `products`
    const product = products.find(p => p.id === productId);

    const detailContainer = document.getElementById('product-detail-content');

    if (product && detailContainer) {
        // Nếu tìm thấy sản phẩm, bắt đầu render giao diện
        renderProductDetail(product, detailContainer);
    } else {
        // Nếu không tìm thấy, hiển thị thông báo lỗi
        detailContainer.innerHTML = `<div style="text-align: center; padding: 50px;">Không tìm thấy sản phẩm. Vui lòng quay lại <a href="index.html">trang chủ</a>.</div>`;
    }
});

/**
 * Render toàn bộ giao diện chi tiết sản phẩm
 * @param {object} product - Đối tượng sản phẩm từ data.js
 * @param {HTMLElement} container - Element để render vào
 */
function renderProductDetail(product, container) {
    // --- 1. Tạo cấu trúc HTML cơ bản ---
    container.innerHTML = `
        <div class="detail-left">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-right">
            <h2 class="detail-title">${product.name}</h2>
            <p class="detail-brand">Thương hiệu: ${product.brand}</p>
            
            <!-- Tùy chọn màu sắc -->
            <div class="option-group" id="color-options-group">
                <h4>Màu sắc</h4>
                <div class="option-list" id="color-options"></div>
            </div>

            <!-- Tùy chọn dung lượng -->
            <div class="option-group" id="storage-options-group">
                <h4>Dung lượng</h4>
                <div class="option-list" id="storage-options"></div>
            </div>

            <!-- Giá tiền -->
            <div class="detail-price" id="current-price">${product.price}</div>

            <!-- Nút hành động -->
            <div class="action-buttons">
                <button class="btn-buy-now">MUA NGAY</button>
                <button class="btn-add-cart-outline" id="detail-add-to-cart">THÊM VÀO GIỎ</button>
            </div>
        </div>
    `;

    // --- 2. Render các nút tùy chọn (Màu sắc & Dung lượng) ---
    const colorContainer = document.getElementById('color-options');
    const storageContainer = document.getElementById('storage-options');
    const colorGroup = document.getElementById('color-options-group');
    const storageGroup = document.getElementById('storage-options-group');

    // Render màu sắc
    if (product.colors && product.colors.length > 0) {
        product.colors.forEach((color, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn color-btn';
            btn.innerText = color;
            btn.dataset.color = color;
            if (index === 0) btn.classList.add('active'); // Mặc định chọn cái đầu tiên
            colorContainer.appendChild(btn);
        });
    } else {
        colorGroup.style.display = 'none'; // Ẩn nếu không có tùy chọn màu
    }

    // Render dung lượng
    if (product.storage && product.storage.length > 0) {
        product.storage.forEach((storage, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn storage-btn';
            btn.innerText = storage;
            btn.dataset.index = index; // Lưu vị trí để tính giá
            if (index === 0) btn.classList.add('active'); // Mặc định chọn cái đầu tiên
            storageContainer.appendChild(btn);
        });
    } else {
        storageGroup.style.display = 'none'; // Ẩn nếu không có tùy chọn dung lượng
    }

    // --- 3. Gán sự kiện cho các nút tùy chọn ---
    const basePrice = parsePrice(product.price);
    const priceIncrement = 2000000; // 2 triệu

    // Sự kiện cho nút màu sắc
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Sự kiện cho nút dung lượng (tính lại giá)
    document.querySelectorAll('.storage-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.storage-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedIndex = parseInt(btn.dataset.index);
            const newPrice = basePrice + (selectedIndex * priceIncrement);
            document.getElementById('current-price').innerText = formatPrice(newPrice);
        });
    });

    // --- 4. Gán sự kiện cho nút "Thêm vào giỏ" ---
    document.getElementById('detail-add-to-cart').addEventListener('click', () => {
        const selectedColor = document.querySelector('.color-btn.active')?.dataset.color || '';
        const selectedStorage = document.querySelector('.storage-btn.active')?.innerText || '';
        const currentPrice = document.getElementById('current-price').innerText;

        // Tạo một ID mới cho sản phẩm trong giỏ hàng để phân biệt các tùy chọn khác nhau
        const cartProductId = `${product.id}-${selectedColor}-${selectedStorage}`.replace(/\s/g, '-');
        const productNameWithOptions = `${product.name} (${selectedColor}${selectedStorage ? ' - ' + selectedStorage : ''})`;

        // Tạo một đối tượng sản phẩm mới để thêm vào giỏ
        const productToAdd = {
            id: cartProductId,
            name: productNameWithOptions,
            price: currentPrice,
            image: product.image,
            quantity: 1
        };

        // Sử dụng hàm addToCart đã được sửa đổi
        addToCartWithOptions(productToAdd);
    });
}

/**
 * Hàm thêm vào giỏ hàng được tùy chỉnh cho trang chi tiết
 * @param {object} productData - Đối tượng sản phẩm với đầy đủ tùy chọn
 */
function addToCartWithOptions(productData) {
    let cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    const existingItem = cart.find(item => item.id === productData.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(productData);
    }

    localStorage.setItem('hehe_cart', JSON.stringify(cart));
    updateCartBadge();
    alert(`Đã thêm "${productData.name}" vào giỏ hàng!`);
}
