# Zaiyigum Zeliang - Portfolio Website

A modern, accessible, and feature-rich portfolio website showcasing the work and skills of Zaiyigum Zeliang, a software developer and designer.

## 🌟 Features

### Core Features
- **Multi-page Design**: Home, About, Projects, Skills, and Contact pages
- **Responsive Layout**: Mobile-first design that works on all devices
- **Theme System**: Light, dark, high contrast, and color themes
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

### Interactive Features
- **Text-to-Speech (TTS)**: Listen to page content with customizable voice settings
- **Speech-to-Text (STT)**: Voice commands and dictation support
- **Keyboard Shortcuts**: Quick access to features via keyboard
- **Font Size Controls**: Adjustable text size for better readability
- **High Contrast Mode**: Enhanced visibility for users with visual impairments

### User Experience
- **Smooth Animations**: CSS transitions and micro-interactions
- **Loading States**: Visual feedback for user interactions
- **Form Validation**: Real-time validation with helpful error messages
- **Project Filtering**: Filter projects by category and technology
- **Skill Animations**: Animated skill bars and progress indicators

## 🎨 Design System

### Color Themes
- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Modern, eye-friendly design
- **High Contrast**: Maximum accessibility
- **Color Themes**: Vibrant, personality-driven options

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace Font**: JetBrains Mono for code and technical content
- **Responsive Sizing**: Scalable font sizes with accessibility controls

### Components
- **Navigation**: Fixed header with smooth scrolling
- **Cards**: Consistent project and skill cards
- **Buttons**: Interactive buttons with hover effects
- **Forms**: Styled contact forms with validation
- **Modals**: Keyboard shortcuts help and accessibility panels

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools required - pure HTML, CSS, and JavaScript

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-website.git
   cd portfolio-website
   ```

2. Open `home.html` in your web browser or serve locally:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Visit `http://localhost:8000/home.html` in your browser

## 📁 Project Structure

```
portfolio-website/
├── home.html               # Home page (was index.html)
├── about.html              # About page
├── projects.html           # Projects page
├── skills.html             # Skills page
├── contact.html            # Contact page
├── css/
│   ├── style.css           # Main stylesheet
│   ├── themes.css          # Theme system
│   └── text-styles.css     # Centralized text styles
├── js/
│   ├── main.js             # Core functionality
│   ├── accessibility.js    # Accessibility features
│   ├── tts.js              # Text-to-speech
│   ├── stt.js              # Speech-to-text
│   ├── projects.js         # Project filtering
│   ├── skills.js           # Skill animations
│   ├── contact.js          # Contact form
│   └── buttons.js          # Centralized button logic
├── assets/                 # Images and media files
├── README.md               # Project documentation
└── .gitignore              # Git ignore rules
```

## 🖼️ Font Awesome Usage

- The project uses [Font Awesome 6](https://fontawesome.com/) via CDN:
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  ```
- Use the new icon class names, e.g.:
  ```html
  <i class="fa-solid fa-moon"></i>
  <i class="fa-solid fa-volume-up"></i>
  <i class="fa-solid fa-microphone"></i>
  <i class="fa-solid fa-universal-access"></i>
  ```
- Make sure the CDN link is placed before your own CSS files for best results.

## 🎯 Customization

### Content Updates
1. **Personal Information**: Update name, title, and contact details in all HTML files
2. **Projects**: Add your projects to `projects.html` with images and descriptions
3. **Skills**: Modify skills and expertise in `skills.html`
4. **About**: Update personal story and experience in `about.html`

### Styling
1. **Colors**: Modify CSS custom properties in `css/style.css`
2. **Themes**: Add new themes in `css/themes.css`
3. **Typography**: Change fonts in CSS variables
4. **Layout**: Adjust grid and flexbox layouts as needed

### Features
1. **TTS/STT**: Configure voice settings in `js/tts.js` and `js/stt.js`
2. **Animations**: Modify transition timings and effects
3. **Accessibility**: Add new accessibility features in `js/accessibility.js`

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Toggle theme |
| `Ctrl/Cmd + T` | Toggle text-to-speech |
| `Ctrl/Cmd + S` | Toggle speech-to-text |
| `Ctrl/Cmd + +` | Increase font size |
| `Ctrl/Cmd + -` | Decrease font size |
| `Ctrl/Cmd + 0` | Reset font size |
| `?` | Show keyboard shortcuts |
| `Escape` | Close modals |

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly navigation
- Optimized performance for mobile devices
- PWA-ready structure

## ♿ Accessibility Features

- **WCAG 2.1 AA Compliance**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast Mode**: Enhanced visibility options
- **Font Size Controls**: Adjustable text sizing
- **Focus Indicators**: Clear focus states for all interactive elements
- **Skip Links**: Quick navigation to main content
- **Alt Text**: Descriptive alt text for all images

## 🔧 Technical Details

### Performance
- Optimized CSS and JavaScript
- Minimal external dependencies
- Efficient DOM manipulation
- Lazy loading for images

### Security
- Form validation and sanitization
- XSS protection
- Secure external links
- Content Security Policy ready

### SEO
- Semantic HTML structure
- Meta tags for social sharing
- Open Graph and Twitter Card support
- Structured data markup ready

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Zaiyigum Zeliang - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/portfolio-website](https://github.com/yourusername/portfolio-website)

## 🙏 Acknowledgments

- [Google Fonts](https://fonts.google.com/) for typography
- [Font Awesome](https://fontawesome.com/) for icons
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for TTS/STT functionality
- [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) and [Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout) for layouts

---

**Note**: This is a template portfolio website. Please customize all content, images, and personal information before deploying to production. 