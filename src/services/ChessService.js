// ChessService.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ChessServiceContext = createContext();

export const ChessServiceProvider = ({ children }) => {
  const [chessPieces, setChessPieces] = useState([
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ]);

  const [selectedPiece, setSelectedPiece] = useState(null);

  const [enPassantAvailable, setEnPassantAvailable] = useState(false);
  const [enPassantPawnRow, setEnPassantPawnRow] = useState(-1);
  const [enPassantPawnCol, setEnPassantPawnCol] = useState(-1);

  //capture pieces

  const [whiteScore, setWhiteScore] = useState([]);

  const [blackScore, setBlackScore] = useState([]);

  //check if the king is in check

  const [whiteCheck, setWhiteCheck] = useState(false);
  const [blackCheck, setBlackCheck] = useState(false);


  const movePiece = (fromRow, fromCol, toRow, toCol) => {
    // Add your move logic here
    const newChessPieces = [...chessPieces];

    // Check if the rows are defined
    if (!newChessPieces[fromRow] || !newChessPieces[toRow]) {
      return;
    }

    // Check if the move is legal
    if (!checkLegalMove(fromRow, fromCol, toRow, toCol, newChessPieces[fromRow][fromCol])) {
      return;
    }

    newChessPieces[toRow][toCol] = newChessPieces[fromRow][fromCol];

    // Check if the columns are defined before accessing them
    if (newChessPieces[fromRow][fromCol]) {
      newChessPieces[fromRow][fromCol] = ' ';
    }

    setChessPieces(newChessPieces);
  };

  const chooseCell = (row, col) => {
    const newChessPieces = [...chessPieces];
    const piece = newChessPieces[row][col];

    if (selectedPiece) {
      movePiece(selectedPiece.row, selectedPiece.col, row, col);
      console.log('Moved piece', row, col);
      setSelectedPiece(null);
      return;
    }

    if (piece === ' ') {
      return;
    }

    setSelectedPiece({ row, col });

    console.log('Selected piece', piece);

  };

  const capturePiece = (row, col) => {
    const newChessPieces = [...chessPieces];
    const piece = newChessPieces[row][col];

    if (piece === ' ') {
      return;
    }

    if (isWhitePiece(piece)) {
      setBlackScore([...blackScore, piece]);
    } else {
      setWhiteScore([...whiteScore, piece]);
    }

    newChessPieces[row][col] = ' ';
  };


  const isSquareUnderAttack = (row, col, opponentColor) => {
    const isOpponentPiece = (piece) => {
      return (opponentColor === 'white' && isBlackPiece(piece)) || (opponentColor === 'black' && isWhitePiece(piece));
    };
  
    const checkMoves = (moves, pieceType) => {
      for (const move of moves) {
        const newRow = row + move.row;
        const newCol = col + move.col;
  
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const piece = chessPieces[newRow][newCol];
          if (piece === pieceType && isOpponentPiece(piece)) {
            console.log(opponentColor)
            console.log('Piece', pieceType, 'at', newRow, newCol);
            return true;
          }
        }
      }
      return false;
    };
  
    // Check opponent's knight moves
    const opponentKnightMoves = [
      { row: -2, col: -1 }, { row: -2, col: 1 },
      { row: -1, col: -2 }, { row: -1, col: 2 },
      { row: 1, col: -2 }, { row: 1, col: 2 },
      { row: 2, col: -1 }, { row: 2, col: 1 },
    ];
    if (checkMoves(opponentKnightMoves, 'n')) {
      console.log('Knight at', row, col);
      return true;
    }
  
    // Check opponent's rook and queen along rank and file
    const rankAndFileMoves = [
      { row: 0, col: 1 }, { row: 0, col: -1 },
      { row: 1, col: 0 }, { row: -1, col: 0 },
    ];
    if (checkMoves(rankAndFileMoves, 'r') || checkMoves(rankAndFileMoves, 'q')) {
      console.log('Rook or queen at', row, col);
      return true;
    }
  
    // Check opponent's bishop and queen along diagonals
    const diagonalMoves = [
      { row: 1, col: 1 }, { row: 1, col: -1 },
      { row: -1, col: 1 }, { row: -1, col: -1 },
    ];
    if (checkMoves(diagonalMoves, 'b') || checkMoves(diagonalMoves, 'q')) {
      console.log('Bishop or queen at', row, col);
      return true;
    }
  
    // Check opponent's pawn moves
    const pawnMoves = (opponentColor === 'white')
      ? [{ row: -1, col: -1 }, { row: -1, col: 1 }]
      : [{ row: 1, col: -1 }, { row: 1, col: 1 }];
  
    if (checkMoves(pawnMoves, 'p')) {
      console.log('Pawn at', row, col);
      return true;
    }
  
    // Check opponent's king moves
    const kingMoves = [
      { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
      { row: 0, col: -1 },                        { row: 0, col: 1 },
      { row: 1, col: -1 }, { row: 1, col: 0 },  { row: 1, col: 1 },
    ];
    if (checkMoves(kingMoves, 'k')) {
      console.log('King at', row, col);
      return true;
    }
  
    return false;
  };
  



  const checkLegalMove = (fromRow, fromCol, toRow, toCol, piece) => {
    // Check if the move is within the chessboard bounds
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) {
      return false;
    }

    // Check if the destination cell is occupied by a friendly piece
    if (chessPieces[toRow][toCol] !== ' ' && isSameColor(chessPieces[fromRow][fromCol], chessPieces[toRow][toCol])) {
      return false;
    }

    // Determine the type of piece and check its legal moves
    switch (piece.toLowerCase()) {
      case 'p':
        // Pawn moves
        const direction = isWhitePiece(piece) ? 1 : -1;
        const startRow = isWhitePiece(piece) ? 1 : 6;

        // Regular move
        if (fromCol === toCol && chessPieces[toRow][toCol] === ' ') {
          // Set en passant variables if it's a double move
          if (fromRow === startRow && toRow === fromRow + 2 * direction) {
            setEnPassantAvailable(true);
            // enPassantPawnRow = fromRow + direction;
            // enPassantPawnCol = toCol;
            setEnPassantPawnRow(fromRow + direction);
            setEnPassantPawnCol(toCol);
            console.log('En passant available', enPassantPawnRow, enPassantPawnCol);
          }

          return (
            (toRow === fromRow + direction) ||
            (fromRow === startRow && toRow === fromRow + 2 * direction && chessPieces[fromRow + direction][toCol] === ' ')
          );
        }


        // Capture move
        if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction) {
          // Check if there is a piece to capture
          if (chessPieces[toRow][toCol] !== ' ') {
            capturePiece(toRow, toCol);
            return true;
          }
        }

        // En passant
        if (enPassantAvailable) {
          console.log('En passant move');
          if (toRow === enPassantPawnRow && toCol === enPassantPawnCol) {
            console.log('En passant move');
            setEnPassantAvailable(false);
            setEnPassantPawnRow(-1);
            setEnPassantPawnCol(-1);
            if (isWhitePiece(piece)) {
              capturePiece(toRow - 1, toCol);
            } else {
              capturePiece(toRow + 1, toCol);
            }
            return true;
          }
          setEnPassantAvailable(false); // En passant move is only available for one turn (reset the variable
          setEnPassantPawnRow(-1);
          setEnPassantPawnCol(-1);
        }

        break;

      case 'r':
        // Rook moves
        if (fromRow === toRow) {
          // Move along the same rank
          const step = fromCol < toCol ? 1 : -1;
          for (let col = fromCol + step; col !== toCol; col += step) {
            if (chessPieces[fromRow][col] !== ' ') {
              return false; // There is a piece in the way
            }
          }
          return true;
        } else if (fromCol === toCol) {
          // Move along the same file
          const step = fromRow < toRow ? 1 : -1;
          for (let row = fromRow + step; row !== toRow; row += step) {
            if (chessPieces[row][fromCol] !== ' ') {
              return false; // There is a piece in the way
            }
          }
          // Check if there is a piece to capture
          if (chessPieces[toRow][toCol] !== ' ') {
            capturePiece(toRow, toCol);
          }
          return true;
        } else {
          return false; // Rook can't move diagonally
        }

      case 'n':
        // knight moves and checks if there is a piece to capture
        if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - fromCol) === 1) {
          // Check if there is a piece to capture
          if (chessPieces[toRow][toCol] !== ' ') {
            capturePiece(toRow, toCol);
          }
          return true;
        } else if (Math.abs(toRow - fromRow) === 1 && Math.abs(toCol - fromCol) === 2) {
          // Check if there is a piece to capture
          if (chessPieces[toRow][toCol] !== ' ') {
            capturePiece(toRow, toCol);
          }
          return true;
        } else {
          return false; // Knight can't move in any other way
        }

      case 'b':
        // Bishop moves
        if (Math.abs(toRow - fromRow) === Math.abs(toCol - fromCol)) {
          const rowStep = fromRow < toRow ? 1 : -1;
          const colStep = fromCol < toCol ? 1 : -1;

          for (let row = fromRow + rowStep, col = fromCol + colStep; row !== toRow; row += rowStep, col += colStep) {
            if (chessPieces[row][col] !== ' ') {
              return false; // There is a piece in the way
            }
          }
          // Check if there is a piece to capture
          if (chessPieces[toRow][toCol] !== ' ') {
            capturePiece(toRow, toCol);
          }
          return true;
        } else {
          return false; // Bishop can't move in any other way
        }

      case 'q':
        // Queen moves (combination of rook and bishop)
        return (
          checkLegalMove(fromRow, fromCol, toRow, toCol, 'r') || // Rook-like move
          checkLegalMove(fromRow, fromCol, toRow, toCol, 'b')    // Bishop-like move
        );

      case 'k':
        //cant move to a square that is under attack by the opponent

        if (isSquareUnderAttack(toRow, toCol, isWhitePiece(piece) ? 'black' : 'white'))  {
          console.log('Square under attack');
          return false;
        }

        if (Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1) {
          // Check if there is a piece to capture
          if (chessPieces[toRow][toCol] !== ' ') {
            capturePiece(toRow, toCol);
          }
          return true;
        } else {
          return false; // King can't move in any other way
        }
      // Check if the king is castling

      default:
        return false;
    }
  };


  // Helper functions

  const isSameColor = (piece1, piece2) => {
    return (isWhitePiece(piece1) && isWhitePiece(piece2)) || (isBlackPiece(piece1) && isBlackPiece(piece2));
  };

  const isWhitePiece = (piece) => {
    return piece === piece.toUpperCase();
  };

  const isBlackPiece = (piece) => {
    return piece === piece.toLowerCase();
  };

  useEffect(() => {
    console.log('White score:', whiteScore);
    console.log('Black score:', blackScore);
  }, [whiteScore, blackScore]);

  return (
    <ChessServiceContext.Provider value={{ chessPieces, movePiece, chooseCell }}>
      {children}
    </ChessServiceContext.Provider>
  );
};

export const useChessService = () => {
  const context = useContext(ChessServiceContext);
  if (!context) {
    throw new Error('useChessService must be used within a ChessServiceProvider');
  }
  return context;
};
