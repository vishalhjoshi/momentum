# Contributing to Momentum

Thank you for your interest in contributing to Momentum! We welcome contributions from everyone.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/adhd-app.git
    cd adhd-app
    ```
3.  **Install dependencies**:
    ```bash
    pnpm install
    ```
4.  **Set up environment variables**:
    - Copy `backend/.env.example` to `backend/.env`
    - Copy `frontend/.env.example` to `frontend/.env`
    - Update the values as needed (especially database credentials).

## Development

-   **Start both frontend and backend**:
    ```bash
    # Terminal 1
    pnpm dev:backend

    # Terminal 2
    pnpm dev:frontend
    ```

## Project Structure

-   `frontend/`: React + Vite application
-   `backend/`: Node.js + Fastify API

## Code Style

-   We use **ESLint** and **Prettier** for linting and formatting.
-   Please run `pnpm lint` before submitting a PR.
-   Conversational comments and documentation are encouraged!

## Submitting Changes

1.  Create a new branch for your feature or fix: `git checkout -b feature/amazing-feature`.
2.  Commit your changes: `git commit -m "Add amazing feature"`.
3.  Push to the branch: `git push origin feature/amazing-feature`.
4.  Open a **Pull Request** on the main repository.

## Community

Be kind and respectful. This project aims to be a safe and welcoming space for everyone.
