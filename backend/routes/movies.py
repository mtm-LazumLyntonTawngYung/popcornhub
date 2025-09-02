from flask import Blueprint, jsonify, request

movies_bp = Blueprint('movies', __name__)

# Mock movie data - in production, this would come from a database
MOVIES = [
    {
        "id": 1,
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        "genre": ["Sci-Fi", "Action", "Thriller"],
        "rating": 8.8,
        "releaseYear": 2010,
        "duration": "148 min",
        "director": "Christopher Nolan",
        "cast": [
            {"name": "Leonardo DiCaprio", "role": "Dom Cobb"},
            {"name": "Marion Cotillard", "role": "Mal Cobb"},
            {"name": "Tom Hardy", "role": "Eames"}
        ],
        "poster": "https://via.placeholder.com/600x900/1a1a1a/ffffff?text=Inception+Poster",
        "trailerUrl": "https://www.youtube.com/embed/YoHD9XEInc0",
        "relatedMovies": [
            {"id": 2, "title": "Interstellar", "poster": "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Interstellar", "rating": 8.6},
            {"id": 3, "title": "The Dark Knight", "poster": "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dark+Knight", "rating": 9.0}
        ]
    },
    {
        "id": 2,
        "title": "The Shawshank Redemption",
        "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "genre": ["Drama"],
        "rating": 9.3,
        "releaseYear": 1994,
        "duration": "142 min",
        "director": "Frank Darabont",
        "cast": [
            {"name": "Tim Robbins", "role": "Andy Dufresne"},
            {"name": "Morgan Freeman", "role": "Ellis Redding"}
        ],
        "poster": "https://via.placeholder.com/600x900/1a1a1a/ffffff?text=Shawshank",
        "trailerUrl": "https://www.youtube.com/embed/6hB3S9bIaco",
        "relatedMovies": [
            {"id": 1, "title": "Inception", "poster": "https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception", "rating": 8.8}
        ]
    }
]

@movies_bp.route('/movies', methods=['GET'])
def get_movies():
    """Get all movies or search by query"""
    query = request.args.get('q', '').lower()
    genre = request.args.get('genre', '').lower()

    filtered_movies = MOVIES

    if query:
        filtered_movies = [m for m in filtered_movies if query in m['title'].lower() or query in m['description'].lower()]

    if genre:
        filtered_movies = [m for m in filtered_movies if any(g.lower() == genre for g in m['genre'])]

    return jsonify(filtered_movies)

@movies_bp.route('/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    """Get movie details by ID"""
    movie = next((m for m in MOVIES if m['id'] == movie_id), None)
    if movie:
        return jsonify(movie)
    return jsonify({"error": "Movie not found"}), 404

@movies_bp.route('/movies/recommendations', methods=['GET'])
def get_recommendations():
    """Get movie recommendations"""
    # Simple recommendation logic - return top rated movies
    recommendations = sorted(MOVIES, key=lambda x: x['rating'], reverse=True)[:5]
    return jsonify(recommendations)

@movies_bp.route('/movies/search', methods=['GET'])
def search_movies():
    """Search movies by title or description"""
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    results = []
    for movie in MOVIES:
        if query.lower() in movie['title'].lower() or query.lower() in movie['description'].lower():
            results.append({
                "id": movie['id'],
                "title": movie['title'],
                "poster": movie['poster'],
                "rating": movie['rating'],
                "year": movie['releaseYear']
            })

    return jsonify(results)

@movies_bp.route('/ai-chat', methods=['POST'])
def ai_chat():
    """Handle AI chat for movie recommendations"""
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400

    user_message = data['message'].lower()

    # Simple AI logic - in production, integrate with OpenAI or similar
    response = {
        "text": "I understand you're looking for movie recommendations. Here are some suggestions:",
        "suggestions": []
    }

    if 'recommend' in user_message or 'suggest' in user_message:
        response["suggestions"] = [
            {"id": 1, "title": "Inception", "poster": "https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Inception", "year": 2010, "rating": 8.8},
            {"id": 2, "title": "The Shawshank Redemption", "poster": "https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Shawshank", "year": 1994, "rating": 9.3}
        ]
    elif 'action' in user_message:
        response["text"] = "For action movies, I recommend:"
        response["suggestions"] = [
            {"id": 1, "title": "Inception", "poster": "https://via.placeholder.com/100x150/1a1a1a/ffffff?text=Inception", "year": 2010, "rating": 8.8}
        ]
    else:
        response["text"] = "I'm here to help with movie recommendations! Try asking for recommendations or search for specific genres."

    return jsonify(response)