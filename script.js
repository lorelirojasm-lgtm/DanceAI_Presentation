let currentSlide = 0;
const totalSlides = 6;

function goToSlide(slideIndex) {
    // Remove active class from current slide
    document.querySelector('.slide.active').classList.remove('active');
    document.querySelector('.nav-link.active').classList.remove('active');
    document.querySelector('.indicator.active').classList.remove('active');
    
    // Add active class to new slide
    document.getElementById(`slide-${slideIndex}`).classList.add('active');
    document.querySelectorAll('.nav-link')[slideIndex].classList.add('active');
    document.querySelectorAll('.indicator')[slideIndex].classList.add('active');
    
    currentSlide = slideIndex;
}

function nextSlide() {
    const nextIndex = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
    goToSlide(nextIndex);
}

function previousSlide() {
    const prevIndex = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    goToSlide(prevIndex);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') previousSlide();
});

// Journey timeline animation
document.addEventListener('DOMContentLoaded', function() {
    const journeySteps = document.querySelectorAll('.journey-step');
    
    journeySteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            journeySteps.forEach(s => s.classList.remove('active'));
            step.classList.add('active');
            
            // Update demo content based on step
            updateDemoContent(index + 1);
        });
    });
});

function updateDemoContent(stepNumber) {
    const demoContent = document.getElementById('demo-content');
    const contents = {
        1: '<div class="login-form"><h4>Login as Student/Teacher</h4><div class="form-preview">📝 Registration Form</div></div>',
        2: '<div class="upload-interface"><h4>Upload Dance Video</h4><div class="upload-zone">📁 Drag & Drop Video</div></div>',
        3: '<div class="ai-processing"><h4>AI Analysis in Progress</h4><div class="processing-animation">🤖 Analyzing poses...</div></div>',
        4: '<div class="feedback-display"><h4>Feedback Results</h4><div class="score-display">Score: 87/100</div></div>',
        5: '<div class="progress-tracking"><h4>Progress Dashboard</h4><div class="chart-preview">📊 Performance Chart</div></div>'
    };
    
    demoContent.innerHTML = contents[stepNumber] || contents[1];
}

// Initialize demo content
updateDemoContent(1);
