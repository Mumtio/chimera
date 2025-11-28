# Chimera Protocol Frontend

A cyberpunk-themed web application that enables users to fuse multiple AI models (GPT, Claude, Gemini) into a unified cognitive system with shared memory.

## Features

- **Cyberpunk Aesthetic**: Neon green holographic UI with angular tech frames and futuristic HUD animations
- **Multi-Model Integration**: Connect and manage multiple AI model providers
- **Shared Memory Bank**: Store and inject memories across different LLM contexts
- **3D Brain Visualization**: Interactive 3D interface for model selection
- **Team Collaboration**: Manage workspace members and permissions
- **Developer Console**: Execute MCP commands and view structured responses

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **3D Graphics**: Three.js + React Three Fiber + @react-three/drei
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies (using legacy-peer-deps due to React 19 compatibility)
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI primitives (buttons, inputs, cards)
│   ├── layout/         # Layout components (sidebar, topbar, shell)
│   ├── brain/          # 3D brain visualization components
│   ├── animations/     # Animation wrappers and effects
│   └── features/       # Feature-specific components
├── pages/              # Route-level page components
├── stores/             # Zustand state stores
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── types/              # TypeScript type definitions
├── data/               # Dummy data for demo
├── styles/             # Global styles and theme
└── assets/             # Static assets (fonts, images)
```

## Development

The project uses:
- **TypeScript** with strict mode enabled
- **ESLint** for code linting
- **Tailwind CSS** with custom cyberpunk theme
- **Path aliases** (`@/` maps to `src/`)

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Deployment

Ready to deploy? We've got you covered!

### Quick Deploy (5 minutes)
See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for the fastest deployment path.

### Comprehensive Guide
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Vercel deployment (recommended)
- Netlify deployment
- GitHub Pages
- AWS S3 + CloudFront
- Environment configuration
- Performance optimization
- Security best practices

### Verify Build

Before deploying, verify your production build:

```bash
# Build the application
npm run build

# Verify the build
npm run verify-build

# Test locally
npm run preview
```

## License

MIT
