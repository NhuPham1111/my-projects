# Fullstack Monorepo

A production-ready fullstack monorepo built with modern technologies and clean architecture.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React, TypeScript, Vite, TailwindCSS |
| Backend  | Node.js, Express, TypeScript        |
| Database | MySQL, Prisma ORM                   |
| Tooling  | ESLint, Prettier, npm workspaces    |

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.x

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd fullstack-monorepo

# 2. Install all dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
cp packages/frontend/.env.example packages/frontend/.env
cp packages/backend/.env.example packages/backend/.env

# 4. Update packages/backend/.env with your MySQL connection string

# 5. Generate Prisma client
npm run prisma:generate

# 6. Run database migrations (after adding models)
npm run prisma:migrate
```

### Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Run only frontend (http://localhost:5173)
npm run dev:frontend

# Run only backend (http://localhost:3001)
npm run dev:backend
```

### Available Scripts

| Script              | Description                               |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Start frontend + backend dev servers      |
| `npm run dev:frontend` | Start frontend dev server only         |
| `npm run dev:backend`  | Start backend dev server only          |
| `npm run build`     | Build both packages for production        |
| `npm run lint`      | Lint all TypeScript files                 |
| `npm run lint:fix`  | Lint and auto-fix issues                  |
| `npm run format`    | Format all files with Prettier            |
| `npm run format:check` | Check formatting without changes       |
| `npm run prisma:generate` | Generate Prisma client              |
| `npm run prisma:migrate`  | Run Prisma migrations               |
| `npm run prisma:studio`   | Open Prisma Studio                  |

## Project Structure

```
├── packages/
│   ├── frontend/          # React + Vite + TailwindCSS
│   │   ├── src/
│   │   │   ├── assets/        # Static assets
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── layouts/       # Page layout wrappers
│   │   │   ├── lib/           # Utilities & helpers
│   │   │   ├── pages/         # Route-level pages
│   │   │   ├── routes/        # Router configuration
│   │   │   ├── services/      # API client layer
│   │   │   ├── stores/        # State management
│   │   │   └── types/         # TypeScript types
│   │   └── ...
│   │
│   └── backend/           # Node.js + Express + Prisma
│       ├── prisma/            # Prisma schema & migrations
│       ├── src/
│       │   ├── config/        # App configuration
│       │   ├── controllers/   # Route controllers
│       │   ├── middlewares/    # Express middlewares
│       │   ├── routes/        # Route definitions
│       │   ├── services/      # Business logic
│       │   ├── types/         # TypeScript types
│       │   └── utils/         # Utility functions
│       └── ...
│
├── .eslintrc.cjs          # Shared ESLint config
├── .prettierrc            # Shared Prettier config
├── tsconfig.base.json     # Shared TypeScript config
└── package.json           # Root workspace config
```

## Architecture

This monorepo follows a clean, layered architecture:

- **Frontend**: Component-based React with file-based routing, centralized API services, and reusable hooks
- **Backend**: Controller → Service → Data Access pattern with Express middleware pipeline
- **Database**: Prisma ORM for type-safe database access with MySQL

## License

MIT
