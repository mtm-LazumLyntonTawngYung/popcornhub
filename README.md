# PopcornHub

A full-stack movie discovery and chat application built with Angular (frontend) and Flask (backend).

## Features

- **Movie Discovery**: Browse and search through a comprehensive movie database
- **AI-Powered Chat**: Interactive chat for personalized movie recommendations
- **User Authentication**: Secure login and user management with Firebase
- **Personal Watchlist**: Save and manage your favorite movies
- **Movie Details**: Detailed information including cast, ratings, trailers, and related movies
- **Responsive Design**: Optimized for desktop and mobile devices
- **RESTful API**: Well-documented API with OpenAPI/Swagger support

## Architecture

This project consists of two main components:

- **Frontend**: Angular 17+ application with TypeScript and Tailwind CSS
- **Backend**: Flask API server with Connexion and OpenAPI documentation

## Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v15 or higher)
- Python 3.8 or higher
- Docker (optional, for containerized deployment)

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd PopcornHub
    ```

2. Start both frontend and backend:
    ```bash
    docker-compose up --build
    ```

3. Access the application:
    - Frontend: `http://localhost:4200`
    - Backend API: `http://localhost:5000`
    - API Documentation: `http://localhost:5000/api/ui/`

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
    ```bash
    cd backend
    ```

2. Create virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Start the backend server:
    ```bash
    python app_connexion.py
    ```

#### Frontend Setup

1. Navigate to frontend directory:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure Firebase (optional):
    - Copy `firebase.json` and configure your Firebase project
    - Update environment files in `src/environments/`

4. Start the development server:
    ```bash
    ng serve
    ```

## Development

### Running Individual Services

- **Frontend**: `cd frontend && ng serve` → `http://localhost:4200`
- **Backend**: `cd backend && python app_connexion.py` → `http://localhost:5000`

### API Documentation

When the backend is running, visit `http://localhost:5000/api/ui/` for interactive API documentation.

## Build

### Frontend Production Build

```bash
cd frontend
ng build --prod
```

### Backend Docker Build

```bash
cd backend
docker build -t popcornhub-backend .
```

## Technologies Used

### Frontend
- Angular 17+
- TypeScript
- Tailwind CSS
- Firebase Authentication
- RxJS

### Backend
- Flask
- Connexion (OpenAPI/Swagger)
- Flask-CORS
- Python 3.8+

## Project Structure

```
PopcornHub/
├── frontend/              # Angular frontend application
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── README.md
├── backend/               # Flask backend API
│   ├── app_connexion.py
│   ├── openapi.yaml
│   ├── requirements.txt
│   ├── generated/
│   └── README.md
├── docker-compose.yml     # Multi-service orchestration
├── Dockerfile             # Frontend container
├── backend/
│   └── Dockerfile.backend # Backend container
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test both frontend and backend
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## API Endpoints

Key API endpoints include:

- `GET /api/movies` - List movies with filtering
- `GET /api/movies/{id}` - Get movie details
- `POST /api/ai-chat` - AI movie recommendations
- `GET/POST/DELETE /api/watchlist` - Manage user watchlist

See backend README for complete API documentation.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.