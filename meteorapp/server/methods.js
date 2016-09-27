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
    let startDoc = Boards.findOne({_id: startFieldID});
    if (!startDoc)
    {
      throw new Meteor.Error('entity-not-found', 'There is no field with the ID ' + startFieldID + '.');
    }
    let destDoc = Boards.findOne({_id: destFieldID});
    if (!destDoc)
    {
      throw new Meteor.Error('entity-not-found', 'There is no field with the ID ' + destFieldID + '.');
    }

    let allow = Moves.allowed(startFieldID, destFieldID, 'TODO: fill board ID');
    if (false === allow)
    {
      return false;
    }
    if (allow || (null === allow))
    {
      // Move is either allowed or check not implemented, so assume the player
      // does a correct move.
      // -- "copy" piece to destination field
      Boards.update({_id: destFieldID}, {$set: {piece: startDoc.piece, colour: startDoc.colour}});
      // -- remove piece in start field
      Boards.update({_id: startFieldID}, {$set: {piece: 'empty', colour: 'empty'}});
      return true;
    }
  }
});
