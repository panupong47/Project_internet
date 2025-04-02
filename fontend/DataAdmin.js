const BASE_URL = 'http://localhost:4720';
let allUserData = []; // เก็บข้อมูลทั้งหมดไว้สำหรับการกรอง

window.onload = async () => {
    await loadData();
    
    // เพิ่มตัวฟังก์ชันเหตุการณ์สำหรับการค้นหา
    document.getElementById('searchButton').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
};

const loadData = async () => {
    console.log('กำลังโหลดข้อมูล...');
    try {
        // ดึงข้อมูลจากเซิร์ฟเวอร์
        const response = await axios.get(`${BASE_URL}/tb_data`);
        allUserData = response.data; // เก็บข้อมูลทั้งหมด
        displayData(allUserData); // แสดงข้อมูลทั้งหมดเริ่มต้น
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error);
    }
};

const displayData = (data) => {
    const userDOM = document.getElementById('user');    
    let usersData = '';
    
    if (data.length === 0) {
        userDOM.innerHTML = '<tr><td colspan="9" style="text-align: center;">ไม่พบข้อมูล</td></tr>';
        return;
    }
    
    for (let i = 0; i < data.length; i++) {
        let user = data[i];
        usersData += 
        `<tr>
            <td>${user.Id || user.id}</td>
            <td>${user.Name}</td>
            <td>${user.Tle}</td>
            <td>${user.Email}</td>
            <td>${user.service_date ? new Date(user.service_date).toLocaleDateString() : ''}</td>
            <td>${user.Address}</td>
            <td>${user.service}</td>
            <td>${user.price}</td>
            <td>
                <button class="edit" onclick="window.location.href='edit.html?id=${user.Id || user.id}'">แก้ไข</button>
                <button class="delete" data-id="${user.Id || user.id}">ลบ</button>
            </td>
        </tr>`;
    }
    userDOM.innerHTML = usersData;

    // แนบตัวจัดการเหตุการณ์การลบ
    attachDeleteHandlers();
};

const performSearch = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const searchField = document.getElementById('searchField').value;
    
    if (!searchTerm.trim()) {
        displayData(allUserData); // ถ้าคำค้นหาว่างเปล่า แสดงข้อมูลทั้งหมด
        return;
    }
    
    // กรองข้อมูลตามคำค้นหาและฟิลด์
    const filteredData = allUserData.filter(user => {
        if (searchField === 'all') {
            // ค้นหาในทุกฟิลด์
            return Object.values(user).some(value => 
                value && value.toString().toLowerCase().includes(searchTerm)
            );
        } else {
            // ค้นหาในฟิลด์เฉพาะ
            const fieldValue = user[searchField];
            return fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm);
        }
    });
    
    displayData(filteredData);
};

const attachDeleteHandlers = () => {
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?')) {
                try {
                    await axios.delete(`${BASE_URL}/tb_data/${id}`);
                    alert('ลบข้อมูลสำเร็จ');
                    await loadData(); // โหลดข้อมูลใหม่หลังจากลบ
                } catch (error) {
                    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
                    alert('เกิดข้อผิดพลาดในการลบข้อมูล');
                }
            }
        });
    });
};