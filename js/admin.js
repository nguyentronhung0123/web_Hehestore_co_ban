// File admin.js xu ly logic toan bo trang quan tri
// Cho phep admin quan ly don hang va san pham
// Luu tru du lieu vao localStorage

document.addEventListener('DOMContentLoaded', () => {
    // Khoi tao cac chuc nang khi trang vua tai xong
    initTabs(); // Bat chuc nang chuyen doi giua tab Don hang va San pham
    renderOrders(); // Ve danh sach don hang ra man hinh
    renderAllProducts(); // Ve danh sach toan bo san pham goc them moi ra man hinh
    initAddProductForm(); // Lang nghe su kien khi Admin bam nut Them San Pham Moi
    initModalEvents(); // Khoi tao cac su kien tat mo Modal Hop thoai noi
    initEditProductLogic(); // Khoi tao logic xu ly khi Admin luu thong tin chinh sua san pham
});

// 
// PHẦN 1: XỬ LÝ CHUYỂN TAB (ĐƠN HÀNG / SẢN PHẨM)
// 
function initTabs() {
    const btnOrders = document.getElementById('tab-btn-orders');
    const btnProducts = document.getElementById('tab-btn-products');
    const secOrders = document.getElementById('section-orders');
    const secProducts = document.getElementById('section-products');
    const pageTitle = document.getElementById('admin-page-title');

    // Nếu không tìm thấy các nút (tránh lỗi nếu lỡ viết sai ID trong HTML)
    if(!btnOrders || !btnProducts) return;

    // Khi click vào nút "Quản lý Đơn hàng"
    btnOrders.addEventListener('click', (e) => {
        e.preventDefault();
        // Đổi màu menu
        btnOrders.classList.add('active');
        btnProducts.classList.remove('active');
        // Hiện tab đơn hàng, ẩn tab sản phẩm
        secOrders.classList.remove('hidden');
        secProducts.classList.add('hidden');
        pageTitle.innerText = 'Danh sách Đơn hàng';
    });

    // Khi click vào nút "Quản lý Sản phẩm"
    btnProducts.addEventListener('click', (e) => {
        e.preventDefault();
        // Đổi màu menu
        btnProducts.classList.add('active');
        btnOrders.classList.remove('active');
        // Hiện tab sản phẩm, ẩn tab đơn hàng
        secProducts.classList.remove('hidden');
        secOrders.classList.add('hidden');
        pageTitle.innerText = 'Quản lý Sản phẩm';
    });
}

