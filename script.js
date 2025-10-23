/* ====================================================================
   MODERN PORTFOLIO - JAVASCRIPT
   Main script file for portfolio website functionality
   ==================================================================== */

/* ====================================================================
   GLOBAL VARIABLES
   ==================================================================== */
let currentNumber = 1;
let totalNumbers = 0;
let sum = 0;
let numbers = [];
let calculationHistory = [];
let isCalculating = false;

/* ====================================================================
   INITIALIZATION
   ==================================================================== */
// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    setupScrollEffects();
    setupAnimations();
    setupCalculatorEnhancements();
    setupFormEnhancements();
    setupKeyboardShortcuts();
    setupSmoothScroll();
    console.log('Modern portfolio initialized successfully!');
}

/* ====================================================================
   SMOOTH SCROLL NAVIGATION
   ==================================================================== */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ====================================================================
   SCROLL EFFECTS
   ==================================================================== */
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        updateActiveNavigation();
        revealOnScroll();
    });
}

// Reveal elements on scroll
function revealOnScroll() {
    const elements = document.querySelectorAll('.card, .skill-card, .project-card, .contact-card');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible && !el.classList.contains('fade-in')) {
            el.classList.add('fade-in');
        }
    });
}

// Update active navigation based on scroll position
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/* ====================================================================
   ANIMATIONS
   ==================================================================== */
function setupAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const elementsToAnimate = document.querySelectorAll('.card, .skill-card, .project-card, .contact-card, .section');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    setupButtonEffects();
}

// Enhanced button effects
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

// Create ripple effect on button click
function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

/* ====================================================================
   CALCULATOR ENHANCEMENTS
   ==================================================================== */
function setupCalculatorEnhancements() {
    const calculatorInputs = document.querySelectorAll('#num1, #num2, #simple-num1, #simple-num2');
    calculatorInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', clearResult);
            input.addEventListener('focus', function() {
                this.style.borderColor = 'var(--accent-primary)';
                this.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)';
            });
            input.addEventListener('blur', function() {
                this.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                this.style.boxShadow = 'none';
            });
        }
    });
}

// Clear calculator result
function clearResult() {
    const outputs = document.querySelectorAll('#output, #simple-result');
    const operations = document.querySelectorAll('#operation');
    
    outputs.forEach(output => {
        if (output) {
            output.textContent = "0";
            output.className = "result-output";
        }
    });
    
    operations.forEach(operation => {
        if (operation) {
            operation.textContent = "";
            operation.className = "operation-display";
        }
    });
}

/* ====================================================================
   BASIC CALCULATOR FUNCTIONS
   ==================================================================== */
function add() {
    performCalculation('add', '+');
}

function subtract() {
    performCalculation('subtract', '-');
}

function multiply() {
    performCalculation('multiply', '×');
}

function divide() {
    performCalculation('divide', '÷');
}

function performCalculation(operation, symbol) {
    const num1 = parseFloat(document.getElementById("num1")?.value) || 0;
    const num2 = parseFloat(document.getElementById("num2")?.value) || 0;
    const output = document.getElementById("output");
    const operationDisplay = document.getElementById("operation");
    
    if (!output) return;
    
    output.style.opacity = '0.5';
    
    setTimeout(() => {
        output.style.opacity = '1';
        
        if (isNaN(num1) || isNaN(num2)) {
            displayResult("Please enter valid numbers.", "error", output, operationDisplay);
            return;
        }
        
        let result;
        try {
            switch(operation) {
                case 'add':
                    result = num1 + num2;
                    break;
                case 'subtract':
                    result = num1 - num2;
                    break;
                case 'multiply':
                    result = num1 * num2;
                    break;
                case 'divide':
                    if (num2 === 0) {
                        throw new Error('Cannot divide by zero');
                    }
                    result = num1 / num2;
                    break;
            }
            
            displayResult(formatNumber(result), "success", output, operationDisplay, `${num1} ${symbol} ${num2} = ${formatNumber(result)}`);
            addToHistory(`${num1} ${symbol} ${num2} = ${formatNumber(result)}`);
            
        } catch (error) {
            displayResult(error.message, "error", output, operationDisplay);
        }
    }, 200);
}

// Display calculation result
function displayResult(value, type, output, operationDisplay, operationText = "") {
    if (output) {
        output.textContent = value;
        output.className = `result-output ${type}`;
    }
    
    if (operationDisplay && operationText) {
        operationDisplay.textContent = operationText;
        operationDisplay.className = `operation-display ${type}`;
    }
    
    setTimeout(() => {
        if (output) output.classList.remove(type);
        if (operationDisplay) operationDisplay.classList.remove(type);
    }, 3000);
    
    showNotification(
        type === 'success' ? 'Calculation completed!' : 'Calculation error!',
        type
    );
}

// Format numbers for display
function formatNumber(num) {
    if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-9 && num !== 0)) {
        return num.toExponential(3);
    }
    return parseFloat(num.toFixed(10)).toString();
}

