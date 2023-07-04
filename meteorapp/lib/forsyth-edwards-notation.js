/* nextColumn: returns the next column for a given column

   parameters:
     column - (string) single character-string that denotes the current column,
              e.g. "a", "b", "c",...

   returns:
     Returns a single character for the next column. If the given column is out
     of range, the function will return "a".
*/
nextColumn = function(column)
{
  let nextCol = String.fromCharCode(column.charCodeAt(0)+1);
  if ((nextCol > 'h') || (nextCol < 'a'))
  {
    nextCol = 'a';
  }
  return nextCol;
}


/* fenmap: auxiliary function that returns a map which is used in the board
           initialization from a FEN.
*/
fenmap = function()
{
  var result = new Map();
  result.set('r', {piece: 'rook', colour: 'black'});
  result.set('n', {piece: 'knight', colour: 'black'});
  result.set('b', {piece: 'bishop', colour: 'black'});
  result.set('q', {piece: 'queen', colour: 'black'});
  result.set('k', {piece: 'king', colour: 'black'});
  result.set('p', {piece: 'pawn', colour: 'black'});

  result.set('R', {piece: 'rook', colour: 'white'});
  result.set('N', {piece: 'knight', colour: 'white'});
  result.set('B', {piece: 'bishop', colour: 'white'});
  result.set('Q', {piece: 'queen', colour: 'white'});
  result.set('K', {piece: 'king', colour: 'white'});
  result.set('P', {piece: 'pawn', colour: 'white'});
  return result;
}


