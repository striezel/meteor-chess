/* class to check whether certain moves are legal or not */
Moves = {
  allowedPawn: function(field1, field2, board)
  {
    //TODO: implement
    return null; //null means: not implemented yet
  },
  allowedRook: function(field1, field2, board)
  {
    //Rook moves horizontally or vertically only, i.e. either column or row
    //must be identical.
    return ((field1.column === field2.column) || (field1.row === field2.row));
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
    //Bishop move diagonally, i.e. absolute difference between rows and columns
    //of start and end point must be equal (and non-zero).
    let rowDiff = Math.abs(field1.row - field2.row);
    let colDiff = Math.abs(field1.column.charCodeAt(0) - field2.column.charCodeAt(0));
    return ((colDiff === rowDiff) && (rowDiff !== 0));
  },
  allowedQueen: function(field1, field2, board)
  {
    //Queen can move like rook or like bishop.
    if (allowedRook(field1, field2, board))
      return true;
    return allowedBishop(field1, field2, board);
  },
  allowedKnight: function(field1, field2, board)
  {
    //King can move one field in any direction, i.e. the difference between
    //start and end point must not be more than one in any direction.
    //TODO: implement check for castling
    return ((Math.abs(field1.row - field2.row) <= 1)
      && (Math.abs(field1.column.charCodeAt(0) - field2.column.charCodeAt(0)) <= 1));
  },


  /* checks whether a move is allowed or not

     parameters:
       startCol - (string) column where the move starts
       startRow - (integer number) row where the move starts
       destCol  - (string) column where the move ends
       destRow  - (integer number) row where the move ends
       board    - (string) ID of the board

     return value:
       Returns true, if the move is allowed.
       Returns false, if the move is not legal.
       Returns null, if the implementation cannot determine whether the move is
       legal or not. (This is an indication for the yet incomplete
       implementation.)
  */
  allowed: function(startCol, startRow, destCol, destRow, board)
  {
    //If start and destination are equal, it is not a valid move.
    if ((startCol === destCol) && (startRow === destRow))
      return false;
    let field1 = Boards.findOne({row: startRow, column: startCol});
    //If field does not exist, it is no valid starting point.
    if (!field1)
      return false;
    let field2 = Boards.findOne({row: destRow, column: destCol});
    //If field does not exist, it is no valid destination point.
    if (!field2)
      return false;
    //If the field is empty, it is no valid destination point.
    if (field1.piece === 'empty')
      return false;

    switch(field1.piece)
    {
      case 'pawn':
           return Moves.allowedPawn(field1, field2, board);
      case 'rook':
      case 'tower':
           return Moves.allowedRook(field1, field2, board);
      case 'knight':
           return Moves.allowedKnight(field1, field2, board);
      case 'bishop':
           return Moves.allowedBishop(field1, field2, board);
      case 'queen':
           return Moves.allowedQueen(field1, field2, board);
      case 'king':
           return Moves.allowedKing(field1, field2, board);
    } //switch
    //no piece matched, error
    return null;
  },


  /* checks whether a move is allowed or not

     parameters:
       field_id1 - (string) ID of field where the move starts
       field_id2 - (string) ID of field where the move ends
       board    - (string) ID of the board

     return value:
       Returns true, if the move is allowed.
       Returns false, if the move is not legal.
       Returns null, if the implementation cannot determine whether the move is
       legal or not. (This is an indication for the yet incomplete
       implementation.)
  */
  allowed: function(field_id1, field_id2, board)
  {
    let field1 = Boards.findOne({_id: field_id1});
    //If field does not exist, it is no valid starting point.
    if (!field1)
      return false;
    let field2 = Boards.findOne({{_id: field_id2}});
    //If field does not exist, it is no valid destination point.
    if (!field2)
      return false;
    //If start and destination are equal, it is not a valid move.
    if ((field1.column === field2.column) && (field1.row === field2.row))
      return false;
    //If the field is empty, it is no valid destination point.
    if (field1.piece === 'empty')
      return false;

    switch(field1.piece)
    {
      case 'pawn':
           return Moves.allowedPawn(field1, field2, board);
      case 'rook':
      case 'tower':
           return Moves.allowedRook(field1, field2, board);
      case 'knight':
           return Moves.allowedKnight(field1, field2, board);
      case 'bishop':
           return Moves.allowedBishop(field1, field2, board);
      case 'queen':
           return Moves.allowedQueen(field1, field2, board);
      case 'king':
           return Moves.allowedKing(field1, field2, board);
    } //switch
    //no piece matched, error
    return null;
  }
};
