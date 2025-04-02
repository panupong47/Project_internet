// ไฟล์ Home.js - เพิ่มโค้ดนี้เข้าไปในไฟล์ JavaScript ของคุณ

// โครงสร้างข้อมูลรีวิวเริ่มต้น
const defaultReviews = [
    {
        id: 1,
        author_name: "คุณแพรพลอย แจ้งกระจ่าง",
        content: "บริการดีมากค่ะ พนักงานสุภาพ ราคาเป็นธรรม ซ่อมเสร็จเร็วกว่าที่คาดไว้อีก",
        rating: 5,
        created_at: "2025-03-28T10:30:00"
    },
    {
        id: 2,
        author_name: "คุณพสิษฐ์ ภูฆัง",
        content: "ประทับใจมากครับ เครื่องผมมีปัญหาหลายอย่าง แต่ช่างแก้ไขได้หมด และยังแนะนำวิธีดูแลเครื่องด้วย",
        rating: 5,
        created_at: "2025-03-30T14:22:00"
    },
    {
        id: 3,
        author_name: "คุณธีรพงศ์ กลิ่นฟุ้ง",
        content: "ดีมากครับร้านนี้บริการดี คุ้มค่ากับราคา จะกลับมาใช้บริการอีกแน่นอน",
        rating: 4,
        created_at: "2025-04-01T09:15:00"
    }
];

// ฟังก์ชันสำหรับดึงรีวิวจาก localStorage หรือใช้รีวิวเริ่มต้นถ้าไม่มี
function getReviews() {
    const savedReviews = localStorage.getItem('computerRepairReviews');
    if (savedReviews) {
        return JSON.parse(savedReviews);
    } else {
        // บันทึกรีวิวเริ่มต้นลงใน localStorage
        localStorage.setItem('computerRepairReviews', JSON.stringify(defaultReviews));
        return defaultReviews;
    }
}

// ฟังก์ชันสำหรับบันทึกรีวิวลงใน localStorage
function saveReview(review) {
    const reviews = getReviews();
    // สร้าง ID ใหม่โดยใช้ timestamp
    const newId = Date.now();
    const newReview = {
        id: newId,
        ...review,
        created_at: new Date().toISOString()
    };
    
    // เพิ่มรีวิวใหม่ไปที่จุดเริ่มต้นของอาร์เรย์ (แสดงล่าสุดก่อน)
    reviews.unshift(newReview);
    
    // บันทึกลงใน localStorage
    localStorage.setItem('computerRepairReviews', JSON.stringify(reviews));
    
    return newReview;
}

// ฟังก์ชันสำหรับสร้าง HTML ของรีวิว
function createReviewElement(review) {
    // สร้างดาวตามคะแนน
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < review.rating ? '⭐' : '☆';
    }
    
    // สร้างวันที่ในรูปแบบที่อ่านง่าย
    const date = new Date(review.created_at);
    const formattedDate = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // สร้าง HTML element สำหรับรีวิว
    const reviewElement = document.createElement('div');
    reviewElement.className = 'testimonial-card';
    reviewElement.innerHTML = `
        <div class="rating">${stars}</div>
        <p class="testimonial-text">"${review.content}"</p>
        <p class="testimonial-author">- ${review.author_name}</p>
        <p class="testimonial-date">${formattedDate}</p>
    `;
    
    return reviewElement;
}

// ฟังก์ชันสำหรับแสดงรีวิวทั้งหมด
function displayReviews() {
    const testimonialContainer = document.querySelector('.testimonials .container');
    if (!testimonialContainer) return;
    
    // ลบรีวิวเดิมออก (ยกเว้นส่วนหัว)
    const oldReviews = testimonialContainer.querySelectorAll('.testimonial-card');
    oldReviews.forEach(review => review.remove());
    
    // ดึงรีวิวทั้งหมดและแสดงผล
    const reviews = getReviews();
    const sectionTitle = testimonialContainer.querySelector('.section-title');
    
    // แสดงรีวิว 3 อันล่าสุด
    reviews.slice(0, 3).forEach(review => {
        testimonialContainer.appendChild(createReviewElement(review));
    });
}

