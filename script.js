// DanceAI Presentation JavaScript
let currentSlide = 0;
const totalSlides = 6;

// Initialize presentation
document.addEventListener("DOMContentLoaded", function () {
  initializePresentation();
  startJourneyDemo();
  addInteractiveElements();
  ensureDancerAnimations();
});

// Ensure dancer animations are always running
function ensureDancerAnimations() {
  const dancerElements = [
    ".dance-animation",
    ".dancer-silhouette",
    ".dancer-head",
    ".dancer-body",
    ".dancer-arm-left",
    ".dancer-arm-right",
    ".dancer-leg-left",
    ".dancer-leg-right",
    ".pose-points",
    ".pose-point-shoulder-left",
    ".pose-point-shoulder-right",
    ".pose-point-hip-left",
    ".pose-point-hip-right",
    ".pose-point-knee-left",
    ".pose-point-knee-right",
    ".ai-scan-line",
    ".analysis-badge",
  ];

  function forceAnimations() {
    dancerElements.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (element) {
          element.style.animationPlayState = "running";
          element.style.animationIterationCount = "infinite";
          // Force reflow to restart animations if stopped
          element.style.display = "none";
          element.offsetHeight; // Trigger reflow
          element.style.display = "";
        }
      });
    });
  }

  // Run initially
  forceAnimations();

  // Run every 5 seconds to ensure animations don't stop
  setInterval(forceAnimations, 5000);

  // Run on slide changes
  document.addEventListener("slideChange", forceAnimations);

  // Run on any interaction
  document.addEventListener("click", forceAnimations);
  document.addEventListener("keydown", forceAnimations);

  // Run when the page becomes visible again (tab switching)
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      setTimeout(forceAnimations, 100);
    }
  });
}

// Initialize presentation functionality
function initializePresentation() {
  // Add keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " ") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      previousSlide();
    } else if (e.key >= "1" && e.key <= "6") {
      goToSlide(parseInt(e.key) - 1);
    }
  });

  // Add touch/swipe support for mobile
  let startX = 0;
  let startY = 0;

  document.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", function (e) {
    if (!startX || !startY) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    // Only trigger if horizontal swipe is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 50) {
        // Minimum swipe distance
        if (diffX > 0) {
          nextSlide(); // Swipe left - next slide
        } else {
          previousSlide(); // Swipe right - previous slide
        }
      }
    }

    startX = 0;
    startY = 0;
  });

  // Initialize slide animations
  initializeAnimations();
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
  document.querySelector(".slide.active").classList.remove("active");
  document.querySelector(".nav-link.active").classList.remove("active");
  document.querySelector(".indicator.active").classList.remove("active");

  // Update current slide
  currentSlide = slideNumber;

  // Add active class to new slide and nav link
  document.getElementById(`slide-${slideNumber}`).classList.add("active");
  document.querySelectorAll(".nav-link")[slideNumber].classList.add("active");
  document.querySelectorAll(".indicator")[slideNumber].classList.add("active");

  // Dispatch slide change event
  document.dispatchEvent(
    new CustomEvent("slideChange", {
      detail: { slideNumber: slideNumber },
    })
  );

  // Trigger slide-specific animations
  triggerSlideAnimations(slideNumber);

  // Update journey demo if on demo slide
  if (slideNumber === 4) {
    startJourneyDemo();
  }
}

// Animation system
function initializeAnimations() {
  // Add intersection observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  // Observe all feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });

  // Add hover effects to tech items
  document.querySelectorAll(".tech-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(10px) scale(1.05)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0) scale(1)";
    });
  });
}

