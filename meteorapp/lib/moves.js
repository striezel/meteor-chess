/* class to check whether certain moves are legal or not */
Moves = {
  isEmptyStraightOrDiagonal: function(field1, field2)
  {
    let rowDiff = field2.row - field1.row;
    let colDiff = field2.column.charCodeAt(0) - field1.column.charCodeAt(0);

    let curRow = field1.row + Math.sign(rowDiff);
    let curCol = String.fromCharCode(field1.column.charCodeAt(0) + Math.sign(colDiff));
    while ((curRow !== field2.row) || (curCol !== field2.column))
    {
      // try to find empty field at current coordinates
      let fieldDoc = Fields.findOne({board: field1.board, column: curCol, row: curRow, colour: 'empty'});
      // If no field was found, it is not empty (or does not exist).
      if (!fieldDoc)
        return false;
      // move to next field
      curRow = curRow + Math.sign(rowDiff);
      curCol = String.fromCharCode(curCol.charCodeAt(0) + Math.sign(colDiff));
    } // while
    // All fields empty, all OK.
    return true;
  },
  isCastlingAttemptAllowed: function(field1, field2, board)
  {
    if ((field1.colour === 'white') && (field1.column === 'e') && (field1.row === 1))
    {
      if ((field2.column === 'c') && (field2.row === 1) && (field2.piece === 'empty'))
      {
        let freeFields = Fields.find({"board": board, piece: 'empty', row: 1, column: {$in: ['b','c','d']}});
        let boardDoc = Boards.findOne({_id: board});
        return ((freeFields.count() === 3) && boardDoc.castling.white.queenside);
      }
      if ((field2.column === 'g') && (field2.row === 1) && (field2.piece === 'empty'))
      {
        let freeFields = Fields.find({"board": board, piece: 'empty', row: 1, column: {$in: ['f','g']}});
        let boardDoc = Boards.findOne({_id: board});
        return ((freeFields.count() === 2) && boardDoc.castling.white.kingside);
      }
    }// if white king at initial position
    else if ((field1.colour === 'black') && (field1.column === 'e') && (field1.row === 8))
    {
      if ((field2.column === 'c') && (field2.row === 8) && (field2.piece === 'empty'))
      {
        let freeFields = Fields.find({"board": board, piece: 'empty', row: 8, column: {$in: ['b','c','d']}});
        let boardDoc = Boards.findOne({_id: board});
        return ((freeFields.count() === 3) && boardDoc.castling.black.queenside);
      }
      if ((field2.column === 'g') && (field2.row === 8) && (field2.piece === 'empty'))
      {
        let freeFields = Fields.find({"board": board, piece: 'empty', row: 8, column: {$in: ['f','g']}});
        let boardDoc = Boards.findOne({_id: board});
        return ((freeFields.count() === 2) && boardDoc.castling.black.kingside);
      }
    }// if black king at initial position
    return false;
  },
  allowedPawnBlack: function(field1, field2, board)
  {
    let rowDiff = field1.row - field2.row;
    let colDiff = Math.abs(field1.column.charCodeAt(0) - field2.column.charCodeAt(0));
    // If dest. is empty, move may only be one step ahead; or two if in initial position.
    if (field2.colour === 'empty')
    {
      let f3 = Fields.findOne({board: field1.board, column: field1.column, row: 6});
      if ((colDiff === 0) && ((rowDiff === 1) || ((rowDiff === 2) && (field1.row === 7) && (f3.colour === 'empty'))))
        return true;
      // It may also be an en passant move.
      let boardDoc = Boards.findOne({_id: board});
      return ((colDiff === 1) && (rowDiff === 1)
           && (field2.row === boardDoc.enPassant.row) && (field2.column === boardDoc.enPassant.column));
    }
    if (field2.colour === 'white')
    {
      return ((colDiff === 1) && (rowDiff === 1));
    }
    // everything else is not allowed
    return false;
  },
  allowedPawnWhite: function(field1, field2, board)
  {
    let rowDiff = field2.row - field1.row;
    let colDiff = Math.abs(field1.column.charCodeAt(0) - field2.column.charCodeAt(0));
    // If dest. is empty, move may only be one step ahead; or two if in initial position.
    if (field2.colour === 'empty')
    {
      let f3 = Fields.findOne({board: field1.board, column: field1.column, row: 3});
      if ((colDiff === 0) && ((rowDiff === 1) || ((rowDiff === 2) && (field1.row === 2) && (f3.colour === 'empty'))))
        return true;
      // It may also be an en passant move.
      let boardDoc = Boards.findOne({_id: board});
      return ((colDiff === 1) && (rowDiff === 1)
           && (field2.row === boardDoc.enPassant.row) && (field2.column === boardDoc.enPassant.column));
    }
    if (field2.colour === 'black')
    {
      return ((colDiff === 1) && (rowDiff === 1));
    }
    // Everything else is not allowed.
    return false;
  },
  allowedPawn: function(field1, field2, board)
  {
    if (field1.colour === 'black')
      return Moves.allowedPawnBlack(field1, field2, board);
    else if (field1.colour === 'white')
      return Moves.allowedPawnWhite(field1, field2, board);
    else // empty
      return false;
  },
  allowedRook: function(field1, field2, board)
  {
    // Rook moves horizontally or vertically only, i.e. either column or row
    // must be identical.
    if ((field1.column === field2.column) || (field1.row === field2.row))
    {
      // Move is allowed, if fields between start and end are empty.
      return Moves.isEmptyStraightOrDiagonal(field1, field2);
    }
    // Does not match the rook move pattern, therefore not allowed.
    return false;
  },
  allowedKnight: function(field1, field2, board)
  {
    // Knight moves in an L-shaped step: two fields on a horizontal or vertical
    // line and one field orthogonally from that move. That is: Row and column
    // difference must be 2 and 1 (or 1 and 2).
    let rowDiff = Math.abs(field1.row - field2.row);
    let colDiff = Math.abs(field1.column.charCodeAt(0) - field2.column.charCodeAt(0));
    return (((rowDiff === 1) && (colDiff === 2))
      || ((rowDiff === 2) && (colDiff === 1)));
  },
  allowedBishop: function(field1, field2, board)
  {
    // Bishop moves diagonally, i.e. absolute difference between rows and columns
    // of start and end point must be equal and non-zero.
    let rowDiff = Math.abs(field1.row - field2.row);
    let colDiff = Math.abs(field1.column.charCodeAt(0) - field2.column.charCodeAt(0));
    if ((colDiff === rowDiff) && (rowDiff !== 0))
    {
      // Move is allowed, if fields between start and end are empty.
      return Moves.isEmptyStraightOrDiagonal(field1, field2);
    }
    // not allowed
    return false;
  },
  allowedQueen: function(field1, field2, board)
  {
    // Queen can move like rook or like bishop.
    if (Moves.allowedRook(field1, field2, board))
      return true;
    return Moves.allowedBishop(field1, field2, board);
  },
  allowedKing: function(field1, field2, board)
  {
    // King can move one field in any direction, i.e. the difference between
    // start and end point must not be more than one in any direction.
    // Only one exception is castling.

    // Check for castling.
    let ca = Moves.isCastlingAttemptAllowed(field1, field2, board);
    if (ca === true)
    {
      //TODO: Check whether fields between the pieces are empty.
      return true;
    }
    // regular move
    return ((Math.abs(field1.row - field2.row) <= 1)
      && (Math.abs(field1.column.charCodeAt(0) - field2.column.charCodeAt(0)) <= 1));
  },


  /* checks whether a move is allowed or not

     parameters:
       field_id1 - (string) ID of field where the move starts
       field_id2 - (string) ID of field where the move ends
       boardID   - (string) ID of the board

     return value:
       Returns true, if the move is allowed.
       Returns false, if the move is not legal.
       Returns null, if the implementation cannot determine whether the move is
       legal or not. (This is an indication for the yet incomplete
       implementation.)
  */
  allowed: function(field_id1, field_id2, boardID)
  {
    let field1 = Fields.findOne({_id: field_id1, board: boardID});
    // If field does not exist, it is no valid starting point.
    if (!field1)
      return false;
    let field2 = Fields.findOne({_id: field_id2, board: boardID});
    // If field does not exist, it is no valid destination point.
    if (!field2)
      return false;
    // If start and destination are equal, it is not a valid move.
    if ((field1.column === field2.column) && (field1.row === field2.row))
      return false;
    // If the field is empty, it is no valid destination point.
    if (field1.piece === 'empty')
      return false;
    // If there is a piece of the same colour on the destination field, then the
    // move is not allowed.
    if (field1.colour === field2.colour)
      return false;

    switch(field1.piece)
    {
      case 'pawn':
           return Moves.allowedPawn(field1, field2, boardID);
      case 'rook':
      case 'tower':
           return Moves.allowedRook(field1, field2, boardID);
      case 'knight':
           return Moves.allowedKnight(field1, field2, boardID);
      case 'bishop':
           return Moves.allowedBishop(field1, field2, boardID);
      case 'queen':
           return Moves.allowedQueen(field1, field2, boardID);
      case 'king':
           return Moves.allowedKing(field1, field2, boardID);
    } // switch
    // no piece matched, error
    return null;
  }
};
