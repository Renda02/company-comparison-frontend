# Company comparison frontend

A Next.js application for comparing companies, built with React, TypeScript, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js) or **yarn** or **pnpm**

You can check your Node.js version by running:
```bash
node --version
```

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd company-comparison-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   Or if you're using yarn:
   ```bash
   yarn install
   ```
   
   Or if you're using pnpm:
   ```bash
   pnpm install
   ```

## Running the Application

### Development Mode

To start the development server:

```bash
npm run dev
```

Or with yarn:
```bash
yarn dev
```

Or with pnpm:
```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

The development server includes hot-reloading, so any changes you make to the code will automatically refresh in the browser.

### Production Build

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

The production server will also run on [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server (requires `build` to be run first)
- `npm run lint` - Runs ESLint to check for code quality issues

## Troubleshooting

### Port 3000 is already in use

If port 3000 is already occupied, you can:

1. **Kill the process using port 3000:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Or specify a different port:**
   ```bash
   PORT=3001 npm run dev
   ```

### Dependencies issues

If you encounter issues with dependencies:

1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall dependencies:
   ```bash
   npm install
   ```

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Project Structure

```
company-comparison-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── company-comparison.tsx
│   ├── company-comparison-form.tsx
│   ├── comparison-result.tsx
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