// 
// PHẦN 2: QUẢN LÝ ĐƠN HÀNG (CÓ CHỨC NĂNG XEM CHI TIẾT & ĐỔI TRẠNG THÁI)
// 
function renderOrders() {
    const tbody = document.getElementById('admin-orders-list');
    if (!tbody) return;

    // Kéo mảng đơn hàng từ LocalStorage
    const orders = JSON.parse(localStorage.getItem('hehe_orders')) || [];

    // Nếu trống
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Chưa có đơn hàng nào!</td></tr>';
        return;
    }

    let html = '';
    // Đảo ngược mảng để đơn hàng mới nhất (cuối mảng) lên đầu bảng
    orders.slice().reverse().forEach((order, index) => {
        const realIndex = orders.length - 1 - index; // Lấy đúng index thực tế trong mảng gốc
        
        // Tạo bảng màu tương ứng cho từng trạng thái
        const statusMap = {
            'Đang xử lý': 'status-pending',
            'Đang đóng gói': 'status-packing',
            'Đang giao hàng': 'status-shipping',
            'Đã giao hàng': 'status-done',
            'Đã hủy': 'status-cancelled'
        };
        // Mặc định là vàng (pending) nếu không tìm thấy
        const currentClass = statusMap[order.status] || 'status-pending';

        html += `
            <tr>
                <td><strong>${order.id}</strong></td>
                <td>
                    ${order.customer.name}<br>
                    <small style="color: #666;">${order.customer.phone}</small>
                </td>
                <td>${order.date}</td>
                <td style="color: #d32f2f; font-weight: bold;">${order.total}</td>
                <td><span class="admin-status-btn ${currentClass}">${order.status}</span></td>
                <td>
                    <select class="status-select" onchange="updateOrderStatus(${realIndex}, this.value)" style="margin-bottom: 5px;">
                        <option value="" disabled selected>Đổi trạng thái</option>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đang đóng gói">Đang đóng gói</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã giao hàng">Đã giao hàng</option>
                        <option value="Đã hủy">Hủy đơn hàng</option>
                    </select>
                    <br>
                    <button class="admin-status-btn btn-action btn-view" onclick="viewOrderDetails(${realIndex})">
                        Xem chi tiết
                    </button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Hàm đổi trạng thái đơn hàng (gọi khi Admin chọn từ Dropdown)
window.updateOrderStatus = function(index, newStatus) {
    let orders = JSON.parse(localStorage.getItem('hehe_orders')) || [];
    if (orders[index]) {
        orders[index].status = newStatus; // Cập nhật trạng thái mới
        localStorage.setItem('hehe_orders', JSON.stringify(orders)); // Lưu lại vào ổ cứng
        renderOrders(); // Vẽ lại bảng ngay lập tức
    }
};

// Hàm mở hộp thoại (Modal) hiển thị chi tiết 1 đơn hàng cụ thể
window.viewOrderDetails = function(index) {
    const orders = JSON.parse(localStorage.getItem('hehe_orders')) || [];
    const order = orders[index];
    if (!order) return;

    // Gắn thông tin cơ bản
    document.getElementById('modal-order-id').innerText = order.id;
    document.getElementById('modal-total-price').innerText = order.total;

    // In thông tin khách
    document.getElementById('modal-customer-info').innerHTML = `
        <p><strong>Người nhận:</strong> ${order.customer.name}</p>
        <p><strong>Số điện thoại:</strong> ${order.customer.phone}</p>
        <p><strong>Địa chỉ:</strong> ${order.customer.address || 'Không có'}</p>
        <p><strong>Ngày đặt:</strong> ${order.date}</p>
    `;

    // In danh sách món hàng khách mua
    const items = order.items || order.cart || []; 
    let itemsHtml = '';
    
    if (items.length > 0) {
        items.forEach(item => {
            // Loại bỏ chữ "đ" và dấu chấm để lấy ra con số thuần túy tính toán
            const priceNum = parseInt((item.price || '0').replace(/\D/g, '')) || 0;
            // Tính thành tiền = Giá * Số lượng
            const itemTotal = (priceNum * (item.quantity || 1)).toLocaleString('vi-VN') + 'đ';

            itemsHtml += `
                <tr>
                    <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                            <img src="${item.image}" style="width:40px; height:40px; object-fit:contain; border:1px solid #eee; padding:2px;">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>${item.price}</td>
                    <td style="text-align:center;">${item.quantity || 1}</td>
                    <td style="font-weight:bold; color:#d32f2f;">${itemTotal}</td>
                </tr>
            `;
        });
    } else {
        itemsHtml = '<tr><td colspan="4" style="text-align:center;">Không tìm thấy chi tiết sản phẩm.</td></tr>';
    }

    document.getElementById('modal-order-items').innerHTML = itemsHtml;
    // Bỏ class 'hidden' để Hộp thoại nổi lên
    document.getElementById('order-modal').classList.remove('hidden');
};

// 
// PHẦN 3: QUẢN LÝ SẢN PHẨM (GỘP, HIỂN THỊ, THÊM, XÓA, SỬA)
//


// HÀM QUAN TRỌNG: Gộp sản phẩm từ file data.js và localStorage lại thành 1 mảng
function getCombinedProducts() {
    // 1. Kéo dữ liệu gốc từ biến 'products' trong data.js (Bảo vệ mảng gốc bằng dấu [...])
    const baseProducts = typeof products !== 'undefined' ? [...products] : [];
    
    // 2. Kéo danh sách những thay đổi do Admin thực hiện với sản phẩm gốc
    // Đối tượng này lưu dưới dạng: { "1": {name: "IP 17 Pro", price: "40tr"}, "5": {...} }
    const modifiedBaseProducts = JSON.parse(localStorage.getItem('hehe_modified_base_products')) || {};
    // Mảng này lưu các ID (1, 2, 3...) của sản phẩm gốc mà Admin đã bấm "Xóa"
    const deletedBaseIds = JSON.parse(localStorage.getItem('hehe_deleted_base_ids')) || [];

    // 3. Kéo mảng sản phẩm hoàn toàn mới do Admin bấm "Thêm Sản Phẩm"
    const customProducts = JSON.parse(localStorage.getItem('hehe_custom_products')) || [];

    // XỬ LÝ SẢN PHẨM GỐC: Lọc bỏ hàng đã Xóa, và Cập nhật hàng đã Sửa
    const finalBaseProducts = baseProducts
        .filter(p => !deletedBaseIds.includes(p.id)) // Bước 1: Xóa
        .map(p => { // Bước 2: Sửa
            // Nếu phát hiện ID này có lưu trong hehe_modified_base_products, thì ghi đè thông tin mới lên
            if (modifiedBaseProducts[p.id]) {
                return { ...p, ...modifiedBaseProducts[p.id], source: 'base' };
            }
            // Nếu chưa bị sửa gì, gắn thêm cái đuôi "source: base" để nhận diện
            return { ...p, source: 'base' }; 
        });

    // XỬ LÝ SẢN PHẨM TỰ THÊM: Gắn đuôi "source: custom"
    const finalCustomProducts = customProducts.map(p => ({ ...p, source: 'custom' }));

    // GỘP: Ghép mảng gốc đã xử lý và mảng tự thêm lại thành 1 danh sách hoàn chỉnh
    return [...finalBaseProducts, ...finalCustomProducts];
}

// In danh sách GỘP ra bảng
function renderAllProducts() {
    const tbody = document.getElementById('admin-products-list');
    if (!tbody) return;

    // Lấy mảng gộp
    const allProducts = getCombinedProducts();

    if (allProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color:#888;">Không có sản phẩm nào.</td></tr>';
        return;
    }

    let html = '';
    // Đảo ngược để hàng mới thêm hiện lên đầu cho dễ thấy
    allProducts.reverse().forEach(p => {
        html += `
            <tr>
                <td><img src="${p.image}" alt="${p.name}" class="admin-product-img"></td>
                <td><strong>${p.name}</strong></td>
                <td style="text-transform: uppercase; font-size: 13px;">${p.category}</td>
                <td style="color: #d32f2f; font-weight: bold;">${p.price}</td>
                <td>
                    <button class="admin-status-btn status-pending" style="margin-right: 5px;" 
                        onclick="openEditProductModal('${p.id}', '${p.source}')">Sửa</button>
                    <button class="admin-status-btn btn-cancel" 
                        onclick="deleteAnyProduct('${p.id}', '${p.source}')">Xóa</button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Logic THÊM SẢN PHẨM MỚI (Từ Form)
function initAddProductForm() {
    const form = document.getElementById('form-add-product');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Chặn tải lại trang

        const name = document.getElementById('p-name').value.trim();
        const price = document.getElementById('p-price').value.trim();
        const category = document.getElementById('p-category').value;
        const image = document.getElementById('p-image').value.trim();

        if (!name || !price || !image) {
            alert('Vui lòng nhập đủ thông tin sản phẩm!');
            return;
        }

        // Tạo object sản phẩm mới. 
        // ID thêm chữ 'c_' (custom) để không bị trùng lặp với ID dạng số (1, 2, 3...) của data.js
        const newProduct = {
            id: 'c_' + Date.now(), 
            name: name,
            price: price,
            category: category,
            image: image
        };

        // Lưu vào LocalStorage của hàng tự thêm
        let customProducts = JSON.parse(localStorage.getItem('hehe_custom_products')) || [];
        customProducts.push(newProduct);
        localStorage.setItem('hehe_custom_products', JSON.stringify(customProducts));

        alert('Đã thêm sản phẩm thành công!');
        form.reset(); // Xóa trắng form
        renderAllProducts(); // Load lại toàn bộ bảng
    });
}

