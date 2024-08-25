document.addEventListener('DOMContentLoaded', function () {
    // Select the board and all boxes
    const board = document.querySelector('.container');
    const boxes = Array.from(document.querySelectorAll('.box'));
    let selectedBox = null; // To keep track of the selected box
    let turn = 'A'; // Starting turn

    // Initial positions of pieces
    const initialPositions = {
        'A-P1': [0, 0], 'A-P2': [0, 1], 'A-H1': [0, 2], 'A-H2': [0, 3], 'A-P3': [0, 4],
        'B-P1': [4, 0], 'B-P2': [4, 1], 'B-H1': [4, 2], 'B-H2': [4, 3], 'B-P3': [4, 4]
    };

    // Initialize the board with pieces
    function initializeBoard() {
        for (const piece in initialPositions) {
            const [row, col] = initialPositions[piece];
            const index = row * 5 + col; // Convert row and col to index
            boxes[index].textContent = piece; // Set piece name in the box
            boxes[index].setAttribute('data-piece', piece); // Store piece info in data attribute
        }
    }

    // Check if a move is valid based on piece type and move distance
    function isValidMove(fromIndex, toIndex, piece) {
        const pieceType = piece.split('-')[1]; // Extract piece type
        const fromRow = Math.floor(fromIndex / 5);
        const fromCol = fromIndex % 5;
        const toRow = Math.floor(toIndex / 5);
        const toCol = toIndex % 5;
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        if (toRow === fromRow) return false; // Can't move onto own starting line

        // Check moves based on piece type
        switch (pieceType) {
            case 'P1':
            case 'P2':
            case 'P3':
                // Pawn moves: one block in any direction
                return (rowDiff === 1 && colDiff <= 1) || (rowDiff <= 1 && colDiff === 1);
            case 'H1':
                // Hero1 moves: two blocks straight
                return (rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2);
            case 'H2':
                // Hero2 moves: two blocks diagonally
                return (rowDiff === 2 && colDiff === 2);
            default:
                return false;
        }
    }

    // Remove highlight from all boxes
    function clearHighlights() {
        boxes.forEach(box => box.classList.remove('highlight'));
    }

    // Highlight valid moves for the selected piece
    function highlightValidMoves(piece) {
        const index = boxes.indexOf(selectedBox);
        boxes.forEach((box, i) => {
            if (isValidMove(index, i, piece) && isMoveAllowed(index, i)) {
                box.classList.add('highlight');
            }
        });
    }

    // Check if moving to the target box is allowed based on the team
    function isMoveAllowed(fromIndex, toIndex) {
        const fromPiece = boxes[fromIndex].getAttribute('data-piece');
        const toPiece = boxes[toIndex].getAttribute('data-piece');

        if (!toPiece) return true; // Target box is empty

        const toPieceTeam = toPiece[0];
        const fromPieceTeam = fromPiece[0];

        return toPieceTeam !== fromPieceTeam; // Can't move to a box with own team piece
    }

    // Move the piece from one box to another
    function movePiece(fromBox, toBox) {
        toBox.textContent = fromBox.textContent; // Move piece text
        toBox.setAttribute('data-piece', fromBox.getAttribute('data-piece')); // Move piece data
        fromBox.textContent = ''; // Clear source box
        fromBox.removeAttribute('data-piece'); // Remove data from source box
    }

    // Switch turn between players
    function switchTurn() {
        turn = (turn === 'A') ? 'B' : 'A'; // Toggle turn
        document.querySelector('.turn-indicator').textContent = `Player ${turn}'s Turn`; // Update turn indicator
    }

    // Check if there's a winner
    function checkWin() {
        const playerAPieces = boxes.some(box => box.textContent.startsWith('A-'));
        const playerBPieces = boxes.some(box => box.textContent.startsWith('B-'));

        if (!playerAPieces) return 'Player B Wins!';
        if (!playerBPieces) return 'Player A Wins!';
        return null; // No winner yet
    }

    // Handle board clicks
    board.addEventListener('click', function (event) {
        const clickedBox = event.target;

        if (!clickedBox.classList.contains('box')) return; // Clicked outside of boxes

        if (selectedBox) {
            const selectedPiece = selectedBox.getAttribute('data-piece');
            const clickedPiece = clickedBox.getAttribute('data-piece');

            if (clickedBox === selectedBox) {
                // Deselect the selected box
                clearHighlights();
                selectedBox.classList.remove('selected');
                selectedBox = null;
            } else if (clickedBox.classList.contains('highlight')) {
                // Move piece to the highlighted box
                movePiece(selectedBox, clickedBox);
                clearHighlights();
                selectedBox.classList.remove('selected');
                selectedBox = null;
                const winner = checkWin();
                if (winner) {
                    alert(winner); // Display winner
                } else {
                    switchTurn(); // Switch turn if no winner
                }
            } else {
                // Select a new piece if valid
                clearHighlights();
                if (clickedPiece && clickedPiece[0] === turn) {
                    clickedBox.classList.add('selected');
                    selectedBox = clickedBox;
                    highlightValidMoves(selectedPiece);
                }
            }
        } else {
            // Select a piece if none is currently selected
            const piece = clickedBox.getAttribute('data-piece');
            if (piece && piece[0] === turn) {
                clickedBox.classList.add('selected');
                selectedBox = clickedBox;
                highlightValidMoves(piece);
            }
        }
    });

    initializeBoard(); // Initialize the board when the page loads
});
