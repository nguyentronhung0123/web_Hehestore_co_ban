// File detail.js xu ly logic cho trang chi tiet san pham
// Chuc nang render giao dien dong dua vao data.js tinh toan
// gia tien khi chon dung luong va them vao gio hang voi phan loai

document.addEventListener('DOMContentLoaded', () => {
    // Lay ID san pham tu tham so id tren URL
    const urlParams = new URLSearchParams(window.location.search);

    // ID cua chung ta co the la chu vi du ip17 macM2
    // Neu dung parseInt sebi loi NaN Not a Number
    const productId = urlParams.get('id');

    // Tim san pham trong mang products nam ben file data.js
    // Dung dau == loose equality de so sanh khop ca chuoi string lan so number
    const product = products.find(p => p.id == productId);

    const detailContainer = document.getElementById('product-detail-content');

    if (product && detailContainer) {
        // Neu tim thay san pham bat dau render giao dien
        renderProductDetail(product, detailContainer);
    } else {
        // Neu khong tim thay hien thi thong bao loi
        detailContainer.innerHTML = `<div style="text-align: center; padding: 50px;">
            <h2 style="color:red; margin-bottom:20px;">Khong tim thay san pham!</h2>
            Vui long quay lai <a href="index.html" style="color:#2196F3; font-weight:bold;">Trang chu</a>.
        </div>`;
    }
});

// Render toan bo giao dien chi tiet san pham
// Doi so product la doi tuong san pham tu data.js
// Doi so container la Element de render vao
function renderProductDetail(product, container) {
    // Tao cau truc HTML co ban
    // Su dung Backtick de nhung bien truc tiep vao HTML
    container.innerHTML = `
        <div class="detail-left">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-right">
            <h2 class="detail-title">${product.name}</h2>
            <p class="detail-brand">Thuong hieu <span style="font-weight:bold; color:#2196F3;">${product.brand || 'Apple'}</span></p>

            <div class="option-group" id="color-options-group">
                <h4>Mau sac</h4>
                <div class="option-list" id="color-options"></div>
            </div>

            <div class="option-group" id="storage-options-group">
                <h4>Dung luong</h4>
                <div class="option-list" id="storage-options"></div>
            </div>

            <div class="detail-price" id="current-price">${product.price}</div>

            <div class="action-buttons">
                <button class="btn-buy-now" id="detail-buy-now">MUA NGAY</button>
                <button class="btn-add-cart-outline" id="detail-add-to-cart">THEM VAO GIO</button>
            </div>
        </div>
    `;

    // Render cac nut tuy chon mau sac dung luong
    const colorContainer = document.getElementById('color-options');
    const storageContainer = document.getElementById('storage-options');
    const colorGroup = document.getElementById('color-options-group');
    const storageGroup = document.getElementById('storage-options-group');

    // Render danh sach Nut Mau sac neu san pham co mang colors
    if (product.colors && product.colors.length > 0) {
        product.colors.forEach((color, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn color-btn';
            btn.innerText = color;
            btn.dataset.color = color; // Luu du lieu ngam vao thuoc tinh data-color
            if (index === 0) btn.classList.add('active'); // Mac dinh to xanh cai dau tien
            colorContainer.appendChild(btn);
        });
    } else {
        colorGroup.style.display = 'none'; // An hang khu vuc chon mau neu data khong co
    }

    // Render danh sach Nut Dung luong neu san pham co mang storage
    if (product.storage && product.storage.length > 0) {
        product.storage.forEach((storage, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn storage-btn';
            btn.innerText = storage;
            btn.dataset.index = index; // Luu vi tri index 0 1 2 de lat nhan voi tien
            if (index === 0) btn.classList.add('active'); // Mac dinh to xanh cai dau tien
            storageContainer.appendChild(btn);
        });
    } else {
        storageGroup.style.display = 'none'; // An hang khu vuc chon dung luong neu data khong co
    }

    // Gan su kien cho cac nut tuy chon bam vao doi mau doi gia
    // Goi ham parsePrice da duoc viet bo sung o cuoi file de bien chuoi 36.990.000d thanh so 36990000
    const basePrice = parsePrice(product.price);
    const priceIncrement = 2000000; // Moi bac dung luong tang 2 trieu VND

    // Su kien khi click vao nut mau sac
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Xoa class active mau xanh o tat ca cac nut
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            // Them class active cho nut vua bam
            btn.classList.add('active');
        });
    });

    // Su kien khi click vao nut dung luong Bao gom tinh lai tien
    document.querySelectorAll('.storage-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.storage-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Lay ra index cua nut duoc bam 0 1 2
            const selectedIndex = parseInt(btn.dataset.index);
            // Cong thuc tinh gia Gia goc index 2 trieu
            const newPrice = basePrice + (selectedIndex * priceIncrement);

            // Cap nhat gia moi len man hinh thong qua ham formatPrice
            document.getElementById('current-price').innerText = formatPrice(newPrice);
        });
    });

    // Gan su kien cho nut them vao gio
    document.getElementById('detail-add-to-cart').addEventListener('click', () => {
        // Tim xem nut mau sac va dung luong nao dang co class active
        const selectedColor = document.querySelector('.color-btn.active')?.dataset.color || '';
        const selectedStorage = document.querySelector('.storage-btn.active')?.innerText || '';
        const currentPrice = document.getElementById('current-price').innerText;

        // Tao mot ID moi cho san pham trong gio Vi du ip17-Titan-Den-512GB
        // Muc dich Cung 1 may nhung chon mau dung luong khac nhau thi thanh 2 dong trong gio
        const cartProductId = `${product.id}-${selectedColor}-${selectedStorage}`.replace(/\s/g, '-');

        // Ten san pham hien thi trong gio Vi du iPhone 17 Pro Max Titan Den - 512GB
        let optionsText = '';
        if (selectedColor || selectedStorage) {
            const separator = (selectedColor && selectedStorage) ? ' - ' : '';
            optionsText = ` (${selectedColor}${separator}${selectedStorage})`;
        }
        const productNameWithOptions = `${product.name}${optionsText}`;

        // Dong goi du lieu thanh Object
        const productToAdd = {
            id: cartProductId,
            name: productNameWithOptions,
            price: currentPrice, // Luu gia da cong don dung luong
            image: product.image,
            quantity: 1
        };

        // Day vao ham xu ly localStorage
        addToCartWithOptions(productToAdd);
    });

    // Gan su kien cho nut mua ngay phan sua de khong bi ket chuyen trang
    document.getElementById('detail-buy-now').addEventListener('click', () => {
        const selectedColor = document.querySelector('.color-btn.active')?.dataset.color || '';
        const selectedStorage = document.querySelector('.storage-btn.active')?.innerText || '';
        const currentPrice = document.getElementById('current-price').innerText;

        const cartProductId = `${product.id}-${selectedColor}-${selectedStorage}`.replace(/\s/g, '-');

        let optionsText = '';
        if (selectedColor || selectedStorage) {
            const separator = (selectedColor && selectedStorage) ? ' - ' : '';
            optionsText = ` (${selectedColor}${separator}${selectedStorage})`;
        }
        const productNameWithOptions = `${product.name}${optionsText}`;

        const productToAdd = {
            id: cartProductId,
            name: productNameWithOptions,
            price: currentPrice,
            image: product.image,
            quantity: 1
        };

        // Them hang vao gio mot cach im lang Bo qua ham co chua alert
        let cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];
        const existingItem = cart.find(item => item.id === productToAdd.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(productToAdd);
        }

        localStorage.setItem('hehe_cart', JSON.stringify(cart));

        if(typeof updateCartBadge === 'function') {
            updateCartBadge();
        }

        // Chuyen huong ngay lap tuc sang trang thanh toan
        window.location.href = 'thanhtoan.html';
    });
}


