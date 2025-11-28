# Frontend Scaffold

**A clean, minimal starting point for web applications**

A frontend-only scaffold with pure HTML, CSS, and JavaScript. No build tools, no frameworks - just clean code ready to connect to any backend.

> 🚀 **Open Source** - Licensed under MIT. Perfect for learning, prototyping, or rapid development.

## ✨ Key Features

### 📁 Clean Structure
- **Organized Folders** - Separate HTML, CSS, and JavaScript for easy maintenance
- **Multiple Pages** - Home, Features, About, and Contact pages included
- **Static Files** - No build process required - just open in a browser

### 🎨 Modern Styling
- **CSS Reset** - Consistent base styles across all browsers
- **CSS Variables** - Easy theming with custom properties
- **Responsive Design** - Mobile-first approach with flexible layouts
- **Modern Aesthetics** - Gradients, shadows, and smooth animations

### ⚡ Simple Navigation
- **Hash-based Routing** - Client-side page switching without full reloads
- **Active States** - Automatic highlighting of current page
- **Smooth Transitions** - Pleasant user experience with CSS animations

### 🔌 Backend Ready
- **Integration Hooks** - Pre-built placeholders for API calls
- **Form Handling** - Example contact form with submission logic
- **Extensible** - Easy to add authentication, data fetching, and more

## 📁 Folder Structure
```
project/
├── frontend/                  # Frontend scaffold
│   ├── html/                  # HTML pages
│   │   ├── index.html         # Homepage
│   │   ├── features.html      # Features page
│   │   ├── about.html         # About page
│   │   └── contact.html       # Contact page
│   ├── css/                   # Stylesheets
│   │   └── styles.css         # Main styles with CSS reset
│   └── js/                    # JavaScript
│       └── app.js             # Navigation and backend hooks
├── docs/                      # Documentation (for reference only)
└── README.md                  # This file
```

## 🎨 Styling with CSS Variables

The scaffold uses CSS custom properties (variables) for easy theming:

```css
:root {
  /* Colors */
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-accent: #f093fb;
  --color-text: #2d3748;
  --color-background: #ffffff;
  
  /* Spacing */
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  
  /* Other design tokens... */
}
```

**Customization:**
1. Open `frontend/css/styles.css`
2. Modify the `:root` variables to match your brand
3. Changes apply globally across all pages

## 🏁 Getting Started

### Option 1: Open Directly (No Server Required)

1. **Clone or download this repository**

   ```bash
   git clone https://github.com/anyx-app/make-me-a-web-app-keep-track-of-phy-f0015.git
   cd make-me-a-web-app-keep-track-of-phy-f0015
   ```

2. **Open in your browser**

   Simply open `frontend/html/index.html` in your web browser!
   
   ```bash
   # macOS
   open frontend/html/index.html
   
   # Linux
   xdg-open frontend/html/index.html
   
   # Windows
   start frontend/html/index.html
   ```

### Option 2: Use a Local Development Server

For better CORS handling and more realistic testing:

