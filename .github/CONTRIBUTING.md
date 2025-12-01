# Contributing to YouTube AI Navigator Browser Extension

Thank you for considering contributing to the YouTube AI Navigator Browser Extension! We aim to foster a collaborative environment for building a top-tier, privacy-first browser extension. All contributions are welcome, from bug reports and feature requests to code submissions.

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. Please review the [CODE_OF_CONDUCT.md](https://github.com/chirag127/YouTube-AI-Navigator-Browser-Extension/blob/main/CODE_OF_CONDUCT.md) file for details on expected behavior.

## How to Contribute

We welcome contributions through the following channels:

1.  **Reporting Bugs:** If you find a bug, please open an issue on GitHub. Provide a clear title, a detailed description of the bug, steps to reproduce it, and any relevant environment information (browser, OS, extension version).
2.  **Suggesting Features:** Have an idea for a new feature or an improvement? Please open an issue to discuss it before implementing.
3.  **Submitting Pull Requests:** For code contributions, please follow these steps:

    *   **Fork the Repository:** Create your own fork of the `chirag127/YouTube-AI-Navigator-Browser-Extension` repository.
    *   **Clone Your Fork:** Clone your forked repository to your local machine.
        bash
        git clone https://github.com/YOUR_USERNAME/YouTube-AI-Navigator-Browser-Extension.git
        cd YouTube-AI-Navigator-Browser-Extension
        
    *   **Create a New Branch:** Create a descriptive branch for your changes.
        bash
        git checkout -b feat/your-new-feature
        # or
        git checkout -b fix/your-bug-fix
        
    *   **Make Your Changes:** Implement your feature or bug fix. Ensure your code adheres to the project's standards (see below).
    *   **Test Your Changes:** Run the provided test suite to ensure your changes haven't introduced regressions.
    *   **Commit Your Changes:** Use [Conventional Commits](https://www.conventionalcommits.org/) for your commit messages.
        bash
        git add .
        git commit -m "feat: Add AI-powered tooltip for video analysis"
        # or
        git commit -m "fix: Resolve issue with SponsorBlock integration"
        
    *   **Push to Your Fork:** Push your branch to your fork on GitHub.
        bash
        git push origin feat/your-new-feature
        
    *   **Open a Pull Request:** Go to the original repository and open a new pull request from your fork's branch to the `main` branch.

## Development Environment Setup

To set up the development environment, please refer to the `README.md` file in the root of this repository for detailed instructions.

## Code Standards & Architecture

This project adheres to the Apex Technical Authority standards, emphasizing Zero-Defect, High-Velocity, and Future-Proof development.

*   **Language:** TypeScript (Strict)
*   **Bundler:** Vite 7
*   **Extension Framework:** WXT
*   **Linter/Formatter:** Biome
*   **Testing:** Vitest (Unit), Playwright (E2E)
*   **Architecture:** Feature-Sliced Design (FSD), SOLID principles, DRY, KISS.
*   **AI Integration:** Strict adherence to the AI Orchestration & Gemini Protocol as defined in `AGENTS.md`.
*   **Code Hygiene:** Self-documenting code, semantic naming, no unnecessary comments, strict `src/` directory for production code, all tests and scripts in `tests/`.

**Refer to the `AGENTS.md` file for detailed AI and development directives.**

## Pull Request Guidelines

*   **Keep PRs focused:** Each PR should address a single issue or feature.
*   **Descriptive Title:** Use Conventional Commits format.
*   **Clear Description:** Explain what the PR does, why it's necessary, and any potential impact.
*   **Link to Issue:** Reference the relevant GitHub issue if applicable.
*   **Self-Review:** Before submitting, review your own code and tests.

## Reporting Security Vulnerabilities

We take security very seriously. If you discover a security vulnerability, please report it responsibly by following the guidelines in the [SECURITY.md](https://github.com/chirag127/YouTube-AI-Navigator-Browser-Extension/blob/main/SECURITY.md) file.

## Questions?

If you have any questions or need clarification, please don't hesitate to open an issue.
