import connexion
from typing import Dict
from typing import Tuple
from typing import Union
from typing import List
import sys
import os

# Add chatbot directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'chatbot'))

from models.ai_chat_post_request import AiChatPostRequest  # noqa: E501
from models.chat_response import ChatResponse  # noqa: E501
from models.error import Error  # noqa: E501
from models.health_get200_response import HealthGet200Response  # noqa: E501
from models.movie import Movie  # noqa: E501
from models.movie_suggestion import MovieSuggestion  # noqa: E501
from models.watchlist_delete200_response import WatchlistDelete200Response  # noqa: E501
from models.watchlist_post200_response import WatchlistPost200Response  # noqa: E501
from models.watchlist_request import WatchlistRequest  # noqa: E501
from models.cast_member import CastMember
from models.related_movie import RelatedMovie
from chatbot.chatbot import PopcornHubChatbot

# Mock movie data - in production, this would come from a database
MOVIES = [
    Movie(
        id=1,
        title="Inception",
        description="A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
        genre=["Sci-Fi", "Action", "Thriller"],
        rating=8.8,
        release_year=2010,
        duration="148 min",
        director="Christopher Nolan",
        cast=[
            CastMember(name="Leonardo DiCaprio", role="Dom Cobb"),
            CastMember(name="Marion Cotillard", role="Mal Cobb"),
            CastMember(name="Tom Hardy", role="Eames")
        ],
        poster="https://via.placeholder.com/600x900/1a1a1a/ffffff?text=Inception+Poster",
        trailer_url="https://www.youtube.com/embed/YoHD9XEInc0",
        related_movies=[
            RelatedMovie(id=2, title="Interstellar", poster="https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Interstellar", rating=8.6),
            RelatedMovie(id=3, title="The Dark Knight", poster="https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dark+Knight", rating=9.0)
        ]
    ),
    Movie(
        id=2,
        title="The Shawshank Redemption",
        description="Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        genre=["Drama"],
        rating=9.3,
        release_year=1994,
        duration="142 min",
        director="Frank Darabont",
        cast=[
            CastMember(name="Tim Robbins", role="Andy Dufresne"),
            CastMember(name="Morgan Freeman", role="Ellis Redding")
        ],
        poster="https://via.placeholder.com/600x900/1a1a1a/ffffff?text=Shawshank",
        trailer_url="https://www.youtube.com/embed/6hB3S9bIaco",
        related_movies=[
            Movie(id=1, title="Inception", poster="https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception", rating=8.8)
        ]
    )
]

# Mock watchlist - in production, this would be in a database
WATCHLISTS = {}

def ai_chat_post(body):  # noqa: E501
    """AI movie chat

    Get movie recommendations through AI chat # noqa: E501

    :param ai_chat_post_request:
    :type ai_chat_post_request: dict | bytes

    :rtype: Union[ChatResponse, Tuple[ChatResponse, int], Tuple[ChatResponse, int, Dict[str, str]]
    """
    ai_chat_post_request = AiChatPostRequest.from_dict(body) if isinstance(body, dict) else body

    user_message = ai_chat_post_request.message

    # Change to chatbot directory for file access
    original_cwd = os.getcwd()
    chatbot_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'chatbot')
    os.chdir(chatbot_dir)

    try:
        # Initialize chatbot
        bot = PopcornHubChatbot()

        # Get user ID from request (default if not provided)
        user_id = connexion.request.headers.get('X-User-ID', 'default_user')

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
            genre_movies = [m for m in MOVIES if any(g.lower() == entities['genre'] for g in m.genre)]
            if genre_movies:
                for movie in genre_movies[:3]:  # Limit to 3 suggestions
                    suggestions.append(MovieSuggestion(
                        id=movie.id,
                        title=movie.title,
                        poster=movie.poster,
                        year=movie.release_year,
                        rating=movie.rating
                    ))
        elif intent in ['suggest_movie', 'greeting']:
            # General recommendations
            top_movies = sorted(MOVIES, key=lambda x: x.rating, reverse=True)[:3]
            for movie in top_movies:
                suggestions.append(MovieSuggestion(
                    id=movie.id,
                    title=movie.title,
                    poster=movie.poster,
                    year=movie.release_year,
                    rating=movie.rating
                ))

        response = ChatResponse(
            text=bot_response,
            suggestions=suggestions
        )

    finally:
        # Restore original working directory
        os.chdir(original_cwd)

    return response


def health_get():  # noqa: E501
    """Health check

    Check if the API is running # noqa: E501


    :rtype: Union[HealthGet200Response, Tuple[HealthGet200Response, int], Tuple[HealthGet200Response, int, Dict[str, str]]
    """
    return HealthGet200Response(status="healthy")


