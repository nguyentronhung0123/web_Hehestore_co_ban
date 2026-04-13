# HẸ HẸ STORE – TỔNG QUAN DỰ ÁN (CẬP NHẬT)

Dự án này là một website bán hàng điện tử (tập trung vào sản phẩm Apple) được xây dựng hoàn toàn bằng **HTML, CSS và JavaScript thuần (Vanilla JS)**, không sử dụng bất kỳ framework hay thư viện bên thứ ba nào (ngoại trừ Google Fonts).

---

## 1. Cấu trúc thư mục (Directory Structure)

```text
Hẹ Hẹ Store/
├── css/
│   └── style.css          # Chứa toàn bộ mã định dạng giao diện (CSS)
├── js/
│   ├── data.js            # Chứa mảng dữ liệu sản phẩm (Cơ sở dữ liệu giả lập)
│   ├── main.js            # Điều khiển hiển thị sản phẩm và Banner Slider
│   ├── auth.js            # Xử lý logic Đăng ký, Đăng nhập (LocalStorage)
│   └── cart.js            # Xử lý logic Giỏ hàng (LocalStorage)
├── images/                # Thư mục chứa hình ảnh sản phẩm, banner, icon
├── index.html             # Trang chủ chính
├── danhmuc.html           # Trang hiển thị sản phẩm theo danh mục (iPhone, iPad...)
├── giohang.html           # Trang quản lý giỏ hàng và thanh toán
├── dangnhap.html          # Trang đăng nhập tài khoản
├── dangki.html            # Trang đăng ký tài khoản mới
├── tintuc.html            # Trang tin tức công nghệ
└── NOTE-PROJECT.md        # Tài liệu hướng dẫn và ghi chú dự án
```

---

## 2. Các tính năng chính (Core Features)

### 2.1. Quản lý Dữ liệu (Data Management)
- Toàn bộ thông tin sản phẩm được quản lý tập trung trong [data.js](file:///Users/admin/T%C3%A0i%20li%E1%BB%87u%20h%E1%BB%8Dc%20web/H%E1%BA%B9%20H%E1%BA%B9%20Store/js/data.js).
- Mỗi sản phẩm có các thuộc tính: `id`, `name`, `price`, `image`, và `category`.

### 2.2. Giao diện người dùng (UI/UX)
- **Banner Slider**: Tự động chuyển ảnh quảng cáo mỗi 5 giây, có nút điều hướng thủ công.
- **Mega Menu & Dropdown**: Hệ thống menu điều hướng mượt mà, hỗ trợ cuộn nhanh đến các danh mục sản phẩm.
- **Nút nổi tiện ích**: Nhóm nút bên phải màn hình giúp khách hàng liên hệ nhanh (Gọi điện, Facebook, Maps) và truy cập Giỏ hàng.
- **Responsive**: Giao diện được tối ưu hóa cơ bản cho các kích thước màn hình khác nhau.

### 2.3. Hệ thống Tài khoản (Authentication)
- **Lưu trữ**: Sử dụng `localStorage` (tên khóa: `hehe_users`) để lưu danh sách tài khoản người dùng.
- **Đăng ký**: Kiểm tra trùng lặp tài khoản, khớp mật khẩu.
- **Đăng nhập**: Đối soát thông tin và ghi nhớ trạng thái đăng nhập (`hehe_currentUser`).
- **Header động**: Chữ "Đăng nhập" sẽ tự động chuyển thành "Đăng xuất" sau khi đăng nhập thành công. Khi di chuột vào icon tài khoản sẽ hiển thị tên người dùng.

### 2.4. Giỏ hàng (Shopping Cart)
- **Lưu trữ**: Sản phẩm trong giỏ được lưu vào `localStorage` (tên khóa: `hehe_cart`).
- **Thêm vào giỏ**: Có thể thêm từ Trang chủ hoặc Trang danh mục.
- **Badge thông báo**: Một vòng tròn nhỏ trên icon giỏ hàng hiển thị tổng số lượng sản phẩm hiện có.
- **Trang Giỏ hàng**:
    - Hiển thị chi tiết: ảnh, tên, giá.
    - Thay đổi số lượng (+/-) hoặc xóa hẳn sản phẩm.
    - Tự động tính tổng tiền thanh toán.
    - Nút Thanh toán màu đỏ nổi bật.

---

## 3. Hướng dẫn kỹ thuật (Technical Guide)

### Cách render sản phẩm động
Thay vì viết HTML cho từng sản phẩm, dự án sử dụng hàm `createProductHTML(product)` trong [main.js](file:///Users/admin/T%C3%A0i%20li%E1%BB%87u%20h%E1%BB%8Dc%20web/H%E1%BA%B9%20H%E1%BA%B9%20Store/js/main.js) để tạo chuỗi HTML từ dữ liệu, sau đó dùng `innerHTML` để đổ vào các container tương ứng.

### Cơ chế lọc sản phẩm (Trang Danh mục)
Trang [danhmuc.html](file:///Users/admin/T%C3%A0i%20li%E1%BB%87u%20h%E1%BB%8Dc%20web/H%E1%BA%B9%20H%E1%BA%B9%20Store/danhmuc.html) sử dụng `URLSearchParams` để đọc tham số trên trình duyệt. Ví dụ: `?category=macbook`. Dựa vào đó, JS sẽ lọc mảng `products` và chỉ hiển thị các sản phẩm thuộc nhóm MacBook.

---

*Tài liệu này được tạo và cập nhật bởi Trợ lý AI (Trae) vào ngày 16/03/2026.*
