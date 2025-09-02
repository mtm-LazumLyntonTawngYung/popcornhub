# PopcornHub

A movie discovery and chat application built with Angular.

## Features

- Browse movies
- User authentication
- Movie details and chat functionality
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v15 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PopcornHub
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Set up Firebase (if using Firebase for authentication):
   - Copy `firebase.json` and configure your Firebase project
   - Update environment files in `src/environments/`

## Development

To start the development server:

```bash
cd frontend
ng serve
```

The application will be available at `http://localhost:4200`.

## Build

To build the project for production:

```bash
cd frontend
ng build --prod
```

## Technologies Used

- Angular
- TypeScript
- Tailwind CSS
- Firebase (Authentication)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.