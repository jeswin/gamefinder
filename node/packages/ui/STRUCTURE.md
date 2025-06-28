# GameFinder UI - Project Structure

## Current File Structure

```
src/
├── components/
│   ├── auth/
│   │   └── google-login-button.tsx    # Google OAuth login button
│   ├── layout/
│   │   ├── app-header.tsx             # Application header with user info
│   │   └── main-layout.tsx            # Main page layout wrapper
│   └── common/
│       ├── button-primary.tsx         # Primary action button
│       ├── feature-grid.tsx           # Features showcase grid
│       ├── hero-section.tsx           # Homepage hero section
│       └── loading-spinner.tsx        # Loading state component
├── pages/
│   ├── home-page.tsx                  # Protected homepage
│   └── login-page.tsx                 # Login/authentication page
├── services/
│   └── auth-service.ts                # Authentication API calls
├── types/
│   ├── components.ts                  # JSX component type definitions
│   └── user.ts                        # User-related TypeScript types
├── utils/                             # (empty, for future utilities)
├── stores/                            # (empty, for future state management)
├── styles/
│   ├── components/                    # (empty, for component-specific styles)
│   └── pages/                         # (empty, for page-specific styles)
├── styles.css                         # Global application styles
└── main.tsx                           # Application entry point
```

## Component Architecture

### Magic Loop Components
All UI components are built using Magic Loop + WebJSX:
- `component()` function defines custom web components
- Async generators for reactive state management
- JSX for declarative markup
- Full TypeScript support

### Key Design Patterns

1. **Separation of Concerns**
   - Components focus on UI logic only
   - Services handle API communication
   - Types define data structures

2. **Mobile-First Responsive Design**
   - CSS Grid and Flexbox layouts
   - Touch-friendly interface elements
   - Scalable typography and spacing
   - Cross-platform compatibility (web/mobile)

3. **Component Composition**
   - Small, focused components
   - Clear prop interfaces
   - Reusable across different contexts

## Scalability Planning

### Future Directory Structure

As the app grows, we'll expand into these areas:

```
src/
├── components/
│   ├── games/                         # Game discovery & management
│   │   ├── game-card.tsx
│   │   ├── game-search.tsx
│   │   ├── game-filters.tsx
│   │   └── game-details.tsx
│   ├── tournaments/                   # Tournament system
│   │   ├── tournament-card.tsx
│   │   ├── tournament-bracket.tsx
│   │   ├── tournament-registration.tsx
│   │   └── tournament-leaderboard.tsx
│   ├── profile/                       # User profiles
│   │   ├── profile-header.tsx
│   │   ├── achievement-badge.tsx
│   │   ├── game-library.tsx
│   │   └── stats-overview.tsx
│   ├── social/                        # Social features
│   │   ├── friend-list.tsx
│   │   ├── chat-window.tsx
│   │   ├── activity-feed.tsx
│   │   └── notification-center.tsx
│   └── admin/                         # Administration
│       ├── user-management.tsx
│       ├── game-moderation.tsx
│       └── analytics-dashboard.tsx
├── pages/
│   ├── games/
│   │   ├── games-discover.tsx
│   │   ├── games-library.tsx
│   │   └── game-details.tsx
│   ├── tournaments/
│   │   ├── tournaments-browse.tsx
│   │   ├── tournament-details.tsx
│   │   └── tournament-create.tsx
│   ├── profile/
│   │   ├── profile-view.tsx
│   │   ├── profile-edit.tsx
│   │   └── profile-settings.tsx
│   └── admin/
│       └── admin-dashboard.tsx
├── services/
│   ├── games-api.ts                   # Game discovery & management API
│   ├── tournaments-api.ts             # Tournament system API
│   ├── social-api.ts                  # Friends, chat, notifications
│   ├── user-api.ts                    # User profile management
│   └── analytics.ts                   # Usage tracking & analytics
├── stores/
│   ├── auth-store.ts                  # Authentication state
│   ├── games-store.ts                 # Games & library state
│   ├── tournaments-store.ts           # Tournament participation
│   ├── social-store.ts                # Friends & social features
│   └── user-preferences.ts            # User settings & preferences
└── utils/
    ├── date-helpers.ts
    ├── game-helpers.ts
    ├── validation.ts
    └── constants.ts
```

## Mobile App Integration

### Responsive Design Principles
- **Touch-First**: All interactions designed for touch
- **Flexible Layouts**: CSS Grid/Flexbox for any screen size
- **Performance**: Optimized for mobile bandwidth
- **Native Feel**: Platform-appropriate animations and gestures

### WebView Compatibility
The UI is designed to work seamlessly in:
- **iOS WebView** (UIWebView/WKWebView)
- **Android WebView** (System WebView)
- **Cordova/PhoneGap** applications
- **Electron** desktop apps

### Key Responsive Breakpoints
```css
/* Mobile First */
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large Desktop */ }
```

## Technology Stack

- **Framework**: Magic Loop + WebJSX
- **Routing**: webjsx-router
- **Styling**: Modern CSS (Grid, Flexbox, Custom Properties)
- **Build**: Vite + TypeScript
- **Type Safety**: Full TypeScript coverage
- **Module System**: ESM with explicit file extensions

## Development Workflow

1. **Component Development**: Create in appropriate subdirectory
2. **Type Definitions**: Add to `types/components.ts`
3. **Import**: Add to `main.tsx` for registration
4. **Styling**: Add component-specific styles to `styles.css`
5. **Testing**: Manual testing across device types

This structure provides a solid foundation that can scale from the current authentication system to a full-featured gaming platform while maintaining code organization and developer productivity.