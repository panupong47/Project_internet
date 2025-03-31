const BASE_URL = 'http://localhost:4720';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('Loading data...');
    try {
        // Fetch data from the server
        const response = await axios.get(`${BASE_URL}/tb_data`);
        const userDOM = document.getElementById('user');    
        let usersData = '';
        for (let i = 0; i < response.data.length; i++) {
            let user = response.data[i];
            usersData += 
            `<tr>
                <td>${user.Id}</td>
                <td>${user.Name}</td>
                <td>${user.Tle}</td>
                <td>${user.Email}</td>
                <td>${user.service_date}</td>
                <td>${user.Address}</td>
                <td>${user.service}</td>
                <td>
                    <button class="edit"
                    <a href="service.html?id=${user.id}">
                        Edit
                    </a>
                    </button>
                    <button class="delete" data-id="${user.id}">Delete</button>
                </td>
            </tr>`;
        }
        userDOM.innerHTML = usersData;

        // Attach delete event listeners
        attachDeleteHandlers();
    } catch (error) {
        console.error('Error loading data:', error);
    }
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
                    console.error('Error deleting data:', error);
                    alert('เกิดข้อผิดพลาดในการลบข้อมูล');
                }
            }
        });
    });
};