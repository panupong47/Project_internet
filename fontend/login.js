const API_URL = 'http://localhost:4720'; // ปรับให้ตรงกับพอร์ตของเซิร์ฟเวอร์

function showTab(tabId) {
    // ซ่อนทุก tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // ยกเลิกการ active ของทุก tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // แสดง tab content ที่ต้องการ
    document.getElementById(tabId).classList.add('active');

    // Active tab ที่เลือก
    if (tabId === 'login-tab' || tabId === 'register-tab') {
        document.querySelectorAll('.tab')[tabId === 'login-tab' ? 0 : 1].classList.add('active');
    }

    // ซ่อนข้อความ
    document.getElementById('message').style.display = 'none';
}

function showMessage(text, isSuccess = true) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = 'message ' + (isSuccess ? 'success' : 'error');
    messageEl.style.display = 'block';
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showMessage('กรุณากรอกอีเมลและรหัสผ่าน', false);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tb_login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message);
            // บันทึก user id ไว้ใน localStorage
            localStorage.setItem('userId', data.user.id);
            // ไปยังหน้าหลักหลังจาก login สำเร็จ
            setTimeout(() => {
                window.location.href = 'DataAdmin.html'; // หรือหน้าหลักของคุณ
            }, 1500);
        } else {
            showMessage(data.message, false);
        }
    } catch (error) {
        showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', false);
        console.error('ข้อผิดพลาดในการเข้าสู่ระบบ:', error);
    }
}

async function resetPassword() {
    const email = document.getElementById('reset-email').value;

    if (!email) {
        showMessage('กรุณากรอกอีเมล', false);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reset-password-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(data.message);
            // กลับไปหน้า login หลังจากส่งคำขอรีเซ็ตรหัสผ่าน
            setTimeout(() => {
                showTab('login-tab');
            }, 2000);
        } else {
            showMessage(data.message, false);
        }
    } catch (error) {
        showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', false);
        console.error('ข้อผิดพลาดในการรีเซ็ตรหัสผ่าน:', error);
    }
}
