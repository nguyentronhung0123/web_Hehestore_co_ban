// File donhang.js xu ly logic hien thi danh sach don hang

document.addEventListener('DOMContentLoaded', () => {
    // Tim the chua danh sach don hang
    const ordersWrapper = document.getElementById('orders-list-wrapper');
    if (!ordersWrapper) return; // Thoat neu khong o trang don hang

    // Lay danh sach don hang tu localStorage
    const orders = JSON.parse(localStorage.getItem('hehe_orders')) || [];

    // Kiem tra neu khong co don hang nao
    if (orders.length === 0) {
        ordersWrapper.innerHTML = `
            <div style="text-align: center; padding: 50px 0;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <p style="font-size: 18px; color: #666; margin-bottom: 20px;">Ban chua co don hang nao.</p>
                <a href="index.html" class="btn-back-profile" style="background: #ff9800; border-radius: 5px;">Bat dau mua sam ngay</a>
            </div>
        `;
        return;
    }

    let html = '';

    // Dao nguoc mang de don hang moi nhat nam len dau
    orders.slice().reverse().forEach(order => {
        html += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">Ma don ${order.id}</span>
                        <span class="order-date"> - Ngay dat ${order.date}</span>
                    </div>
                    <span class="order-status">${order.status}</span>
                </div>
                <div class="order-body">
        `;

        // Duyet tung san pham trong don
        order.items.forEach(item => {
            html += `
                <div class="order-item-row">
                    <img src="${item.image}" alt="${item.name}" class="order-item-img">
                    <div class="order-item-info">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-meta">So luong x${item.quantity} | Gia ${item.price}</div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
                <div class="order-footer">
                    Thanh tien <span class="order-total-price">${order.total}</span>
                </div>
            </div>
        `;
    });

    // Hien thi danh sach don hang tren man hinh
    ordersWrapper.innerHTML = html;
});