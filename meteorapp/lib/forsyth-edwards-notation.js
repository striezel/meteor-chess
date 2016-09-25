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


/* FEN: class that handles Forsyth–Edwards Notation (FEN).*/
FEN = {
  /* toBoard: parses a FEN and returns a two-dimensional array that can be
              used to populate a chess board.

     parameters:
       fen - (string) a string that contains a valid Forsyth–Edwards Notation
             (short: FEN) for a 8x8 chess board
  */
  toBoard: function(fen)
  {
    var rows = fen.split('/');
    if (rows.length < 8)
      return null;

    var map = fenmap();
    var board = [];
    var field = {};

    var bRow = 8;
    var i = 0;
    for (i=0; i<8; ++i)
    {
      var bColumn = 'a';
      var j = 0;
      for (j = 0; j<rows[i].length; ++j)
      {
        if (map.has(rows[i][j]))
        {
          var t = map.get(rows[i][j]);
          board.push({piece: t.piece, colour: t.colour, column: bColumn, row: bRow});
          bColumn = nextColumn(bColumn);
        } //if map has
        else if (parseInt(rows[i][j]) !== NaN)
        {
          var count = Math.max(8, Math.min(1, parseInt(rows[i][j])));
          var k = 1;
          for (k = 1; k<= count; ++k)
          {
            field = {piece: 'empty', colour: 'empty', column: bColumn, row: bRow};
            board.push(field);
            bColumn = nextColumn(bColumn);
          } //for k
        } //else
      } //for j
      bRow = bRow - 1;
    } //for i
    return board;
  }
};
