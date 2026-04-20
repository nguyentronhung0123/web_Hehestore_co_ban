// File checkout.js xu ly logic cho trang thanh toan
// Chuc nang lay du lieu tu gio hang hien thi tom tat don hang
// tinh tong tien va xu ly hanh dong dat hang

document.addEventListener('DOMContentLoaded', () => {
    // Ngay khi trang vua load xong goi ham hien thi don hang
    renderCheckoutSummary();
});

// Ham lay du lieu tu localStorage va in ra cot don hang cua ban
function renderCheckoutSummary() {
    // Lay gio hang tu localStorage
    const cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];

    // Tim cac the HTML can dien du lieu
    const summaryList = document.getElementById('order-summary-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const finalTotalEl = document.getElementById('checkout-final-total');

    // Neu gio hang trong
    if (cart.length === 0) {
        summaryList.innerHTML = '<p style="text-align: center; color: #888; padding: 20px 0;">Gio hang cua ban dang trong.</p>';
        subtotalEl.innerText = '0đ';
        finalTotalEl.innerText = '0đ';
        return;
    }

    let html = '';
    let totalAmount = 0;

    // Duyet qua tung san pham trong gio de tao HTML
    cart.forEach(item => {
        // Chuyen gia tu chuoi sang so va nhan voi so luong
        const itemPrice = parsePrice(item.price);
        const itemTotal = itemPrice * item.quantity;
        totalAmount += itemTotal;

        // Bom HTML cho tung dong san pham
        html += `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${item.name}</div>
                    <div style="font-size: 13px; color: #666;">So luong: ${item.quantity}</div>
                </div>
                <div class="checkout-item-price">${formatPrice(itemTotal)}</div>
            </div>
        `;
    });

    // In danh sach ra man hinh
    summaryList.innerHTML = html;

    // In tong tien
    subtotalEl.innerText = formatPrice(totalAmount);
    finalTotalEl.innerText = formatPrice(totalAmount);
}

// Ham duoc goi khi bam nut xac nhan dat hang
function xuLyThanhToan() {
    // Lay du lieu nguoi dung nhap vao form
    const name = document.getElementById('full-name').value.trim();
    const phone = document.getElementById('phone-number').value.trim();
    const address = document.getElementById('address').value.trim();

    // Kiem tra gio hang
    const cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
    if (cart.length === 0) {
        alert("Gio hang cua ban dang trong. Vui long chon san pham truoc khi thanh toan!");
        window.location.href = 'index.html';
        return;
    }

    // Kiem tra xem da dien du thong tin bat buoc chua
    if (name === "" || phone === "" || address === "") {
        alert("Vui long dien day du ho ten so dien thoai va dia chi nhan hang!");
        return;
    }

    // Lay phuong thuc thanh toan dang duoc chon va tong tien
    const paymentMethod = document.querySelector('input[name="payment"]:checked').nextElementSibling.innerText;
    const totalString = document.getElementById('checkout-final-total').innerText;

    // Luu don hang vao lich su hehe_orders
    let orders = JSON.parse(localStorage.getItem('hehe_orders')) || [];
    const newOrder = {
        id: 'DH' + Math.floor(Math.random() * 1000000), // Tao ma don hang ngau nhien
        date: new Date().toLocaleString('vi-VN'),       // Lay ngay gio hien tai
        customer: { name, phone, address, paymentMethod },
        items: cart,                                    // Luu toan bo san pham trong gio vao don nay
        total: totalString,                             // Luu tong tien
        status: 'Dang xu ly'                            // Trang thai mac dinh
    };
    orders.push(newOrder);
    localStorage.setItem('hehe_orders', JSON.stringify(orders));

    // Neu moi thu hop le gia lap dat hang thanh cong
    alert(`Cam on ${name}!\n\nDon hang cua ban da duoc ghi nhan.\nChung toi se giao hang den: ${address}.\nPhuong thuc: ${paymentMethod}.\n\nNhan vien se som goi vao so ${phone} de xac nhan.`);

    // Xoa sach gio hang sau khi mua xong
    localStorage.removeItem('hehe_cart');

    // Chuyen huong nguoi dung ve trang chu
    window.location.href = 'index.html';
}

// Cac ham bo tro copy sang day de file hoat dong doc lap

function parsePrice(priceString) {
    if (!priceString) return 0;
    const cleanString = priceString.toString().replace(/[đd\.\s]/gi, '');
    const number = parseInt(cleanString);
    return isNaN(number) ? 0 : number;
}

function formatPrice(number) {
    return number.toLocaleString('vi-VN') + 'đ';
}