// Add calculation to history
function addToHistory(calculation) {
    calculationHistory.unshift(calculation);
    if (calculationHistory.length > 10) {
        calculationHistory = calculationHistory.slice(0, 10);
    }
}

/* ====================================================================
   AVERAGE CALCULATOR
   ==================================================================== */
function startCalculation() {
    if (isCalculating) {
        showNotification('Calculation already in progress', 'warning');
        return;
    }
    
    currentNumber = 1;
    sum = 0;
    numbers = [];
    isCalculating = true;
    
    const totalInput = prompt("How many numbers do you want to enter? (2-50)");
    totalNumbers = parseInt(totalInput);
    
    if (isNaN(totalNumbers) || totalNumbers < 2 || totalNumbers > 50) {
        showNotification("Please enter a valid number between 2 and 50!", "error");
        isCalculating = false;
        return;
    }
    
    const progressSection = document.getElementById("progress-section");
    if (progressSection) {
        progressSection.style.display = "block";
        progressSection.classList.add('fade-in');
    }
    
    updateProgress();
    updateDisplays();
    
    setTimeout(() => collectNumbers(), 500);
}

function collectNumbers() {
    if (currentNumber <= totalNumbers && isCalculating) {
        const numInput = prompt(`Enter number ${currentNumber} (10-99):`);
        
        if (numInput === null) {
            isCalculating = false;
            resetCalculation();
            return;
        }
        
        const num = parseInt(numInput);
        
        if (isNaN(num) || num < 10 || num > 99) {
            showNotification("Please enter a valid two-digit number (10-99)!", "error");
            collectNumbers();
            return;
        }
        
        numbers.push(num);
        sum += num;
        
        updateNumbersDisplay();
        updateProgress();
        
        currentNumber++;
        
        setTimeout(() => {
            if (currentNumber <= totalNumbers) {
                collectNumbers();
            } else {
                showResults();
            }
        }, 300);
    }
}

function updateProgress() {
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");
    
    if (progressFill && progressText) {
        const progress = ((currentNumber - 1) / totalNumbers) * 100;
        progressFill.style.width = progress + "%";
        progressText.textContent = `${currentNumber - 1}/${totalNumbers}`;
    }
}

function updateNumbersDisplay() {
    const display = document.getElementById("numbers-display");
    if (!display) return;
    
    let html = "<h4 style='color: var(--accent-primary); margin-bottom: 1rem;'>Numbers Entered:</h4>";
    html += "<div style='display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;'>";
    
    numbers.forEach((num, index) => {
        html += `<span style='background: rgba(99, 102, 241, 0.2); color: var(--accent-primary); padding: 6px 12px; border-radius: 20px; font-size: 0.9rem; border: 1px solid rgba(99, 102, 241, 0.3);'>#${index + 1}: ${num}</span>`;
    });
    
    html += "</div>";
    display.innerHTML = html;
}

function showResults() {
    const average = sum / totalNumbers;
    const isPassed = average >= 75;
    
    const resultDisplay = document.getElementById("result-display");
    if (resultDisplay) {
        const statusColor = isPassed ? 'var(--accent-success)' : 'var(--accent-secondary)';
        const statusText = isPassed ? '✅ PASSED' : '❌ FAILED';
        
        resultDisplay.innerHTML = `
            <h4 style='color: var(--accent-primary); margin-bottom: 1rem;'>Calculation Results:</h4>
            <div style='background: var(--bg-primary); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2);'>
                <p style='margin: 0.5rem 0; color: var(--text-secondary);'><strong>Sum:</strong> ${sum}</p>
                <p style='margin: 0.5rem 0; color: var(--text-secondary);'><strong>Count:</strong> ${totalNumbers}</p>
                <p style='margin: 0.5rem 0; color: var(--text-secondary);'><strong>Average:</strong> ${average.toFixed(2)}</p>
                <div style='margin-top: 1rem; padding: 1rem; background: rgba(${isPassed ? '16, 185, 129' : '236, 72, 153'}, 0.1); border: 2px solid ${statusColor}; border-radius: 8px; text-align: center; font-size: 1.2rem; font-weight: bold; color: ${statusColor};'>
                    ${statusText}
                </div>
            </div>
        `;
    }
    
    const progressSection = document.getElementById("progress-section");
    if (progressSection) {
        setTimeout(() => {
            progressSection.style.display = "none";
        }, 1000);
    }
    
    if (isPassed) {
        showNotification("Congratulations! You passed! 🎉", "success");
        setTimeout(() => showCelebration(), 500);
    } else {
        showNotification("Keep studying! You can do better! 📚", "error");
    }
    
    isCalculating = false;
}

