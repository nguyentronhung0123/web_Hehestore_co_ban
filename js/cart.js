// ==========================================================
// FILE: cart.js - Xử lý logic Giỏ hàng
// Quản lý việc thêm, sửa, xóa sản phẩm và tính tổng tiền.
// Dữ liệu giỏ hàng được lưu trữ trong localStorage.
// ==========================================================

/**
 * Thêm một sản phẩm vào giỏ hàng (Dùng cho trang chủ/danh mục với tùy chọn mặc định).
 * @param {number} productId - ID duy nhất của sản phẩm.
 */
function addToCartDefault(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Lấy tùy chọn mặc định (màu đầu tiên, dung lượng đầu tiên)
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
    const defaultStorage = product.storage && product.storage.length > 0 ? product.storage[0] : '';
    
    // Tạo ID giỏ hàng đặc biệt để phân biệt các tùy chọn
    const cartProductId = `${product.id}-${defaultColor}-${defaultStorage}`.replace(/\s/g, '-');
    const productNameWithOptions = `${product.name} (${defaultColor}${defaultStorage ? ' - ' + defaultStorage : ''})`;

    let cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    const existingItem = cart.find(item => item.id === cartProductId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: cartProductId,
            name: productNameWithOptions,
            price: product.price, // Giá mặc định
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('hehe_cart', JSON.stringify(cart));
    updateCartBadge();
    alert(`Đã thêm "${productNameWithOptions}" vào giỏ hàng!`);
    
    if (window.location.pathname.includes('giohang.html')) {
        renderCart();
    }
}

/**
 * Chuyển đổi chuỗi giá tiền (ví dụ: "36.990.000đ") thành kiểu số để tính toán.
 * @param {string} priceStr 
 * @returns {number}
 */
function parsePrice(priceStr) {
    // Xóa tất cả dấu chấm và chữ 'đ', sau đó chuyển thành số nguyên
    return parseInt(priceStr.replace(/\./g, '').replace('đ', ''));
}

/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (ví dụ: 36990000 -> "36.990.000đ").
 * @param {number} price 
 * @returns {string}
 */
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

/**
 * Tăng hoặc giảm số lượng của một sản phẩm trong giỏ hàng.
 * @param {number} productId 
 * @param {number} delta - Lượng thay đổi (+1 để tăng, -1 để giảm)
 */
function updateQuantity(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += delta;
        // Nếu số lượng giảm xuống 0 hoặc ít hơn, tiến hành xóa sản phẩm khỏi giỏ
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }

    // Lưu và vẽ lại giao diện
    localStorage.setItem('hehe_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

/**
 * Xóa hoàn toàn một sản phẩm khỏi giỏ hàng.
 * @param {number} productId 
 */
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    // Lọc bỏ sản phẩm có ID trùng khớp
    cart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('hehe_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

/**
 * Cập nhật con số báo hiệu trên icon giỏ hàng nổi ở góc màn hình.
 */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    // Tính tổng số lượng của tất cả các mặt hàng trong giỏ
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge-count');
    
    if (badge) {
        badge.innerText = totalItems;
        // Nếu không có sản phẩm nào thì ẩn vòng tròn đếm số đi cho đẹp
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

/**
 * Vẽ (Render) danh sách sản phẩm trong giỏ hàng lên trang giohang.html.
 */
function renderCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalAmountElement = document.getElementById('total-amount');
    
    // Nếu không tìm thấy container này (tức là không phải đang ở trang giohang.html) thì thoát hàm
    if (!cartContainer) return; 

    const cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];

    // Trường hợp giỏ hàng trống
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-msg">
                <p>Giỏ hàng của bạn đang trống.</p>
                <a href="index.html" class="go-shopping-btn">Tiếp tục mua sắm</a>
            </div>
        `;
        if (totalAmountElement) totalAmountElement.innerText = '0đ';
        // Ẩn nút thanh toán khi không có hàng
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    // Trường hợp có sản phẩm: Duyệt mảng và tạo chuỗi HTML
    let cartHTML = '';
    let total = 0;

    cart.forEach(item => {
        // Tính tiền cho từng dòng sản phẩm (Giá x Số lượng)
        const itemTotal = parsePrice(item.price) * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">${item.price}</p>
                    </div>
                </div>
                
                <!-- Bộ điều khiển số lượng -->
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-input">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>

                <!-- Nút xóa sản phẩm -->
                <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Xóa sản phẩm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
    });

    // Đổ HTML vào container và cập nhật tổng tiền thanh toán
    cartContainer.innerHTML = cartHTML;
    if (totalAmountElement) totalAmountElement.innerText = formatPrice(total);
    
    // Hiện lại nút thanh toán
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'block';
}

/**
 * Xử lý sự kiện khi bấm nút "Thanh Toán".
 */
function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống, không thể thanh toán!');
        return;
    }

    // Thông báo giả định thanh toán thành công
    alert('Cảm ơn bạn đã mua hàng tại Hẹ Hẹ Store! Đơn hàng của bạn đã được tiếp nhận và đang xử lý.');
    
    // Xóa sạch giỏ hàng sau khi mua xong
    localStorage.removeItem('hehe_cart');
    
    // Cập nhật lại giao diện
    updateCartBadge();
    renderCart();
}

// Khởi động các hàm cần thiết ngay khi trang web tải xong
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge(); // Cập nhật con số trên icon nổi
    renderCart();      // Vẽ giỏ hàng (nếu đang ở trang giỏ hàng)
});
