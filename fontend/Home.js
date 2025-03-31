// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Service card hover effects
    function setupServiceCardEffects() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
        });
    }
    
    // Testimonial slider
    function setupTestimonialSlider() {
        const testimonials = document.querySelectorAll('.testimonial-card');
        if (testimonials.length <= 1) return;
        
        let currentIndex = 0;
        const testimonialSection = document.querySelector('.testimonials .container');
        
        // Hide all testimonials except the first one
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) testimonial.style.display = 'none';
        });
        
        // Create slider controls
        const sliderControls = document.createElement('div');
        sliderControls.className = 'slider-controls';
        
        // Add navigation dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        testimonials.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = index === 0 ? 'dot active' : 'dot';
            
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
            
            dotsContainer.appendChild(dot);
        });
        
        // Create navigation arrows
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-arrow prev';
        prevBtn.innerHTML = '&#10094;';
        prevBtn.addEventListener('click', () => {
            showTestimonial(currentIndex - 1);
        });
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-arrow next';
        nextBtn.innerHTML = '&#10095;';
        nextBtn.addEventListener('click', () => {
            showTestimonial(currentIndex + 1);
        });
        
        // Append controls to slider
        sliderControls.appendChild(prevBtn);
        sliderControls.appendChild(dotsContainer);
        sliderControls.appendChild(nextBtn);
        testimonialSection.appendChild(sliderControls);
        
        // Function to show specific testimonial
        function showTestimonial(index) {
            // Handle wrapping around
            if (index < 0) index = testimonials.length - 1;
            if (index >= testimonials.length) index = 0;
            
            // Hide all testimonials
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'none';
            });
            
            // Show the selected testimonial with fade-in effect
            testimonials[index].style.display = 'block';
            testimonials[index].style.opacity = 0;
            
            // Simple fade-in animation
            let opacity = 0;
            const fadeIn = setInterval(() => {
                opacity += 0.1;
                testimonials[index].style.opacity = opacity;
                if (opacity >= 1) clearInterval(fadeIn);
            }, 30);
            
            // Update dots
            document.querySelectorAll('.slider-dots .dot').forEach((dot, i) => {
                dot.className = i === index ? 'dot active' : 'dot';
            });
            
            currentIndex = index;
        }
        
        // Auto-rotate testimonials
        let autoSlide = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 5000);
        
        // Pause rotation on hover
        testimonialSection.addEventListener('mouseenter', () => {
            clearInterval(autoSlide);
        });
        
        testimonialSection.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => {
                showTestimonial(currentIndex + 1);
            }, 5000);
        });
    }
    
    // Scroll animation for elements
    function setupScrollAnimation() {
        const elements = document.querySelectorAll('.service-card, .feature-card, .testimonial-card, .contact-card');
        
        // Only run if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            elements.forEach(element => {
                // Set initial style
                element.style.opacity = 0;
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                observer.observe(element);
            });
        }
    }
    
    // Add "Back to Top" button
    function setupBackToTop() {
        // Create button
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.style.display = 'none';
        document.body.appendChild(backToTopBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Create a simple contact form validation (for future use)
    function createContactForm() {
        // Check if contact section exists
        const contactSection = document.querySelector('.contact .container');
        if (!contactSection) return;
        
        // Create a form element
        const contactForm = document.createElement('form');
        contactForm.id = 'contact-form';
        contactForm.className = 'contact-form';
        
        // Form HTML
        contactForm.innerHTML = `
            <div class="form-group">
                <label for="name">ชื่อ-นามสกุล</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">อีเมล</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="phone">เบอร์โทรศัพท์</label>
                <input type="tel" id="phone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="service">บริการที่ต้องการ</label>
                <select id="service" name="service">
                    <option value="">-- กรุณาเลือกบริการ --</option>
                    <option value="repair">ซ่อมคอมพิวเตอร์</option>
                    <option value="upgrade">อัพเกรดคอมพิวเตอร์</option>
                    <option value="virus">กำจัดไวรัส</option>
                    <option value="maintenance">บำรุงรักษา</option>
                    <option value="software">ติดตั้งโปรแกรม</option>
                    <option value="recovery">กู้ข้อมูล</option>
                </select>
            </div>
            <div class="form-group">
                <label for="message">รายละเอียดเพิ่มเติม</label>
                <textarea id="message" name="message" rows="4"></textarea>
            </div>
            <button type="submit" class="btn">ส่งข้อความ</button>
        `;
        
        // Form validation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            
            // Basic validation
            if (!name.value.trim()) {
                markInvalid(name, 'กรุณากรอกชื่อ-นามสกุล');
                isValid = false;
            } else {
                markValid(name);
            }
            
            if (!email.value.trim()) {
                markInvalid(email, 'กรุณากรอกอีเมล');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                markInvalid(email, 'กรุณากรอกอีเมลให้ถูกต้อง');
                isValid = false;
            } else {
                markValid(email);
            }
            
            if (!phone.value.trim()) {
                markInvalid(phone, 'กรุณากรอกเบอร์โทรศัพท์');
                isValid = false;
            } else if (!isValidPhone(phone.value)) {
                markInvalid(phone, 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
                isValid = false;
            } else {
                markValid(phone);
            }
            
            if (isValid) {
                // For demonstration - replace with actual form submission
                alert('ขอบคุณสำหรับข้อมูล เราจะติดต่อกลับโดยเร็วที่สุด!');
                contactForm.reset();
            }
        });
        
        // Helper functions for validation
        function markInvalid(element, message) {
            element.classList.add('invalid');
            
            // Create or update error message
            let errorElement = element.nextElementSibling;
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                element.parentNode.insertBefore(errorElement, element.nextSibling);
            }
            errorElement.textContent = message;
        }
        
        function markValid(element) {
            element.classList.remove('invalid');
            
            // Remove error message if exists
            const errorElement = element.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
        
        function isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
        
        function isValidPhone(phone) {
            // Simplified phone validation for Thailand
            return /^0\d{8,9}$/.test(phone.replace(/[-\s]/g, ''));
        }
        
        // Add form to contact section
        const contactInfo = contactSection.querySelector('.contact-info');
        contactSection.insertBefore(contactForm, contactInfo);
    }
    
    // Initialize all functions
    setupMobileNav();
    setupSmoothScroll();
    setupServiceCardEffects();
    setupTestimonialSlider();
    setupScrollAnimation();
    setupBackToTop();
    // Uncomment the line below if you want to add the contact form
    // createContactForm();
    
    // Add necessary CSS for JavaScript-added elements
    const customStyles = document.createElement('style');
    customStyles.textContent = `
        /* Mobile Navigation */
        .menu-toggle {
            display: none;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: auto;
        }
        
        @media (max-width: 768px) {
            .nav-links.mobile-ready {
                display: none;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: #2c3e50;
                padding: 1rem;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .nav-links.active {
                display: flex;
            }
            
            .nav-links.mobile-ready li {
                margin: 0.5rem 0;
            }
        }
        
        /* Testimonial Slider */
        .slider-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 1rem;
        }
        
        .slider-dots {
            display: flex;
            justify-content: center;
            margin: 0 1rem;
        }
        
        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #ccc;
            margin: 0 5px;
            cursor: pointer;
            transition: 0.3s;
        }
        
        .dot.active {
            background-color: #3498db;
        }
        
        .slider-arrow {
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 1rem;
            transition: 0.3s;
        }
        
        .slider-arrow:hover {
            background-color: #2980b9;
        }
        
        /* Back to Top Button */
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.3s;
            z-index: 99;
        }
        
        .back-to-top:hover {
            background-color: #2980b9;
        }
        
        /* Scroll Animation */
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Contact Form Styles */
        .contact-form {
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #2c3e50;
            font-weight: bold;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3498db;
        }
        
        .form-group input.invalid,
        .form-group select.invalid,
        .form-group textarea.invalid {
            border-color: #e74c3c;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.9rem;
            margin-top: 0.3rem;
        }
    `;
    
    document.head.appendChild(customStyles);
});