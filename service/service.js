// service.js
const BASE_URL = 'http://localhost:4748';

// Check if there's an ID in the URL (for edit mode)
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
let isEditMode = !!userId;

// Load user data if in edit mode
window.onload = async () => {
    if (isEditMode) {
        try {
            const response = await axios.get(`${BASE_URL}/tb_data/${userId}`);
            const userData = response.data;
            
            // Fill the form with user data
            document.querySelector('input[name="firstname"]').value = userData.name;
            document.querySelector('input[name="tle"]').value = userData.tle;
            document.querySelector('input[name="email"]').value = userData.Email;
            document.querySelector('input[name="repairDate"]').value = userData.service_date;
            document.querySelector('select[name="service"]').value = userData.service;
            document.querySelector('input[name="address"]').value = userData.address;
            
            // Change button text to "Update"
            document.querySelector('.button').textContent = 'Update';
        } catch (error) {
            console.error('Error loading user data:', error);
            showMessage('Error loading user data', 'error');
        }
    }
};

// Function to submit the form data
async function submitData() {
    try {
        // Get form values
        const name = document.querySelector('input[name="firstname"]').value;
        const telephone = document.querySelector('input[name="tle"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const repairDate = document.querySelector('input[name="repairDate"]').value;
        const serviceType = document.getElementById('service').value;
        const address = document.querySelector('input[name="address"]').value; // Optional field

        // Validate form
        if (!name || !telephone || !email || !repairDate || !serviceType || !address) {
            showMessage('กรุณากรอกข้อมูลให้ครบทุกช่อง', 'error');
            return;
        }

        // Prepare data object
        const formData = {
            name: name,
            tle: telephone,
            Email: email,
            service: serviceType,
            address: '', // You can add an address field to your form if needed
            service_date: repairDate
        };

        let response;
        if (isEditMode) {
            // Update existing record
            response = await axios.put(`${BASE_URL}/tb_data/${userId}`, formData);
            showMessage('บันทึกการแก้ไขข้อมูลเรียบร้อยแล้ว', 'success');
        } else {
            // Create new record
            response = await axios.post(`${BASE_URL}/tb_data`, formData);
            showMessage('บันทึกข้อมูลเรียบร้อยแล้ว', 'success');
            
            // Clear the form
            clearForm();
        }

        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error submitting data:', error);
        showMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    }
}

// Function to show message
function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = 'message ' + type;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 3000);
}

// Function to clear the form
function clearForm() {
    document.querySelector('input[name="firstname"]').value = '';
    document.querySelector('input[name="tle"]').value = '';
    document.querySelector('input[name="email"]').value = '';
    document.querySelector('input[name="repairDate"]').value = '';
    document.getElementById('service').value = '';
    document.querySelector('input[name="address"]').value = '';
}