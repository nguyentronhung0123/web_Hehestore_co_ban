
// File auth.js xu ly dang ky dang nhap va quen mat khau
// He thong su dung localStorage de luu tru du lieu nguoi dung
// gia lap mot co so du lieu phia trinh duyet
// Khong su dung server thuc te chi de demo

document.addEventListener('DOMContentLoaded', () => {

    // Xu ly dang ky tai trang dangki.html
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngan trinh duyet tai lai trang khi submit

            // Lay gia tri tu cac o input
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const phone = document.getElementById('reg-phone').value;

            // Kiem tra mat khau xac nhan co khop khong
            if (password !== confirmPassword) {
                alert('Mat khau xac nhan khong khop!');
                return;
            }

            // Lay danh sach nguoi dung da luu trong localStorage
            // Neu chua co thi tao mang rong
            const users = JSON.parse(localStorage.getItem('hehe_users')) || [];

            // Kiem tra xem ten tai khoan da ton tai trong he thong chua
            const userExists = users.some(user => user.username === username);
            if (userExists) {
                alert('Ten tai khoan nay da duoc su dung!');
                return;
            }

            // Tao doi tuong nguoi dung moi va them vao mang
            const newUser = {
                username: username,
                password: password,
                phone: phone
            };
            users.push(newUser);

            // Luu mang nguoi dung moi lai vao localStorage duoi dang chuoi JSON
            localStorage.setItem('hehe_users', JSON.stringify(users));

            alert('Dang ky tai khoan thanh cong! Bay gio ban co the dang nhap.');
            // Chuyen huong nguoi dung sang trang dang nhap
            window.location.href = 'dangnhap.html';
        });
    }

    // Kiem tra trang thai dang nhap chay tren moi trang
    // Ham nay giup thay doi giao dien Header tuy theo viec nguoi dung da dang nhap hay chua
    checkLoginStatus();
});

/**
 * Kiểm tra xem có 'hehe_currentUser' trong localStorage không.
 * Nếu có: Ẩn nút "Đăng nhập" và hiển thị Tên người dùng kèm nút "Đăng xuất".
 */
function checkLoginStatus() {
    // Lay thong tin nguoi dung dang dang nhap tu localStorage
    const currentUser = JSON.parse(localStorage.getItem('hehe_currentUser'));
    // Tim thanh menu chinh va link tai khoan
    const navUl = document.querySelector('.main-nav ul');
    const accountLink = document.querySelector('.account-link');

    if (currentUser && navUl) {
        // Neu co nguoi dung dang dang nhap
        // Duyet qua cac muc tren thanh menu
        const navItems = navUl.querySelectorAll('li');
        navItems.forEach(item => {
            const link = item.querySelector('a');
            // Tim muc Dang nhap dua vao href
            if (link && link.getAttribute('href') === 'dangnhap.html') {
                // Thay the chu Dang nhap thanh Dang xuat truc tiep
                link.innerText = 'Dang xuat';
                link.href = '#';
                link.id = 'logout-btn';
            }
        });

        // Cap nhat thuoc tinh title cho icon tai khoan de hien ten khi di chuot vao
        if (accountLink) {
            accountLink.title = `Xin chao, ${currentUser.username}`;
            // Doi link cua icon tai khoan sang trang profile
            accountLink.href = 'profile.html';
        }

        // Gan su kien cho nut Dang xuat vua tao
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Xoa thong tin nguoi dung hien tai khoi localStorage
                localStorage.removeItem('hehe_currentUser');
                alert('Ban da dang xuat thanh cong.');
                // Tai lai trang de cap nhat giao dien ve trang thai chua dang nhap
                window.location.reload();
            });
        }
    }
}

// Cac ham xu ly giao dien dang nhap va quen mat khau
// Duoc goi truc tiep tu thuoc tinh onclick trong file HTML