// ฟังก์ชันเพื่อเพิ่มฟอร์มส่งรีวิว
function addReviewForm() {
    const testimonialSection = document.querySelector('.testimonials');
    if (!testimonialSection) return;
    
    // ตรวจสอบว่ามีฟอร์มอยู่แล้วหรือไม่
    if (testimonialSection.querySelector('#review-form')) return;
    
    const formContainer = document.createElement('div');
    formContainer.className = 'review-form-container container';
    formContainer.innerHTML = `
        <h3>แสดงความคิดเห็นของคุณ</h3>
        <form id="review-form">
            <div class="form-group">
                <label for="author_name">ชื่อ (ไม่บังคับ)</label>
                <input type="text" id="author_name" name="author_name" placeholder="ระบุชื่อของคุณ หรือไม่ระบุก็ได้">
            </div>
            
            <div class="form-group">
                <label>ให้คะแนน</label>
                <div class="rating-input">
                    <div class="star-rating">
                        <input type="radio" id="star5" name="rating" value="5" required>
                        <label for="star5">★</label>
                        <input type="radio" id="star4" name="rating" value="4">
                        <label for="star4">★</label>
                        <input type="radio" id="star3" name="rating" value="3">
                        <label for="star3">★</label>
                        <input type="radio" id="star2" name="rating" value="2">
                        <label for="star2">★</label>
                        <input type="radio" id="star1" name="rating" value="1">
                        <label for="star1">★</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="review_content">ความคิดเห็นของคุณ</label>
                <textarea id="review_content" name="content" rows="4" required placeholder="บอกเราเกี่ยวกับประสบการณ์ของคุณ..."></textarea>
            </div>
            
            <button type="submit" class="submit-review-btn">ส่งรีวิว</button>
        </form>
    `;
    
    // เพิ่มฟอร์มต่อจาก testimonial cards
    testimonialSection.appendChild(formContainer);
    
    // เพิ่ม event listener สำหรับฟอร์ม
    document.getElementById('review-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // ดึงข้อมูลจากฟอร์ม
        const authorName = document.getElementById('author_name').value || 'ผู้ใช้นิรนาม';
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const content = document.getElementById('review_content').value;
        
        // บันทึกรีวิว
        saveReview({
            author_name: authorName,
            content: content,
            rating: parseInt(rating)
        });
        
        // รีเซ็ตฟอร์ม
        this.reset();
        
        // แสดงรีวิวล่าสุด
        displayReviews();
        
        // แสดงข้อความขอบคุณ
        alert('ขอบคุณสำหรับรีวิวของคุณ!');
    });
}

// ปรับปรุงโครงสร้าง HTML ของส่วนรีวิว
function updateReviewSection() {
    const testimonialSection = document.querySelector('.testimonials');
    if (!testimonialSection) return;
    
    const container = testimonialSection.querySelector('.container');
    if (!container) return;
    
    // เพิ่มปุ่มรีเฟรช
    const sectionTitle = container.querySelector('.section-title');
    if (sectionTitle && !sectionTitle.querySelector('.refresh-reviews-btn')) {
        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-reviews-btn';
        refreshButton.textContent = '🔄 รีเฟรชรีวิวล่าสุด';
        refreshButton.addEventListener('click', displayReviews);
        sectionTitle.appendChild(refreshButton);
    }
}