function triggerSlideAnimations(slideNumber) {
  const slide = document.getElementById(`slide-${slideNumber}`);
  const elements = slide.querySelectorAll(
    ".feature-card, .tech-category, .arch-layer, .solution-card"
  );

  elements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";

    setTimeout(() => {
      element.style.transition = "all 0.6s ease";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
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
            `,
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
            `,
    },
    {
      title: "AI Analysis",
      content: `
                <div class="demo-interface mobile-mockup">
                    <div class="phone-frame">
                        <div class="phone-screen">
                            <div class="mobile-gradient-bg">
                                <div class="dancer-figure">
                                    <div class="dancer-image-container">
                                        <img src="https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600&q=80" alt="Dancer" class="dancer-photo" />
                                        
                                        <!-- Pose detection points overlay -->
                                        <div class="pose-points-overlay">
                                            <div class="pose-point-mobile head-point"></div>
                                            <div class="pose-point-mobile shoulder-left-point"></div>
                                            <div class="pose-point-mobile shoulder-right-point"></div>
                                            <div class="pose-point-mobile elbow-left-point"></div>
                                            <div class="pose-point-mobile elbow-right-point"></div>
                                            <div class="pose-point-mobile wrist-left-point"></div>
                                            <div class="pose-point-mobile wrist-right-point"></div>
                                            <div class="pose-point-mobile hip-left-point"></div>
                                            <div class="pose-point-mobile hip-right-point"></div>
                                            <div class="pose-point-mobile knee-left-point"></div>
                                            <div class="pose-point-mobile knee-right-point"></div>
                                            <div class="pose-point-mobile ankle-left-point"></div>
                                            <div class="pose-point-mobile ankle-right-point"></div>
                                        </div>
                                    </div>
                                    
                                    <!-- AI scanning effect -->
                                    <div class="ai-scan-overlay">
                                        <div class="scan-line-mobile"></div>
                                        <div class="scan-dots">
                                            <div class="scan-dot"></div>
                                            <div class="scan-dot"></div>
                                            <div class="scan-dot"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="analysis-status-mobile">
                                    <div class="status-indicator">
                                        <i class="fas fa-brain rotating-icon"></i>
                                        <span class="status-text">Analyzing Movement...</span>
                                    </div>
                                    <div class="progress-dots">
                                        <div class="dot active"></div>
                                        <div class="dot active"></div>
                                        <div class="dot"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
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
            `,
    },
    {
      title: "Practice History",
      content: `
                <div class="demo-interface">
                    <div class="history-view">
                        <div class="history-header">
                            <div class="header-content">
                                <div class="header-icon">
                                    <i class="fas fa-history"></i>
                                </div>
                                <h3>Practice History</h3>
                            </div>
                            <div class="stats-summary">
                                <div class="summary-stat">
                                    <span class="stat-number">24</span>
                                    <span class="stat-text">Total Sessions</span>
                                </div>
                                <div class="summary-stat">
                                    <span class="stat-number">89</span>
                                    <span class="stat-text">Avg Score</span>
                                </div>
                            </div>
                        </div>
                        <div class="session-list">
                            <div class="session-item featured">
                                <div class="session-badge">
                                    <i class="fas fa-star"></i>
                                    <span>Best Score</span>
                                </div>
                                <div class="session-info">
                                    <div class="session-title">
                                        <i class="fas fa-video"></i>
                                        Inversion Challenge
                                    </div>
                                    <div class="session-meta">9/23/2025 • Challenge: Inversion</div>
                                    <div class="session-score">
                                        <div class="score-circle">94</div>
                                        <span class="score-label">Perfect execution!</span>
                                    </div>
                                </div>
                                <button class="view-details-btn premium">
                                    <i class="fas fa-play"></i>
                                    VIEW DETAILS
                                </button>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <div class="session-title">
                                        <i class="fas fa-video"></i>
                                        Hip Hop Basics
                                    </div>
                                    <div class="session-meta">9/22/2025 • Challenge: Urban Style</div>
                                    <div class="session-score">
                                        <div class="score-circle">87</div>
                                        <span class="score-label">Great improvement!</span>
                                    </div>
                                </div>
                                <button class="view-details-btn">
                                    <i class="fas fa-eye"></i>
                                    VIEW DETAILS
                                </button>
                            </div>
                            <div class="session-item">
                                <div class="session-info">
                                    <div class="session-title">
                                        <i class="fas fa-video"></i>
                                        Ballet Fundamentals
                                    </div>
                                    <div class="session-meta">9/21/2025 • Challenge: Classical</div>
                                    <div class="session-score">
                                        <div class="score-circle">91</div>
                                        <span class="score-label">Excellent form!</span>
                                    </div>
                                </div>
                                <button class="view-details-btn">
                                    <i class="fas fa-search"></i>
                                    VIEW DETAILS
                                </button>
                            </div>
                        </div>
                        <div class="history-footer">
                            <div class="achievement-showcase">
                                <i class="fas fa-trophy"></i>
                                <span>Latest Achievement: Perfect Score Master!</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
    },
  ];

  let currentStep = 0;

  function updateDemo() {
    // Update step indicators
    document.querySelectorAll(".journey-step").forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    // Update demo content
    const demoContent = document.getElementById("demo-content");
    if (demoContent) {
      demoContent.innerHTML = steps[currentStep].content;

      // Add click handlers for journey steps
      document.querySelectorAll(".journey-step").forEach((step, index) => {
        step.addEventListener("click", () => {
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
    if (document.getElementById("slide-4").classList.contains("active")) {
      currentStep = (currentStep + 1) % steps.length;
      updateDemo();
    }
  }, 9000);
}

// Interactive elements
function addInteractiveElements() {
  // Add click effects to feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("click", function () {
      this.style.transform = "scale(0.98)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  });

  // Add hover effects to architecture components
  document.querySelectorAll(".arch-component").forEach((component) => {
    component.addEventListener("mouseenter", function () {
      this.style.background = "rgba(99, 102, 241, 0.1)";
      this.style.borderColor = "var(--primary-color)";
    });

    component.addEventListener("mouseleave", function () {
      this.style.background = "var(--surface)";
      this.style.borderColor = "rgba(99, 102, 241, 0.1)";
    });
  });

  // Add particles effect to hero section
  createParticles();

  // Add typing effect to hero subtitle
  typeWriter();
}

// Particles animation for hero section
function createParticles() {
  const heroVisual = document.querySelector(".hero-visual");
  if (!heroVisual) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
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
  const style = document.createElement("style");
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
  const subtitle = document.querySelector(".hero-subtitle");
  if (!subtitle) return;

  const text = subtitle.textContent;
  subtitle.textContent = "";

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
    
    /* Practice History Styles - Optimized for Demo Screen */
    .history-view {
        width: 100%;
        position: relative;
        max-height: 350px;
        overflow-y: auto;
        padding: 0.5rem;
    }
    
    .history-header {
        background: var(--purple-gradient);
        color: white;
        padding: 1rem;
        border-radius: 0.75rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .header-content {
        display: flex;
        align-items: center;
        gap: 0.8rem;
    }
    
    .header-icon {
        width: 35px;
        height: 35px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
    }
    
    .header-icon i {
        font-size: 1.1rem;
        color: white;
    }
    
    .history-header h3 {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
    }
    
    .stats-summary {
        display: flex;
        gap: 1rem;
    }
    
    .summary-stat {
        text-align: center;
        background: rgba(255, 255, 255, 0.15);
        padding: 0.6rem 0.8rem;
        border-radius: 0.5rem;
        backdrop-filter: blur(10px);
        min-width: 60px;
    }
    
    .stat-number {
        display: block;
        font-size: 1.4rem;
        font-weight: 800;
        line-height: 1;
    }
    
    .stat-text {
        font-size: 0.7rem;
        opacity: 0.9;
        margin-top: 0.2rem;
    }
    
    .session-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .session-item {
        background: white;
        border-radius: 0.75rem;
        padding: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border: 2px solid transparent;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .session-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--purple-gradient);
    }
    
    .session-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(99, 102, 241, 0.2);
        border-color: var(--primary-color);
    }
    
    .session-item.featured {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
        border: 2px solid var(--primary-color);
    }
    
    .session-item.featured::before {
        background: var(--gold-gradient);
        height: 6px;
    }
    
    .session-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--gold-gradient);
        color: white;
        padding: 0.2rem 0.6rem;
        border-radius: 0.75rem;
        font-size: 0.6rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.2rem;
    }
    
    .session-info {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        flex: 1;
    }
    
    .session-title {
        font-weight: 700;
        color: var(--text-dark);
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        margin: 0;
    }
    
    .session-title i {
        color: var(--primary-color);
        font-size: 0.9rem;
    }
    
    .session-meta {
        color: var(--text-light);
        font-size: 0.8rem;
        margin: 0;
    }
    
    .session-score {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-top: 0.3rem;
    }
    
    .score-circle {
        width: 40px;
        height: 40px;
        background: var(--purple-gradient);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 1rem;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        flex-shrink: 0;
    }
    
    .score-label {
        color: var(--primary-color);
        font-weight: 600;
        font-size: 0.8rem;
    }
    
    .view-details-btn {
        padding: 0.6rem 1rem;
        background: var(--purple-gradient);
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 600;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        min-width: 110px;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        flex-shrink: 0;
    }
    
    .view-details-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
    
    .view-details-btn.premium {
        background: var(--gold-gradient);
    }
    
    .view-details-btn i {
        font-size: 0.7rem;
    }
    
    .history-footer {
        margin-top: 1rem;
        text-align: center;
    }
    
    .achievement-showcase {
        background: var(--dance-gradient);
        padding: 0.6rem 1.2rem;
        border-radius: 1.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        color: var(--primary-color);
        font-weight: 600;
        font-size: 0.8rem;
        box-shadow: 0 2px 10px rgba(99, 102, 241, 0.2);
    }
    
    .achievement-showcase i {
        font-size: 1rem;
        color: var(--accent-color);
    }
    
    /* Mobile Mockup Styles */
    .mobile-mockup {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        background: transparent;
    }
    
    .phone-frame {
        width: 280px;
        height: 500px;
        background: #1a1a1a;
        border-radius: 30px;
        padding: 15px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        position: relative;
    }
    
    .phone-frame::before {
        content: '';
        position: absolute;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 6px;
        background: #333;
        border-radius: 3px;
    }
    
    .phone-screen {
        width: 100%;
        height: 100%;
        background: white;
        border-radius: 20px;
        overflow: hidden;
        position: relative;
    }
    
    .mobile-gradient-bg {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #a8e6cf 0%, #dda0dd 50%, #87ceeb 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
    }
    
    .dancer-figure {
        position: relative;
        margin-bottom: 40px;
    }
    
    .dancer-image-container {
        width: 180px;
        height: 270px;
        position: relative;
        border-radius: 15px;
        overflow: hidden;
        filter: drop-shadow(0 8px 25px rgba(0, 0, 0, 0.3));
        animation: floatDancer 3s ease-in-out infinite;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(5px);
    }
    
    .dancer-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        border-radius: 15px;
        transition: transform 0.3s ease;
        display: block;
    }
    
    .pose-points-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 5;
    }
    
    .pose-point-mobile {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #ff4757;
        border: 2px solid white;
        border-radius: 50%;
        animation: pulsePose 2s ease-in-out infinite;
        box-shadow: 0 0 15px rgba(255, 71, 87, 0.9);
        z-index: 10;
    }
    
    /* Animation delays for sequential detection effect */
    .head-point { animation-delay: 0s; }
    .shoulder-left-point { animation-delay: 0.2s; }
    .shoulder-right-point { animation-delay: 0.4s; }
    .elbow-left-point { animation-delay: 0.6s; }
    .elbow-right-point { animation-delay: 0.8s; }
    .wrist-left-point { animation-delay: 1s; }
    .wrist-right-point { animation-delay: 1.2s; }
    .hip-left-point { animation-delay: 1.4s; }
    .hip-right-point { animation-delay: 1.6s; }
    .knee-left-point { animation-delay: 1.8s; }
    .knee-right-point { animation-delay: 2s; }
    .ankle-left-point { animation-delay: 2.2s; }
    .ankle-right-point { animation-delay: 2.4s; }
    
    .head-point { top: 8%; left: 52%; transform: translateX(-50%); }
    .shoulder-left-point { top: 20%; left: 38%; }
    .shoulder-right-point { top: 18%; right: 25%; }
    .elbow-left-point { top: 32%; left: 15%; }
    .elbow-right-point { top: 28%; right: 15%; }
    .wrist-left-point { top: 42%; left: 8%; }
    .wrist-right-point { top: 38%; right: 8%; }
    .hip-left-point { top: 48%; left: 45%; }
    .hip-right-point { top: 46%; right: 38%; }
    .knee-left-point { top: 68%; left: 48%; }
    .knee-right-point { top: 65%; right: 35%; }
    .ankle-left-point { top: 88%; left: 50%; }
    .ankle-right-point { top: 85%; right: 32%; }
    
    .ai-scan-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
    }
    
    .scan-line-mobile {
        position: absolute;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, transparent 0%, #00ff88 50%, transparent 100%);
        animation: scanMove 3s linear infinite;
        box-shadow: 0 0 10px #00ff88;
    }
    
    .scan-dots {
        position: absolute;
        top: 30px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .scan-dot {
        width: 6px;
        height: 6px;
        background: #00ff88;
        border-radius: 50%;
        animation: dotBlink 2s ease-in-out infinite;
        box-shadow: 0 0 8px #00ff88;
    }
    
    .scan-dot:nth-child(2) { animation-delay: 0.3s; }
    .scan-dot:nth-child(3) { animation-delay: 0.6s; }
    
    .analysis-status-mobile {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        text-align: center;
        min-width: 200px;
    }
    
    .status-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 10px;
    }
    
    .rotating-icon {
        color: #6366f1;
        font-size: 1.2rem;
        animation: spin 2s linear infinite;
    }
    
    .status-text {
        color: #4a4a4a;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .progress-dots {
        display: flex;
        justify-content: center;
        gap: 6px;
    }
    
    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #e0e0e0;
        animation: progressDot 2s ease-in-out infinite;
    }
    
    .dot.active {
        background: #6366f1;
    }
    
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    
    /* Animations */
    @keyframes floatDancer {
        0%, 100% { 
            transform: translateY(0px) scale(1); 
        }
        33% { 
            transform: translateY(-8px) scale(1.02); 
        }
        66% { 
            transform: translateY(-4px) scale(0.98); 
        }
    }
    
    @keyframes danceBounce {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-8px) rotate(-2deg); }
        50% { transform: translateY(-5px) rotate(1deg); }
        75% { transform: translateY(-12px) rotate(-1deg); }
    }
    
    @keyframes armSwing {
        0%, 100% { transform: rotate(-15deg); }
        50% { transform: rotate(25deg); }
    }
    
    @keyframes legMove {
        0%, 100% { transform: rotate(5deg); }
        50% { transform: rotate(-10deg); }
    }
    
    @keyframes pulsePose {
        0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
            box-shadow: 0 0 20px rgba(255, 71, 87, 0.9);
        }
        50% { 
            transform: scale(1.4); 
            opacity: 0.8; 
            box-shadow: 0 0 30px rgba(255, 71, 87, 1);
        }
    }
    
    @keyframes scanMove {
        0% { top: 0%; }
        100% { top: 100%; }
    }
    
    @keyframes dotBlink {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes progressDot {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 1; }
    }
`;

// Add demo styles to document
const demoStyleSheet = document.createElement("style");
demoStyleSheet.textContent = demoStyles;
document.head.appendChild(demoStyleSheet);
