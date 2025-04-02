const BASE_URL = 'http://localhost:4720';
let userId = null;

// ดึงข้อมูลตาม ID เมื่อโหลดหน้า
window.onload = async () => {
    // ดึง ID จาก URL
    const urlParams = new URLSearchParams(window.location.search);
    userId = urlParams.get('id');

    if (!userId) {
        alert('ไม่พบ ID ของข้อมูล');
        window.location.href = 'DataAdmin.html';
        return;
    }

    try {
        // ดึงข้อมูลจาก API
        const response = await axios.get(`${BASE_URL}/tb_data/${userId}`);
        const data = response.data;

        // แสดงข้อมูลในฟอร์ม
        document.getElementById('Name').value = data.Name || '';
        document.getElementById('Tle').value = data.Tle || '';
        document.getElementById('Email').value = data.Email || '';
        document.getElementById('Address').value = data.Address || '';

        // แปลงรูปแบบวันที่ให้เหมาะสมกับ input type="date"
        if (data.service_date) {
            const date = new Date(data.service_date);
            const formattedDate = date.toISOString().split('T')[0];
            document.getElementById('service_date').value = formattedDate;
        }

        // เลือกบริการตามข้อมูลที่มีอยู่
        const serviceSelect = document.getElementById('service');
        for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value === data.service) {
                serviceSelect.selectedIndex = i;
                break;
            }
        }

        document.getElementById('price').value = data.price || '';

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
};

// อัปเดตข้อมูลเมื่อกดปุ่ม "บันทึกการแก้ไข"
document.getElementById('updateBtn').addEventListener('click', async () => {
    try {
        const updateData = {
            Name: document.getElementById('Name').value,
            Tle: document.getElementById('Tle').value,
            Email: document.getElementById('Email').value,
            Address: document.getElementById('Address').value,
            service_date: document.getElementById('service_date').value,
            service: document.getElementById('service').value,
            price: document.getElementById('price').value
        };

        // ตรวจสอบการกรอกข้อมูล
        if (!updateData.Name || !updateData.Tle || !updateData.Email || !updateData.Address ||
            !updateData.service_date || !updateData.service || !updateData.price) {
            document.getElementById('message').textContent = 'กรุณากรอกข้อมูลให้ครบทุกช่อง';
            document.getElementById('message').style.color = 'red';
            return;
        }

        // อัปเดตข้อมูลผ่าน API
        await axios.put(`${BASE_URL}/tb_data/${userId}`, updateData);

        document.getElementById('message').textContent = 'อัปเดตข้อมูลสำเร็จ';
        document.getElementById('message').style.color = 'green';

        // กลับไปที่หน้าแสดงข้อมูลหลังจากอัปเดตสำเร็จ
        setTimeout(() => {
            window.location.href = 'DataAdmin.html';
        }, 1500);

    } catch (error) {
        console.error('Error updating data:', error);
        document.getElementById('message').textContent = 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ' + error.message;
        document.getElementById('message').style.color = 'red';
    }
});