"""
Train Intent Classifier

This script trains a TF-IDF + Logistic Regression model for intent recognition
using the patterns from intents.json and saves the model to models/intent_clf.pkl.
"""

import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

def train_intent_model():
    # Load intents data
    intents_path = os.path.join('data', 'intents.json')
    with open(intents_path, 'r') as f:
        intents = json.load(f)

    # Prepare training data
    patterns = []
    tags = []
    for intent in intents:
        for pattern in intent['patterns']:
            patterns.append(pattern.lower())  # Normalize to lowercase
            tags.append(intent['tag'])

    # Create and train the pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', LogisticRegression(random_state=42, max_iter=200))
    ])

    pipeline.fit(patterns, tags)

    # Save the model
    model_path = os.path.join('models', 'intent_clf.pkl')
    joblib.dump(pipeline, model_path)

    print(f"Model trained and saved to {model_path}")

if __name__ == "__main__":
    train_intent_model()