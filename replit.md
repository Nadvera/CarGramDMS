# Overview

Cargram is an automotive social platform designed to connect car enthusiasts worldwide. The application serves as a community hub where users can share car builds, showcase modifications, and connect with fellow automotive enthusiasts. Built as a full-stack web application, it features a modern React frontend with a Node.js/Express backend, designed to handle user interactions, email subscriptions, and community features.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript, utilizing modern development practices and a component-based architecture:

- **Framework**: React 18 with TypeScript for type safety and better developer experience
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS for utility-first styling with custom automotive-themed color schemes
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Build Tool**: Vite for fast development and optimized production builds

The component architecture follows atomic design principles with reusable UI components in the `/components/ui` directory and page-specific components organized by feature.

## Backend Architecture

The backend follows a RESTful API design with Express.js:

- **Framework**: Express.js with TypeScript for the web server
- **API Design**: RESTful endpoints with JSON responses
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod schemas shared between frontend and backend for consistent validation
- **Storage Pattern**: Abstracted storage interface allowing for different implementations (currently in-memory, designed for PostgreSQL)

The server architecture separates concerns with dedicated modules for routing, storage, and middleware handling.

## Data Storage Solutions

- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud hosting
- **Schema Management**: Drizzle migrations for version-controlled database schema changes
- **Connection**: `@neondatabase/serverless` for optimized serverless database connections

The database schema includes user management and email subscription functionality, with plans for expanding to support car posts, user profiles, and community features.

## Theme and Styling System

- **Design System**: Custom automotive-themed design with blue and orange accent colors
- **Theme Support**: Dynamic light/dark theme switching with time-based automatic theme detection
- **Typography**: Inter font family for modern, readable text
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **CSS Variables**: HSL color system for consistent theming across components

## Development and Build Process

- **Development**: Vite dev server with hot module replacement
- **Build**: Optimized production builds with code splitting
- **Type Checking**: TypeScript for compile-time type safety
- **Package Management**: npm with package-lock.json for dependency management
- **Environment**: ESM modules throughout the application

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Drizzle ORM**: Type-safe database toolkit and query builder
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI and Component Libraries
- **Radix UI**: Headless component primitives for accessibility and customization
- **Shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Carousel component for image galleries

## Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer

## State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class name utility
- **class-variance-authority**: Type-safe CSS class variants
- **nanoid**: URL-safe unique ID generation

## Replit-Specific Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit integration features
- **@replit/vite-plugin-dev-banner**: Development environment indicators