// Show celebration effect
function showCelebration() {
    const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 50%;
            left: 50%;
            border-radius: 50%;
            animation: celebrate ${2 + Math.random() * 2}s ease-out forwards;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 4000);
    }
    
    if (!document.querySelector('#celebration-styles')) {
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
            @keyframes celebrate {
                0% {
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(${-50 + Math.random() * 100 - 50}vw, ${-50 + Math.random() * 100 - 50}vh) scale(0) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function updateDisplays() {
    const numbersDisplay = document.getElementById("numbers-display");
    const resultDisplay = document.getElementById("result-display");
    
    if (numbersDisplay) {
        numbersDisplay.innerHTML = "<p style='color: var(--text-muted);'>Numbers will appear here...</p>";
    }
    
    if (resultDisplay) {
        resultDisplay.innerHTML = "<p style='color: var(--text-muted);'>Results will appear here...</p>";
    }
}

function resetCalculation() {
    isCalculating = false;
    currentNumber = 1;
    sum = 0;
    numbers = [];
    totalNumbers = 0;
    
    const progressSection = document.getElementById("progress-section");
    if (progressSection) {
        progressSection.style.display = "none";
    }
    
    updateDisplays();
}

/* ====================================================================
   SIMPLE CALCULATOR FUNCTIONS (for simple.html)
   ==================================================================== */
function multiplySimple() {
    performSimpleCalculation('multiply', '×');
}

function divideSimple() {
    performSimpleCalculation('divide', '÷');
}

function performSimpleCalculation(operation, symbol) {
    const num1 = parseFloat(document.getElementById("simple-num1")?.value) || 0;
    const num2 = parseFloat(document.getElementById("simple-num2")?.value) || 0;
    const output = document.getElementById("simple-result");
    
    if (!output) return;
    
    if (isNaN(num1) || isNaN(num2)) {
        output.textContent = "Please enter valid numbers.";
        output.className = "result-output error";
        return;
    }
    
    let result;
    try {
        switch(operation) {
            case 'multiply':
                result = num1 * num2;
                break;
            case 'divide':
                if (num2 === 0) {
                    throw new Error('Cannot divide by zero');
                }
                result = num1 / num2;
                break;
        }
        
        output.textContent = formatNumber(result);
        output.className = "result-output success";
        showNotification('Calculation completed!', 'success');
        
    } catch (error) {
        output.textContent = error.message;
        output.className = "result-output error";
        showNotification(error.message, 'error');
    }
}

/* ====================================================================
   FORM ENHANCEMENTS
   ==================================================================== */
function setupFormEnhancements() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--accent-primary)';
            this.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            this.style.boxShadow = 'none';
        });
    });
}

// Handle contact form submission
function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:raven@example.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
        
        window.location.href = mailtoLink;
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        showNotification('Thank you! Your email client will open with the message.', 'success');
        e.target.reset();
    }, 1000);
}

/* ====================================================================
   KEYBOARD SHORTCUTS
   ==================================================================== */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.id === 'num1' || activeElement.id === 'num2')) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '+':
                    case '=':
                        e.preventDefault();
                        add();
                        break;
                    case '-':
                        e.preventDefault();
                        subtract();
                        break;
                    case '*':
                        e.preventDefault();
                        multiply();
                        break;
                    case '/':
                        e.preventDefault();
                        divide();
                        break;
                }
            }
        }
        
        if (e.key === 'Enter' && activeElement && (activeElement.id === 'num1' || activeElement.id === 'num2')) {
            e.preventDefault();
            add();
        }
    });
}

/* ====================================================================
   NOTIFICATION SYSTEM
   ==================================================================== */
function showNotification(message, type = 'info') {
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const colors = {
        success: '#10b981',
        error: '#ec4899',
        info: '#6366f1',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-secondary);
        border: 1px solid ${colors[type]};
        color: ${colors[type]};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        word-wrap: break-word;
        font-size: 0.9rem;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

/* ====================================================================
   UTILITY FUNCTIONS
   ==================================================================== */
// Copy result functionality
function copyResult() {
    const output = document.getElementById('output');
    if (output && output.textContent && output.textContent !== '0') {
        navigator.clipboard.writeText(output.textContent).then(() => {
            showNotification('Result copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy result', 'error');
        });
    }
}

/* ====================================================================
   WINDOW EVENT HANDLERS
   ==================================================================== */
// Window resize handler
window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
        const cards = document.querySelectorAll('.card, .skill-card, .project-card, .contact-card');
        cards.forEach(card => {
            card.style.padding = '1.5rem';
        });
    }
});

// Focus on first input when calculator pages load
window.addEventListener('load', function() {
    const firstInput = document.getElementById('num1') || document.getElementById('simple-num1');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
    
    // Trigger initial scroll reveal
    revealOnScroll();
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add mouse move parallax effect
document.addEventListener('mousemove', function(e) {
    const hero = document.querySelector('.hero-content');
    if (hero && window.innerWidth > 768) {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        hero.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// Prevent form resubmission
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

/* ====================================================================
   ENHANCED VISUAL EFFECTS
   ==================================================================== */
// Add loading state to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        }
    });
});

// Typing effect for hero text (optional enhancement)
function typeEffect(element, text, speed = 50) {
    if (!element) return;
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect if on home page
const heroTitle = document.querySelector('.hero h1');
if (heroTitle && window.location.pathname.includes('index')) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
        typeEffect(heroTitle, originalText, 30);
    }, 500);
}

