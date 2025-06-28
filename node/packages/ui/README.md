# GameFinder UI

A modern, responsive web application built with Magic Loop and WebJSX for discovering and tracking games.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication-related components
│   ├── layout/          # Layout components (header, footer, etc.)
│   └── common/          # Shared components (buttons, forms, etc.)
├── pages/               # Page components (route handlers)
├── services/            # API services and external integrations
├── stores/              # State management (future)
├── utils/               # Helper functions and utilities
├── types/               # TypeScript type definitions
├── styles/              # CSS styles
│   ├── components/      # Component-specific styles (future)
│   └── pages/          # Page-specific styles (future)
└── main.tsx            # Application entry point
```

## Current Pages

- **Login Page** (`/login`) - Authentication with Google OAuth
- **Home Page** (`/`) - Protected dashboard with hero section and features

## Future Structure

As the app grows, we'll add these directories:

```
src/
├── components/
│   ├── games/           # Game discovery and management
│   ├── tournaments/     # Tournament components
│   ├── profile/         # User profile components
│   ├── social/          # Social features (friends, chat)
│   └── admin/           # Admin panel components
├── pages/
│   ├── games/           # Game-related pages
│   ├── tournaments/     # Tournament pages
│   ├── profile/         # Profile pages
│   └── admin/           # Admin pages
├── stores/
│   ├── auth-store.ts    # Authentication state
│   ├── games-store.ts   # Games state
│   ├── user-store.ts    # User preferences
│   └── tournament-store.ts
└── services/
    ├── games-api.ts     # Game discovery API
    ├── tournaments-api.ts
    ├── social-api.ts    # Social features API
    └── analytics.ts     # Usage analytics
```

## Mobile Responsiveness

This UI is designed to be fully responsive and will work seamlessly in:
- Web browsers (desktop/mobile)
- iOS applications (via WebView)
- Android applications (via WebView)

The design follows mobile-first principles with:
- Touch-friendly interface elements
- Responsive grid layouts
- Flexible typography scaling
- Cross-platform compatible gestures

## Component Architecture

All components are built using Magic Loop + WebJSX:
- **Declarative**: Components describe what the UI should look like
- **Reactive**: State changes automatically trigger re-renders
- **Composable**: Small, focused components that work together
- **Type-safe**: Full TypeScript support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run check
```

## Key Features

- **Authentication**: Google OAuth integration
- **Responsive Design**: Works on all devices
- **Component System**: Modular, reusable components
- **Type Safety**: Full TypeScript support
- **Modern Styling**: CSS Grid, Flexbox, and modern techniques
- **Performance**: Optimized for both web and mobile platforms