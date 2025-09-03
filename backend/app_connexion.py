#!/usr/bin/env python3

from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Import the chatbot
# from chatbot import PopcornHubChatbot
from chatbot import PopcornHubChatbot

app = Flask(__name__)
CORS(app)

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

# Mock watchlist - in production, this would be in a database
WATCHLISTS = {}

# API Routes
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

@app.route('/api/movies', methods=['GET'])
def get_movies():
    q = request.args.get('q', '').lower()
    genre = request.args.get('genre', '').lower()
    limit = request.args.get('limit')
    offset = request.args.get('offset')

    filtered_movies = MOVIES

    if q:
        filtered_movies = [m for m in filtered_movies if q in m['title'].lower() or q in m['description'].lower()]

    if genre:
        filtered_movies = [m for m in filtered_movies if any(g.lower() == genre for g in m['genre'])]

    if offset:
        filtered_movies = filtered_movies[int(offset):]

    if limit:
        filtered_movies = filtered_movies[:int(limit)]

    return jsonify(filtered_movies)

@app.route('/api/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    movie = next((m for m in MOVIES if m['id'] == movie_id), None)
    if movie:
        return jsonify(movie)
    return jsonify({"error": "Movie not found"}), 404

@app.route('/api/movies/recommendations', methods=['GET'])
def get_recommendations():
    limit = request.args.get('limit')
    recommendations = sorted(MOVIES, key=lambda x: x['rating'], reverse=True)
    if limit:
        recommendations = recommendations[:int(limit)]
    return jsonify(recommendations)

@app.route('/api/movies/search', methods=['GET'])
def search_movies():
    q = request.args.get('q', '')
    limit = request.args.get('limit')

    if not q:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    results = []
    for movie in MOVIES:
        if q.lower() in movie['title'].lower() or q.lower() in movie['description'].lower():
            results.append({
                "id": movie['id'],
                "title": movie['title'],
                "poster": movie['poster'],
                "rating": movie['rating'],
                "year": movie['releaseYear']
            })

    if limit:
        results = results[:int(limit)]

    return jsonify(results)

@app.route('/api/ai-chat', methods=['POST'])
def ai_chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400

    user_message = data['message']

    # Initialize chatbot
    bot = PopcornHubChatbot()

    # Get user ID from request (default if not provided)
    user_id = request.headers.get('X-User-ID', 'default_user')

    # Predict intent and extract entities
    intent, confidence = bot.predict_intent(user_message)
    entities = bot.extract_entities(user_message)

    if confidence < 0.6:
        intent = 'fallback'

    # Get response from chatbot
    bot_response = bot.get_response(intent, entities, user_message)

    # Update memory
    bot.update_memory(user_id, intent, entities)

    # Create suggestions based on intent
    suggestions = []
    if intent == 'suggest_movie' and 'genre' in entities:
        # Filter movies by genre
        genre_movies = [m for m in MOVIES if any(g.lower() == entities['genre'] for g in m['genre'])]
        if genre_movies:
            for movie in genre_movies[:3]:  # Limit to 3 suggestions
                suggestions.append({
                    "id": movie['id'],
                    "title": movie['title'],
                    "poster": movie['poster'],
                    "year": movie['releaseYear'],
                    "rating": movie['rating']
                })
    elif intent in ['suggest_movie', 'greeting']:
        # General recommendations
        top_movies = sorted(MOVIES, key=lambda x: x['rating'], reverse=True)[:3]
        for movie in top_movies:
            suggestions.append({
                "id": movie['id'],
                "title": movie['title'],
                "poster": movie['poster'],
                "year": movie['releaseYear'],
                "rating": movie['rating']
            })

    response = {
        "text": bot_response,
        "suggestions": suggestions
    }

    return jsonify(response)

@app.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    user_id = request.headers.get('X-User-ID', 'anonymous')
    return jsonify(WATCHLISTS.get(user_id, []))

@app.route('/api/watchlist', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    if not data or 'movie_id' not in data:
        return jsonify({"error": "movie_id is required"}), 400

    user_id = request.headers.get('X-User-ID', 'anonymous')

    if user_id not in WATCHLISTS:
        WATCHLISTS[user_id] = []

    movie_id = data['movie_id']
    if movie_id not in WATCHLISTS[user_id]:
        WATCHLISTS[user_id].append(movie_id)

    return jsonify({"message": "Movie added to watchlist"})

@app.route('/api/watchlist', methods=['DELETE'])
def remove_from_watchlist():
    data = request.get_json()
    if not data or 'movie_id' not in data:
        return jsonify({"error": "movie_id is required"}), 400

    user_id = request.headers.get('X-User-ID', 'anonymous')
    movie_id = data['movie_id']

    if user_id in WATCHLISTS and movie_id in WATCHLISTS[user_id]:
        WATCHLISTS[user_id].remove(movie_id)
        return jsonify({"message": "Movie removed from watchlist"})

    return jsonify({"error": "Movie not in watchlist"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)