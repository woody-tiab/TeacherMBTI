# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**React + TypeScript + TailwindCSS + Vite**
```bash
npm install              # Install dependencies
npm run dev              # Development server
npm run build            # Production build
npm run type-check       # TypeScript type checking
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix linting issues
npm run preview          # Preview build
npm run deploy           # Deploy to GitHub Pages
npm run predeploy        # Pre-deployment checks (type-check + lint + build)
```

## High-Level Architecture

**State Management Pattern:**
- Custom hooks for state management (`useMBTITest.ts`)
- React Context API for global state
- Local state for UI interactions

**Component Architecture:**
```
src/components/
├── common/            # Reusable UI components (Button, Card, Loading)
├── question/          # Question display and interaction
└── result/           # Result visualization and sharing
```

**Data Flow:**
1. Questions defined in `src/data/questions.ts` with MBTI dimensions
2. User answers processed through `src/utils/mbti.ts` scoring algorithm
3. Results calculated and displayed with detailed type analysis
4. Social sharing via Web Share API or direct platform URLs

**Type System:**
- Comprehensive TypeScript definitions in `src/types/mbti.ts`
- Enum-based MBTI types and dimensions
- Structured interfaces for questions, answers, and results

## Development Guidelines (from shrimp-rules.md)

**Strict Development Standards:**
- TypeScript strict mode enforced - no `any` types allowed
- TailwindCSS only - no inline styles or CSS files
- Vite build system - Create React App prohibited  
- GitHub Pages deployment with proper base path configuration
- Framer Motion for all animations

**Component Standards:**
- Functional components only with React hooks
- Props interfaces required for all components
- PascalCase naming convention
- Default exports preferred

**Testing and Quality:**
- Pre-deployment validation: type-check → lint → build
- SPA routing support with 404.html fallback
- Browser compatibility: Chrome, Firefox, Safari, Edge
- Responsive design mandatory

## Key Files to Understand

**Type System and Data:**
- `src/types/mbti.ts`: Complete type system definitions
- `src/utils/mbti.ts`: MBTI calculation algorithm
- `src/hooks/useMBTITest.ts`: State management logic

**Build and Deployment:**
- `vite.config.ts`: Build configuration with GitHub Pages base path
- `.github/workflows/deploy.yml`: Automated deployment pipeline
- `public/404.html`: Required for SPA routing support

## Important Notes

**Deployment:**
- GitHub Pages with automated deployment on main branch push
- Base path must match repository name in vite.config.ts
- 404.html required for SPA routing support

**Code Quality Standards:**
- TypeScript with strict type checking
- ESLint configuration enforced
- No console.log statements in production builds
- Comprehensive error handling for network issues