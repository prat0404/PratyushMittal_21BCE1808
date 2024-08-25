const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const express = require('express');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const initialPositions = {
    'A-P1': [0, 0], 'A-P2': [0, 1], 'A-H1': [0, 2], 'A-H2': [0, 3], 'A-P3': [0, 4],
    'B-P1': [4, 0], 'B-P2': [4, 1], 'B-H1': [4, 2], 'B-H2': [4, 3], 'B-P3': [4, 4]
};

let gameState = {
    pieces: { ...initialPositions },
    turn: 'A'
};

app.use(express.static(path.join(__dirname, '../client')));

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'INIT', state: gameState }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'MOVE':
                handleMove(data, ws);
                break;
            case 'RESET':
                resetGame();
                broadcast({ type: 'INIT', state: gameState });
                break;
        }
    });
});

function handleMove(data, ws) {
    const { from, to } = data;
    const piece = gameState.pieces[from];
    if (!piece || !isValidMove(piece, from, to)) {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid move' }));
        return;
    }
    // Check if the move is valid
    if (!isMoveAllowed(from, to)) {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Move not allowed' }));
        return;
    }
    gameState.pieces[to] = gameState.pieces[from];
    delete gameState.pieces[from];
    gameState.turn = gameState.turn === 'A' ? 'B' : 'A';
    broadcast({ type: 'UPDATE', state: gameState });
}

function isValidMove(piece, from, to) {
    const pieceType = piece.split('-')[1];
    const [fromRow, fromCol] = from.split('-').map(Number);
    const [toRow, toCol] = to.split('-').map(Number);
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    if (toRow === fromRow) return false; // Can't move onto own starting line

    switch (pieceType) {
        case 'P1':
        case 'P2':
        case 'P3':
            return (rowDiff === 1 && colDiff <= 1) || (rowDiff <= 1 && colDiff === 1); // Pawn moves
        case 'H1':
            return (rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2); // Hero1 moves
        case 'H2':
            return (rowDiff === 2 && colDiff === 2); // Hero2 moves
        default:
            return false;
    }
}

function isMoveAllowed(from, to) {
    const fromPiece = gameState.pieces[from];
    const toPiece = gameState.pieces[to];

    if (!toPiece) return true; // Empty box

    const fromPieceTeam = fromPiece[0];
    const toPieceTeam = toPiece[0];

    return toPieceTeam !== fromPieceTeam; // Can't move to a box with own team piece
}

function resetGame() {
    gameState = {
        pieces: { ...initialPositions },
        turn: 'A'
    };
}

function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