// Add particle effect to hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        hero.appendChild(particle);
    }
}

// Initialize particles on hero section
if (document.querySelector('.hero')) {
    createParticles();
}

// Add glow effect on card hover
document.querySelectorAll('.card, .skill-card, .project-card, .contact-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        glow.style.cssText = `
            position: absolute;
            inset: -2px;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border-radius: 20px;
            opacity: 0.2;
            filter: blur(20px);
            z-index: -1;
            pointer-events: none;
        `;
        this.appendChild(glow);
    });
    
    card.addEventListener('mouseleave', function() {
        const glow = this.querySelector('.card-glow');
        if (glow) glow.remove();
    });
});

// Add tilt effect to cards
document.querySelectorAll('.card, .skill-card, .project-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ====================================================================
   SKILL BAR ANIMATIONS
   ==================================================================== */
// Enhanced skill progress animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Initialize skill bar animations
animateSkillBars();

/* ====================================================================
   COUNTER ANIMATIONS
   ==================================================================== */
// Add counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Initialize counters for stat numbers
document.querySelectorAll('.stat-number').forEach(stat => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(stat);
});

/* ====================================================================
   THEME TOGGLE (Optional)
   ==================================================================== */
// Add theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

/* ====================================================================
   PERFORMANCE OPTIMIZATION
   ==================================================================== */
// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

lazyLoadImages();

// Add smooth page transitions
document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

/* ====================================================================
   BMI CALCULATOR
   ==================================================================== */
function calculateBMI() {
    const height = parseFloat(document.getElementById('bmi-height')?.value);
    const weight = parseFloat(document.getElementById('bmi-weight')?.value);
    const resultDiv = document.getElementById('bmi-result');
    const outputDiv = document.getElementById('bmi-output');
    const categoryDiv = document.getElementById('bmi-category');
    const recommendationDiv = document.getElementById('bmi-recommendation');

    if (!height || !weight || height <= 0 || weight <= 0) {
        showNotification('Please enter valid height and weight values', 'error');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category, categoryColor, recommendation;

    if (bmi < 18.5) {
        category = 'Underweight';
        categoryColor = '#3b82f6';
        recommendation = 'You may need to gain weight. Consult with a healthcare provider for a proper diet plan.';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        categoryColor = '#10b981';
        recommendation = 'Great! You have a healthy weight. Maintain your current lifestyle with balanced diet and exercise.';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        categoryColor = '#f59e0b';
        recommendation = 'Consider adopting a healthier lifestyle with regular exercise and a balanced diet.';
    } else {
        category = 'Obese';
        categoryColor = '#ef4444';
        recommendation = 'It\'s recommended to consult with a healthcare provider for a weight management plan.';
    }

    resultDiv.style.display = 'block';
    outputDiv.textContent = bmi.toFixed(1);
    outputDiv.className = 'result-output success';
    
    categoryDiv.style.backgroundColor = `${categoryColor}20`;
    categoryDiv.style.border = `2px solid ${categoryColor}`;
    categoryDiv.style.color = categoryColor;
    categoryDiv.textContent = category;
    
    recommendationDiv.textContent = recommendation;
    
    showNotification('BMI calculated successfully!', 'success');
}

function resetBMI() {
    document.getElementById('bmi-height').value = '';
    document.getElementById('bmi-weight').value = '';
    document.getElementById('bmi-result').style.display = 'none';
    showNotification('Form reset', 'info');
}

/* ====================================================================
   CURRENCY CONVERTER
   ==================================================================== */
const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    PHP: 56.50,
    AUD: 1.52,
    CAD: 1.36,
    CNY: 7.24,
    INR: 83.12
};

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount')?.value);
    const fromCurrency = document.getElementById('currency-from')?.value;
    const toCurrency = document.getElementById('currency-to')?.value;
    const outputDiv = document.getElementById('currency-output');
    const rateDiv = document.getElementById('currency-rate');

    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    const amountInUSD = amount / exchangeRates[fromCurrency];
    const convertedAmount = amountInUSD * exchangeRates[toCurrency];
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];

    outputDiv.textContent = `${toCurrency} ${convertedAmount.toFixed(2)}`;
    outputDiv.className = 'result-output success';
    
    rateDiv.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
    
    showNotification('Currency converted successfully!', 'success');
}

function swapCurrencies() {
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    convertCurrency();
}

/* ====================================================================
   JOKE GENERATOR
   ==================================================================== */
let jokeCount = 0;
const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a fake noodle? An impasta!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What did the ocean say to the beach? Nothing, it just waved!",
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "Why couldn't the bicycle stand up by itself? It was two tired!",
    "What did one wall say to the other wall? I'll meet you at the corner!",
    "Why did the coffee file a police report? It got mugged!",
    "What do you call a pile of cats? A meowtain!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "What do you call a fish wearing a bowtie? Sofishticated!",
    "Why don't programmers like nature? It has too many bugs!",
    "What did the programmer say to the bug? You're not a feature!",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem!"
];

function generateJoke() {
    const jokeDisplay = document.getElementById('joke-display');
    const copyBtn = document.getElementById('copy-joke-btn');
    const jokeCountDisplay = document.getElementById('joke-count');
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    
    jokeDisplay.style.opacity = '0';
    setTimeout(() => {
        jokeDisplay.innerHTML = `<p>${randomJoke}</p>`;
        jokeDisplay.style.opacity = '1';
    }, 200);
    
    jokeCount++;
    jokeCountDisplay.textContent = jokeCount;
    copyBtn.style.display = 'inline-block';
    
    showNotification('Here\'s a fresh joke! 😄', 'success');
}

function copyJoke() {
    const jokeText = document.querySelector('#joke-display p')?.textContent;
    if (jokeText) {
        navigator.clipboard.writeText(jokeText).then(() => {
            showNotification('Joke copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy joke', 'error');
        });
    }
}

/* ====================================================================
   PHOTO GALLERY
   ==================================================================== */
const galleryImages = [
    { id: 1, category: 'nature', title: 'Mountain Sunset', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    { id: 2, category: 'nature', title: 'Forest Path', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800' },
    { id: 3, category: 'tech', title: 'Coding Setup', src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800' },
    { id: 4, category: 'tech', title: 'Circuit Board', src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800' },
    { id: 5, category: 'abstract', title: 'Color Waves', src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800' },
    { id: 6, category: 'abstract', title: 'Geometric Art', src: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800' },
    { id: 7, category: 'nature', title: 'Ocean View', src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800' },
    { id: 8, category: 'tech', title: 'Data Visualization', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800' },
    { id: 9, category: 'abstract', title: 'Light Patterns', src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800' },
    { id: 10, category: 'nature', title: 'Desert Landscape', src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800' },
    { id: 11, category: 'tech', title: 'Futuristic Design', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800' },
    { id: 12, category: 'abstract', title: 'Digital Art', src: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800' }
];

let currentImageIndex = 0;

function initializeGallery() {
    const gallery = document.getElementById('photo-gallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    galleryImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-category', img.category);
        item.innerHTML = `
            <img src="${img.src}" alt="${img.title}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
            <div class="gallery-overlay">
                <h4>${img.title}</h4>
                <p>${img.category}</p>
            </div>
        `;
        item.onclick = () => openLightbox(index);
        gallery.appendChild(item);
    });
}

function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
            setTimeout(() => item.style.opacity = '1', 10);
        } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const image = galleryImages[index];
    
    img.src = image.src;
    img.alt = image.title;
    img.style.background = 'none';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.innerHTML = '';
    
    caption.textContent = `${image.title} - ${image.category}`;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function navigateLightbox(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = galleryImages.length - 1;
    if (currentImageIndex >= galleryImages.length) currentImageIndex = 0;
    openLightbox(currentImageIndex);
}

// Close lightbox on escape key or background click
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Initialize gallery when page loads
if (document.getElementById('photo-gallery')) {
    document.addEventListener('DOMContentLoaded', initializeGallery);
}

/* ====================================================================
   SPIN THE WHEEL
   ==================================================================== */
let wheelPrizes = [];

const wheelColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7B731', '#5F27CD', '#00D2D3',
    '#FF9FF3', '#54A0FF', '#48DBFB', '#10b981'
];

let isSpinning = false;
let spinHistory = [];

// Add a new prize
function addPrize(event) {
    event.preventDefault();
    
    const input = document.getElementById('prize-input');
    if (!input) {
        console.error('Prize input not found');
        return;
    }
    
    const prizeText = input.value.trim();
    
    if (!prizeText) {
        showNotification('Please enter a prize name', 'error');
        return;
    }
    
    if (wheelPrizes.length >= 12) {
        showNotification('Maximum 12 prizes allowed', 'error');
        return;
    }
    
    if (wheelPrizes.includes(prizeText)) {
        showNotification('This prize already exists', 'error');
        return;
    }
    
    wheelPrizes.push(prizeText);
    input.value = '';
    input.focus();
    updatePrizesList();
    initializeWheel();
    showNotification('Prize added successfully!', 'success');
}

// Remove a prize
function removePrize(index) {
    const removedPrize = wheelPrizes[index];
    wheelPrizes.splice(index, 1);
    updatePrizesList();
    initializeWheel();
    showNotification(`Removed: ${removedPrize}`, 'info');
}

// Update the prizes list display
function updatePrizesList() {
    const container = document.getElementById('prize-chips');
    const countSpan = document.getElementById('prize-count');
    
    if (!container || !countSpan) return;
    
    countSpan.textContent = wheelPrizes.length;
    
    if (wheelPrizes.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No prizes added yet. Add prizes to start spinning!</p>';
        return;
    }
    
    container.innerHTML = wheelPrizes.map((prize, index) => `
        <div class="prize-chip" onclick="removePrize(${index})" title="Click to remove">
            <span>${prize}</span>
            <span class="remove-icon">×</span>
        </div>
    `).join('');
}

// Initialize the wheel
function initializeWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    drawWheel(ctx, centerX, centerY, radius, 0);
}

// Draw the wheel
function drawWheel(ctx, centerX, centerY, radius, rotation) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    if (wheelPrizes.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Add prizes above', centerX, centerY - 10);
        ctx.fillText('to start spinning!', centerX, centerY + 15);
        return;
    }
    
    const sliceAngle = (2 * Math.PI) / wheelPrizes.length;
    
    // Draw wheel slices
    for (let i = 0; i < wheelPrizes.length; i++) {
        const angle = rotation + i * sliceAngle;
        
        // Draw slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = wheelColors[i % wheelColors.length];
        ctx.fill();
        ctx.strokeStyle = '#0a0e27';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        
        // Wrap text if too long
        const text = wheelPrizes[i];
        const maxWidth = radius * 0.6;
        const words = text.split(' ');
        let line = '';
        let y = 5;
        
        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), radius * 0.65, y);
                line = word + ' ';
                y += 16;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), radius * 0.65, y);
        
        ctx.restore();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0e27';
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.stroke();
}

// Spin the wheel
function spinWheel() {
    if (isSpinning) return;
    
    if (wheelPrizes.length === 0) {
        showNotification('Add at least one prize to spin!', 'error');
        return;
    }
    
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const button = document.getElementById('spin-button');
    const resultDiv = document.getElementById('wheel-result');
    
    if (!canvas || !button || !resultDiv) return;
    
    isSpinning = true;
    button.disabled = true;
    button.textContent = 'SPINNING...';
    resultDiv.style.display = 'none';
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    const spinTime = 3000;
    const spinRotation = Math.random() * 360 + 1800; // 5-6 full rotations
    let currentRotation = 0;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinTime, 1);
        
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = (spinRotation * easeOut * Math.PI) / 180;
        drawWheel(ctx, centerX, centerY, radius, currentRotation);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Calculate winning prize (adjusted for top pointer)
            const sliceAngle = (2 * Math.PI) / wheelPrizes.length;
            const normalizedRotation = currentRotation % (2 * Math.PI);
            // Pointer is at top (90 degrees = PI/2), so we adjust the calculation
            const adjustedRotation = (normalizedRotation + Math.PI / 2) % (2 * Math.PI);
            const prizeIndex = Math.floor((2 * Math.PI - adjustedRotation) / sliceAngle) % wheelPrizes.length;
            
            const wonPrize = wheelPrizes[prizeIndex];
            showWheelResult(wonPrize);
            
            // Remove the won prize from the array
            wheelPrizes.splice(prizeIndex, 1);
            updatePrizesList();
            initializeWheel();
            
            isSpinning = false;
            button.disabled = false;
            button.textContent = wheelPrizes.length > 0 ? 'SPIN AGAIN' : 'ADD PRIZES TO SPIN';
        }
    }
    
    animate();
}

// Show wheel result
function showWheelResult(prize) {
    const resultDiv = document.getElementById('wheel-result');
    const prizeDiv = document.getElementById('result-prize');
    
    if (!resultDiv || !prizeDiv) return;
    
    prizeDiv.textContent = prize;
    resultDiv.style.display = 'block';
    
    addSpinHistory(prize);
    showNotification(`You won: ${prize}! 🎉`, 'success');
    
    // Celebration effect for special prizes
    if (prize.toLowerCase().includes('grand') || 
        prize.toLowerCase().includes('jackpot') ||
        prize.toLowerCase().includes('$100')) {
        setTimeout(() => {
            if (typeof showCelebration === 'function') {
                showCelebration();
            }
        }, 300);
    }
}

// Add to spin history
function addSpinHistory(prize) {
    spinHistory.unshift({
        prize: prize,
        time: new Date().toLocaleTimeString()
    });
    
    if (spinHistory.length > 5) spinHistory = spinHistory.slice(0, 5);
    
    const historyDiv = document.getElementById('spin-history');
    if (!historyDiv) return;
    
    if (spinHistory.length === 0) {
        historyDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No spins yet</p>';
        return;
    }
    
    historyDiv.innerHTML = spinHistory.map(item => `
        <div class="history-item">
            <span>${item.prize}</span>
            <span>${item.time}</span>
        </div>
    `).join('');
}

// Initialize wheel when page loads
if (document.getElementById('wheel-canvas')) {
    document.addEventListener('DOMContentLoaded', function() {
        initializeWheel();
        updatePrizesList();
    });
}

/* ====================================================================
   STOPWATCH
   ==================================================================== */
let stopwatchInterval;
let stopwatchTime = 0;
let isRunning = false;
let laps = [];

function startStopwatch() {
    const startBtn = document.getElementById('start-btn');
    const lapBtn = document.getElementById('lap-btn');
    
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'Pause';
        startBtn.classList.remove('btn-primary');
        startBtn.classList.add('btn-outline');
        lapBtn.disabled = false;
        
        stopwatchInterval = setInterval(() => {
            stopwatchTime += 10;
            updateStopwatchDisplay();
        }, 10);
    } else {
        isRunning = false;
        startBtn.textContent = 'Resume';
        startBtn.classList.add('btn-primary');
        startBtn.classList.remove('btn-outline');
        clearInterval(stopwatchInterval);
    }
}

function updateStopwatchDisplay() {
    const display = document.getElementById('stopwatch-display');
    const hours = Math.floor(stopwatchTime / 3600000);
    const minutes = Math.floor((stopwatchTime % 3600000) / 60000);
    const seconds = Math.floor((stopwatchTime % 60000) / 1000);
    const milliseconds = stopwatchTime % 1000;
    
    display.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

function pad(num, size = 2) {
    return String(num).padStart(size, '0');
}

function lapStopwatch() {
    if (!isRunning && stopwatchTime === 0) return;
    
    laps.unshift({
        number: laps.length + 1,
        time: stopwatchTime
    });
    
    updateLapsDisplay();
    showNotification('Lap recorded', 'success');
}

function updateLapsDisplay() {
    const container = document.getElementById('laps-container');
    const lapsList = document.getElementById('laps-list');
    
    container.style.display = 'block';
    
    lapsList.innerHTML = laps.map(lap => {
        const hours = Math.floor(lap.time / 3600000);
        const minutes = Math.floor((lap.time % 3600000) / 60000);
        const seconds = Math.floor((lap.time % 60000) / 1000);
        const milliseconds = lap.time % 1000;
        
        return `
            <div class="lap-item">
                <span class="lap-number">Lap ${lap.number}</span>
                <span class="lap-time">${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}</span>
            </div>
        `;
    }).join('');
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    isRunning = false;
    laps = [];
    
    updateStopwatchDisplay();
    
    const startBtn = document.getElementById('start-btn');
    const lapBtn = document.getElementById('lap-btn');
    const container = document.getElementById('laps-container');
    
    startBtn.textContent = 'Start';
    startBtn.classList.add('btn-primary');
    startBtn.classList.remove('btn-outline');
    lapBtn.disabled = true;
    container.style.display = 'none';
    
    showNotification('Stopwatch reset', 'info');
}

/* ====================================================================
   STUDENT MANAGEMENT SYSTEM
   ==================================================================== */
let students = [];
let editingStudentId = null;

function addStudent(event) {
    event.preventDefault();
    
    const id = document.getElementById('student-id').value.trim();
    const fname = document.getElementById('student-fname').value.trim();
    const lname = document.getElementById('student-lname').value.trim();
    const mname = document.getElementById('student-mname').value.trim().toUpperCase();
    const gender = document.getElementById('student-gender').value;
    const age = parseInt(document.getElementById('student-age').value);
    const contact = document.getElementById('student-contact').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const course = document.getElementById('student-course').value.trim();
    
    if (!id || !fname || !lname || !gender || !age || !contact || !email || !course) {
        showNotification('Please fill all required fields correctly', 'error');
        return;
    }
    
    if (students.some(s => s.id === id && s.uniqueId !== editingStudentId)) {
        showNotification('Student ID already exists', 'error');
        return;
    }
    
    if (editingStudentId) {
        const index = students.findIndex(s => s.uniqueId === editingStudentId);
        students[index] = { 
            ...students[index], 
            id, fname, lname, mname, gender, age, contact, email, course,
            dateModified: new Date().toLocaleDateString()
        };
        editingStudentId = null;
        showNotification('Student updated successfully', 'success');
    } else {
        students.push({
            uniqueId: Date.now(),
            id, fname, lname, mname, gender, age, contact, email, course,
            dateAdded: new Date().toLocaleDateString()
        });
        showNotification('Student added successfully', 'success');
    }
    
    document.getElementById('student-form').reset();
    document.getElementById('form-title').textContent = 'Add New Student';
    document.getElementById('submit-btn').textContent = 'Add Student';
    document.getElementById('cancel-btn').style.display = 'none';
    displayStudents();
}

function displayStudents(filteredStudents = null) {
    const tbody = document.getElementById('students-list');
    const countSpan = document.getElementById('student-count');
    const studentsToDisplay = filteredStudents || students;
    
    countSpan.textContent = `${studentsToDisplay.length} student${studentsToDisplay.length !== 1 ? 's' : ''}`;
    
    if (studentsToDisplay.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 3rem;">No students found</td></tr>';
        return;
    }
    
    tbody.innerHTML = studentsToDisplay.map(student => `
        <tr class="student-row">
            <td><strong>${student.id}</strong></td>
            <td>${student.fname}</td>
            <td>${student.lname}</td>
            <td>${student.mname || '-'}</td>
            <td>${student.gender}</td>
            <td>${student.age}</td>
            <td>${student.contact}</td>
            <td>${student.email}</td>
            <td><span class="course-badge">${student.course}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" onclick="editStudent(${student.uniqueId})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteStudent(${student.uniqueId})" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editStudent(uniqueId) {
    const student = students.find(s => s.uniqueId === uniqueId);
    if (!student) return;
    
    document.getElementById('student-id').value = student.id;
    document.getElementById('student-fname').value = student.fname;
    document.getElementById('student-lname').value = student.lname;
    document.getElementById('student-mname').value = student.mname || '';
    document.getElementById('student-gender').value = student.gender;
    document.getElementById('student-age').value = student.age;
    document.getElementById('student-contact').value = student.contact;
    document.getElementById('student-email').value = student.email;
    document.getElementById('student-course').value = student.course;
    
    editingStudentId = uniqueId;
    document.getElementById('form-title').textContent = 'Edit Student';
    document.getElementById('submit-btn').textContent = 'Update Student';
    document.getElementById('cancel-btn').style.display = 'inline-block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Editing student record', 'info');
}

