# Pratyush_Mittal_21BCE1808_SD_Assignment 

## Project Overview

This project is a chess-inspired game designed with a server-client architecture, utilizing WebSocket for real-time communication. The game takes place on a 5x5 grid where two players compete, each commanding characters with distinct movement abilities.

```
/chess-game
├── /client
│   ├── index.html       # The main HTML file for the client-side interface
│   ├── styles.css       # CSS file for styling the client-side interface
│   └── chess.js         # JavaScript file for client-side game logic
├── /server
│   └── server.js        # JavaScript file for server-side logic and WebSocket handling
├── package.json         # npm package configuration file
└── package-lock.json    # npm package lock file
```

### Client Directory

- **`index.html`**: Contains the HTML layout for the game board.
- **`styles.css`**: Provides the styling for the game board and pieces.
- **`chess.js`**: Implements the game logic and handles user interactions.

### Server Directory

- **`server.js`**: Sets up an Express server and WebSocket communication for real-time game updates.

## Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd chess-game

2. **Install Dependencies:**
   ```bash
   npm install

4. **Start the Server**
   ```bash
   npm start

## How to Play

   Click on a piece to select it.
   Click on a highlighted square to move the piece.
   The turn indicator will update to show whose turn it is.
   The game will notify you when a player wins.

## Video

https://github.com/user-attachments/assets/7161bc88-40c5-4835-a40c-d1dae0455001




## Dependencies

   Express: Web server framework.
   ws: WebSocket library for real-time communication.



