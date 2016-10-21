Rules = {
  /* determines whether a player is in check

     parameters:
       colour  - (string) the colour which may be in check, either "black" or "white"
       boardId - (string) id of the corresponding board

     return value:
       Returns true, if the given player/colour is in check.
       Returns false otherwise.
  */
  isInCheck: function(colour, boardId)
  {
    let kingDoc = Fields.findOne({board: boardId, piece: 'king', "colour": colour});
    if (!kingDoc)
      return false; //Maybe we should throw instead, if no king is present.
    let attackers = null;
    if (colour === 'white')
      attackers = Fields.find({board: boardId, colour: 'black'});
    else
      attackers = Fields.find({board: boardId, colour: 'white'});
    attackers = attackers.fetch();
    for (let aDoc of attackers)
    {
    	if (Moves.allowed(aDoc._id, kingDoc._id, boardId))
    	  return true;
    } //for
    return false;
  }
};