// ฟังก์ชันสำหรับเพิ่มการโต้ตอบให้กับ contact cards
function setupContactCardInteractions() {
    const contactCards = document.querySelectorAll('.contact-card');
    if (!contactCards.length) return;
    
    // เพิ่ม cursor pointer ให้กับการ์ดทั้งหมด (ใช้ CSS ที่มีอยู่แล้วสำหรับ hover effect)
    contactCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        // เพิ่มไอคอนบอกว่าคลิกได้
        const actionIcon = document.createElement('div');
        actionIcon.style.position = 'absolute';
        actionIcon.style.bottom = '10px';
        actionIcon.style.right = '10px';
        actionIcon.style.fontSize = '20px';
        actionIcon.style.opacity = '0.7';
        
        // ทำให้ position ของ card เป็น relative ถ้ายังไม่เป็น
        if (getComputedStyle(card).position === 'static') {
            card.style.position = 'relative';
        }
        
        card.appendChild(actionIcon);
    });
    
    // กำหนด action สำหรับแต่ละการ์ด
    for (let card of contactCards) {
        const cardTitle = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const actionIcon = card.lastChild;
        
        if (cardTitle.includes('โทรศัพท์')) {
            actionIcon.textContent = '📞';
            card.addEventListener('click', () => {
                // ดึงเบอร์โทรศัพท์จากการ์ด (เลือกเบอร์แรก)
                const phone = card.querySelector('p')?.textContent.trim() || '063-965-2579';
                const cleanPhone = phone.replace(/[^\d+]/g, ''); // ลบทุกอย่างยกเว้นตัวเลขและเครื่องหมาย +
                window.location.href = `tel:${cleanPhone}`;
            });
        }
        else if (cardTitle.includes('อีเมล')) {
            actionIcon.textContent = '✉️';
            card.addEventListener('click', () => {
                // ดึงอีเมลจากการ์ด (เลือกอีเมลแรก)
                const email = card.querySelector('p')?.textContent.trim() || 'panupong.jar@ku.th';
                window.location.href = `mailto:${email}`;
            });
        }
        else if (cardTitle.includes('ที่อยู่')) {
            actionIcon.textContent = '🗺️';
            card.addEventListener('click', () => {
                // ใช้ที่อยู่จาก HTML หรือใช้พิกัด
                const address = encodeURIComponent('2XFH+QGG ตำบล กำแพงแสน อำเภอกำแพงแสน นครปฐม 73140');
                window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
            });
        }
        else if (cardTitle.includes('เวลาทำการ')) {
            actionIcon.textContent = '⏰';
            card.addEventListener('click', () => {
                // สร้างการแจ้งเตือนเกี่ยวกับเวลาทำการ
                const openingHours = card.querySelectorAll('p');
                let hoursText = '';
                openingHours.forEach(p => {
                    hoursText += p.textContent + '\n';
                });
                alert(`เวลาทำการของเรา:\n${hoursText}`);
            });
        }
    }
}

// เพิ่มสไตล์เล็กน้อยเพื่อแสดงว่าการ์ดคลิกได้
function addMinimalContactCardStyles() {
    // สร้าง <style> element สำหรับเพิ่ม CSS ที่จำเป็นเท่านั้น
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        /* เพิ่มเอฟเฟคแสดงว่าคลิกได้ */
        .contact-card:hover {
            cursor: pointer;
        }
        
        /* เพิ่มแอนิเมชั่นเมื่อคลิก */
        .contact-card:active {
            transform: scale(0.98);
            transition: transform 0.1s;
        }
    `;
    
    // เพิ่ม <style> เข้าไปใน <head>
    document.head.appendChild(styleElement);
}

// เริ่มทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function() {
    // อัปเดตโครงสร้าง HTML
    updateReviewSection();
    
    // แสดงรีวิวล่าสุด
    displayReviews();
    
    // เพิ่มฟอร์มส่งรีวิว
    addReviewForm();
    
    // เพิ่มสไตล์ขั้นต่ำสำหรับ contact cards
    addMinimalContactCardStyles();
    
    // ตั้งค่าการโต้ตอบสำหรับ contact cards
    setupContactCardInteractions();
});