 // Text-to-Speech (TTS) Functionality
class TextToSpeech {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.utterance = null;
        this.isSpeaking = false;
        this.isEnabled = false;
        this.voice = null;
        this.rate = 1.0;
        this.pitch = 1.0;
        this.volume = 1.0;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.loadVoices();
        
        // Handle voice loading
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    bindEvents() {
        const ttsToggle = document.getElementById('tts-toggle');
        
        if (ttsToggle) {
            ttsToggle.addEventListener('click', () => this.toggleTTS());
            
            // Add keyboard shortcut (Ctrl/Cmd + T)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                    e.preventDefault();
                    this.toggleTTS();
                }
            });
        }

        // Add click listeners to text elements for reading
        this.addTextListeners();
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        // Try to find a preferred voice
        this.voice = this.voices.find(voice => 
            voice.lang.includes('en') && voice.default
        ) || this.voices.find(voice => 
            voice.lang.includes('en')
        ) || this.voices[0];
    }

    toggleTTS() {
        this.isEnabled = !this.isEnabled;
        
        if (this.isEnabled) {
            this.enableTTS();
        } else {
            this.disableTTS();
        }
        
        this.saveSettings();
        this.updateToggleButton();
    }

    enableTTS() {
        this.isEnabled = true;
        this.showNotification('Text-to-speech enabled. Click on any text to hear it read aloud.');
        this.addTextListeners();
    }

    disableTTS() {
        this.isEnabled = false;
        this.stopSpeaking();
        this.showNotification('Text-to-speech disabled.');
        this.removeTextListeners();
    }

    addTextListeners() {
        if (!this.isEnabled) return;

        // Remove existing listeners first
        this.removeTextListeners();

        // Add listeners to headings, paragraphs, and other text elements
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, span, a');
        
        textElements.forEach(element => {
            if (!element.hasAttribute('data-tts-listener')) {
                element.setAttribute('data-tts-listener', 'true');
                element.style.cursor = 'pointer';
                
                element.addEventListener('click', (e) => {
                    if (this.isEnabled && !e.target.closest('button, a')) {
                        e.preventDefault();
                        this.speakText(element.textContent.trim());
                    }
                });

                element.addEventListener('mouseenter', () => {
                    if (this.isEnabled) {
                        element.style.textDecoration = 'underline';
                        element.style.textDecorationColor = 'var(--primary-color)';
                    }
                });

                element.addEventListener('mouseleave', () => {
                    if (this.isEnabled) {
                        element.style.textDecoration = 'none';
                    }
                });
            }
        });
    }

    removeTextListeners() {
        const textElements = document.querySelectorAll('[data-tts-listener]');
        
        textElements.forEach(element => {
            element.removeAttribute('data-tts-listener');
            element.style.cursor = '';
            element.style.textDecoration = '';
            
            // Remove event listeners by cloning and replacing
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });
    }

    speakText(text) {
        if (!this.isEnabled || !text || this.isSpeaking) return;

        // Stop any current speech
        this.stopSpeaking();

        // Create new utterance
        this.utterance = new SpeechSynthesisUtterance(text);
        
        // Configure utterance
        this.utterance.voice = this.voice;
        this.utterance.rate = this.rate;
        this.utterance.pitch = this.pitch;
        this.utterance.volume = this.volume;
        
        // Event handlers
        this.utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateToggleButton();
            this.showNotification('Reading text...');
        };
        
        this.utterance.onend = () => {
            this.isSpeaking = false;
            this.updateToggleButton();
        };
        
        this.utterance.onerror = (event) => {
            this.isSpeaking = false;
            this.updateToggleButton();
            console.error('Speech synthesis error:', event.error);
            this.showNotification('Error reading text. Please try again.');
        };

        // Speak the text
        this.synthesis.speak(this.utterance);
    }

    stopSpeaking() {
        if (this.isSpeaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            this.updateToggleButton();
        }
    }

    pauseSpeaking() {
        if (this.isSpeaking) {
            this.synthesis.pause();
        }
    }

    resumeSpeaking() {
        if (this.isSpeaking) {
            this.synthesis.resume();
        }
    }

    updateToggleButton() {
        const ttsToggle = document.getElementById('tts-toggle');
        const icon = ttsToggle?.querySelector('i');
        
        if (ttsToggle && icon) {
            if (this.isSpeaking) {
                icon.className = 'fas fa-stop';
                ttsToggle.setAttribute('aria-label', 'Stop reading');
                ttsToggle.style.color = 'var(--accent-color)';
            } else if (this.isEnabled) {
                icon.className = 'fas fa-volume-up';
                ttsToggle.setAttribute('aria-label', 'Text-to-speech enabled. Click to disable.');
                ttsToggle.style.color = 'var(--primary-color)';
            } else {
                icon.className = 'fas fa-volume-mute';
                ttsToggle.setAttribute('aria-label', 'Enable text-to-speech');
                ttsToggle.style.color = 'var(--text-secondary)';
            }
        }
    }

    // Voice selection
    setVoice(voiceName) {
        this.voice = this.voices.find(voice => voice.name === voiceName) || this.voice;
        this.saveSettings();
    }

    // Speed control
    setRate(rate) {
        this.rate = Math.max(0.5, Math.min(2.0, rate));
        this.saveSettings();
    }

    // Pitch control
    setPitch(pitch) {
        this.pitch = Math.max(0.5, Math.min(2.0, pitch));
        this.saveSettings();
    }

    // Volume control
    setVolume(volume) {
        this.volume = Math.max(0.0, Math.min(1.0, volume));
        this.saveSettings();
    }

    // Read entire page
    readPage() {
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent) {
            const text = this.extractReadableText(mainContent);
            this.speakText(text);
        }
    }

    // Extract readable text from element
    extractReadableText(element) {
        let text = '';
        
        // Skip hidden elements
        if (element.style.display === 'none' || element.style.visibility === 'hidden') {
            return text;
        }
        
        // Process child nodes
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent.trim() + ' ';
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Skip script and style elements
                if (!['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.tagName)) {
                    text += this.extractReadableText(node) + ' ';
                }
            }
        });
        
        return text.trim();
    }

    // Read specific section
    readSection(sectionSelector) {
        const section = document.querySelector(sectionSelector);
        if (section) {
            const text = this.extractReadableText(section);
            this.speakText(text);
        }
    }

    // Auto-read on page load (optional)
    autoReadOnLoad() {
        if (this.isEnabled && this.autoRead) {
            setTimeout(() => {
                this.readPage();
            }, 1000);
        }
    }

    // Settings management
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('tts-settings') || '{}');
            this.isEnabled = settings.isEnabled || false;
            this.rate = settings.rate || 1.0;
            this.pitch = settings.pitch || 1.0;
            this.volume = settings.volume || 1.0;
            this.autoRead = settings.autoRead || false;
            
            if (settings.voiceName) {
                // Voice will be set after voices are loaded
                this.pendingVoiceName = settings.voiceName;
            }
        } catch (error) {
            console.error('Error loading TTS settings:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                isEnabled: this.isEnabled,
                rate: this.rate,
                pitch: this.pitch,
                volume: this.volume,
                autoRead: this.autoRead,
                voiceName: this.voice?.name
            };
            localStorage.setItem('tts-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving TTS settings:', error);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'tts-notification';
        notification.textContent = message;
        notification.setAttribute('role', 'status');
        notification.setAttribute('aria-live', 'polite');
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'var(--primary-color)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            transform: 'translateY(-100%)',
            transition: 'transform 0.3s ease',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '300px'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Get available voices
    getAvailableVoices() {
        return this.voices.filter(voice => voice.lang.includes('en'));
    }

    // Create voice selection UI
    createVoiceSelector() {
        const voices = this.getAvailableVoices();
        const selector = document.createElement('select');
        
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (voice.name === this.voice?.name) {
                option.selected = true;
            }
            selector.appendChild(option);
        });
        
        selector.addEventListener('change', (e) => {
            this.setVoice(e.target.value);
        });
        
        return selector;
    }
}

// Initialize TTS when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
        window.tts = new TextToSpeech();
        
        // Auto-read on load if enabled
        setTimeout(() => {
            window.tts.autoReadOnLoad();
        }, 2000);
    } else {
        console.warn('Speech synthesis not supported in this browser');
        
        // Disable TTS button if not supported
        const ttsToggle = document.getElementById('tts-toggle');
        if (ttsToggle) {
            ttsToggle.disabled = true;
            ttsToggle.setAttribute('aria-label', 'Text-to-speech not supported in this browser');
            ttsToggle.style.opacity = '0.5';
        }
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (window.tts && document.hidden) {
        window.tts.stopSpeaking();
    }
});

// Handle beforeunload to stop speech
window.addEventListener('beforeunload', function() {
    if (window.tts) {
        window.tts.stopSpeaking();
    }
});