// Speech-to-Text (STT) Functionality
class SpeechToText {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.isEnabled = false;
        this.continuous = false;
        this.interimResults = true;
        this.maxAlternatives = 1;
        this.language = 'en-US';
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.initRecognition();
        this.bindEvents();
    }

    initRecognition() {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.configureRecognition();
        } else {
            console.warn('Speech recognition not supported in this browser');
            this.disableSTT();
        }
    }

    configureRecognition() {
        if (!this.recognition) return;

        this.recognition.continuous = this.continuous;
        this.recognition.interimResults = this.interimResults;
        this.recognition.maxAlternatives = this.maxAlternatives;
        this.recognition.lang = this.language;

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateToggleButton();
            this.showNotification('Listening... Speak now.');
            this.showListeningIndicator();
        };

        this.recognition.onresult = (event) => {
            this.handleRecognitionResult(event);
        };

        this.recognition.onerror = (event) => {
            this.handleRecognitionError(event);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateToggleButton();
            this.hideListeningIndicator();
            
            if (this.isEnabled && this.continuous) {
                // Restart recognition for continuous mode
                setTimeout(() => {
                    this.startListening();
                }, 100);
            }
        };
    }

    bindEvents() {
        const sttToggle = document.getElementById('stt-toggle');
        
        if (sttToggle) {
            sttToggle.addEventListener('click', () => this.toggleSTT());
            
            // Add keyboard shortcut (Ctrl/Cmd + S)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    e.preventDefault();
                    this.toggleSTT();
                }
            });
        }

        // Add voice commands
        this.addVoiceCommands();
    }

    toggleSTT() {
        if (!this.recognition) {
            this.showNotification('Speech recognition not supported in this browser.');
            return;
        }

        this.isEnabled = !this.isEnabled;
        
        if (this.isEnabled) {
            this.enableSTT();
        } else {
            this.disableSTT();
        }
        
        this.saveSettings();
        this.updateToggleButton();
    }

    enableSTT() {
        this.isEnabled = true;
        this.showNotification('Speech-to-text enabled. Click the microphone button to start listening.');
        this.addVoiceCommands();
    }

    disableSTT() {
        this.isEnabled = false;
        this.stopListening();
        this.showNotification('Speech-to-text disabled.');
        this.removeVoiceCommands();
    }

    startListening() {
        if (!this.isEnabled || !this.recognition || this.isListening) return;

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showNotification('Error starting speech recognition. Please try again.');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    handleRecognitionResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Process final results
        if (finalTranscript) {
            this.processVoiceCommand(finalTranscript.trim());
            this.showNotification(`Recognized: "${finalTranscript}"`);
        }

        // Show interim results
        if (interimTranscript) {
            this.showInterimResult(interimTranscript);
        }
    }

    handleRecognitionError(event) {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = 'Speech recognition error.';
        
        switch (event.error) {
            case 'no-speech':
                errorMessage = 'No speech detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'Audio capture error. Please check your microphone.';
                break;
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage = 'Network error. Please check your internet connection.';
                break;
            case 'service-not-allowed':
                errorMessage = 'Speech recognition service not allowed.';
                break;
        }
        
        this.showNotification(errorMessage);
        this.isListening = false;
        this.updateToggleButton();
        this.hideListeningIndicator();
    }

    processVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Navigation commands
        if (lowerCommand.includes('go to') || lowerCommand.includes('navigate to')) {
            if (lowerCommand.includes('home')) {
                this.navigateToPage('index.html');
            } else if (lowerCommand.includes('about')) {
                this.navigateToPage('about.html');
            } else if (lowerCommand.includes('projects')) {
                this.navigateToPage('projects.html');
            } else if (lowerCommand.includes('skills')) {
                this.navigateToPage('skills.html');
            } else if (lowerCommand.includes('contact')) {
                this.navigateToPage('contact.html');
            }
        }
        
        // Theme commands
        else if (lowerCommand.includes('theme') || lowerCommand.includes('color')) {
            if (lowerCommand.includes('dark') || lowerCommand.includes('night')) {
                this.changeTheme('dark');
            } else if (lowerCommand.includes('light') || lowerCommand.includes('day')) {
                this.changeTheme('light');
            } else if (lowerCommand.includes('high contrast')) {
                this.changeTheme('high-contrast');
            } else if (lowerCommand.includes('blue')) {
                this.changeTheme('blue');
            } else if (lowerCommand.includes('green')) {
                this.changeTheme('green');
            } else if (lowerCommand.includes('purple')) {
                this.changeTheme('purple');
            }
        }
        
        // TTS commands
        else if (lowerCommand.includes('read') || lowerCommand.includes('speak')) {
            if (lowerCommand.includes('page') || lowerCommand.includes('everything')) {
                if (window.tts) {
                    window.tts.readPage();
                }
            } else if (lowerCommand.includes('stop')) {
                if (window.tts) {
                    window.tts.stopSpeaking();
                }
            }
        }
        
        // Accessibility commands
        else if (lowerCommand.includes('font') || lowerCommand.includes('text size')) {
            if (lowerCommand.includes('bigger') || lowerCommand.includes('increase')) {
                if (window.accessibilityManager) {
                    window.accessibilityManager.increaseFontSize();
                }
            } else if (lowerCommand.includes('smaller') || lowerCommand.includes('decrease')) {
                if (window.accessibilityManager) {
                    window.accessibilityManager.decreaseFontSize();
                }
            } else if (lowerCommand.includes('reset') || lowerCommand.includes('normal')) {
                if (window.accessibilityManager) {
                    window.accessibilityManager.resetFontSize();
                }
            }
        }
        
        // General commands
        else if (lowerCommand.includes('help')) {
            this.showHelp();
        } else if (lowerCommand.includes('stop listening') || lowerCommand.includes('stop recognition')) {
            this.stopListening();
        } else if (lowerCommand.includes('start listening') || lowerCommand.includes('start recognition')) {
            this.startListening();
        }
        
        // Search functionality
        else if (lowerCommand.includes('search for') || lowerCommand.includes('find')) {
            const searchTerm = command.replace(/search for|find/i, '').trim();
            this.performSearch(searchTerm);
        }
    }

    navigateToPage(page) {
        window.location.href = page;
    }

    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        this.showNotification(`Theme changed to ${theme}`);
    }

    performSearch(searchTerm) {
        // Implement search functionality
        this.showNotification(`Searching for: ${searchTerm}`);
        // You can implement actual search logic here
    }

    showHelp() {
        const helpText = `
            Available voice commands:
            - "Go to home/about/projects/skills/contact"
            - "Theme dark/light/high contrast/blue/green/purple"
            - "Read page" or "Read everything"
            - "Stop reading"
            - "Font bigger/smaller/reset"
            - "Search for [term]"
            - "Help"
            - "Stop listening"
        `;
        
        this.showNotification(helpText);
    }

    addVoiceCommands() {
        // Add visual indicators for voice commands
        const voiceCommandIndicator = document.createElement('div');
        voiceCommandIndicator.id = 'voice-command-indicator';
        voiceCommandIndicator.className = 'sr-only';
        voiceCommandIndicator.setAttribute('aria-live', 'polite');
        document.body.appendChild(voiceCommandIndicator);
    }

    removeVoiceCommands() {
        const indicator = document.getElementById('voice-command-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    showListeningIndicator() {
        // Create or update listening indicator
        let indicator = document.getElementById('listening-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'listening-indicator';
            indicator.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
            
            Object.assign(indicator.style, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--accent-color)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: '10000',
                animation: 'pulse 1.5s infinite'
            });
            
            document.body.appendChild(indicator);
        }
        
        indicator.style.display = 'block';
    }

    hideListeningIndicator() {
        const indicator = document.getElementById('listening-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    showInterimResult(text) {
        let interimDisplay = document.getElementById('interim-result');
        
        if (!interimDisplay) {
            interimDisplay = document.createElement('div');
            interimDisplay.id = 'interim-result';
            
            Object.assign(interimDisplay.style, {
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                maxWidth: '300px',
                zIndex: '10000',
                border: '1px solid var(--border-color)'
            });
            
            document.body.appendChild(interimDisplay);
        }
        
        interimDisplay.textContent = text;
        interimDisplay.style.display = 'block';
        
        // Hide after 3 seconds
        setTimeout(() => {
            interimDisplay.style.display = 'none';
        }, 3000);
    }

    updateToggleButton() {
        const sttToggle = document.getElementById('stt-toggle');
        const icon = sttToggle?.querySelector('i');
        
        if (sttToggle && icon) {
            if (this.isListening) {
                icon.className = 'fas fa-microphone-slash';
                sttToggle.setAttribute('aria-label', 'Stop listening');
                sttToggle.style.color = 'var(--accent-color)';
            } else if (this.isEnabled) {
                icon.className = 'fas fa-microphone';
                sttToggle.setAttribute('aria-label', 'Start listening for voice commands');
                sttToggle.style.color = 'var(--primary-color)';
            } else {
                icon.className = 'fas fa-microphone-slash';
                sttToggle.setAttribute('aria-label', 'Enable speech-to-text');
                sttToggle.style.color = 'var(--text-secondary)';
            }
        }
    }

    // Settings management
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('stt-settings') || '{}');
            this.isEnabled = settings.isEnabled || false;
            this.continuous = settings.continuous || false;
            this.language = settings.language || 'en-US';
        } catch (error) {
            console.error('Error loading STT settings:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                isEnabled: this.isEnabled,
                continuous: this.continuous,
                language: this.language
            };
            localStorage.setItem('stt-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving STT settings:', error);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'stt-notification';
        notification.textContent = message;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'var(--secondary-color)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            transform: 'translateY(-100%)',
            transition: 'transform 0.3s ease',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px',
            whiteSpace: 'pre-line'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Click handler for toggle button
    handleToggleClick() {
        if (this.isListening) {
            this.stopListening();
        } else if (this.isEnabled) {
            this.startListening();
        }
    }
}

// Initialize STT when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.stt = new SpeechToText();
});

// Add pulse animation for listening indicator
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(pulseStyle);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (window.stt && document.hidden) {
        window.stt.stopListening();
    }
});

// Handle beforeunload to stop recognition
window.addEventListener('beforeunload', function() {
    if (window.stt) {
        window.stt.stopListening();
    }
}); 