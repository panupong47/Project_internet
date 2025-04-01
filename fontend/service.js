// service.js
const BASE_URL = 'http://localhost:4720'; // URL ของ API

// ตารางราคาบริการ
const SERVICE_PRICES = {
    'ซ่อมคอมพิวเตอร์': 500,
    'อัพเกรดคอมพิวเตอร์': 300,
    'กำจัดไวรัส': 350,
    'บำรุงรักษา': 500,
    'ติดตั้งโปรแกรม': 300,
    'กู้ข้อมูล': 300
};

// ตรวจสอบว่ามี ID ใน URL หรือไม่ (สำหรับโหมดแก้ไข)
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
let isEditMode = !!userId;

// โหลดข้อมูลผู้ใช้ถ้าอยู่ในโหมดแก้ไข
window.onload = async () => {
    // เพิ่ม event listener สำหรับการเลือกบริการเพื่ออัพเดทราคา
    document.getElementById('service').addEventListener('change', updatePrice);
    // เพิ่ม event listener สำหรับปุ่ม submit
    document.getElementById('submitBtn').addEventListener('click', submitData);
    
    if (isEditMode) {
        try {
            const response = await axios.get(`${BASE_URL}/tb_data/${userId}`);
            const userData = response.data;
            
            // กรอกข้อมูลในฟอร์มด้วยข้อมูลผู้ใช้
            document.querySelector('input[name="Name"]').value = userData.Name;
            document.querySelector('input[name="Tle"]').value = userData.Tle;
            document.querySelector('input[name="Email"]').value = userData.Email;
            document.querySelector('input[name="repairDate"]').value = userData.service_date;
            document.querySelector('select[name="service"]').value = userData.service;
            document.querySelector('input[name="Address"]').value = userData.Address;
            
            // อัพเดทราคาตามบริการที่โหลดมา
            updatePrice();
            
            // เปลี่ยนข้อความปุ่มเป็น "Update"
            document.querySelector('.button').textContent = 'Update';
        } catch (error) {
            console.error('Error loading user data:', error);
            showMessage('Error loading user data', 'error');
        }
    }
};

// ฟังก์ชันสำหรับอัพเดทราคาตามบริการที่เลือก
function updatePrice() {
    const serviceSelect = document.getElementById('service');
    const selectedService = serviceSelect.value;
    const price = SERVICE_PRICES[selectedService] || 0;
    
    // ตรวจสอบว่ามีองค์ประกอบแสดงราคาหรือไม่ ถ้าไม่มีให้สร้างขึ้น
    let priceElement = document.getElementById('service-price');
    if (!priceElement) {
        // สร้างองค์ประกอบสำหรับแสดงราคา
        priceElement = document.createElement('div');
        priceElement.id = 'service-price';
        priceElement.className = 'price-display';
        
        // แทรกหลังส่วนเลือกบริการ
        const serviceFormGroup = document.querySelector('.gender.form-input');
        serviceFormGroup.appendChild(priceElement);
    }
    
    // อัพเดทการแสดงราคา
    if (selectedService && price > 0) {
        priceElement.textContent = `ราคาค่าบริการ: ${price} บาท`;
        priceElement.style.display = 'block';
    } else {
        priceElement.style.display = 'none';
    }
}

// Function to submit the form data
async function submitData() {
    console.log("Submit function triggered");
    
    try {
        // รับค่าจากฟอร์ม
        const name = document.querySelector('input[name="Name"]').value;
        const telephone = document.querySelector('input[name="Tle"]').value;
        const email = document.querySelector('input[name="Email"]').value;
        const repairDate = document.querySelector('input[name="repairDate"]').value;
        const serviceType = document.getElementById('service').value;
        const address = document.querySelector('input[name="Address"]').value;
        
        
        console.log("Form values:", { name, telephone, email, repairDate, serviceType, address });
        
        // คำนวณราคา
        const price = SERVICE_PRICES[serviceType] || 0;

        // ตรวจสอบความถูกต้องของฟอร์ม
        if (!name || !telephone || !email || !repairDate || !serviceType || !address) {
            showMessage('กรุณากรอกข้อมูลให้ครบทุกช่อง', 'error');
            return;
        }

        // เตรียมข้อมูลสำหรับส่ง
        const formData = {
            Name: name,
            Tle: telephone,
            Email: email,
            service: serviceType,
            Address: address,
            service_date: repairDate,
            "service-price": price  // ชื่อฟิลด์ตามที่เห็นในฐานข้อมูล
        };
        
        console.log("Sending data to server:", formData);

        let response;
        if (isEditMode) {
            // อัพเดทข้อมูลที่มีอยู่
            response = await axios.put(`${BASE_URL}/tb_data/${userId}`, formData);
            showMessage(`บันทึกการแก้ไขข้อมูลเรียบร้อยแล้ว (ราคา: ${price} บาท)`, 'success');
        } else {
            // สร้างข้อมูลใหม่
            response = await axios.post(`${BASE_URL}/tb_data`, formData);
            showMessage(`บันทึกข้อมูลเรียบร้อยแล้ว (ราคา: ${price} บาท)`, 'success');
            
            // ล้างฟอร์ม
            clearForm();
        }

        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error submitting data:', error);
        showMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
}

// ฟังก์ชันสำหรับแสดงข้อความ
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = 'message ' + type;
    
    // ล้างข้อความหลังจาก 3 วินาที
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 3000);
}

// ฟังก์ชันสำหรับล้างฟอร์ม
function clearForm() {
    document.querySelector('input[name="Name"]').value = '';
    document.querySelector('input[name="Tle"]').value = '';
    document.querySelector('input[name="Email"]').value = '';
    document.querySelector('input[name="repairDate"]').value = '';
    document.getElementById('service').value = '';
    document.querySelector('input[name="Address"]').value = '';
    
    // รีเซ็ตการแสดงราคา
    updatePrice();
}