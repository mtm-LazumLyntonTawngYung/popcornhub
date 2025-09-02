import unittest

from flask import json

from popcornhub_api.models.ai_chat_post_request import AiChatPostRequest  # noqa: E501
from popcornhub_api.models.chat_response import ChatResponse  # noqa: E501
from popcornhub_api.models.error import Error  # noqa: E501
from popcornhub_api.models.health_get200_response import HealthGet200Response  # noqa: E501
from popcornhub_api.models.movie import Movie  # noqa: E501
from popcornhub_api.models.movie_suggestion import MovieSuggestion  # noqa: E501
from popcornhub_api.models.watchlist_delete200_response import WatchlistDelete200Response  # noqa: E501
from popcornhub_api.models.watchlist_post200_response import WatchlistPost200Response  # noqa: E501
from popcornhub_api.models.watchlist_request import WatchlistRequest  # noqa: E501
from popcornhub_api.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_ai_chat_post(self):
        """Test case for ai_chat_post

        AI movie chat
        """
        ai_chat_post_request = popcornhub_api.AiChatPostRequest()
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/api/ai-chat',
            method='POST',
            headers=headers,
            data=json.dumps(ai_chat_post_request),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_health_get(self):
        """Test case for health_get

        Health check
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/health',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_movies_get(self):
        """Test case for movies_get

        Get movies
        """
        query_string = [('q', 'q_example'),
                        ('genre', 'genre_example'),
                        ('limit', 20),
                        ('offset', 0)]
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/movies',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_movies_movie_id_get(self):
        """Test case for movies_movie_id_get

        Get movie by ID
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/movies/{movie_id}'.format(movie_id=56),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_movies_recommendations_get(self):
        """Test case for movies_recommendations_get

        Get movie recommendations
        """
        query_string = [('limit', 10)]
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/movies/recommendations',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_movies_search_get(self):
        """Test case for movies_search_get

        Search movies
        """
        query_string = [('q', 'q_example'),
                        ('limit', 20)]
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/api/movies/search',
            method='GET',
            headers=headers,
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_watchlist_delete(self):
        """Test case for watchlist_delete

        Remove movie from watchlist
        """
        watchlist_request = {"movie_id":1}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/watchlist',
            method='DELETE',
            headers=headers,
            data=json.dumps(watchlist_request),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_watchlist_get(self):
        """Test case for watchlist_get

        Get user watchlist
        """
        headers = { 
            'Accept': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/watchlist',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_watchlist_post(self):
        """Test case for watchlist_post

        Add movie to watchlist
        """
        watchlist_request = {"movie_id":1}
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer special-key',
        }
        response = self.client.open(
            '/api/watchlist',
            method='POST',
            headers=headers,
            data=json.dumps(watchlist_request),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
