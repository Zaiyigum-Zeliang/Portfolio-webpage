// Accessibility Features
class AccessibilityManager {
    constructor() {
        this.fontSize = 16; // Base font size in pixels
        this.maxFontSize = 24;
        this.minFontSize = 12;
        this.fontSizeStep = 2;
        this.isHighContrast = false;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.updateAccessibilityPanel();
    }

    bindEvents() {
        // Font size controls
        const increaseFontBtn = document.getElementById('increase-font');
        const decreaseFontBtn = document.getElementById('decrease-font');
        const highContrastBtn = document.getElementById('high-contrast');

        if (increaseFontBtn) {
            increaseFontBtn.addEventListener('click', () => this.increaseFontSize());
        }

        if (decreaseFontBtn) {
            decreaseFontBtn.addEventListener('click', () => this.decreaseFontSize());
        }

        if (highContrastBtn) {
            highContrastBtn.addEventListener('click', () => this.toggleHighContrast());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Plus to increase font size
            if ((e.ctrlKey || e.metaKey) && e.key === '=') {
                e.preventDefault();
                this.increaseFontSize();
            }
            
            // Ctrl/Cmd + Minus to decrease font size
            if ((e.ctrlKey || e.metaKey) && e.key === '-') {
                e.preventDefault();
                this.decreaseFontSize();
            }
            
            // Ctrl/Cmd + 0 to reset font size
            if ((e.ctrlKey || e.metaKey) && e.key === '0') {
                e.preventDefault();
                this.resetFontSize();
            }
        });

        // Accessibility panel toggle
        const accessibilityPanel = document.getElementById('accessibility-panel');
        if (accessibilityPanel) {
            // Show panel on hover
            accessibilityPanel.addEventListener('mouseenter', () => {
                accessibilityPanel.classList.add('show');
            });

            accessibilityPanel.addEventListener('mouseleave', () => {
                accessibilityPanel.classList.remove('show');
            });

            // Show panel on focus for keyboard users
            const accessibilityBtns = accessibilityPanel.querySelectorAll('button');
            accessibilityBtns.forEach(btn => {
                btn.addEventListener('focus', () => {
                    accessibilityPanel.classList.add('show');
                });
            });
        }
    }

    increaseFontSize() {
        if (this.fontSize < this.maxFontSize) {
            this.fontSize += this.fontSizeStep;
            this.applyFontSize();
            this.saveSettings();
            this.showNotification('Font size increased');
        }
    }

    decreaseFontSize() {
        if (this.fontSize > this.minFontSize) {
            this.fontSize -= this.fontSizeStep;
            this.applyFontSize();
            this.saveSettings();
            this.showNotification('Font size decreased');
        }
    }

    resetFontSize() {
        this.fontSize = 16;
        this.applyFontSize();
        this.saveSettings();
        this.showNotification('Font size reset');
    }

    applyFontSize() {
        document.documentElement.style.fontSize = `${this.fontSize}px`;
        this.updateAccessibilityPanel();
    }

    toggleHighContrast() {
        this.isHighContrast = !this.isHighContrast;
        
        if (this.isHighContrast) {
            document.documentElement.setAttribute('data-theme', 'high-contrast');
            this.showNotification('High contrast mode enabled');
        } else {
            // Restore previous theme
            const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.showNotification('High contrast mode disabled');
        }
        
        this.saveSettings();
        this.updateAccessibilityPanel();
    }

    updateAccessibilityPanel() {
        const increaseBtn = document.getElementById('increase-font');
        const decreaseBtn = document.getElementById('decrease-font');
        const highContrastBtn = document.getElementById('high-contrast');

        if (increaseBtn) {
            increaseBtn.disabled = this.fontSize >= this.maxFontSize;
            increaseBtn.setAttribute('aria-label', `Increase font size (current: ${this.fontSize}px)`);
        }

        if (decreaseBtn) {
            decreaseBtn.disabled = this.fontSize <= this.minFontSize;
            decreaseBtn.setAttribute('aria-label', `Decrease font size (current: ${this.fontSize}px)`);
        }

        if (highContrastBtn) {
            highContrastBtn.classList.toggle('active', this.isHighContrast);
            highContrastBtn.setAttribute('aria-label', 
                this.isHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'
            );
        }
    }

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('accessibility-settings') || '{}');
            this.fontSize = settings.fontSize || 16;
            this.isHighContrast = settings.isHighContrast || false;
            
            this.applyFontSize();
            
            if (this.isHighContrast) {
                document.documentElement.setAttribute('data-theme', 'high-contrast');
            }
        } catch (error) {
            console.error('Error loading accessibility settings:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                fontSize: this.fontSize,
                isHighContrast: this.isHighContrast
            };
            localStorage.setItem('accessibility-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving accessibility settings:', error);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'accessibility-notification';
        notification.textContent = message;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'var(--primary-color)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            fontSize: '14px',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Additional accessibility features
    enableReducedMotion() {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-normal', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }

    disableReducedMotion() {
        document.documentElement.style.removeProperty('--transition-fast');
        document.documentElement.style.removeProperty('--transition-normal');
        document.documentElement.style.removeProperty('--transition-slow');
    }

    // Focus indicators
    enhanceFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 3px solid var(--accent-color) !important;
                outline-offset: 2px !important;
            }
            
            button:focus,
            a:focus,
            input:focus,
            textarea:focus,
            select:focus {
                outline: 3px solid var(--accent-color) !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent-color) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Screen reader announcements
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    // Check for reduced motion preference
    checkReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.enableReducedMotion();
        }
    }

    // Initialize focus management
    initFocusManagement() {
        // Trap focus in modals (if any)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modals = document.querySelectorAll('[role="dialog"]');
                modals.forEach(modal => {
                    if (modal.style.display !== 'none') {
                        this.trapFocus(modal, e);
                    }
                });
            }
        });
    }

    trapFocus(element, event) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
}

// Initialize accessibility features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.accessibilityManager = new AccessibilityManager();
    
    // Check for reduced motion preference
    window.accessibilityManager.checkReducedMotion();
    
    // Enhance focus indicators
    window.accessibilityManager.enhanceFocusIndicators();
    
    // Initialize focus management
    window.accessibilityManager.initFocusManagement();

    const accBtn = document.getElementById('accessibility-toggle');
    const accPopup = document.getElementById('accessibility-popup');

    if (accBtn && accPopup) {
        // Show on hover/focus
        accBtn.addEventListener('mouseenter', () => accPopup.classList.add('show'));
        accBtn.addEventListener('focus', () => accPopup.classList.add('show'));
        // Hide on mouseleave/blur
        accBtn.addEventListener('mouseleave', () => accPopup.classList.remove('show'));
        accBtn.addEventListener('blur', () => accPopup.classList.remove('show'));
        // Also show when popup is hovered/focused
        accPopup.addEventListener('mouseenter', () => accPopup.classList.add('show'));
        accPopup.addEventListener('focusin', () => accPopup.classList.add('show'));
        // Hide when mouse leaves popup or focus leaves
        accPopup.addEventListener('mouseleave', () => accPopup.classList.remove('show'));
        accPopup.addEventListener('focusout', (e) => {
            // Only hide if focus moves outside popup and button
            if (!accPopup.contains(e.relatedTarget) && e.relatedTarget !== accBtn) {
                accPopup.classList.remove('show');
            }
        });
    }
});

// Add screen reader only class
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
`;
document.head.appendChild(style); 