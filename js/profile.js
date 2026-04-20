// Xu ly man hinh profile thong tin tai khoan

document.addEventListener('DOMContentLoaded', () => {
    // Lay thong tin nguoi dung hien tai tu localStorage
    const currentUser = JSON.parse(localStorage.getItem('hehe_currentUser'));

    if (!currentUser) {
        alert('Vui long dang nhap de xem thong tin tai khoan!');
        window.location.href = 'dangnhap.html';
        return;
    }

    // Lay cac element DOM
    const displayInfo = document.getElementById('display-info');
    const editInfo = document.getElementById('edit-info');
    const btnEdit = document.getElementById('btn-edit');
    const editActions = document.getElementById('edit-actions');

    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const phoneEl = document.getElementById('profile-phone');

    const inputName = document.getElementById('edit-name');
    const inputPhone = document.getElementById('edit-phone');
    const adminLink = document.getElementById('admin-menu-link');

    // Ham hien thi du lieu
    function renderProfileData() {
        if(nameEl) nameEl.innerText = currentUser.username;
        if(emailEl) emailEl.innerText = `${currentUser.username.toLowerCase().replace(/\s/g, '')}@gmail.com`;
        if(phoneEl) phoneEl.innerText = `SDT ${currentUser.phone || 'Chua cap nhat'}`;

        // Kich hoat nut Admin neu ten dang nhap la admin hoac chua ten hung hung
        if (adminLink && currentUser.username) {
            const usernameLower = currentUser.username.toLowerCase();
            if (usernameLower.includes('admin') || usernameLower.includes('hung')) {
                adminLink.style.display = 'flex';
            } else {
                adminLink.style.display = 'none';
            }
        }
    }

    // Chay hien thi lan dau
    renderProfileData();

    // Mo form chinh sua
    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            displayInfo.style.display = 'none';
            btnEdit.style.display = 'none';

            editInfo.style.display = 'block';
            editActions.style.display = 'flex';

            inputName.value = currentUser.username;
            inputPhone.value = currentUser.phone || '';
        });
    }

    // Huy chinh sua
    const btnCancel = document.getElementById('btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            editInfo.style.display = 'none';
            editActions.style.display = 'none';

            displayInfo.style.display = 'block';
            btnEdit.style.display = 'inline-block';
        });
    }

    // Luu thong tin
    const btnSave = document.getElementById('btn-save');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            const newName = inputName.value.trim();
            const newPhone = inputPhone.value.trim();

            if (newName === '') {
                alert('Ten khong duoc de trong!');
                return;
            }

            // Luu vao mang users
            let users = JSON.parse(localStorage.getItem('hehe_users')) || [];
            let userIndex = users.findIndex(u => u.username === currentUser.username);
            if (userIndex !== -1) {
                users[userIndex].username = newName;
                users[userIndex].phone = newPhone;
                localStorage.setItem('hehe_users', JSON.stringify(users));
            }

            // Luu vao user hien tai
            currentUser.username = newName;
            currentUser.phone = newPhone;
            localStorage.setItem('hehe_currentUser', JSON.stringify(currentUser));

            alert('Cap nhat thong tin thanh cong!');

            btnCancel.click();
            renderProfileData();
            window.location.reload();
        });
    }
});