# Persona

Persona is a minimalist, AI-powered data enrichment application designed for sales and marketing professionals. It operates as a single-page application where a user, after a simulated Google authentication, can input a query (such as a person's name, email, or LinkedIn URL). The application sends this query to a backend service which returns a comprehensive, structured JSON object containing detailed information about a person, their company, and tailored outreach strategies. The frontend then beautifully renders this data in a clean, tabbed interface, separating information into 'Person', 'Company', and 'Outreach' categories for easy consumption and action.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ramubotsplash/bsp-persona)

## Key Features

*   **AI-Powered Data Enrichment**: Transforms a simple query into a comprehensive, actionable profile.
*   **Simulated Authentication**: A seamless "Sign in with Google" flow to gate access.
*   **Intuitive UI**: A clean, tabbed interface to easily navigate between Person, Company, and Outreach data.
*   **Modern & Minimalist Design**: Built with shadcn/ui and Tailwind CSS for a visually stunning and responsive experience.
*   **Serverless Backend**: Powered by a lightweight Hono API running on Cloudflare Workers.
*   **State Management**: Uses Zustand for efficient and simple global state management.

## Technology Stack

*   **Frontend**: React, Vite, TypeScript, Tailwind CSS
*   **UI Components**: shadcn/ui, Lucide React
*   **State Management**: Zustand
*   **Animations**: Framer Motion
*   **Backend**: Hono on Cloudflare Workers
*   **Package Manager**: Bun

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd persona_app
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

### Local Development

To start the development server for both the frontend and the backend worker, run:

```bash
bun dev
```

This command will:
*   Start the Vite development server for the React frontend, typically on `http://localhost:3000`.
*   Start a local Wrangler instance to serve the Hono backend API.
*   The application will open in your default browser.

## Usage

1.  Open the application in your browser.
2.  Click the "Sign in with Google" button to access the main application.
3.  Enter a query (e.g., a person's name or company) into the search box.
4.  Click the "Enrich" button.
5.  View the enriched data, organized into "Person", "Company", and "Outreach" tabs.

## Deployment

This project is designed for easy deployment to Cloudflare's global network.

1.  **Login to Cloudflare:**
    If you haven't already, authenticate Wrangler with your Cloudflare account.
    ```bash
    bunx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script to build the project and deploy it to Cloudflare Workers.
    ```bash
    bun deploy
    ```

This command will build the Vite frontend, bundle the Hono worker, and deploy the entire application. You will be provided with a public URL for your deployed project.

Or deploy directly with the button below:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ramubotsplash/bsp-persona)

## Project Structure

*   `src/`: Contains the frontend React application source code.
    *   `pages/`: Main application pages.
    *   `components/`: Reusable React components.
    *   `stores/`: Zustand state management stores.
    *   `lib/`: Utility functions and API client.
*   `worker/`: Contains the backend Hono application for the Cloudflare Worker.
    *   `user-routes.ts`: API route definitions.
*   `shared/`: Contains TypeScript types shared between the frontend and backend.