```bash
# Using Python
cd frontend/html
python -m http.server 8000

# Using Node.js (npx)
npx http-server frontend/html -p 8000

# Using PHP
cd frontend/html
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 🔌 Integrating Your Backend

The scaffold includes placeholder functions in `frontend/js/app.js` for backend integration:

### Configuration

Update the backend URL in `app.js`:

```javascript
const APP_CONFIG = {
    backendUrl: 'https://your-backend-api.com',
    // ... other config
};
```

### Available Hooks

#### 1. Application Initialization

```javascript
async function onInit() {
    // Called when the app loads
    // Use for: authentication check, loading user data, etc.
    const user = await fetchFromBackend('/api/user');
}
```

#### 2. Navigation Events

```javascript
function onNavigate(page) {
    // Called when user navigates to a new page
    // Use for: analytics, page-specific data loading
    console.log('User visited:', page);
}
```

#### 3. Fetching from Backend

```javascript
async function fetchFromBackend(endpoint, options = {}) {
    // Wrapper for fetch with authentication headers
    const response = await fetch(`${APP_CONFIG.backendUrl}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
            ...options.headers
        }
    });
    return await response.json();
}
```

### Example: Contact Form Integration

The contact form in `contact.html` includes a submission handler:

```javascript
async function handleContactFormSubmit(event) {
    event.preventDefault();
    const formData = {
        name: event.target.name.value,
        email: event.target.email.value,
        message: event.target.message.value
    };
    
    // Replace placeholder with your API call
    await fetchFromBackend('/api/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
    });
}
```

### Authentication Example

```javascript
// Store token after login
function login(token) {
    setAuthToken(token);
    // Redirect or update UI
}

// Check authentication on init
async function onInit() {
    const token = getAuthToken();
    if (token) {
        // Fetch user data
        const user = await fetchFromBackend('/api/user');
    } else {
        // Redirect to login
        navigateTo('login');
    }
}
```

## 📝 Adding New Pages

Adding pages is straightforward with this scaffold:

### 1. Create a New HTML File

Create your page in `frontend/html/`:

```html
<!-- frontend/html/services.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Services - Frontend Scaffold</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <div class="page-container">
        <header class="site-header">
            <nav class="nav-bar">
                <div class="nav-brand">
                    <h1 class="logo">Frontend Scaffold</h1>
                </div>
                <ul class="nav-menu">
                    <li><a href="#home" class="nav-link">Home</a></li>
                    <li><a href="#services" class="nav-link active">Services</a></li>
                    <!-- Add other nav links -->
                </ul>
            </nav>
        </header>

        <main id="app-content" class="main-content">
            <h1>Services</h1>
            <p>Your content here...</p>
        </main>

        <footer class="site-footer">
            <p>&copy; 2025 Frontend Scaffold</p>
        </footer>
    </div>

    <script src="../js/app.js"></script>
</body>
</html>
```

### 2. Register the Page in app.js

Add your new page to the `APP_CONFIG.pages` object:

```javascript
const APP_CONFIG = {
    backendUrl: 'https://your-backend-api.com',
    defaultPage: 'home',
    pages: {
        home: 'index.html',
        features: 'features.html',
        about: 'about.html',
        contact: 'contact.html',
        services: 'services.html'  // Add your new page
    }
};
```

### 3. Add Navigation Links

Update all navigation menus to include your new page:

```html
<li><a href="#services" class="nav-link">Services</a></li>
```

That's it! The hash-based routing will handle navigation automatically.

## ⚙️ Customization

### Styling
- **Colors**: Modify CSS variables in `frontend/css/styles.css`
- **Layout**: Adjust spacing, fonts, and responsive breakpoints
- **Components**: Add new CSS classes for your custom components

### JavaScript
- **Add features**: Extend `app.js` with new functions
- **Create modules**: Split code into multiple JS files as needed
- **Add libraries**: Include CDN links in your HTML or download locally

### HTML
- **Modify structure**: Change layouts to fit your needs
- **Add sections**: Create new content areas with semantic HTML
- **Accessibility**: Ensure proper ARIA labels and semantic tags

## 🤝 Contributing

**Frontend Scaffold is an open-source project!** We welcome contributions from the community.

### How to Contribute

1. **Fork the repository** and create your feature branch from `main`
2. **Make your changes** following the existing code conventions
3. **Test your changes** thoroughly using `pnpm lint && pnpm build`
4. **Commit your changes** with clear, descriptive commit messages
5. **Push to your fork** and submit a pull request

### Contribution Guidelines

- Keep code quality high and follow existing conventions
- Write clear, descriptive commit messages
- Update documentation for any user-facing changes
- Ensure all tests pass before submitting
- Be respectful and constructive in discussions

### Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/anyx-app/make-me-a-web-app-keep-track-of-phy-f0015/issues) with:
- Clear description of the issue or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

### Code of Conduct

This is a welcoming community project. Please be respectful, inclusive, and professional in all interactions.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 📚 Additional Documentation

The `docs/` directory contains comprehensive guides for React-based development (for reference if you decide to migrate from the vanilla HTML/CSS/JS scaffold to a framework-based approach).

