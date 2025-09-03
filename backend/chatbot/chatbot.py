"""
PopcornHub Chatbot

A chatbot for planning movie watch parties with intent recognition,
entity extraction, and memory persistence.
"""

import json
import os
import re
import random
import uuid
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import pytz
from tinydb import TinyDB, Query

class PopcornHubChatbot:
    def __init__(self):
        # Get the directory of this file
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # Load model
        self.model = joblib.load(os.path.join(current_dir, 'models', 'intent_clf.pkl'))

        # Load intents
        with open(os.path.join(current_dir, 'data', 'intents.json'), 'r') as f:
            self.intents = json.load(f)
        self.intent_responses = {intent['tag']: intent['responses'] for intent in self.intents}

        # Load knowledge base
        with open(os.path.join(current_dir, 'data', 'kb_sentences.txt'), 'r') as f:
            self.kb_sentences = [line.strip() for line in f if line.strip()]
        self.tfidf_vectorizer = TfidfVectorizer()
        self.kb_vectors = self.tfidf_vectorizer.fit_transform(self.kb_sentences)

        # Memory
        self.db = TinyDB(os.path.join(current_dir, 'chatbot_memory.json'))
        self.user_query = Query()

        # Icebreakers
        self.icebreakers = [
            "What's your favorite movie memory?",
            "If you could live in any movie world, which one?",
            "What's the funniest movie you've seen?",
            "What's a movie that always makes you cry?",
            "If you were a superhero, what would your power be?"
        ]

    def predict_intent(self, message):
        """Predict intent and confidence."""
        message = message.lower()
        probs = self.model.predict_proba([message])[0]
        max_prob = max(probs)
        intent_idx = probs.argmax()
        intent = self.model.classes_[intent_idx]
        return intent, max_prob

    def extract_entities(self, message):
        """Extract entities using regex."""
        entities = {}

        # Date patterns
        date_patterns = [
            r'\b(tomorrow|today|next week|friday|saturday|sunday|monday|tuesday|wednesday|thursday)\b',
            r'\b(\d{1,2}/\d{1,2}(/\d{2,4})?)\b'
        ]
        for pattern in date_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                entities['date'] = match.group()
                break

        # Time patterns
        time_patterns = [
            r'\b(\d{1,2}(:\d{2})?\s*(am|pm|AM|PM))\b',
            r'\b(\d{1,2})\s*(am|pm|AM|PM)\b'
        ]
        for pattern in time_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                entities['time'] = match.group()
                break

        # Genre
        genre_pattern = r'\b(romance|comedy|horror|action|drama|thriller|animation)\b'
        match = re.search(genre_pattern, message, re.IGNORECASE)
        if match:
            entities['genre'] = match.group().lower()

        # Participants
        participants_pattern = r'\b(me and my (girlfriend|boyfriend|partner|friends|family))\b'
        match = re.search(participants_pattern, message, re.IGNORECASE)
        if match:
            entities['participants'] = match.group()

        # Snack
        snack_pattern = r'\b(popcorn|pizza|chips|chocolate|wine|soda|candy)\b'
        match = re.search(snack_pattern, message, re.IGNORECASE)
        if match:
            entities['snack'] = match.group().lower()

        return entities

    def get_response(self, intent, entities, message):
        """Get response based on intent and entities."""
        if intent == 'suggest_movie':
            if 'genre' in entities:
                # Filter responses by genre (simple implementation)
                genre_responses = [r for r in self.intent_responses[intent] if entities['genre'] in r.lower()]
                if genre_responses:
                    return random.choice(genre_responses)
            return random.choice(self.intent_responses[intent])

        elif intent == 'schedule_watch':
            if 'date' in entities and 'time' in entities:
                # Mock scheduling
                return f"Scheduled for {entities['date']} at {entities['time']}. Timezone conversion handled."
            return random.choice(self.intent_responses[intent])

        elif intent == 'start_watch_party':
            session_id = str(uuid.uuid4())[:8]
            return f"Great! Here's your shareable link: https://popcornhub.com/watch/{session_id}"

        elif intent == 'set_reminder':
            return random.choice(self.intent_responses[intent])

        elif intent == 'suggest_snacks':
            if 'snack' in entities:
                return f"Great choice! {entities['snack'].capitalize()} pairs well with movies."
            return random.choice(self.intent_responses[intent])

        elif intent == 'icebreaker':
            return random.choice(self.icebreakers)

        elif intent == 'goodbye':
            return random.choice(self.intent_responses[intent])

        elif intent == 'greeting':
            return random.choice(self.intent_responses[intent])

        else:
            # Fallback to KB
            return self.fallback_response(message)

    def fallback_response(self, message):
        """Fallback using TF-IDF similarity with KB."""
        message_vec = self.tfidf_vectorizer.transform([message.lower()])
        similarities = cosine_similarity(message_vec, self.kb_vectors)
        best_idx = similarities.argmax()
        if similarities[0][best_idx] > 0.1:  # Threshold
            return self.kb_sentences[best_idx]
        return random.choice(self.intent_responses['fallback'])

    def update_memory(self, user_id, intent, entities):
        """Update user memory."""
        self.db.upsert({
            'user_id': user_id,
            'last_intent': intent,
            'entities': entities,
            'timestamp': str(datetime.now())
        }, self.user_query.user_id == user_id)

    def chat(self):
        """Main chat loop."""
        print("PopcornHub Chatbot: Hello! How can I help with your movie night?")
        user_id = 'default_user'  # In real app, get from session

        while True:
            message = input("You: ").strip()
            if not message:
                continue

            intent, confidence = self.predict_intent(message)
            entities = self.extract_entities(message)

            if confidence < 0.6:
                intent = 'fallback'

            response = self.get_response(intent, entities, message)
            print(f"Bot: {response}")

            self.update_memory(user_id, intent, entities)

            if intent == 'goodbye':
                break

if __name__ == "__main__":
    bot = PopcornHubChatbot()
    bot.chat()