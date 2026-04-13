// =========================================
// FILE: main.js - Toàn bộ chức năng JS
//
// MỤC LỤC:
// 1. HIỂN THỊ SẢN PHẨM
// 2. BANNER SLIDER
// 3. KHỞI ĐỘNG
// =========================================


/* =========================================
   PHẦN 1: HIỂN THỊ SẢN PHẨM
   ========================================= */

/**
 * Tạo chuỗi HTML cho một card sản phẩm.
 * @param {Object} product - Đối tượng sản phẩm từ mảng `products` (trong data.js).
 * @returns {string} - Chuỗi HTML của card sản phẩm.
 */
function createProductHTML(product) {
    return `
        <article class="product-item">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <div class="product-actions">
                <a href="chitietsanpham.html?id=${product.id}">Xem chi tiết</a>
                <button class="add-to-cart-btn" onclick="addToCartDefault(${product.id})">Thêm vào giỏ</button>
            </div>
        </article>
    `;
}

/**
 * Render tất cả sản phẩm lên trang chủ.
 * - Lấy các container: #iphone-list, #macbook-list, #ipad-list, #phukien-list.
 * - Duyệt qua mảng `products`.
 * - Phân loại sản phẩm theo `category` và tạo HTML.
 * - Gán HTML vào các container tương ứng.
 */
function renderAllProducts() {
    // Lấy các element container từ DOM
    const iphoneContainer = document.getElementById('iphone-list');
    const macbookContainer = document.getElementById('macbook-list');
    const ipadContainer = document.getElementById('ipad-list');
    const phukienContainer = document.getElementById('phukien-list');

    // Chuẩn bị các chuỗi HTML cho từng danh mục
    let iphoneHTML = '';
    let macbookHTML = '';
    let ipadHTML = '';
    let phukienHTML = '';

    // Duyệt qua mảng `products` (được khai báo trong data.js)
    products.forEach(product => {
        switch (product.category) {
            case 'iphone':
                iphoneHTML += createProductHTML(product);
                break;
            case 'macbook':
                macbookHTML += createProductHTML(product);
                break;
            case 'ipad':
                ipadHTML += createProductHTML(product);
                break;
            case 'phukien':
                phukienHTML += createProductHTML(product);
                break;
        }
    });

    // Gán HTML vào DOM. Kiểm tra container có tồn tại không để tránh lỗi
    // (hữu ích khi các trang khác không có các list sản phẩm này).
    if (iphoneContainer) iphoneContainer.innerHTML = iphoneHTML;
    if (macbookContainer) macbookContainer.innerHTML = macbookHTML;
    if (ipadContainer) ipadContainer.innerHTML = ipadHTML;
    if (phukienContainer) phukienContainer.innerHTML = phukienHTML;
}


/* =========================================
   PHẦN 2: BANNER SLIDER
   - Tự động chuyển slide mỗi 5 giây.
   - Có nút prev/next để điều khiển.
   - Tạm dừng khi giữ chuột (mousedown) trên banner.
   - Chạy lại khi thả chuột (mouseup) hoặc di chuột ra ngoài (mouseleave).
   ========================================= */
function initBannerSlider() {
    // --- Khai báo biến ---
    let currentIndex = 0;       // Index của slide đang hiển thị
    const totalSlides = 5;      // Tổng số ảnh banner
    let autoTimer = null;       // Biến để lưu trữ setInterval
    let isPaused = false;       // Trạng thái có đang tạm dừng hay không
    const intervalTime = 5000;  // Thời gian tự chuyển slide: 5 giây

    // --- Lấy element từ DOM ---
    const track = document.getElementById('banner-track');
    const prevBtn = document.getElementById('banner-prev');
    const nextBtn = document.getElementById('banner-next');
    const slider = track ? track.closest('.banner-slider') : null;

    // Chỉ khởi tạo slider nếu các element cần thiết tồn tại (chỉ chạy ở trang chủ)
    if (!track || !slider) return;

    /** Chuyển đến slide có index tương ứng */
    function goToSlide(index) {
        // Xử lý để slide chạy vòng lặp (từ slide cuối về đầu và ngược lại)
        currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    /** Chuyển đến slide tiếp theo */
    function next() {
        goToSlide(currentIndex + 1);
    }

    /** Chuyển về slide trước đó */
    function prev() {
        goToSlide(currentIndex - 1);
    }

    /** Bắt đầu chế độ tự động chuyển slide */
    function startAuto() {
        // Xóa timer cũ (nếu có) để tránh chạy nhiều timer cùng lúc
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(next, intervalTime);
    }

    /** Dừng chế độ tự động */
    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    // --- Gán sự kiện cho các nút và banner ---

    // Nút prev: click để về slide trước, sau đó reset timer
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prev();
            if (!isPaused) { stopAuto(); startAuto(); }
        });
    }

    // Nút next: click để sang slide sau, sau đó reset timer
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            next();
            if (!isPaused) { stopAuto(); startAuto(); }
        });
    }

    // Giữ chuột trên banner = tạm dừng
    slider.addEventListener('mousedown', () => {
        isPaused = true;
        stopAuto();
    });

    // Thả chuột = chạy lại
    slider.addEventListener('mouseup', () => {
        isPaused = false;
        startAuto();
    });

    // Di chuột ra ngoài (trong lúc đang giữ) cũng cho chạy lại
    slider.addEventListener('mouseleave', () => {
        if (isPaused) {
            isPaused = false;
            startAuto();
        }
    });

    // Bắt đầu tự chạy ngay khi khởi tạo
    startAuto();
}


/* =========================================
   PHẦN 3: KHỞI ĐỘNG
   - Chạy các hàm cần thiết khi trang đã tải xong.
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    renderAllProducts();    // Hiển thị sản phẩm (chỉ hoạt động hiệu quả ở trang chủ)
    initBannerSlider();     // Khởi động banner (chỉ hoạt động ở trang chủ)
});
