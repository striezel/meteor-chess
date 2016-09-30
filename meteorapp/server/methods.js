/* Methods for the server side. */

Meteor.methods({
  /* boardInit: method to initialize a new board

     return value:
       Returns the ID of the new board.
  */
  boardInit: function() {
    console.log('Info: Performing board initialization.');
    var newBoard = FEN.toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    //new board, white to move
    var boardId = Boards.insert({toMove: 'white', created: new Date()});
    var index = 0;
    for (index = 0; index < newBoard.length; ++index)
    {
    	newBoard[index].board = boardId;
      Fields.insert(newBoard[index]);
    } //for
    return boardId;
  },


  /* performMove: move a piece

     parameters:
       startFieldID - (string) ID of the field where the move starts
       destFieldID  - (string) ID of the field where the move ends

     return value:
       Returns true, if the move was performed.
       Returns false, if the move was not performed, e.g. because the move was
       against the chess rules.
  */
  performMove: function(startFieldID, destFieldID)
  {
    let startDoc = Fields.findOne({_id: startFieldID});
    if (!startDoc)
    {
      throw new Meteor.Error('entity-not-found', 'There is no field with the ID ' + startFieldID + '.');
    }
    let destDoc = Fields.findOne({_id: destFieldID});
    if (!destDoc)
    {
      throw new Meteor.Error('entity-not-found', 'There is no field with the ID ' + destFieldID + '.');
    }
    if (startDoc.board !== destDoc.board)
    {
    	throw new Meteor.Error('boards-mismatch', 'The given fields are on different boards!');
    }
    //find board
    let board = Boards.findOne({_id: startDoc.board});
    if (board.toMove !== startDoc.colour)
    {
      console.log('Info: Player tried to move ' + startDoc.colour
               + ', but ' + board.toMove + 'is to move.');
      throw new Meteor.Error('wrong-player-to-move', 'The colour that has to move is ' + board.toMove + '.');
    }

    let allow = Moves.allowed(startFieldID, destFieldID, startDoc.board);
    if (false === allow)
    {
      return false;
    }
    if (allow || (null === allow))
    {
      // Move is either allowed or check not implemented, so assume the player
      // does a correct move.
      // -- "copy" piece to destination field
      Fields.update({_id: destFieldID}, {$set: {piece: startDoc.piece, colour: startDoc.colour}});
      // -- remove piece in start field
      Fields.update({_id: startFieldID}, {$set: {piece: 'empty', colour: 'empty'}});
      // -- update colour that is to move
      if (board.toMove === 'white')
        Boards.update({_id: board._id}, {$set: {toMove: 'black'}});
      else
        Boards.update({_id: board._id}, {$set: {toMove: 'white'}});
      return true;
    }
  }
});
