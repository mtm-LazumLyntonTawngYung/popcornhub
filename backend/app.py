from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from routes.movies import movies_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register blueprints
app.register_blueprint(movies_bp, url_prefix='/api')

# Basic route
@app.route('/')
def hello():
    return jsonify({"message": "Welcome to PopcornHub Backend API"})

# Health check
@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

# Mock watchlist - in production, this would be in a database
WATCHLISTS = {}

@app.route('/api/watchlist', methods=['GET', 'POST', 'DELETE'])
def handle_watchlist():
    """Handle user watchlist operations"""
    # In production, verify Firebase token here
    user_id = request.headers.get('X-User-ID', 'anonymous')

    if request.method == 'GET':
        return jsonify(WATCHLISTS.get(user_id, []))
    elif request.method == 'POST':
        data = request.get_json()
        if not data or 'movie_id' not in data:
            return jsonify({"error": "movie_id is required"}), 400

        if user_id not in WATCHLISTS:
            WATCHLISTS[user_id] = []

        movie_id = data['movie_id']
        if movie_id not in WATCHLISTS[user_id]:
            WATCHLISTS[user_id].append(movie_id)

        return jsonify({"message": "Movie added to watchlist"})
    elif request.method == 'DELETE':
        data = request.get_json()
        if not data or 'movie_id' not in data:
            return jsonify({"error": "movie_id is required"}), 400

        movie_id = data['movie_id']
        if user_id in WATCHLISTS and movie_id in WATCHLISTS[user_id]:
            WATCHLISTS[user_id].remove(movie_id)
            return jsonify({"message": "Movie removed from watchlist"})

        return jsonify({"error": "Movie not in watchlist"}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)