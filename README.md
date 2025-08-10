
# JOB-BOARD-SYSTEM-API

## 🧾 Description

This is a backend API for the Job Board System Challenge, built with TypeScript. The project includes a CI/CD pipeline (see the Actions tab for workflow details). You can run the API locally by following the setup instructions below, or use Docker Compose for a quick start. Clone the repository, set up your environment, and get started!

## 🔗 Live Preview

A live version of this API is available here:  
👉 [https://backend-job-board-system.onrender.com](https://backend-job-board-system.onrender.com)

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

## ✅ Prerequisite Installation

- nodejs v18.18.0

## 🛠 Installation

1. **Clone the Repository**

    ```bash
    git clone git@github.com:lcdamy/backend_job_board_system.git
    cd backend_Job_Board_System
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

## 🏃‍♂️ Running in Development

To start the server in development mode:

1. Copy the example environment file:

    ```bash
    cp .env.example .env
    ```
    > **Note:** If you do not have access to the `.env.example` file, request a sample by emailing your-email@example.com.

2. Start the server:

    ```bash
    npm run dev
    ```

## 🏗️ Building for Production

To build the project for production, run:
```bash
npm run build
```

## 🗄️ Running Migration

To run database migrations, use:
```bash
npm run migrate
```

## 🌱 Running Seeds

To seed the database, use:
```bash
npm run seed
```

> **Note:** Built files will be in the `dist` directory.

## 📁 Folder Structure

```
backend_job_board_system/
├── public/
├── src/
│   ├── assets/         # Mock data
│   ├── config/         # Database config & logger
│   ├── controllers/    # Handles incoming requests and responses
│   ├── cronjobs/       # Scheduled tasks (e.g., health checks)
│   ├── dtos/           # TypeScript DTOs
│   ├── middlewares/    # Request interception and custom logic
│   ├── models/         # System schemas
│   ├── routes/         # API endpoints
│   ├── seeds/          # Database seeders
│   ├── services/       # Business logic layer
│   ├── templates/      # Email or other templates
│   ├── utils/          # Utility functions and helpers
│   └── app.ts          # Main application entry point
├── .env                # Environment variables
├── .gitignore          # Git ignore rules
├── combined.log        # Log output file
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker build instructions
├── package.json        # Project metadata and dependencies
└── README.md
```

## 🐳 Running with Docker

To run this application using Docker:

1. Ensure Docker and Docker Compose are installed.
2. Clone the backend (and frontend, if needed) repositories into the same parent directory.
3. Navigate to the backend project folder:

    ```bash
    cd backend_Job_Board_System
    ```

4. Start the services with Docker Compose:

    ```bash
    docker-compose --env-file .env.custom up --build
    ```

> **Note:** Ensure your `.env.custom` file is properly configured before running the command.

## 👥 Contributors

- [yourusername](https://www.linkedin.com/in/your-linkedin-profile/)