// File cart.js xu ly logic gio hang
// Quan ly viec them, sua, xoa san pham va tinh tong tien
// Du lieu gio hang duoc luu tru trong localStorage

// Them mot san pham vao gio hang dung cho trang chu danh muc voi tuy chon mac dinh
function addToCartDefault(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Lay tuy chon mac dinh mau dau tien, dung luong dau tien
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
    const defaultStorage = product.storage && product.storage.length > 0 ? product.storage[0] : '';

    // Tao ID gio hang dac biet de phan biet cac tuy chon
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
            price: product.price, // Gia mac dinh
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

// Chuyen doi chuoi gia tien thanh kieu so de tinh toan
function parsePrice(priceStr) {
    // Xoa tat ca dau cham va chu đ, sau do chuyen thanh so nguyen
    return parseInt(priceStr.replace(/\./g, '').replace('đ', ''));
}

// Dinh dang so thanh chuoi tien te Viet Nam
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// Tang hoac giam so luong cua mot san pham trong gio hang
function updateQuantity(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    // Dung String() de dam bao so sanh dung ID dang chuoi
    const item = cart.find(item => String(item.id) === String(productId));

    if (item) {
        item.quantity += delta;
        // Neu so luong giam xuong 0 hoac it hon, tien hanh xoa san pham khoi gio
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }

    // Luu va ve lai giao dien
    localStorage.setItem('hehe_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

// Xoa hoan toan mot san pham khoi gio hang
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    // Dung String() de loc dung ID dang chuoi
    cart = cart.filter(item => String(item.id) !== String(productId));

    localStorage.setItem('hehe_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
}

// Cap nhat con so bao hieu tren icon gio hang noi o goc man hinh
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    // Tinh tong so luong cua tat ca cac mat hang trong gio
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-badge-count');

    if (badge) {
        badge.innerText = totalItems;
        // Neu khong co san pham nao thi an vong tron dem so di cho dep
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Ve danh sach san pham trong gio hang len trang giohang.html
function renderCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalAmountElement = document.getElementById('total-amount');

    // Neu khong tim thay container nay thi thoat ham
    if (!cartContainer) return;

    const cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];

    // Truong hop gio hang trong
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-msg">
                <p>Giỏ hàng của bạn đang trống.</p>
                <a href="index.html" class="go-shopping-btn">Tiếp tục mua sắm</a>
            </div>
        `;
        if (totalAmountElement) totalAmountElement.innerText = '0đ';
        // An nut thanh toan khi khong co hang
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    // Truong hop co san pham: Duyet mang va tao chuoi HTML
    let cartHTML = '';
    let total = 0;

    cart.forEach(item => {
        // Tinh tien cho tung dong san pham Gia x So luong
        const itemTotal = parsePrice(item.price) * item.quantity;
        total += itemTotal;

        // Them dau nhay don boc quanh item.id trong 3 nut bam ben duoi
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">${item.price}</p>
                    </div>
                </div>

                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-input">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>

                <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Xóa sản phẩm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
    });

    // Do HTML vao container va cap nhat tong tien thanh toan
    cartContainer.innerHTML = cartHTML;
    if (totalAmountElement) totalAmountElement.innerText = formatPrice(total);

    // Hien lai nut thanh toan
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'block';
}

// Xu ly su kien khi bam nut Thanh Toan
function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống, không thể thanh toán!');
        return;
    }

    // Chuyen huong sang trang thanh toan thay vi chi hien thong bao ao
    window.location.href = 'thanhtoan.html';
}

// Khoi dong cac ham can thiet ngay khi trang web tai xong
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge(); // Cap nhat con so tren icon noi
    renderCart();      // Ve gio hang neu dang o trang gio hang
});