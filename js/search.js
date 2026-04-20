// File search.js kich hoat thanh tim kiem va goi y

document.addEventListener('DOMContentLoaded', () => {
    // Lay phan tu input tim kiem va nut tim
    const searchInput = document.getElementById('global-search-input');
    const searchBtn = document.getElementById('global-search-btn');
    // Tim cai the div boc ngoai cung cua o tim kiem de neo cai khung goi y vao
    const searchBoxContainer = document.querySelector('.search-box');

    if (!searchInput || !searchBtn || !searchBoxContainer) return;

    // Tao khung goi y dang an
    const suggestionBox = document.createElement('div');
    suggestionBox.id = 'search-suggestions';
    suggestionBox.className = 'search-suggestions';
    suggestionBox.style.display = 'none'; // Mac dinh an
    searchBoxContainer.appendChild(suggestionBox); // Nhet no vao ngay duoi o input

    // Ham chuyen trang khi bam tim voi tu khoa
    function executeSearch(keyword = null) {
        const finalKeyword = keyword || searchInput.value.trim();
        if (finalKeyword !== "") {
            window.location.href = `danhmuc.html?search=${encodeURIComponent(finalKeyword)}`;
        } else {
            alert('Vui long nhap ten san pham can tim!');
            searchInput.focus();
        }
    }

    // Su kien click nut Tim va nhan Enter
    searchBtn.addEventListener('click', () => executeSearch());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch();
        }
    });

    // Tinh nang tu dong goi y khi go chu
    searchInput.addEventListener('input', function() {
        const keyword = this.value.trim().toLowerCase();

        // Neu xoa trang o tim kiem thi an khung goi y di
        if (keyword === '') {
            suggestionBox.style.display = 'none';
            return;
        }

        // Lay du lieu tu data.js de so sanh
        if (typeof products !== 'undefined') {
            // Loc ra cac san pham co ten chua chu khach dang go
            const matchedProducts = products.filter(p =>
                p.name.toLowerCase().includes(keyword)
            ).slice(0, 5); // Chi lay toi da 5 san pham hien len cho dep

            if (matchedProducts.length > 0) {
                let html = '';
                // Do du lieu 5 san pham do ra HTML
                matchedProducts.forEach(p => {
                    html += `
                        <div class="suggestion-item" onclick="window.location.href='chitietsanpham.html?id=${p.id}'">
                            <img src="${p.image}" alt="${p.name}">
                            <div class="suggestion-info">
                                <div class="suggestion-name">${p.name}</div>
                                <div class="suggestion-price">${p.price}</div>
                            </div>
                        </div>
                    `;
                });

                // Them mot nut duoi cung de xem toan bo ket qua neu khach muon
                html += `
                    <div class="suggestion-view-all" onclick="window.location.href='danhmuc.html?search=${encodeURIComponent(keyword)}'">
                        Xem tat ca ket qua cho "${keyword}" <span>›</span>
                    </div>
                `;

                suggestionBox.innerHTML = html;
                suggestionBox.style.display = 'block'; // Hien khung len
            } else {
                // Neu go sai hoac khong co hang
                suggestionBox.innerHTML = `<div class="suggestion-empty">Khong tim thay san pham nao chua tu "${keyword}"</div>`;
                suggestionBox.style.display = 'block';
            }
        }
    });

    // An khung goi y khi click chuot ra ngoai vung tim kiem
    document.addEventListener('click', function(e) {
        if (!searchBoxContainer.contains(e.target)) {
            suggestionBox.style.display = 'none';
        }
    });
});