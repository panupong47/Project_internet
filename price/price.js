
document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.service-checkbox');
    const quantities = document.querySelectorAll('.service-quantity');
    const summaryContent = document.getElementById('summary-content');
    const totalPriceElement = document.getElementById('total-price');
    const orderButton = document.getElementById('order-button');

    // ฟังก์ชันอัพเดทสรุปรายการและราคารวม
    function updateSummary() {
        let selectedServices = [];
        let totalPrice = 0;

        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                const serviceItem = checkbox.closest('.service-item');
                const serviceName = serviceItem.querySelector('.service-name').textContent;
                const servicePrice = parseInt(checkbox.dataset.price);
                const quantity = parseInt(quantities[index].value);
                const itemTotal = servicePrice * quantity;

                selectedServices.push({
                    name: serviceName,
                    price: servicePrice,
                    quantity: quantity,
                    total: itemTotal
                });

                totalPrice += itemTotal;
            }
        });

        // อัพเดทเนื้อหาในสรุปรายการ
        if (selectedServices.length > 0) {
            let summaryHTML = '';

            selectedServices.forEach(service => {
                summaryHTML += `
                            <div class="summary-item">
                                <div>${service.name} x ${service.quantity}</div>
                                <div>${service.total} บาท</div>
                            </div>
                        `;
            });

            summaryContent.innerHTML = summaryHTML;
        } else {
            summaryContent.innerHTML = '<div class="empty-message">คุณยังไม่ได้เลือกบริการใดๆ</div>';
        }

        // อัพเดทราคารวม
        totalPriceElement.textContent = `${totalPrice} บาท`;
    }

    // เพิ่ม event listener สำหรับ checkbox และ quantity input
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', updateSummary);
        quantities[index].addEventListener('input', updateSummary);
    });

    // จัดการปุ่มสั่งซ่อม
    orderButton.addEventListener('click', function () {
        let selectedServices = Array.from(checkboxes).filter(checkbox => checkbox.checked);

        if (selectedServices.length > 0) {
            alert('ขอบคุณสำหรับการสั่งซ่อม! เราจะติดต่อกลับเพื่อยืนยันรายการและนัดหมายเวลาในเร็วๆ นี้');
        } else {
            alert('กรุณาเลือกบริการอย่างน้อย 1 รายการ');
        }
    });
});
