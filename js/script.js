// Header scroll behavior
let lastScrollTop = 0;
const header = document.querySelector('header');
const logo = document.getElementById('logo');
const nav = document.getElementById('main-nav');

// Track scroll and toggle header visibility
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop < 50) {
        // At the top: show everything
        logo.classList.remove('invisible');
        logo.classList.add('visible');
        nav.classList.remove('d-none');
        header.classList.remove('scrolled-up');
    } else if (scrollTop < lastScrollTop) {
        // Scrolling up: show header
        header.style.transform = 'translateY(0)';
        logo.classList.remove('invisible');
        logo.classList.add('visible');
        nav.classList.remove('d-none');
        header.classList.add('scrolled-up');
    } else {
        // Scrolling down: hide header
        header.style.transform = 'translateY(-100%)';
        logo.classList.remove('visible');
        logo.classList.add('invisible');
        nav.classList.add('d-none');
        header.classList.add('scrolled-up');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Fade-in animation for sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, {
    threshold: 0.6
});

document.querySelectorAll('.fade-word').forEach(el => {
    observer.observe(el);
});

// ANIMATION FOR SCROLLING TEXT
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('scroll-text');
    if (!container) return;
    
    // Store the original HTML with all formatting and classes
    const originalHTML = container.innerHTML;
    
    // Process the text but preserve special spans with font-pixels class
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    
    // Extract all text nodes and font-pixels spans
    const elements = [];
    
    function extractTextAndSpans(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // For text nodes, split by spaces and create individual words
            const words = node.textContent.trim().split(' ').filter(w => w.length > 0);
            words.forEach(word => {
                elements.push({
                    type: 'text',
                    content: word
                });
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // For element nodes (like spans), preserve the whole element
            if (node.classList && node.classList.contains('font-pixels')) {
                elements.push({
                    type: 'element',
                    content: node.outerHTML
                });
            } else {
                // If it's another element, process its children
                node.childNodes.forEach(child => extractTextAndSpans(child));
            }
        }
    }
    
    // Extract all text and font-pixels spans
    Array.from(tempDiv.childNodes).forEach(node => extractTextAndSpans(node));
    
    // Rebuild the HTML with each word/element in its own span for animation
    container.innerHTML = '';
    elements.forEach((element, index) => {
        const span = document.createElement('span');
        span.classList.add('word');
        
        if (element.type === 'text') {
            span.textContent = element.content + ' ';
        } else if (element.type === 'element') {
            span.innerHTML = element.content + ' ';
        }
        
        container.appendChild(span);
    });
    
    const wordSpans = container.querySelectorAll('.word');
    const leadSection = document.getElementById('lead');
    
    // Calculate the section's position for scroll animation
    function updateWordAnimation() {
        if (!leadSection) return;
        
        const rect = leadSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        
        // Improved progress calculation that doesn't reset
        let progress = 0;
        
        // Calculate how far we've scrolled through the section
        const totalScrollDistance = sectionHeight - viewportHeight;
        const scrolledDistance = Math.abs(sectionTop);
        
        // Calculate progress as a percentage of scrolling through the section
        // This ensures we don't reset when transitioning between different scroll states
        if (sectionTop <= 0 && sectionTop >= -totalScrollDistance) {
            // We're somewhere in the scrolling process
            progress = Math.min(1, scrolledDistance / totalScrollDistance);
        } else if (sectionTop > 0) {
            // Section hasn't been scrolled to yet
            progress = 0;
        } else {
            // We've scrolled completely past the section
            progress = 1;
        }
        
        const wordsToShow = Math.floor(progress * wordSpans.length);
        
        wordSpans.forEach((span, index) => {
            span.classList.toggle('active', index <= wordsToShow);
        });
    }

    // Run on scroll and once at start
    window.addEventListener('scroll', updateWordAnimation);
    updateWordAnimation();
});