// ==========================================================
// FILE: data.js - Dữ liệu sản phẩm (Cơ sở dữ liệu giả lập)
// Mảng `products` này được sử dụng bởi các tệp JS khác để render sản phẩm,
// xử lý giỏ hàng và hiển thị chi tiết sản phẩm.
// ==========================================================

const products = [
    // ===== NHÓM IPHONE (category: "iphone") =====
    { 
        id: 1, 
        name: "iPhone 17 Pro Max", 
        price: "36.990.000đ", 
        image: "images/iphone/iphone17prm.png", 
        category: "iphone",
        brand: "Apple",
        colors: ["Titan Tự nhiên", "Titan Xanh", "Titan Trắng", "Titan Đen"],
        storage: ["256GB", "512GB", "1TB"]
    },
    { 
        id: 2, 
        name: "iPhone 16 Pro Max", 
        price: "29.990.000đ", 
        image: "images/iphone/iphone16prm.png", 
        category: "iphone",
        brand: "Apple",
        colors: ["Hồng", "Vàng", "Xanh Dương", "Đen"],
        storage: ["128GB", "256GB", "512GB"]
    },
    { 
        id: 3, 
        name: "iPhone 15 Pro Max", 
        price: "23.990.000đ", 
        image: "images/iphone/iphone15prm.png", 
        category: "iphone",
        brand: "Apple",
        colors: ["Titan Tự nhiên", "Titan Xanh", "Titan Trắng", "Titan Đen"],
        storage: ["256GB", "512GB", "1TB"]
    },
    { 
        id: 4, 
        name: "iPhone 14 Pro Max", 
        price: "14.990.000đ", 
        image: "images/iphone/iphone14prm.png", 
        category: "iphone",
        brand: "Apple",
        colors: ["Tím", "Vàng", "Bạc", "Đen"],
        storage: ["128GB", "256GB", "512GB", "1TB"]
    },

    // ===== NHÓM MACBOOK (category: "macbook") =====
    { 
        id: 5, 
        name: "MacBook Pro M1", 
        price: "29.990.000đ", 
        image: "images/macbook/macbookproM1.png", 
        category: "macbook",
        brand: "Apple",
        colors: ["Xám không gian", "Bạc"],
        storage: ["256GB", "512GB"]
    },
    { 
        id: 6, 
        name: "MacBook Air M2", 
        price: "24.990.000đ", 
        image: "images/macbook/macbookairM2.jpeg", 
        category: "macbook",
        brand: "Apple",
        colors: ["Xám không gian", "Bạc", "Vàng", "Xanh đen"],
        storage: ["256GB", "512GB"]
    },
    { 
        id: 7, 
        name: "MacBook Pro M3", 
        price: "39.990.000đ", 
        image: "images/macbook/macbookproM3.webp", 
        category: "macbook",
        brand: "Apple",
        colors: ["Xám không gian", "Bạc"],
        storage: ["512GB", "1TB", "2TB"]
    },
    { 
        id: 8, 
        name: "MacBook Air M4", 
        price: "49.990.000đ", 
        image: "images/macbook/macbookairM4.jpeg", 
        category: "macbook",
        brand: "Apple",
        colors: ["Xám không gian", "Bạc", "Vàng", "Xanh đen"],
        storage: ["512GB", "1TB", "2TB"]
    },

    // ===== NHÓM IPAD (category: "ipad") =====
    { 
        id: 9, 
        name: "iPad Air M2", 
        price: "14.990.000đ", 
        image: "images/ipad/ipadairm2.jpeg", 
        category: "ipad",
        brand: "Apple",
        colors: ["Xám không gian", "Bạc", "Tím", "Xanh"],
        storage: ["128GB", "256GB"]
    },
    { 
        id: 10, 
        name: "iPad Pro M2", 
        price: "19.990.000đ", 
        image: "images/ipad/ipadprom2.jpeg", 
        category: "ipad",
        brand: "Apple",
        colors: ["Xám không gian", "Bạc"],
        storage: ["128GB", "256GB", "512GB", "1TB"]
    },
    { 
        id: 11, 
        name: "iPad Air M3", 
        price: "19.990.000đ", 
        image: "images/ipad/ipadairm3.jpg", 
        category: "ipad",
        brand: "Apple",
        colors: ["Xám không gian", "Bạc", "Tím", "Xanh"],
        storage: ["128GB", "256GB"]
    },
    { 
        id: 12, 
        name: "iPad Pro M3", 
        price: "24.990.000đ", 
        image: "images/ipad/ipadprom3.jpeg", 
        category: "ipad",
        brand: "Apple",
        colors: ["Xám không gian", "Bạc"],
        storage: ["256GB", "512GB", "1TB", "2TB"]
    },

    // ===== NHÓM PHỤ KIỆN (category: "phukien") =====
    { 
        id: 13, 
        name: "AirPods Pro 2", 
        price: "5.990.000đ", 
        image: "images/phukien/AP2PRO.jpg", 
        category: "phukien",
        brand: "Apple",
        colors: ["Trắng"],
        storage: [] // Phụ kiện không có dung lượng
    },
    { 
        id: 14, 
        name: "Apple Watch Series 9", 
        price: "9.990.000đ", 
        image: "images/phukien/AWS9.webp", 
        category: "phukien",
        brand: "Apple",
        colors: ["Đen", "Trắng", "Hồng"],
        storage: []
    },
    { 
        id: 15, 
        name: "Magic Mouse 2", 
        price: "1.990.000đ", 
        image: "images/phukien/MGM2.jpeg", 
        category: "phukien",
        brand: "Apple",
        colors: ["Trắng", "Đen"],
        storage: []
    },
    { 
        id: 16, 
        name: "Magic Keyboard", 
        price: "2.990.000đ", 
        image: "images/phukien/MKB.webp", 
        category: "phukien",
        brand: "Apple",
        colors: ["Trắng", "Đen"],
        storage: []
    }
];

/*
 * Cấu trúc của mỗi đối tượng sản phẩm:
 * - id:       Số thứ tự (duy nhất) để định danh sản phẩm.
 * - name:     Tên đầy đủ của sản phẩm.
 * - price:    Giá sản phẩm (dưới dạng chuỗi đã được định dạng sẵn).
 * - image:    Đường dẫn đến ảnh của sản phẩm.
 * - category: Danh mục sản phẩm (iphone, macbook, ipad, phukien).
 * - brand:    Thương hiệu sản phẩm (mặc định là Apple).
 * - colors:   Mảng chứa các tùy chọn màu sắc.
 * - storage:  Mảng chứa các tùy chọn dung lượng. Để trống nếu không có.
 */
