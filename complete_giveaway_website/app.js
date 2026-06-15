// Giveaway Website - Main Application
// ====================================

// Testimonial Data
const testimonials = [
    { name: "Emma Johnson", country: "🇺🇸", avatar: "EJ", color: "#FF6B6B", text: "This giveaway platform is amazing! I won a smaller prize and the payout was quick and easy." },
    { name: "Li Wei", country: "🇨🇳", avatar: "LW", color: "#4ECDC4", text: "I was skeptical at first but the process was completely transparent. Highly recommended!" },
    { name: "Sophia Garcia", country: "🇺🇸", avatar: "SG", color: "#45B7D1", text: "The best giveaway site I've used. Clean interface and fair selection process." },
    { name: "Ahmed Khan", country: "🇵🇰", avatar: "AK", color: "#1982C4", text: "Won $1000 and received it within 48 hours. Very professional service!" },
    { name: "Amelia Brown", country: "🇬🇧", avatar: "AB", color: "#FF8552", text: "Easy to enter, great communication, and fast prize delivery. 5 stars!" },
    { name: "Diego Morales", country: "🇲🇽", avatar: "DM", color: "#0652DD", text: "Legitimate giveaways with real prizes. I've entered multiple times and won twice!" },
    { name: "Sakura Yamamoto", country: "🇯🇵", avatar: "SY", color: "#FF69B4", text: "Beautiful website design and excellent user experience. Very impressed!" },
    { name: "Mohamed Hassan", country: "🇪🇬", avatar: "MH", color: "#FF4500", text: "Finally a giveaway site that actually pays out. Thank you for being legit!" }
];

// DOM Elements
const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

const form = document.getElementById('giveawayEntryForm');
const successModal = document.getElementById('successModal');
const participantCount = document.getElementById('participantCount');
const participantAvatars = document.getElementById('participantAvatars');

const testimonialPopup = document.getElementById('testimonialPopup');
const testimonialName = document.getElementById('testimonialName');
const testimonialCountry = document.getElementById('testimonialCountry');
const testimonialAvatar = document.getElementById('testimonialAvatar');
const testimonialText = document.getElementById('testimonialText');

// Initialize the website
function init() {
    setupCountdown();
    setupForm();
    setupTestimonials();
    loadParticipantData();
    setupScrollAnimations();
}

// Countdown Timer
function setupCountdown() {
    // Set end date to 30 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    endDate.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            document.getElementById('countdown').innerHTML = '<p style="font-size: 1.2rem; margin: 0;">Giveaway has ended!</p>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElements.days.textContent = days.toString().padStart(2, '0');
        countdownElements.hours.textContent = hours.toString().padStart(2, '0');
        countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
        countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Form Submission
function setupForm() {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const country = document.getElementById('country').value;
        const referral = document.getElementById('referral').value;
        const terms = document.getElementById('terms').checked;
        
        // Validate
        if (!name || !email || !country || !terms) {
            alert('Please fill in all required fields and accept the terms.');
            return;
        }
        
        // Simple email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Store entry
        const entry = {
            name: name,
            email: email,
            country: country,
            referral: referral,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        let entries = JSON.parse(localStorage.getItem('giveawayEntries')) || [];
        entries.push(entry);
        localStorage.setItem('giveawayEntries', JSON.stringify(entries));
        
        // Reset form
        form.reset();
        
        // Show success modal
        showSuccessModal();
        
        // Update participant data
        updateParticipantData();
    });
}

// Success Modal Functions
function showSuccessModal() {
    successModal.classList.add('active');
    
    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });
}

function closeSuccessModal() {
    successModal.classList.remove('active');
}

// Participant Data Management
function loadParticipantData() {
    const entries = JSON.parse(localStorage.getItem('giveawayEntries')) || [];
    updateParticipantData(entries.length);
}

function updateParticipantData(additional = 0) {
    const baseCount = 1247;
    const total = baseCount + additional;
    
    participantCount.textContent = total.toLocaleString();
    
    // Add some random avatars
    participantAvatars.innerHTML = '';
    const letters = ['J', 'S', 'M', 'L', 'A'];
    
    letters.forEach(letter => {
        const avatar = document.createElement('div');
        avatar.className = 'participant-avatar';
        avatar.textContent = letter;
        participantAvatars.appendChild(avatar);
    });
    
    // Add plus sign
    const plusAvatar = document.createElement('div');
    plusAvatar.className = 'participant-avatar';
    plusAvatar.textContent = '+';
    participantAvatars.appendChild(plusAvatar);
}

// Testimonial Popups
function setupTestimonials() {
    // Show random testimonial every 10 seconds
    setInterval(showRandomTestimonial, 10000);
    
    // Show first testimonial after 3 seconds
    setTimeout(showRandomTestimonial, 3000);
}

function showRandomTestimonial() {
    const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
    
    testimonialName.textContent = randomTestimonial.name;
    testimonialCountry.textContent = randomTestimonial.country;
    testimonialAvatar.textContent = randomTestimonial.avatar;
    testimonialAvatar.style.backgroundColor = randomTestimonial.color;
    testimonialText.textContent = randomTestimonial.text;
    
    // Position popup
    testimonialPopup.style.bottom = '80px';
    testimonialPopup.style.right = '20px';
    
    // Show popup
    testimonialPopup.classList.add('show');
    
    // Auto-dismiss after 8 seconds
    setTimeout(() => {
        testimonialPopup.classList.remove('show');
    }, 8000);
}

function closeTestimonialPopup() {
    testimonialPopup.classList.remove('show');
}

// FAQ Toggle
function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    answer.classList.toggle('active');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}

// Scroll to Entry Form
function scrollToEntry() {
    document.getElementById('entry').scrollIntoView({ behavior: 'smooth' });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-fade-in class
    document.querySelectorAll('.animate-fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        setupCountdown,
        setupForm,
        showSuccessModal,
        closeSuccessModal,
        updateParticipantData,
        showRandomTestimonial,
        toggleFAQ,
        scrollToEntry
    };
}