// Logic XÓA BẤT KỲ SẢN PHẨM NÀO
window.deleteAnyProduct = function(id, source) {
    if(confirm('Bạn có chắc chắn muốn xóa sản phẩm này vĩnh viễn?')) {
        
        // Tình huống 1: Đây là sản phẩm do mình tự thêm bằng form
        if (source === 'custom') {
            // Lôi mảng custom ra, lọc bỏ thằng có id trùng khớp
            let customProducts = JSON.parse(localStorage.getItem('hehe_custom_products')) || [];
            customProducts = customProducts.filter(p => p.id.toString() !== id.toString());
            localStorage.setItem('hehe_custom_products', JSON.stringify(customProducts));
        } 
        // Tình huống 2: Đây là sản phẩm gốc nằm trong data.js
        else {
            // Lưu cái ID (VD: ID=5) vào một "Sổ đen" (Mảng hehe_deleted_base_ids). 
            // Khi load trang, hàm gộp thấy ID=5 nằm trong sổ đen thì nó sẽ giấu đi.
            let deletedBaseIds = JSON.parse(localStorage.getItem('hehe_deleted_base_ids')) || [];
            deletedBaseIds.push(parseInt(id));
            localStorage.setItem('hehe_deleted_base_ids', JSON.stringify(deletedBaseIds));
        }
        
        alert('Đã xóa thành công!');
        renderAllProducts(); 
    }
};

