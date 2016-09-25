/* Methods for the server side. */

Meteor.methods({
  /* boardInit: method to initialize a board
  */
  boardInit: function() {
    console.log('Info: Performing board initialization.');
    var newBoard = FEN.toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    Boards.remove({});
    var count = 0;
    var index = 0;
    for (index = 0; index < newBoard.length; ++index)
    {
      Boards.insert(newBoard[index]);
      ++count;
    } //for
    return count;
  }
});
