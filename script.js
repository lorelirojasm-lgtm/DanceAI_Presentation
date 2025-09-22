// DanceAI Presentation JavaScript
let currentSlide = 0;
const totalSlides = 6;

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    initializePresentation();
    startJourneyDemo();
    addInteractiveElements();
});

// Initialize presentation functionality
function initializePresentation() {
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousSlide();
        } else if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            goToSlide(parseInt(e.key) - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides - 1);
        }
    });

    // Enhanced touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isSwipeGesture = false;
    const minSwipeDistance = 50; // Minimum distance for swipe
    const maxVerticalDistance = 100; // Maximum vertical movement for horizontal swipe

    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isSwipeGesture = false;
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        endX = e.touches[0].clientX;
        endY = e.touches[0].clientY;
        
        const diffX = Math.abs(endX - startX);
        const diffY = Math.abs(endY - startY);
        
        // If horizontal movement is significant and vertical is minimal
        if (diffX > minSwipeDistance && diffY < maxVerticalDistance) {
            isSwipeGesture = true;
            e.preventDefault(); // Prevent scrolling during swipe
        }
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (!startX || !startY || !isSwipeGesture) {
            startX = 0;
            startY = 0;
            return;
        }

        const diffX = endX - startX;
        const diffY = Math.abs(endY - startY);

        // Ensure it's a horizontal swipe
        if (Math.abs(diffX) > minSwipeDistance && diffY < maxVerticalDistance) {
            if (diffX > 0) {
                // Swipe right - go to previous slide
                previousSlide();
            } else {
                // Swipe left - go to next slide
                nextSlide();
            }
        }

        // Reset values
        startX = 0;
        startY = 0;
        endX = 0;
        endY = 0;
        isSwipeGesture = false;
    }, { passive: true });

    // Add double-tap to toggle fullscreen on mobile
    let lastTouchTime = 0;
    let tapCount = 0;
    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTouchTime;
        
        if (tapLength < 300 && tapLength > 0) {
            tapCount++;
            if (tapCount === 2) {
                // Double tap detected
                toggleFullscreen();
                tapCount = 0;
            }
        } else {
            tapCount = 1;
        }
        lastTouchTime = currentTime;
        
        // Reset tap count after delay
        setTimeout(() => {
            tapCount = 0;
        }, 300);
    });

    // Initialize slide animations
    initializeAnimations();
    
    // Add orientation change handler
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // Recalculate layout after orientation change
            triggerSlideAnimations(currentSlide);
        }, 100);
    });
    
    // Add resize handler for responsive behavior
    window.addEventListener('resize', debounce(function() {
        triggerSlideAnimations(currentSlide);
    }, 250));
}

// Slide navigation functions
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function goToSlide(slideNumber) {
    // Remove active class from current slide and nav link
    document.querySelector('.slide.active').classList.remove('active');
    document.querySelector('.nav-link.active').classList.remove('active');
    document.querySelector('.indicator.active').classList.remove('active');

    // Update current slide
    currentSlide = slideNumber;

    // Add active class to new slide and nav link
    document.getElementById(`slide-${slideNumber}`).classList.add('active');
    document.querySelectorAll('.nav-link')[slideNumber].classList.add('active');
    document.querySelectorAll('.indicator')[slideNumber].classList.add('active');

    // Close mobile menu if open
    closeMobileMenu();

    // Trigger slide-specific animations
    triggerSlideAnimations(slideNumber);

    // Update journey demo if on demo slide
    if (slideNumber === 4) {
        startJourneyDemo();
    }
}

// Mobile menu functions
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('mobile-open');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.remove('mobile-open');
}

