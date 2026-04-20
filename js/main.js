// File main.js chua tat ca chuc nang JavaScript cho trang khach
// Muc luc:
// 1. Dong bo du lieu tu admin
// 2. Hien thi san pham
// 3. Banner slider
// 4. Khoi dong

// Phan 1: Dong bo du lieu tu admin
// Ham nay giup trang khach doc duoc nhung thay doi ve gia, ten hoac hang moi do admin tao ra trong localStorage
function getCombinedProducts() {
    // Lay du lieu goc tu bien products trong data.js
    const baseProducts = typeof products !== 'undefined' ? [...products] : [];

    // Lay cac thay doi do admin thuc hien tu localStorage
    const modifiedBaseProducts = JSON.parse(localStorage.getItem('hehe_modified_base_products')) || {};
    const deletedBaseIds = JSON.parse(localStorage.getItem('hehe_deleted_base_ids')) || [];
    const customProducts = JSON.parse(localStorage.getItem('hehe_custom_products')) || [];

    // Loc hang goc: loai bo hang da xoa, ghi de gia/ten moi cho hang bi sua
    const finalBaseProducts = baseProducts
        .filter(p => !deletedBaseIds.includes(p.id))
        .map(p => {
            if (modifiedBaseProducts[p.id]) {
                return { ...p, ...modifiedBaseProducts[p.id] }; // Tron du lieu moi de len cu
            }
            return p;
        });

    // Gop mang hang goc da xu ly va mang hang admin tu them
    return [...finalBaseProducts, ...customProducts];
}

// Phan 2: Hien thi san pham

// Tao chuoi HTML cho mot card san pham
function createProductHTML(product) {
    // Luu y quan trong: ID trong ham addToCartDefault phai duoc boc trong dau nhay don de phong truong hop ID la chuoi
    return `
        <article class="product-item">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <div class="product-actions">
                <a href="chitietsanpham.html?id=${product.id}">Xem chi tiết</a>
                <button class="add-to-cart-btn" onclick="addToCartDefault('${product.id}')">Thêm vào giỏ</button>
            </div>
        </article>
    `;
}

// Render tat ca san pham len trang chu
function renderAllProducts() {
    // Lay cac element container tu DOM
    const iphoneContainer = document.getElementById('iphone-list');
    const macbookContainer = document.getElementById('macbook-list');
    const ipadContainer = document.getElementById('ipad-list');
    const phukienContainer = document.getElementById('phukien-list');

    // Chuan bi cac chuoi HTML cho tung danh muc
    let iphoneHTML = '';
    let macbookHTML = '';
    let ipadHTML = '';
    let phukienHTML = '';

    // Goi ham lay san pham da dong bo
    const allProducts = getCombinedProducts();

    // Duyet qua mang tong
    allProducts.forEach(product => {
        // Bien chu danh muc thanh chu thuong
        const cat = (product.category || '').toLowerCase();

        switch (cat) {
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

    // Gan HTML vao DOM, kiem tra container co ton tai khong
    if (iphoneContainer) iphoneContainer.innerHTML = iphoneHTML || '<p style="grid-column: span 4; text-align:center; color:#888;">Chưa có sản phẩm</p>';
    if (macbookContainer) macbookContainer.innerHTML = macbookHTML || '<p style="grid-column: span 4; text-align:center; color:#888;">Chưa có sản phẩm</p>';
    if (ipadContainer) ipadContainer.innerHTML = ipadHTML || '<p style="grid-column: span 4; text-align:center; color:#888;">Chưa có sản phẩm</p>';
    if (phukienContainer) phukienContainer.innerHTML = phukienHTML || '<p style="grid-column: span 4; text-align:center; color:#888;">Chưa có sản phẩm</p>';
}

// Phan 3: Banner slider
// Tu dong chuyen slide moi 5 giay, co nut prev/next, tam dung khi giu chuot
function initBannerSlider() {
    // Khai bao bien
    let currentIndex = 0;       // Index cua slide dang hien thi
    const totalSlides = 5;      // Tong so anh banner
    let autoTimer = null;       // Bien luu setInterval
    let isPaused = false;       // Trang thai co dang tam dung hay khong
    const intervalTime = 5000;  // Thoi gian tu chuyen: 5 giay

    // Lay element tu DOM
    const track = document.getElementById('banner-track');
    const prevBtn = document.getElementById('banner-prev');
    const nextBtn = document.getElementById('banner-next');
    const slider = track ? track.closest('.banner-slider') : null;

    // Chi khoi tao slider neu cac element can thiet ton tai
    if (!track || !slider) return;

    // Chuyen den slide co index tuong ung
    function goToSlide(index) {
        // Xu ly de slide chay vong lap
        currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Chuyen den slide tiep theo
    function next() {
        goToSlide(currentIndex + 1);
    }

    // Chuyen ve slide truoc do
    function prev() {
        goToSlide(currentIndex - 1);
    }

    // Bat dau che do tu dong chuyen slide
    function startAuto() {
        // Xoa timer cu de tranh chay nhieu timer cung luc
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(next, intervalTime);
    }

    // Dung che do tu dong
    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    // Gan su kien cho cac nut va banner

    // Nut prev: click de ve slide truoc, sau do reset timer
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prev();
            if (!isPaused) { stopAuto(); startAuto(); }
        });
    }

    // Nut next: click de sang slide sau, sau do reset timer
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            next();
            if (!isPaused) { stopAuto(); startAuto(); }
        });
    }

    // Giu chuot tren banner = tam dung
    slider.addEventListener('mousedown', () => {
        isPaused = true;
        stopAuto();
    });

    // Tha chuot = chay lai
    slider.addEventListener('mouseup', () => {
        isPaused = false;
        startAuto();
    });

    // Di chuot ra ngoai cung cho chay lai
    slider.addEventListener('mouseleave', () => {
        if (isPaused) {
            isPaused = false;
            startAuto();
        }
    });

    // Bat dau tu chay ngay khi khoi tao
    startAuto();
}

// Phan 4: Khoi dong
// Chay cac ham can thiet khi trang da tai xong
document.addEventListener('DOMContentLoaded', () => {
    renderAllProducts();    // Hien thi san pham da dong bo o trang chu
    initBannerSlider();     // Khoi dong banner
});