/* FEN: class that handles Forsyth-Edwards Notation (FEN).*/
FEN = {
  /* toBoard: parses a Forsyth-Edwards Notation (FEN) and creates a board
              from it

     parameters:
       fen - (string) a string that contains a valid Forsyth-Edwards Notation
             (short: FEN) for a 8x8 chess board

     return value:
       Returns a string containing the ID of the created board.
  */
  toBoard: function(fen)
  {
    // This function currently only handles the first part, i.e. the pieces on the board.
    var parts = fen.split(' ');
    var rows = parts[0].split('/');
    if (rows.length < 8)
      return null;

    var map = fenmap();

    // new board, white to move
    var boardId = Boards.insert({toMove: 'white', created: new Date(),
                                 castling: {white: {kingside: true, queenside: true},
                                            black: {kingside: true, queenside: true}},
                                 check: {white: false, black: false},
                                 enPassant: {row: null, column: null},
                                 winner: null
                               });

    var bRow = 8;
    for (let i = 0; i < 8; ++i)
    {
      var bColumn = 'a';
      for (let j = 0; j < rows[i].length; ++j)
      {
        if (map.has(rows[i][j]))
        {
          var t = map.get(rows[i][j]);
          Fields.insert({board: boardId, piece: t.piece, colour: t.colour, column: bColumn, row: bRow});
          bColumn = nextColumn(bColumn);
        } // if map has
        else if (!isNaN(parseInt(rows[i][j])))
        {
          var count = Math.min(8, Math.max(1, parseInt(rows[i][j])));
          for (let k = 1; k <= count; ++k)
          {
            Fields.insert({board: boardId, piece: 'empty', colour: 'empty', column: bColumn, row: bRow});
            bColumn = nextColumn(bColumn);
          } // for k
        } // else
      } // for j
      bRow = bRow - 1;
    } // for i

    // Who is to move?
    if (parts.length > 1)
    {
      if ((typeof parts[1] === 'string') && (parts[1].charAt(0).toLowerCase() === 'b'))
      {
        Boards.update({_id: boardId}, {$set: {toMove: 'black'}});
      }
    } // if enough data to set toMove is present
    // parse info about castling
    if (parts.length > 2)
    {
      let castling = {white: {kingside:  parts[2].indexOf('K') >= 0,
                              queenside: parts[2].indexOf('Q') >= 0},
                      black: {kingside:  parts[2].indexOf('k') >= 0,
                              queenside: parts[2].indexOf('q') >= 0}};
      Boards.update({_id: boardId}, {$set: {"castling": castling}});
    } // if castling info is given
    // parse info about en passant move
    if (parts.length > 3)
    {
      let ep_col = parts[3].charAt(0);
      let ep_row = parseInt(parts[3].charAt(1));
      let regEx = /^[a-h]$/;
      if (regEx.test(ep_col) && ((ep_row === 3) || (ep_row === 6)))
      {
        Boards.update({_id: boardId}, {$set: {enPassant: {column: ep_col, row: ep_row}}});
      }
    } // if en passant info is given

    // parse number of halfmoves under 50 move rule
    if (parts.length > 4)
    {
      let val = parseInt(parts[4]);
      if (!isNaN(val) && (val > 0))
        Boards.update({_id: boardId}, {$set: {"halfmovesFifty": val}});
      else
        Boards.update({_id: boardId}, {$set: {"halfmovesFifty": 0}});
    }
    else
      // No information, so let's start with zero here.
      Boards.update({_id: boardId}, {$set: {"halfmovesFifty": 0}});

    return boardId;
  },


  /* fromBoard: returns a FEN for the board with the given ID

     parameters:
       boardId - (string) ID of the board

     return value:
       Returns a string that contains the board's FEN on success.
       Returns null, if an error occurred (e.g. non-existent board).

     remarks:
       This function is still very slow.
       TODO: Improve speed by reducing number of DB queries.
  */
  fromBoard(boardId)
  {
    let boardDoc = Boards.findOne({_id: boardId});
    if (!boardDoc)
      return null;

    let emptyCount = 0;
    let fenString = "";
    for (let r = 8; r >= 1; --r)
    {
      for (let c = 'a'; c <= 'h'; c = String.fromCharCode(c.charCodeAt(0)+1))
      {
        let fieldDoc = Fields.findOne({board: boardId, column: c, row: r});
        if (fieldDoc.piece === 'empty')
          ++emptyCount;
        else
        {
          // First, add empty count, if any.
          if (emptyCount > 0)
          {
            fenString = fenString + emptyCount;
            emptyCount = 0;
          }
          // now add the real thing
          switch(fieldDoc.colour)
          {
            case 'white':
                 switch(fieldDoc.piece)
                 {
                   case 'rook':
                        fenString = fenString + 'R';
                        break;
                   case 'knight':
                        fenString = fenString + 'N';
                        break;
                   case 'bishop':
                        fenString = fenString + 'B';
                        break;
                   case 'queen':
                        fenString = fenString + 'Q';
                        break;
                   case 'king':
                        fenString = fenString + 'K';
                        break;
                   case 'pawn':
                        fenString = fenString + 'P';
                        break;
                   default:
                        // invalid piece
                        return null;
                 } // switch piece
                 break;
            case 'black':
                 switch(fieldDoc.piece)
                 {
                   case 'rook':
                        fenString = fenString + 'r';
                        break;
                   case 'knight':
                        fenString = fenString + 'n';
                        break;
                   case 'bishop':
                        fenString = fenString + 'b';
                        break;
                   case 'queen':
                        fenString = fenString + 'q';
                        break;
                   case 'king':
                        fenString = fenString + 'k';
                        break;
                   case 'pawn':
                        fenString = fenString + 'p';
                        break;
                   default:
                        // invalid piece
                        return null;
                 } // switch piece
                 break;
          } // switch colour
        } // else
      } // for columns
      // First, add empty count, if any.
      if (emptyCount > 0)
      {
        fenString = fenString + emptyCount;
        emptyCount = 0;
      }
      // add slash - except after last row
      if (r > 1)
        fenString = fenString + "/";
    } // for rows
    // Who is to move?
    switch(boardDoc.toMove)
    {
      case 'white':
           fenString = fenString + " w";
           break;
      case 'black':
           fenString = fenString + " b";
           break;
      default:
           // Something is wrong here, return without extra data.
           return fenString;
    } // switch
    // castling information
    let castlingString = "";
    if (boardDoc.castling.white.kingside)
      castlingString = castlingString + "K";
    if (boardDoc.castling.white.queenside)
      castlingString = castlingString + "Q";
    if (boardDoc.castling.black.kingside)
      castlingString = castlingString + "k";
    if (boardDoc.castling.black.queenside)
      castlingString = castlingString + "q";
    if (castlingString !== "")
      fenString = fenString + " " + castlingString;
    else
      fenString = fenString + " -";
    // en passant
    if (boardDoc.enPassant.row === null)
      fenString = fenString + " -";
    else
      fenString = fenString + " " + boardDoc.enPassant.column + boardDoc.enPassant.row;
    // halfmoves for 50 move rule
    fenString = fenString + " " + boardDoc.halfmovesFifty;
    // Return here, because other data is not implemented yet.
    return fenString;
  }
};