def movies_get(q=None, genre=None, limit=None, offset=None):  # noqa: E501
    """Get movies

    Retrieve a list of movies with optional filtering # noqa: E501

    :param q: Search query for movie title or description
    :type q: str
    :param genre: Filter by genre
    :type genre: str
    :param limit: Maximum number of movies to return
    :type limit: int
    :param offset: Number of movies to skip
    :type offset: int

    :rtype: Union[List[Movie], Tuple[List[Movie], int], Tuple[List[Movie], int, Dict[str, str]]
    """
    filtered_movies = MOVIES

    if q:
        filtered_movies = [m for m in filtered_movies if q.lower() in m.title.lower() or q.lower() in m.description.lower()]

    if genre:
        filtered_movies = [m for m in filtered_movies if any(g.lower() == genre.lower() for g in m.genre)]

    if offset:
        filtered_movies = filtered_movies[offset:]

    if limit:
        filtered_movies = filtered_movies[:limit]

    return filtered_movies


def movies_movie_id_get(movie_id):  # noqa: E501
    """Get movie by ID

    Retrieve detailed information about a specific movie # noqa: E501

    :param movie_id: Movie ID
    :type movie_id: int

    :rtype: Union[Movie, Tuple[Movie, int], Tuple[Movie, int, Dict[str, str]]
    """
    movie = next((m for m in MOVIES if m.id == movie_id), None)
    if movie:
        return movie
    return Error(error="Movie not found"), 404


def movies_recommendations_get(limit=None):  # noqa: E501
    """Get movie recommendations

    Retrieve personalized movie recommendations # noqa: E501

    :param limit: Maximum number of recommendations to return
    :type limit: int

    :rtype: Union[List[Movie], Tuple[List[Movie], int], Tuple[List[Movie], int, Dict[str, str]]
    """
    # Simple recommendation logic - return top rated movies
    recommendations = sorted(MOVIES, key=lambda x: x.rating, reverse=True)
    if limit:
        recommendations = recommendations[:limit]
    return recommendations


def movies_search_get(q, limit=None):  # noqa: E501
    """Search movies

    Search for movies by title, description, or other criteria # noqa: E501

    :param q: Search query
    :type q: str
    :param limit: Maximum number of results to return
    :type limit: int

    :rtype: Union[List[MovieSuggestion], Tuple[List[MovieSuggestion], int], Tuple[List[MovieSuggestion], int, Dict[str, str]]
    """
    results = []
    for movie in MOVIES:
        if q.lower() in movie.title.lower() or q.lower() in movie.description.lower():
            results.append(MovieSuggestion(
                id=movie.id,
                title=movie.title,
                poster=movie.poster,
                year=movie.release_year,
                rating=movie.rating
            ))

    if limit:
        results = results[:limit]

    return results


def watchlist_delete(body):  # noqa: E501
    """Remove movie from watchlist

    Remove a movie from the current user's watchlist # noqa: E501

    :param watchlist_request:
    :type watchlist_request: dict | bytes

    :rtype: Union[WatchlistDelete200Response, Tuple[WatchlistDelete200Response, int], Tuple[WatchlistDelete200Response, int, Dict[str, str]]
    """
    watchlist_request = WatchlistRequest.from_dict(body) if isinstance(body, dict) else body

    # In production, get user_id from JWT token
    user_id = connexion.request.headers.get('X-User-ID', 'anonymous')

    movie_id = watchlist_request.movie_id
    if user_id in WATCHLISTS and movie_id in WATCHLISTS[user_id]:
        WATCHLISTS[user_id].remove(movie_id)
        return WatchlistDelete200Response(message="Movie removed from watchlist")

    return Error(error="Movie not in watchlist"), 404


def watchlist_get():  # noqa: E501
    """Get user watchlist

    Retrieve the current user's watchlist # noqa: E501


    :rtype: Union[List[int], Tuple[List[int], int], Tuple[List[int], int, Dict[str, str]]
    """
    # In production, get user_id from JWT token
    user_id = connexion.request.headers.get('X-User-ID', 'anonymous')
    return WATCHLISTS.get(user_id, [])


def watchlist_post(body):  # noqa: E501
    """Add movie to watchlist

    Add a movie to the current user's watchlist # noqa: E501

    :param watchlist_request:
    :type watchlist_request: dict | bytes

    :rtype: Union[WatchlistPost200Response, Tuple[WatchlistPost200Response, int], Tuple[WatchlistPost200Response, int, Dict[str, str]]
    """
    watchlist_request = WatchlistRequest.from_dict(body) if isinstance(body, dict) else body

    # In production, get user_id from JWT token
    user_id = connexion.request.headers.get('X-User-ID', 'anonymous')

    if user_id not in WATCHLISTS:
        WATCHLISTS[user_id] = []

    movie_id = watchlist_request.movie_id
    if movie_id not in WATCHLISTS[user_id]:
        WATCHLISTS[user_id].append(movie_id)

    return WatchlistPost200Response(message="Movie added to watchlist")