function cancelEdit() {
    editingStudentId = null;
    document.getElementById('student-form').reset();
    document.getElementById('form-title').textContent = 'Add New Student';
    document.getElementById('submit-btn').textContent = 'Add Student';
    document.getElementById('cancel-btn').style.display = 'none';
    showNotification('Edit cancelled', 'info');
}

function deleteStudent(uniqueId) {
    const student = students.find(s => s.uniqueId === uniqueId);
    if (!student) return;
    
    if (!confirm(`Are you sure you want to delete ${student.fname} ${student.lname}?`)) return;
    
    students = students.filter(s => s.uniqueId !== uniqueId);
    displayStudents();
    showNotification('Student deleted successfully', 'success');
}

function searchStudents() {
    const query = document.getElementById('search-student').value.toLowerCase().trim();
    
    if (!query) {
        displayStudents();
        return;
    }
    
    const filtered = students.filter(s => 
        s.id.toLowerCase().includes(query) || 
        s.fname.toLowerCase().includes(query) ||
        s.lname.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.course.toLowerCase().includes(query)
    );
    
    displayStudents(filtered);
}

/* ====================================================================
   TO-DO LIST
   ==================================================================== */
let todos = [];
let currentFilter = 'all';

function addTodo(event) {
    event.preventDefault();
    
    const input = document.getElementById('todo-input');
    const priority = document.getElementById('todo-priority').value;
    const text = input.value.trim();
    
    if (!text) {
        showNotification('Please enter a task', 'error');
        return;
    }
    
    todos.push({
        id: Date.now(),
        text: text,
        priority: priority,
        completed: false,
        createdAt: new Date().toLocaleString()
    });
    
    input.value = '';
    displayTodos();
    updateTodoStats();
    showNotification('Task added successfully!', 'success');
}

