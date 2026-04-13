// ==========================================================
// FILE: auth.js - Xử lý Đăng ký & Đăng nhập
// Hệ thống sử dụng localStorage để lưu trữ dữ liệu người dùng 
// giả lập một cơ sở dữ liệu phía trình duyệt.
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. XỬ LÝ ĐĂNG KÝ (Tại trang dangki.html) ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngăn trình duyệt tải lại trang khi submit

            // Lấy giá trị từ các ô input
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const phone = document.getElementById('reg-phone').value;

            // Kiểm tra mật khẩu xác nhận có khớp không
            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            // Lấy danh sách người dùng đã lưu trong localStorage (nếu chưa có thì tạo mảng rỗng)
            const users = JSON.parse(localStorage.getItem('hehe_users')) || [];

            // Kiểm tra xem tên tài khoản đã tồn tại trong "hệ thống" chưa
            const userExists = users.some(user => user.username === username);
            if (userExists) {
                alert('Tên tài khoản này đã được sử dụng!');
                return;
            }

            // Tạo đối tượng người dùng mới và thêm vào mảng
            const newUser = {
                username: username,
                password: password,
                phone: phone
            };
            users.push(newUser);

            // Lưu mảng người dùng mới lại vào localStorage dưới dạng chuỗi JSON
            localStorage.setItem('hehe_users', JSON.stringify(users));

            alert('Đăng ký tài khoản thành công! Bây giờ bạn có thể đăng nhập.');
            // Chuyển hướng người dùng sang trang đăng nhập
            window.location.href = 'dangnhap.html';
        });
    }

    // --- 2. XỬ LÝ ĐĂNG NHẬP (Tại trang dangnhap.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;

            // Lấy danh sách người dùng từ localStorage để đối soát
            const users = JSON.parse(localStorage.getItem('hehe_users')) || [];

            // Tìm người dùng có cả username và password trùng khớp
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Nếu đúng: Lưu thông tin người dùng hiện tại vào localStorage để ghi nhớ trạng thái đăng nhập
                localStorage.setItem('hehe_currentUser', JSON.stringify(user));
                alert('Đăng nhập thành công! Chào mừng bạn quay lại.');
                // Quay về trang chủ
                window.location.href = 'index.html';
            } else {
                // Nếu sai: Thông báo lỗi cho người dùng
                alert('Tài khoản hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.');
            }
        });
    }

    // --- 3. KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP (Chạy trên mọi trang) ---
    // Hàm này giúp thay đổi giao diện Header tùy theo việc người dùng đã đăng nhập hay chưa
    checkLoginStatus();
});

/**
 * Kiểm tra xem có 'hehe_currentUser' trong localStorage không.
 * Nếu có: Ẩn nút "Đăng nhập" và hiển thị Tên người dùng kèm nút "Đăng xuất".
 */
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('hehe_currentUser'));
    const navUl = document.querySelector('.main-nav ul');
    const accountLink = document.querySelector('.account-link');

    if (currentUser && navUl) {
        // Duyệt qua các mục trên thanh menu
        const navItems = navUl.querySelectorAll('li');
        navItems.forEach(item => {
            const link = item.querySelector('a');
            // Tìm đến mục "Đăng nhập" (dựa vào href)
            if (link && link.getAttribute('href') === 'dangnhap.html') {
                // Thay thế chữ "Đăng nhập" thành "Đăng xuất" trực tiếp
                link.innerText = 'Đăng xuất';
                link.href = '#';
                link.id = 'logout-btn';
            }
        });

        // Cập nhật thuộc tính title cho icon tài khoản để hiện tên khi di chuột vào
        if (accountLink) {
            accountLink.title = `Xin chào, ${currentUser.username}`;
            // Đổi link của icon tài khoản sang trang profile
            accountLink.href = 'profile.html';
        }

        // Gán sự kiện cho nút Đăng xuất vừa tạo
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Xóa thông tin người dùng hiện tại khỏi localStorage
                localStorage.removeItem('hehe_currentUser');
                alert('Bạn đã đăng xuất thành công.');
                // Tải lại trang để cập nhật giao diện về trạng thái chưa đăng nhập
                window.location.reload();
            });
        }
    }
}
