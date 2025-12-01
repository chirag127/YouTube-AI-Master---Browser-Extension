# Contributing to YouTube-AI-Navigator-Browser-Extension

We are thrilled you're considering contributing to the YouTube-AI-Navigator-Browser-Extension project! Your contributions help us build an apex-grade, privacy-first browser extension for real-time, AI-powered YouTube analysis. This document outlines the guidelines and best practices for contributing.

## 🌟 Code of Conduct

Please note that this project is released with a [Code of Conduct](https://github.com/chirag127/YouTube-AI-Navigator-Browser-Extension/blob/main/CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## 💡 How Can I Contribute?

There are many ways to contribute to this project, not just by writing code:

### 🐛 Reporting Bugs

*   Before submitting a new bug report, please check existing issues to see if the bug has already been reported.
*   If not, open a new issue using our [bug report template](https://github.com/chirag127/YouTube-AI-Navigator-Browser-Extension/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=%5BBug%5D+).
*   Provide a clear and concise description of the bug.
*   Include steps to reproduce, expected behavior, and actual behavior.
*   Specify your environment (browser version, OS, extension version).

### ✨ Suggesting Enhancements

*   We welcome ideas for new features or improvements to existing ones.
*   Before submitting, check existing issues to avoid duplicates.
*   Open a new issue using the appropriate template.
*   Clearly describe the enhancement and its potential benefits.

### 📝 Improving Documentation

*   Documentation is crucial. If you find errors, omissions, or areas for improvement in our `README.md`, `AGENTS.md`, or other `.md` files, please open a pull request.

### 💻 Your First Code Contribution

*   Start by looking for issues labeled `good first issue` or `help wanted`. These are typically simpler tasks that are good for new contributors.
*   Feel free to ask questions on the issue if you need clarification.

## 🚀 Setting Up Your Development Environment

To get started with local development:

1.  **Prerequisites:**
    *   [Node.js](https://nodejs.org/) (LTS version recommended)
    *   [pnpm](https://pnpm.io/installation) (our preferred package manager)
    *   A modern web browser (Chrome, Firefox, Edge, etc.)

2.  **Clone the repository:**
    bash
    git clone https://github.com/chirag127/YouTube-AI-Navigator-Browser-Extension.git
    cd YouTube-AI-Navigator-Browser-Extension
    

3.  **Install dependencies:**
    bash
    pnpm install
    

4.  **Start development server:**
    This command will build the extension and watch for changes, automatically reloading the extension in your browser after modifications.
    bash
    pnpm dev
    
    Follow the instructions provided by WXT to load the unpacked extension in your browser.

## 🏗️ Project Architecture & Technologies

This project adheres to a **Feature-Sliced Design (FSD)** architecture, promoting modularity, reusability, and maintainability.

**Key Technologies:**

*   **TypeScript 6.x (Strict Mode):** For robust, type-safe code.
*   **WXT Framework:** Powers our browser extension development, offering excellent developer experience and build performance.
*   **Vite 7 (via WXT):** For lightning-fast development builds and optimized production bundles.
*   **TailwindCSS v4 (JIT Mode):** For utility-first styling (if applicable, or general CSS practices).
*   **Biome:** Our chosen linter and formatter for superior performance and code consistency.
*   **Vitest:** For fast unit and integration testing.
*   **Playwright:** For robust end-to-end (E2E) testing of browser interactions.

## ✍️ Coding Guidelines

To ensure code quality and consistency:

*   **TypeScript First:** Write all new code in TypeScript, leveraging its type system extensively.
*   **Feature-Sliced Design:** Organize your code according to FSD principles (e.g., `src/features`, `src/entities`, `src/shared`).
*   **Biome:** All code must pass Biome linting and formatting checks. Your PR will fail CI if these checks do not pass.
    bash
    pnpm run lint # Checks for linting errors
    pnpm run format # Auto-formats code
    pnpm run check # Runs lint, format, and type checks
    
*   **SOLID, DRY, YAGNI:** Adhere to fundamental software engineering principles.
*   **Clear & Concise Code:** Write readable code with meaningful variable names and comments where necessary.
*   **Security Minded:** Always consider potential security implications, especially when handling user data or external APIs.

## ✅ Testing

Comprehensive testing is a cornerstone of this project.

*   **Unit/Integration Tests (Vitest):**
    bash
    pnpm test:unit
    
    Write tests for new features and bug fixes to ensure correctness and prevent regressions. Aim for high code coverage.
*   **End-to-End Tests (Playwright):**
    bash
    pnpm test:e2e
    
    For critical user flows and browser interactions, contribute to our Playwright test suite.

## 🔄 Pull Request Process

1.  **Fork** the repository and **create your branch** from `main`.
    bash
    git checkout main
    git pull origin main
    git checkout -b feature/your-feature-name
    
2.  **Implement your changes**, following the coding guidelines.
3.  **Run tests and linting** to ensure everything passes locally:
    bash
    pnpm run check
    pnpm test:unit
    pnpm test:e2e # If applicable
    
4.  **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standards (e.g., `feat: add new AI summary feature`, `fix: correct transcript parsing error`). This helps us generate release notes.
5.  **Push your branch** to your fork.
6.  **Open a Pull Request** against the `main` branch of `chirag127/YouTube-AI-Navigator-Browser-Extension`.
7.  **Provide a clear title and description** for your PR.
    *   Reference any related issues (e.g., `Closes #123`).
    *   Describe the problem your PR solves and how it solves it.
    *   Include screenshots or GIFs for UI changes.
    *   Explain any design choices or trade-offs.
8.  **Address review comments** promptly. Be open to feedback and iteration.
9.  **Squash commits** if your PR has many small, iterative commits, to keep the history clean before merging.

## 🛡️ Security Vulnerabilities

If you discover a security vulnerability, please refer to our [Security Policy](https://github.com/chirag127/YouTube-AI-Navigator-Browser-Extension/blob/main/SECURITY.md) for instructions on how to report it responsibly.

## ⚖️ License

By contributing to YouTube-AI-Navigator-Browser-Extension, you agree that your contributions will be licensed under its [CC BY-NC 4.0 License](https://github.com/chirag127/YouTube-AI-Navigator-Browser-Extension/blob/main/LICENSE).

Thank you for helping to improve YouTube-AI-Navigator-Browser-Extension!