function displayTodos() {
    const listDiv = document.getElementById('todo-list');
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }
    
    if (filteredTodos.length === 0) {
        listDiv.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No tasks to show</p>';
        return;
    }
    
    listDiv.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <div class="todo-checkbox" onclick="toggleTodo(${todo.id})">
                ${todo.completed ? '✓' : ''}
            </div>
            <div class="todo-content">
                <div class="todo-text">${todo.text}</div>
                <span class="todo-priority-badge ${todo.priority}">${todo.priority}</span>
            </div>
            <button class="todo-delete" onclick="deleteTodo(${todo.id})">🗑️</button>
        </div>
    `).join('');
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        displayTodos();
        updateTodoStats();
        showNotification(todo.completed ? 'Task completed! 🎉' : 'Task marked as active', 'success');
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    displayTodos();
    updateTodoStats();
    showNotification('Task deleted', 'info');
}

function filterTodos(filter) {
    currentFilter = filter;
    
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    displayTodos();
}

function updateTodoStats() {
    const total = todos.length;
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;
    
    document.getElementById('total-tasks').textContent = total;
    document.getElementById('active-tasks').textContent = active;
    document.getElementById('completed-tasks').textContent = completed;
}

function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    
    if (completedCount === 0) {
        showNotification('No completed tasks to clear', 'info');
        return;
    }
    
    if (!confirm(`Delete ${completedCount} completed task(s)?`)) return;
    
    todos = todos.filter(t => !t.completed);
    displayTodos();
    updateTodoStats();
    showNotification('Completed tasks cleared', 'success');
}

/* ====================================================================
   PAGE-SPECIFIC INITIALIZATION
   ==================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery if on gallery page
    if (document.getElementById('photo-gallery')) {
        initializeGallery();
    }
    
    // Initialize wheel if on wheel page
    if (document.getElementById('wheel-canvas')) {
        initializeWheel();
    }
    
    // Initialize student list if on student management page
    if (document.getElementById('student-table')) {
        displayStudents();
    }
    
    // Initialize todo list if on todo page
    if (document.getElementById('todo-list')) {
        displayTodos();
        updateTodoStats();
    }
    
    // Initialize stopwatch display
    if (document.getElementById('stopwatch-display')) {
        updateStopwatchDisplay();
    }
});

/* ====================================================================
   CONSOLE LOG - INITIALIZATION COMPLETE
   ==================================================================== */
console.log('✨ Modern Portfolio JavaScript loaded successfully!');
console.log('🎨 Theme: Enhanced Dark with Vibrant Accents');
console.log('🚀 All features initialized and ready!');
