# PopcornHub Frontend

The frontend application for PopcornHub, a movie discovery and chat platform built with Angular.

## Features

- **Movie Browsing**: Browse and search through a collection of movies
- **Movie Details**: View detailed information about movies including cast, ratings, and trailers
- **AI Chat**: Interactive chat feature for movie recommendations
- **User Authentication**: Secure login and user management with Firebase
- **Watchlist**: Save movies to your personal watchlist
- **Responsive Design**: Optimized for desktop and mobile devices using Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v15 or higher)
- Backend API server running (see backend README)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `src/environments/environment.ts` to `environment.prod.ts` if needed
   - Update API endpoints to point to your backend server

## Development Server

To start the development server:

```bash
ng serve
```

The application will be available at `http://localhost:4200`.

Note: Ensure the backend server is running on `http://localhost:5000` for full functionality.

## Build

To build the project for production:

```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Testing

### Unit Tests

To execute unit tests with Karma:

```bash
ng test
```

### End-to-End Tests

For end-to-end testing:

```bash
ng e2e
```

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component:

```bash
ng generate component component-name
```

For a complete list of available schematics:

```bash
ng generate --help
```

## Technologies Used

- Angular 17+
- TypeScript
- Tailwind CSS
- Firebase Authentication
- RxJS for reactive programming

## Project Structure

```
src/
├── app/
│   ├── core/           # Core services and guards
│   ├── shared/         # Shared components and utilities
│   ├── features/       # Feature modules
│   │   ├── auth/       # Authentication components
│   │   ├── movies/     # Movie-related components
│   │   └── chat/       # Chat functionality
│   └── app.config.ts   # Application configuration
├── assets/             # Static assets
├── environments/       # Environment configurations
└── styles.css          # Global styles
```

## Contributing

1. Follow Angular style guidelines
2. Write unit tests for new components
3. Ensure responsive design works on mobile devices
4. Test with the backend API

## License

This project is licensed under the MIT License.
