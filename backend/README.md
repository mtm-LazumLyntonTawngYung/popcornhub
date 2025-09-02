# PopcornHub Backend

The backend API for PopcornHub, a movie discovery and chat platform built with Flask and Connexion.

## Overview

This backend provides RESTful API endpoints for movie data, user watchlists, and AI-powered chat recommendations. It uses OpenAPI/Swagger for API documentation and includes CORS support for frontend integration.

## Features

- **Movie Management**: CRUD operations for movie data
- **Search & Filtering**: Search movies by title, description, genre
- **AI Chat**: Interactive movie recommendation chat
- **Watchlist**: User-specific movie watchlists
- **Health Checks**: API health monitoring
- **OpenAPI Documentation**: Interactive API documentation via Swagger UI

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

### Development Mode

To start the development server:

```bash
python app_connexion.py
```

The API will be available at `http://localhost:5000`.

### With Connexion (Alternative)

If you prefer to use the generated Connexion server:

```bash
cd generated
python -m popcornhub_api
```

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: `http://localhost:5000/api/ui/`
- **OpenAPI JSON**: `http://localhost:5000/api/openapi.json`

## API Endpoints

### Core Endpoints

- `GET /api/health` - Health check
- `GET /api/movies` - Get all movies (with filtering)
- `GET /api/movies/{id}` - Get movie by ID
- `GET /api/movies/recommendations` - Get movie recommendations
- `GET /api/movies/search` - Search movies

### Chat & Watchlist

- `POST /api/ai-chat` - AI movie chat
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `DELETE /api/watchlist` - Remove movie from watchlist

### Authentication

Watchlist endpoints require authentication via Bearer token in the `Authorization` header.

## Configuration

The application uses the following configuration:

- **Host**: 0.0.0.0 (accessible from any interface)
- **Port**: 5000
- **Debug Mode**: Enabled in development
- **CORS**: Enabled for all origins

## Data

Currently uses mock data stored in memory. For production:

1. Replace mock data with database integration
2. Add proper user authentication
3. Implement data persistence
4. Add environment variable configuration

## Docker

To run with Docker:

```bash
docker build -t popcornhub-backend .
docker run -p 5000:5000 popcornhub-backend
```

## Testing

### Manual Testing

Use the Swagger UI or tools like Postman to test endpoints.

### Example Requests

Get all movies:
```bash
curl http://localhost:5000/api/movies
```

Search movies:
```bash
curl "http://localhost:5000/api/movies/search?q=inception"
```

AI Chat:
```bash
curl -X POST http://localhost:5000/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Recommend action movies"}'
```

## Project Structure

```
backend/
├── app_connexion.py          # Main Flask application
├── openapi.yaml              # OpenAPI specification
├── requirements.txt          # Python dependencies
├── generated/                # OpenAPI generated code
│   ├── popcornhub_api/       # Generated API server
│   └── ...
├── models/                   # Data models
├── routes/                   # Route handlers
├── static/                   # Static files
└── templates/                # HTML templates
```

## Development

### Adding New Endpoints

1. Update `openapi.yaml` with new endpoint specifications
2. Regenerate code if using OpenAPI generator
3. Implement handlers in `routes/` directory
4. Update this README

### Environment Variables

Create a `.env` file for sensitive configuration:

```
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
```

## Contributing

1. Follow Flask best practices
2. Update OpenAPI spec for API changes
3. Add proper error handling
4. Write tests for new endpoints

## License

This project is licensed under the MIT License.