// Xu ly dang nhap
function xuLyDangNhap() {
    // Lay du lieu tu giao dien moi HTML da doi id thanh login-email
    const usernameInput = document.getElementById('login-email').value.trim();
    const passwordInput = document.getElementById('login-password').value;

    if (usernameInput === "" || passwordInput === "") {
        alert("Vui long dien tai khoan email va mat khau!");
        return;
    }

    // Lay danh sach nguoi dung tu localStorage de doi chieu
    const users = JSON.parse(localStorage.getItem('hehe_users')) || [];

    // Tim nguoi dung co ca username va password trung khop
    const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        // Neu dung luu thong tin nguoi dung hien tai vao localStorage
        localStorage.setItem('hehe_currentUser', JSON.stringify(user));
        alert('Dang nhap thanh cong! Chao mung ban quay lai.');
        // Quay ve trang chu
        window.location.href = 'index.html';
    } else {
        // Neu sai thong bao loi cho nguoi dung
        alert('Tai khoan hoac mat khau khong chinh xac! Vui long kiem tra lai.');
    }
}

// Xu ly chuyen doi cac form quen mat khau

// Lay san cac khoi Form HTML bang ID de tai su dung
function getForms() {
    return {
        login: document.getElementById('block-dang-nhap'),
        email: document.getElementById('block-nhap-email'),
        reset: document.getElementById('block-dat-lai-mk')
    };
}

// Ham tro ve man hinh Dang Nhap goc
function showLoginForm() {
    const forms = getForms();
    if(forms.login && forms.email && forms.reset) {
        forms.login.style.display = 'block';
        forms.email.style.display = 'none';
        forms.reset.style.display = 'none';
    }
}

// Ham an Dang Nhap hien form yeu cau nhap Email Tai khoan
function showResetEmailForm(event) {
    if(event) event.preventDefault(); // Ngan trinh duyet nhay len dau trang
    const forms = getForms();
    if(forms.login && forms.email && forms.reset) {
        forms.login.style.display = 'none';
        forms.email.style.display = 'block';
        forms.reset.style.display = 'none';
    }
}

// Ham kiem tra tai khoan co ton tai khong neu co thi cho chuyen sang form Doi MK
function showNewPasswordForm() {
    let emailValue = document.getElementById('reset-email').value.trim();

    if(emailValue === "") {
        alert("Vui long nhap ten tai khoan email cua ban de tiep tuc!");
        return;
    }

    // Kiem tra localStorage xem tai khoan nay co thuc su ton tai khong
    const users = JSON.parse(localStorage.getItem('hehe_users')) || [];
    const userExists = users.some(u => u.username === emailValue);

    if(!userExists) {
        alert("Khong tim thay tai khoan nay trong he thong. Vui long kiem tra lai!");
        return;
    }

    // Luu tam ten tai khoan dang can doi mat khau vao bo nho de lat nua cap nhat
    localStorage.setItem('hehe_reset_target', emailValue);

    const forms = getForms();
    forms.login.style.display = 'none';
    forms.email.style.display = 'none';
    forms.reset.style.display = 'block';
}

// Ham nhan mat khau moi cap nhat vao he thong va hoan tat
function hoanThanhDoiMK() {
    let pass1 = document.getElementById('new-password').value;
    let pass2 = document.getElementById('confirm-password').value;

    if(pass1.trim() === "" || pass2.trim() === "") {
        alert("Vui long dien day du ca 2 o mat khau moi!");
        return;
    }

    if(pass1 !== pass2) {
        alert("Hai mat khau khong khop nhau. Vui long kiem tra lai!");
        return;
    }

    // Cap nhat localStorage doi mat khau cho user
    const targetUser = localStorage.getItem('hehe_reset_target');
    let users = JSON.parse(localStorage.getItem('hehe_users')) || [];

    // Tim dung user va ghi de mat khau moi
    users = users.map(u => {
        if(u.username === targetUser) {
            u.password = pass1;
        }
        return u;
    });

    // Luu mang da cap nhat nguoc lai vao localStorage
    localStorage.setItem('hehe_users', JSON.stringify(users));

    // Don dep bo nho tam
    localStorage.removeItem('hehe_reset_target');

    alert("Doi mat khau thanh cong! Ban co the dang nhap ngay bang mat khau moi.");

    // Xoa rong cac o input de don dep giao dien
    document.getElementById('reset-email').value = "";
    document.getElementById('new-password').value = "";
    document.getElementById('confirm-password').value = "";

    // Quay lai trang dang nhap
    showLoginForm();
}