// Animation system
function initializeAnimations() {
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Observe all feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Add hover effects to tech items
    document.querySelectorAll('.tech-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
}

function triggerSlideAnimations(slideNumber) {
    const slide = document.getElementById(`slide-${slideNumber}`);
    const elements = slide.querySelectorAll('.feature-card, .tech-category, .arch-layer, .solution-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Journey Demo System
function startJourneyDemo() {
    const steps = [
        {
            title: "User Registration",
            content: `
                <div class="demo-interface">
                    <div class="demo-form">
                        <h3>Create Your DanceAI Account</h3>
                        <div class="form-field">
                            <label>Full Name</label>
                            <input type="text" placeholder="Enter your name" readonly>
                        </div>
                        <div class="form-field">
                            <label>Username</label>
                            <input type="text" placeholder="Choose username" readonly>
                        </div>
                        <div class="form-field">
                            <label>Role</label>
                            <select readonly>
                                <option>Student</option>
                                <option>Teacher</option>
                            </select>
                        </div>
                        <button class="demo-btn">Create Account</button>
                    </div>
                </div>
            `
        },
        {
            title: "Video Upload",
            content: `
                <div class="demo-interface">
                    <div class="upload-zone">
                        <div class="upload-card">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <h4>Upload Student Video</h4>
                            <p>Drop your dance video here</p>
                        </div>
                        <div class="upload-card">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <h4>Upload Teacher Reference</h4>
                            <p>Reference video for comparison</p>
                        </div>
                    </div>
                    <div class="upload-progress">
                        <div class="progress-bar">
                            <div class="progress-fill uploading"></div>
                        </div>
                        <span>Uploading videos...</span>
                    </div>
                </div>
            `
        },
        {
            title: "AI Analysis",
            content: `
                <div class="demo-interface">
                    <div class="analysis-display">
                        <div class="analysis-header">
                            <i class="fas fa-brain rotating"></i>
                            <h3>AI Processing Your Dance</h3>
                        </div>
                        <div class="analysis-steps">
                            <div class="analysis-step active">
                                <i class="fas fa-eye"></i>
                                <span>Extracting pose keypoints</span>
                            </div>
                            <div class="analysis-step">
                                <i class="fas fa-search"></i>
                                <span>Comparing movements</span>
                            </div>
                            <div class="analysis-step">
                                <i class="fas fa-chart-line"></i>
                                <span>Generating feedback</span>
                            </div>
                        </div>
                        <div class="analysis-visual">
                            <div class="pose-comparison">
                                <div class="pose-skeleton student">
                                    <div class="pose-point"></div>
                                    <div class="pose-point"></div>
                                    <div class="pose-point"></div>
                                </div>
                                <div class="pose-skeleton teacher">
                                    <div class="pose-point"></div>
                                    <div class="pose-point"></div>
                                    <div class="pose-point"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "Feedback Results",
            content: `
                <div class="demo-interface">
                    <div class="feedback-display">
                        <div class="score-header">
                            <div class="overall-score">
                                <span class="score-value">87</span>
                                <span class="score-label">Overall Score</span>
                            </div>
                        </div>
                        <div class="key-moments">
                            <h4>Key Moment Feedback</h4>
                            <div class="moment-card">
                                <div class="moment-score">92</div>
                                <div class="moment-feedback">
                                    <h5>Moment 1: Opening Pose</h5>
                                    <p>Great alignment! Try pointing your toes more.</p>
                                </div>
                            </div>
                            <div class="moment-card">
                                <div class="moment-score">83</div>
                                <div class="moment-feedback">
                                    <h5>Moment 2: Transition</h5>
                                    <p>Smooth movement! Adjust your hand placement slightly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: "Progress Tracking",
            content: `
                <div class="demo-interface">
                    <div class="progress-display">
                        <div class="progress-header">
                            <h3>Your Dance Journey</h3>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <span class="stat-value">15</span>
                                    <span class="stat-label">Sessions</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value">87</span>
                                    <span class="stat-label">Avg Score</span>
                                </div>
                                <div class="stat-card">
                                    <span class="stat-value">3rd</span>
                                    <span class="stat-label">Rank</span>
                                </div>
                            </div>
                        </div>
                        <div class="progress-chart">
                            <div class="chart-placeholder">
                                <i class="fas fa-chart-line"></i>
                                <span>Performance Over Time</span>
                            </div>
                        </div>
                        <div class="achievements">
                            <h4>Recent Achievements</h4>
                            <div class="achievement-badge">
                                <i class="fas fa-medal"></i>
                                <span>First Perfect Score!</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    ];

    let currentStep = 0;
    
    function updateDemo() {
        // Update step indicators
        document.querySelectorAll('.journey-step').forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        // Update demo content
        const demoContent = document.getElementById('demo-content');
        if (demoContent) {
            demoContent.innerHTML = steps[currentStep].content;
            
            // Add click handlers for journey steps
            document.querySelectorAll('.journey-step').forEach((step, index) => {
                step.addEventListener('click', () => {
                    currentStep = index;
                    updateDemo();
                });
            });
        }
    }

    // Initialize demo
    updateDemo();

    // Auto-advance demo steps
    setInterval(() => {
        if (document.getElementById('slide-4').classList.contains('active')) {
            currentStep = (currentStep + 1) % steps.length;
            updateDemo();
        }
    }, 4000);
}

// Interactive elements
function addInteractiveElements() {
    // Add click effects to feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add hover effects to architecture components
    document.querySelectorAll('.arch-component').forEach(component => {
        component.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(99, 102, 241, 0.1)';
            this.style.borderColor = 'var(--primary-color)';
        });
        
        component.addEventListener('mouseleave', function() {
            this.style.background = 'var(--surface)';
            this.style.borderColor = 'rgba(99, 102, 241, 0.1)';
        });
    });

    // Add particles effect to hero section
    createParticles();
    
    // Add typing effect to hero subtitle
    typeWriter();
}

// Particles animation for hero section
function createParticles() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            opacity: 0.6;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        heroVisual.appendChild(particle);
    }

    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Typing effect for hero subtitle
function typeWriter() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 100);
}

// Add CSS for demo interfaces
const demoStyles = `
    .demo-interface {
        padding: 2rem;
        background: white;
        border-radius: 1rem;
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }
    
    .demo-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .form-field label {
        font-weight: 600;
        color: var(--text-dark);
        font-size: 0.9rem;
    }
    
    .form-field input,
    .form-field select {
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        background: var(--surface);
        cursor: not-allowed;
    }
    
    .demo-btn {
        background: var(--purple-gradient);
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 0.5rem;
        font-weight: 600;
        cursor: pointer;
        margin-top: 0.5rem;
    }
    
    .upload-zone {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .upload-card {
        background: var(--surface);
        border: 2px dashed var(--primary-color);
        border-radius: 0.75rem;
        padding: 1.5rem 1rem;
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .upload-card:hover {
        background: rgba(99, 102, 241, 0.05);
    }
    
    .upload-card i {
        font-size: 2rem;
        color: var(--primary-color);
        margin-bottom: 0.5rem;
    }
    
    .upload-card h4 {
        margin-bottom: 0.5rem;
        color: var(--text-dark);
        font-size: 1rem;
    }
    
    .upload-card p {
        color: var(--text-light);
        font-size: 0.9rem;
    }
    
    .upload-progress {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }
    
    .progress-fill.uploading {
        animation: uploading 2s ease-in-out infinite;
    }
    
    @keyframes uploading {
        0% { width: 0%; }
        50% { width: 70%; }
        100% { width: 100%; }
    }
    
    .analysis-display {
        text-align: center;
    }
    
    .analysis-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .analysis-header i {
        font-size: 2rem;
        color: var(--primary-color);
    }
    
    .analysis-steps {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .analysis-step {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: var(--surface);
        border-radius: 0.5rem;
        opacity: 0.5;
        transition: all 0.3s ease;
    }
    
    .analysis-step.active {
        opacity: 1;
        background: rgba(99, 102, 241, 0.1);
        border-left: 4px solid var(--primary-color);
    }
    
    .analysis-step i {
        color: var(--primary-color);
    }
    
    .pose-comparison {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
    }
    
    .pose-skeleton {
        position: relative;
        width: 60px;
        height: 100px;
        background: rgba(99, 102, 241, 0.1);
        border-radius: 0.5rem;
    }
    
    .pose-point {
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--accent-color);
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    .pose-skeleton.student .pose-point:nth-child(1) { top: 10px; left: 26px; }
    .pose-skeleton.student .pose-point:nth-child(2) { top: 40px; left: 10px; }
    .pose-skeleton.student .pose-point:nth-child(3) { top: 40px; right: 10px; }
    
    .pose-skeleton.teacher .pose-point:nth-child(1) { top: 10px; left: 26px; }
    .pose-skeleton.teacher .pose-point:nth-child(2) { top: 35px; left: 15px; }
    .pose-skeleton.teacher .pose-point:nth-child(3) { top: 35px; right: 15px; }
    
    .feedback-display {
        text-align: center;
    }
    
    .score-header {
        margin-bottom: 2rem;
    }
    
    .overall-score {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        background: var(--gold-gradient);
        color: white;
        padding: 1.5rem;
        border-radius: 1rem;
    }
    
    .score-value {
        font-size: 2.5rem;
        font-weight: 800;
    }
    
    .score-label {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .key-moments {
        text-align: left;
    }
    
    .key-moments h4 {
        margin-bottom: 1rem;
        color: var(--text-dark);
    }
    
    .moment-card {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: var(--surface);
        border-radius: 0.75rem;
        margin-bottom: 0.75rem;
        align-items: center;
    }
    
    .moment-score {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        min-width: 50px;
    }
    
    .moment-feedback h5 {
        margin-bottom: 0.25rem;
        color: var(--text-dark);
    }
    
    .moment-feedback p {
        color: var(--text-light);
        font-size: 0.9rem;
        margin: 0;
    }
    
    .progress-display {
        text-align: center;
    }
    
    .progress-header h3 {
        margin-bottom: 1.5rem;
        color: var(--text-dark);
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .stat-card {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        background: var(--surface);
        border-radius: 0.75rem;
        border: 1px solid rgba(99, 102, 241, 0.1);
    }
    
    .stat-value {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--primary-color);
    }
    
    .stat-label {
        font-size: 0.8rem;
        color: var(--text-light);
        margin-top: 0.25rem;
    }
    
    .chart-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 120px;
        background: var(--surface);
        border-radius: 0.75rem;
        margin-bottom: 1.5rem;
        color: var(--text-light);
    }
    
    .chart-placeholder i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--primary-color);
    }
    
    .achievements h4 {
        margin-bottom: 1rem;
        color: var(--text-dark);
    }
    
    .achievement-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--gold-gradient);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 2rem;
        font-weight: 600;
    }
`;

// Add demo styles to document
const demoStyleSheet = document.createElement('style');
demoStyleSheet.textContent = demoStyles;
document.head.appendChild(demoStyleSheet);

// Fullscreen toggle function
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported or denied');
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mobile-specific optimizations
function initializeMobileOptimizations() {
    // Prevent zoom on double tap for specific elements
    const preventZoomElements = document.querySelectorAll('.nav-link, .control-btn, .indicator');
    preventZoomElements.forEach(element => {
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
    
    // Add visual feedback for touch interactions
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('nav-link') || 
            e.target.classList.contains('control-btn') || 
            e.target.classList.contains('indicator')) {
            e.target.style.transform = 'scale(0.95)';
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (e.target.classList.contains('nav-link') || 
            e.target.classList.contains('control-btn') || 
            e.target.classList.contains('indicator')) {
            e.target.style.transform = '';
        }
    });
}

// Call mobile optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        initializeMobileOptimizations();
    }
});