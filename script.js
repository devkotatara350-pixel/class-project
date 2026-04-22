$(document).ready(function(){
    // Mobile Menu Toggle
    $('.btn').click(function(){
        $('.nav-links').slideToggle(300);
        $('.btn').toggleClass('change');
    });
    
    // Transparent Nav Background on Scroll
    $(window).scroll(function(){
        if ($(window).scrollTop() >= 50){
            $('nav, .nav-container').addClass('navBackground');
        } else {
            $('nav, .nav-container').removeClass('navBackground');
        }
    });

    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.1 });

    $('.fade-in').each(function(){
        observer.observe(this);
    });

    // General Contact & Newsletter Form Basic Prevention
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        $('#message').text('Thank you for subscribing!').hide().fadeIn().delay(3000).fadeOut();
        $('#email').val('');
    });
    
    $('.form').submit(function(e){
        e.preventDefault();
        alert("Message sent successfully! Our team will contact you soon.");
        this.reset();
    });

    // --- UNIVERSAL MODAL LOGIC ---

    // The HTML Template for Membership Registration Form
    const registrationFormHTML = `
        <div class="modal-form">
            <h3>Registration Form</h3>
            <form id="actionForm">
                <input type="text" placeholder="Full Name" required>
                <input type="email" placeholder="Email Address" required>
                <input type="tel" placeholder="Phone Number" required>
                <button type="submit" class="main-btn" style="width: 100%; margin-top: 10px;">Confirm & Pay</button>
            </form>
        </div>
    `;

    // Database for all interactive elements
    const modalData = {
        // MEMBERSHIPS (Shows Registration Form AND Pricing)
        'HOME CLUB MEMBERSHIP': {
            details: 'Enjoy unlimited visits to your designated home club. You get full access to the gym facility, free weights, cardio machines, and standard amenities.',
            price: '$29.99', unit: '/ month', showForm: true
        },
        'PASSPORT MEMBERSHIP': {
            details: 'Workout anywhere! Unlimited visits to all Power Gym Clubs nationwide. Full access to gym facilities and a complimentary monthly fitness assessment.',
            price: '$49.99', unit: '/ month', showForm: true
        },
        'SIGNATURE MEMBERSHIP': {
            details: 'The ultimate VIP experience. Unlimited visits everywhere, priority class booking, and up to 14 Passport visits globally per year.',
            price: '$89.99', unit: '/ month', showForm: true
        },

        // CLASSES (Shows Extended Details, No Form, NO Pricing)
        'BARBELL CLASS': {
            details: 'Focus on heavy compound lifts, proper form, and raw power building in a high-energy group environment.',
            showForm: false,
            extendedInfo: `
                <h3>Class Specifics</h3>
                <ul class="modal-details-list">
                    <li><strong>Duration:</strong> 60 Minutes</li>
                    <li><strong>Intensity:</strong> High</li>
                    <li><strong>Instructor:</strong> Alex Mercer</li>
                    <li><strong>Schedule:</strong> Mon, Wed, Fri - 6:00 PM</li>
                </ul>
            `
        },
        'YOGA CLASS': {
            details: 'A guided Vinyasa flow focusing on breath work, flexibility, mindfulness, and core stabilization.',
            showForm: false,
            extendedInfo: `
                <h3>Class Specifics</h3>
                <ul class="modal-details-list">
                    <li><strong>Duration:</strong> 45 Minutes</li>
                    <li><strong>Intensity:</strong> Low-Medium</li>
                    <li><strong>Instructor:</strong> Sophia Lin</li>
                    <li><strong>Schedule:</strong> Tue, Thu, Sat - 7:00 AM</li>
                </ul>
            `
        },
        'HIIT EXERCISE CLASS': {
            details: 'High-intensity interval training designed to burn fat rapidly, build stamina, and push your limits.',
            showForm: false,
            extendedInfo: `
                <h3>Class Specifics</h3>
                <ul class="modal-details-list">
                    <li><strong>Duration:</strong> 30 Minutes</li>
                    <li><strong>Intensity:</strong> Very High</li>
                    <li><strong>Instructor:</strong> Marcus Johnson</li>
                    <li><strong>Schedule:</strong> Daily - 5:30 PM</li>
                </ul>
            `
        },

        // TRAINERS (Shows Extended Details, No Form, NO Pricing)
        'STRENGTH TRAINER': {
            details: 'Work 1-on-1 with our powerlifting and bodybuilding experts to smash your plateaus and perfect your lifting form.',
            showForm: false,
            extendedInfo: `
                <h3>Trainer Credentials</h3>
                <ul class="modal-details-list">
                    <li><strong>Specialty:</strong> Hypertrophy & Powerlifting</li>
                    <li><strong>Experience:</strong> 10+ Years</li>
                    <li><strong>Certifications:</strong> ISSA Certified, Gold Medalist Bodybuilder</li>
                    <li><strong>Availability:</strong> Mornings & Evenings</li>
                </ul>
            `
        },
        'CARDIO TRAINER': {
            details: 'Customized endurance programs perfect for marathon prep, athletic conditioning, or general cardiovascular improvement.',
            showForm: false,
            extendedInfo: `
                <h3>Trainer Credentials</h3>
                <ul class="modal-details-list">
                    <li><strong>Specialty:</strong> Stamina, Agility & Weight Loss</li>
                    <li><strong>Experience:</strong> 7 Years</li>
                    <li><strong>Certifications:</strong> ACE Certified, Marathon Coach</li>
                    <li><strong>Availability:</strong> Afternoons</li>
                </ul>
            `
        },
        'YOGA & FLEX TRAINER': {
            details: 'Private, tailored yoga sessions designed specifically around your body, injuries, and personal mobility goals.',
            showForm: false,
            extendedInfo: `
                <h3>Trainer Credentials</h3>
                <ul class="modal-details-list">
                    <li><strong>Specialty:</strong> Vinyasa & Injury Rehab</li>
                    <li><strong>Experience:</strong> 5 Years</li>
                    <li><strong>Certifications:</strong> RYT 200, Physical Therapy Assistant</li>
                    <li><strong>Availability:</strong> Flexible Scheduling</li>
                </ul>
            `
        },

        // SERVICES (Shows Extended Details, No Form, NO Pricing)
        'EXERCISE SERVICE': {
            details: 'Get personalized weekly workout plans and routine form checks from our floor staff.',
            showForm: false,
            extendedInfo: `
                <h3>Service Inclusions</h3>
                <ul class="modal-details-list">
                    <li><strong>Custom Plans:</strong> Tailored to your fitness goals</li>
                    <li><strong>Check-ins:</strong> Weekly form adjustments</li>
                    <li><strong>Support:</strong> App-based tracking included</li>
                </ul>
            `
        },
        'YOGA SERVICE': {
            details: 'Unlimited premium access to our specialized quiet yoga studio, mats, and advanced props outside of class times.',
            showForm: false,
            extendedInfo: `
                <h3>Service Inclusions</h3>
                <ul class="modal-details-list">
                    <li><strong>Studio Access:</strong> 24/7 keycard entry</li>
                    <li><strong>Equipment:</strong> Premium mats, blocks, and straps provided</li>
                    <li><strong>Atmosphere:</strong> Sound-proofed, temperature controlled</li>
                </ul>
            `
        },
        'BARBELL SERVICE': {
            details: 'Join the exclusive lifting club with access to competition-grade specialized barbells and chalk stations.',
            showForm: false,
            extendedInfo: `
                <h3>Service Inclusions</h3>
                <ul class="modal-details-list">
                    <li><strong>Equipment:</strong> Eleiko bars and calibrated plates</li>
                    <li><strong>Facility:</strong> Dedicated deadlift platforms</li>
                    <li><strong>Perks:</strong> Complimentary liquid chalk</li>
                </ul>
            `
        },
        'MACHINES SERVICE': {
            details: 'A comprehensive 1-on-1 walk-through of all gym machines, perfect for beginners wanting to learn safely.',
            showForm: false,
            extendedInfo: `
                <h3>Service Inclusions</h3>
                <ul class="modal-details-list">
                    <li><strong>Duration:</strong> 45-Minute guided tour</li>
                    <li><strong>Focus:</strong> Posture, seat adjustments, and safety</li>
                    <li><strong>Takeaway:</strong> Printed machine cheat-sheet</li>
                </ul>
            `
        }
    };

    // Reusable function to open modal
    function openModal(key, titleDisplay) {
        const data = modalData[key];
        if(data) {
            $('#modalTitle').text(titleDisplay);
            $('#modalDetails').text(data.details);
            
            // Toggle pricing section based on if price exists
            if(data.price) {
                $('#priceSection').show();
                $('#modalPrice').html(data.price + ' <span id="modalUnit">' + data.unit + '</span>');
            } else {
                $('#priceSection').hide();
            }
            
            // Inject Form OR Extended Details based on the data object
            if(data.showForm) {
                $('#modalRightCol').html(registrationFormHTML);
            } else {
                $('#modalRightCol').html(data.extendedInfo);
            }

            $('#actionModal').css('display', 'flex');
        }
    }

    // 1. Memberships Click
    $('.membership-item').click(function() {
        const rawTitle = $(this).find('h3').text().trim().toUpperCase();
        openModal(rawTitle + ' MEMBERSHIP', rawTitle + ' MEMBERSHIP');
    });

    // 2. Classes Click
    $('.class-item').click(function() {
        const rawTitle = $(this).find('h4').text().trim().toUpperCase();
        openModal(rawTitle + ' CLASS', rawTitle + ' CLASS');
    });

    // 3. Trainers Click
    $('#trainer-item.service, .service').click(function() {
        const rawTitle = $(this).find('h3').text().trim().toUpperCase();
        if(rawTitle) {
            openModal(rawTitle + ' TRAINER', rawTitle + ' SPECIALIST');
        }
    });

    // 4. Services Click
    $('.category-item').click(function() {
        const rawTitle = $(this).find('.category-item-inner div').text().trim().toUpperCase();
        openModal(rawTitle + ' SERVICE', rawTitle + ' SERVICE');
    });

    // Close Modal actions
    $('.close-btn').click(function() {
        $('#actionModal').css('display', 'none');
    });

    $(window).click(function(event) {
        if ($(event.target).is('#actionModal')) {
            $('#actionModal').css('display', 'none');
        }
    });

    // Handle dynamically injected Form Submission using event delegation
    $(document).on('submit', '#actionForm', function(e) {
        e.preventDefault();
        const actionTarget = $('#modalTitle').text();
        alert('Success! Your registration for [' + actionTarget + '] has been received. Our team will contact you shortly to confirm payment.');
        $('#actionModal').css('display', 'none');
        this.reset();
    });
});