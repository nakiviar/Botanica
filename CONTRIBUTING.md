# Contributing to Botanica

Welcome! Thank you for your interest in contributing to Botanica, a plant enthusiast's digital garden for collecting, organizing, and tracking plants entirely in the browser.

We appreciate all contributions, whether they're bug reports, feature suggestions, documentation improvements, or code enhancements. This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Overview](#project-overview)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md) (if available). Please treat all contributors and users with respect and kindness.

## Getting Started

Before you begin contributing, please familiarize yourself with:

1. The [README.md](README.md) file for general project information
2. The project's goals and vision
3. The technology stack used (HTML5, CSS3, JavaScript ES6+, LocalStorage)

## Project Overview

Botanica is a static web application built with vanilla JavaScript that allows plant enthusiasts to:

- Add, view, and organize plant collections
- Upload plant images via drag & drop
- Filter plants by type and search by name/species
- View dashboard statistics
- Store all data locally using browser LocalStorage
- Enjoy a responsive design that works on all devices

The application is completely client-side with no backend dependencies, making it lightweight and easy to deploy.

## Development Setup

Botanica requires no build process or external dependencies. To set up your development environment:

1. Clone or fork the repository
2. Open `index.html` in your web browser
3. Start making changes to the HTML, CSS, or JavaScript files

That's it! Since there's no build process, you can immediately see your changes by refreshing the browser.

## Project Structure

```
Botanica/
├── .github/
│   └── workflows/
├── assets/
│   ├── icons/
│   └── images/
├── scripts/
│   ├── app.js          # Main application logic
│   ├── image-handler.js # Handles image uploads
│   └── plant-manager.js # Manages plant data
├── styles/
│   ├── components.css   # Component-specific styles
│   ├── main.css         # Global styles
│   └── responsive.css   # Responsive breakpoints
├── index.html           # Entry point
├── README.md            # Documentation
└── CONTRIBUTING.md      # This file
```

### Key Files

- **index.html**: The main HTML file containing the UI structure and layout
- **scripts/app.js**: Contains the main `BotanicalApp` class that orchestrates the application
- **scripts/plant-manager.js**: Handles plant data storage, retrieval, and manipulation
- **scripts/image-handler.js**: Manages image uploading, validation, and preview
- **styles/main.css**: Global styling and CSS variables
- **styles/components.css**: Styles for specific UI components
- **styles/responsive.css**: Media queries for responsive design

## How to Contribute

There are many ways to contribute to Botanica:

### Reporting Bugs

Before submitting a bug report:

1. Check if the issue has already been reported
2. Try to reproduce the issue in a fresh environment
3. Include detailed steps to reproduce the problem

When reporting bugs, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information

### Suggesting Enhancements

Feature requests are welcome! When suggesting enhancements:

1. Check if the feature has already been requested
2. Provide a clear explanation of the proposed feature
3. Explain why this feature would be beneficial
4. Include examples or mockups if possible

### Contributing Code

To contribute code to Botanica:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Test thoroughly
5. Commit your changes with a descriptive commit message
6. Push to your fork
7. Submit a pull request

## Coding Standards

To maintain code quality and consistency, please follow these guidelines:

### JavaScript

- Use ES6+ features where appropriate
- Write modular, reusable code
- Comment complex logic
- Use descriptive variable and function names
- Follow existing code patterns in the project
- Maintain the class-based architecture

Example:
```javascript
// Good
class PlantManager {
  addPlant(plantData) {
    // Implementation
  }
}

// Bad
function add_plant(data) {
  // Implementation
}
```

### HTML

- Use semantic HTML elements
- Maintain proper indentation
- Use descriptive IDs and classes
- Follow accessibility best practices

### CSS

- Use the existing CSS variables for consistency
- Follow the BEM naming convention where possible
- Organize styles logically
- Use responsive units (rem, %, vh/vw) where appropriate

### Git Commit Messages

- Use clear, concise commit messages
- Begin with a capital letter
- Use present tense ("Add feature" not "Added feature")
- Reference issue numbers when applicable

Example:
```
Add dark mode toggle functionality

- Implement theme switching between light/dark modes
- Persist user preference in localStorage
- Update CSS variables for dark theme colors

Resolves #123
```

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Test your changes thoroughly across different browsers if possible
3. Update documentation if you've changed functionality
4. Write clear, descriptive pull request titles and descriptions
5. Link to any relevant issues
6. Be responsive to feedback during the review process

### Pull Request Guidelines

- Keep PRs focused on a single feature or bug fix
- Include a clear description of what changed and why
- Add screenshots for UI changes
- Ensure all checks pass before merging
- Request reviews from maintainers

## Reporting Issues

To report an issue:

1. Check existing issues to avoid duplicates
2. Use a clear, descriptive title
3. Describe the exact steps to reproduce the problem
4. Include expected vs actual behavior
5. Mention your browser version and operating system
6. Add relevant labels (bug, enhancement, etc.)

## Community

We encourage a welcoming and supportive community around Botanica. Feel free to:

- Ask questions in issues
- Help other users
- Share your plant collections using the app
- Contribute to discussions

Thank you for contributing to Botanica and helping plant lovers everywhere!