// 
// PHẦN 4: SỬA THÔNG TIN SẢN PHẨM
// 

// Mở Modal Sửa và nạp dữ liệu cũ vào form
window.openEditProductModal = function(id, source) {
    const allProducts = getCombinedProducts();
    // Tìm ra sản phẩm đang được bấm
    const product = allProducts.find(p => p.id.toString() === id.toString());
    
    if (!product) return;

    // Đổ dữ liệu vào 2 cái input ẩn (để lúc lưu máy biết mình đang lưu cho thằng nào)
    document.getElementById('edit-p-id').value = product.id;
    document.getElementById('edit-p-source').value = source;
    
    // Đổ dữ liệu vào các input hiển thị
    document.getElementById('edit-p-name').value = product.name;
    document.getElementById('edit-p-price').value = product.price;
    document.getElementById('edit-p-category').value = product.category;
    document.getElementById('edit-p-image').value = product.image;

    // Hiện modal lên
    document.getElementById('edit-product-modal').classList.remove('hidden');
};

// Khi bấm nút "Lưu Cập Nhật" trong Modal
function initEditProductLogic() {
    const form = document.getElementById('form-edit-product');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Lôi 2 thằng input ẩn ra xem nó là ai
        const id = document.getElementById('edit-p-id').value;
        const source = document.getElementById('edit-p-source').value;
        
        // Đóng gói thông tin mới
        const updatedData = {
            name: document.getElementById('edit-p-name').value.trim(),
            price: document.getElementById('edit-p-price').value.trim(),
            category: document.getElementById('edit-p-category').value,
            image: document.getElementById('edit-p-image').value.trim()
        };

        // Tình huống 1: Sửa đồ tự thêm
        if (source === 'custom') {
            let customProducts = JSON.parse(localStorage.getItem('hehe_custom_products')) || [];
            // Tìm đúng vị trí nó nằm trong mảng
            const index = customProducts.findIndex(p => p.id.toString() === id.toString());
            if (index !== -1) {
                // Trộn đè dữ liệu mới lên dữ liệu cũ
                customProducts[index] = { ...customProducts[index], ...updatedData };
                localStorage.setItem('hehe_custom_products', JSON.stringify(customProducts));
            }
        } 
        // Tình huống 2: Sửa đồ trong data.js
        else {
            // Lưu vào kho "hehe_modified_base_products". 
            // Cấu trúc: Lưu theo Key (ID sản phẩm). VD: "1": {name: "Mới", price: "rẻ"}
            let modifiedBaseProducts = JSON.parse(localStorage.getItem('hehe_modified_base_products')) || {};
            modifiedBaseProducts[id] = updatedData;
            localStorage.setItem('hehe_modified_base_products', JSON.stringify(modifiedBaseProducts));
        }

        alert('Cập nhật sản phẩm thành công!');
        document.getElementById('edit-product-modal').classList.add('hidden'); // Tắt popup
        renderAllProducts(); // Vẽ lại bảng cho thấy thay đổi
    });
}

// 
// PHẦN 5: XỬ LÝ SỰ KIỆN TẮT CÁC HỘP THOẠI (MODAL)
// 
function initModalEvents() {
    const orderModal = document.getElementById('order-modal');
    const closeOrderBtn = document.getElementById('close-modal-btn');
    
    // Tắt modal đơn hàng khi bấm dấu X
    if (closeOrderBtn) {
        closeOrderBtn.addEventListener('click', () => orderModal.classList.add('hidden'));
    }

    const editModal = document.getElementById('edit-product-modal');
    const closeEditBtn = document.getElementById('close-edit-modal-btn');
    const cancelEditBtn = document.getElementById('btn-cancel-edit');
    
    // Tắt modal sửa khi bấm dấu X hoặc nút Hủy
    if (closeEditBtn) closeEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));

    // Tắt modal khi người dùng bấm chuột ra ngoài khoảng trắng mờ mờ
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) orderModal.classList.add('hidden');
        if (e.target === editModal) editModal.classList.add('hidden');
    });
}