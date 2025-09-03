# PopcornHub Chatbot

A Python-based chatbot for PopcornHub, designed to help long-distance couples and groups plan and enjoy movie watch parties online. It uses TF-IDF and Logistic Regression for intent recognition, extracts entities via regex, and provides responses based on predefined intents.

## Features

- **Intent Recognition**: Supports greeting, movie suggestions, scheduling, watch party creation, reminders, snack suggestions, icebreakers, and goodbye.
- **Entity Extraction**: Extracts dates, times, genres, participants, and snacks from user messages.
- **Fallback Handling**: Uses TF-IDF similarity against a knowledge base for unknown queries.
- **Memory Persistence**: Stores user preferences and conversation context using TinyDB.
- **Timezone Support**: Basic handling for scheduling across time zones.
- **Modular Design**: Easy to extend with new intents and features.

## Project Structure

```
chatbot/
├── data/
│   ├── intents.json      # Intent patterns and responses
│   └── kb_sentences.txt  # Knowledge base for fallback
├── models/
│   └── intent_clf.pkl    # Trained intent classifier
├── train_intent.py       # Script to train the model
├── chatbot.py            # Main chatbot application
├── requirements.txt      # Python dependencies
└── README.md             # This file
```

## Setup Instructions

1. **Clone or navigate to the project directory**:
   ```
   cd path/to/PopcornHub/chatbot
   ```

2. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

3. **Train the intent model**:
   ```
   python train_intent.py
   ```
   This will generate `models/intent_clf.pkl`.

4. **Run the chatbot**:
   ```
   python chatbot.py
   ```

## Usage

- Start a conversation by typing messages like "hello", "suggest a movie", or "schedule a watch".
- The bot will respond based on recognized intents and extracted entities.
- Type "bye" to end the conversation.

### Example Interaction

```
PopcornHub Chatbot: Hello! Ready for a movie night?
You: suggest a horror movie
Bot: If you want horror, 'The Conjuring' is a solid pick.
You: schedule for tomorrow at 8pm
Bot: Scheduled for tomorrow at 8pm. Timezone conversion handled.
You: bye
Bot: Goodbye! Enjoy your movie night.
```

## Extending the Chatbot

### Adding New Intents

1. Edit `data/intents.json`:
   ```json
   {
     "tag": "new_intent",
     "patterns": ["example pattern", "another pattern"],
     "responses": ["Response 1", "Response 2"]
   }
   ```

2. Retrain the model:
   ```
   python train_intent.py
   ```

3. Update `chatbot.py` to handle the new intent in `get_response()`.

### Adding Entities

Modify the `extract_entities()` method in `chatbot.py` with new regex patterns.

### Knowledge Base

Add more sentences to `data/kb_sentences.txt` for better fallback responses.

## Dependencies

- scikit-learn: For TF-IDF and Logistic Regression
- nltk: Natural language processing (though minimally used here)
- tinydb: Lightweight database for memory
- pytz: Timezone handling

## Notes

- The model uses a confidence threshold of 0.6; below this, it falls back to the knowledge base.
- Memory is stored in `chatbot_memory.json`.
- For production, consider integrating with a web framework like Flask for a web interface.