// Ham them vao gio hang duoc tuy chinh cho trang chi tiet
// Luu thang vao localStorage de F5 khong bi mat
function addToCartWithOptions(productData) {
    // Keo mang gio hang tu localStorage xuong
    let cart = JSON.parse(localStorage.getItem('hehe_cart')) || [];

    // Tim xem mon hang co ID y chang vay da co trong gio chua
    const existingItem = cart.find(item => item.id === productData.id);

    if (existingItem) {
        existingItem.quantity += 1; // Co roi thi tang so luong
    } else {
        cart.push(productData); // Chua co thi nhet them vao cuoi mang
    }

    // Day mang gio hang moi len lai localStorage
    localStorage.setItem('hehe_cart', JSON.stringify(cart));

    // Goi ham cap nhat so luong tren icon gio hang neu ham nay nam ben cart.js
    if(typeof updateCartBadge === 'function') {
        updateCartBadge();
    }

    alert(`Da them "${productData.name}" vao gio hang thanh cong!`);
}

// Cac ham bo tro UTILITIES
// Giai quyet loi chua khai bao ham parsePrice va formatPrice

// Chuyen chuoi gia tien VND thanh so nguyen de tinh toan
// Vi du 36.990.000d -> 36990000
function parsePrice(priceString) {
    if (!priceString) return 0;
    // Bo chu d chu d dau cham va khoang trang
    const cleanString = priceString.toString().replace(/[đd\.\s]/gi, '');
    const number = parseInt(cleanString);
    return isNaN(number) ? 0 : number;
}

// Chuyen so nguyen thanh chuoi gia tien VND co dau cham
// Vi du 38990000 -> 38.990.000d
function formatPrice(number) {
    // Dung toLocaleString de tu dong chen dau cham theo chuan tieng Viet
    return number.toLocaleString('vi-VN') + 'đ';
}