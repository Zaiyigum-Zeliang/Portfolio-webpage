// Button functionality for Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    // Keyboard Shortcuts Modal Logic
    const shortcutsModal = document.getElementById('keyboard-shortcuts');
    const openShortcutsKeys = ['?']; // Shift+/ on most keyboards
    const closeShortcutsBtn = document.getElementById('close-shortcuts');

    // Open modal with '?' key
    document.addEventListener('keydown', function(e) {
        // Only open if not typing in an input/textarea
        if (
            (e.key === '?' || (e.shiftKey && e.key === '/')) &&
            !e.ctrlKey && !e.metaKey && !e.altKey &&
            document.activeElement.tagName !== 'INPUT' &&
            document.activeElement.tagName !== 'TEXTAREA'
        ) {
            if (shortcutsModal) {
                shortcutsModal.style.display = 'block';
                shortcutsModal.setAttribute('aria-hidden', 'false');
                // Trap focus to modal
                const firstBtn = shortcutsModal.querySelector('button, [tabindex]:not([tabindex="-1"])');
                if (firstBtn) firstBtn.focus();
            }
        }
        // Close modal with Escape
        if (e.key === 'Escape' && shortcutsModal && shortcutsModal.style.display === 'block') {
            shortcutsModal.style.display = 'none';
            shortcutsModal.setAttribute('aria-hidden', 'true');
        }
    });

    // Close modal with close button
    if (closeShortcutsBtn) {
        closeShortcutsBtn.addEventListener('click', function() {
            if (shortcutsModal) {
                shortcutsModal.style.display = 'none';
                shortcutsModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Optionally: Close modal when clicking outside content
    if (shortcutsModal) {
        shortcutsModal.addEventListener('click', function(e) {
            if (e.target === shortcutsModal) {
                shortcutsModal.style.display = 'none';
                shortcutsModal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Add more button logic here as needed
    // Example: If you add more modals or custom buttons, add their logic here
}); 