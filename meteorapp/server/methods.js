/* Methods for the server side. */

Meteor.methods({
  /* boardInit: method to initialize a new board

     return value:
       Returns the ID of the new board.
  */
  boardInit: function() {
    console.log('Info: Performing board initialization.');
    return FEN.toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
  },


  /* boardDelete: deletes the board with the given ID

     parameters:
       boardId - (string) ID of the board that shall be deleted

     return value:
       Returns true on success. Throws on error.
  */
  boardDelete: function(boardId) {
    console.log('Info: Board deletion request for ID ' + JSON.stringify(boardId) + '.');
    let boardDoc = Boards.findOne({_id: boardId});
    if (!boardDoc)
    {
      throw new Meteor.Error('entity-not-found', 'There is no board with the ID ' + boardId + '.');
    }
    // delete fields and board information
    Fields.remove({board: boardId});
    Boards.remove({_id: boardId});
    return true;
  },


  /* performMove: move a piece

     parameters:
       startFieldID - (string) ID of the field where the move starts
       destFieldID  - (string) ID of the field where the move ends
       promoteTo    - (string) type of piece that a pawn shall be promoted to,
                      if the move allows pawn promotion

     return value:
       Returns true, if the move was performed.
       Returns false, if the move was not performed, e.g. because the move was
       against the chess rules.
  */
  performMove: function(startFieldID, destFieldID, promoteTo)
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
    // find board
    let board = Boards.findOne({_id: startDoc.board});
    if (board.winner !== null)
    {
      console.log('Info: Player tried to move on board ' + board._id + ', but the game is already over.');
      throw new Meteor.Error('game-over', 'You cannot move pieces on this board.'
                            +' The game is over, winner is ' + board.winner + '.');
    }
    // Is the correct player moving?
    if (board.toMove !== startDoc.colour)
    {
      console.log('Info: Player tried to move ' + startDoc.colour
               + ', but ' + board.toMove + ' is to move.');
      throw new Meteor.Error('wrong-player-to-move', 'The colour that has to move is ' + board.toMove + '.');
    }

    let allow = Moves.allowed(startFieldID, destFieldID, startDoc.board);
    if (false === allow)
      return false;

    if (allow || (null === allow))
    {
      // Move is either allowed or check not implemented, so assume the player
      // does a correct move.

      // Handle counter for fifty move rule.
      if ((startDoc.piece === 'pawn') || (destDoc.piece !== 'empty'))
      {
        // Pawn has been moved or piece will be captured: reset counter.
        Boards.update({_id: board._id}, {$set: {"halfmovesFifty": 0}});
      }
      else
      {
        // No pawn move or capture, increase counter.
        Boards.update({_id: board._id}, {$set: {"halfmovesFifty": board.halfmovesFifty + 1}});
      }

      // -- "copy" piece to destination field
      Fields.update({_id: destFieldID}, {$set: {piece: startDoc.piece, colour: startDoc.colour}});
      // -- remove piece in start field
      Fields.update({_id: startFieldID}, {$set: {piece: 'empty', colour: 'empty'}});
      // holds en passant data for next move
      let enPassantData = {column: null, row: null};
      // -- check for special moves of pawn pieces
      if (startDoc.piece === 'pawn')
      {
        // check for promotion
        // -- sanitize promotion piece
        switch(promoteTo)
        {
          case 'tower':
               promoteTo = 'rook';
               break;
          case 'bishop':
          case 'knight':
          case 'rook':
               // allowed value, leave it as it is
               break;
          default:
               // For disallowed values fall back to promotion to queen.
               promoteTo = 'queen';
               break;
        } // switch
        // -- check for promotion of white pawn
        if ((startDoc.colour === 'white') && (destDoc.row === 8))
        {
          Fields.update({_id: destFieldID}, {$set: {piece: promoteTo}});
          console.log('Info: Promoted white pawn on ' + destDoc.column + destDoc.row + ' to ' + promoteTo + '.');
        }
        // -- check for promotion of black pawn
        else if ((startDoc.colour === 'black') && (destDoc.row === 1))
        {
          Fields.update({_id: destFieldID}, {$set: {piece: promoteTo}});
          console.log('Info: Promoted black pawn on ' + destDoc.column + destDoc.row + ' to ' + promoteTo + '.');
        }
        // check for en passant capture
        else if ((destDoc.row === board.enPassant.row) && (destDoc.column === board.enPassant.column))
        {
          let colDiff = Math.abs(startDoc.column.charCodeAt(0) - destDoc.column.charCodeAt(0));
          let rowDiff = Math.abs(destDoc.row - startDoc.row);
          if ((colDiff === 1) && (rowDiff === 1))
          {
            // remove captured pawn
            let removeRow = destDoc.row;
            if (removeRow === 3)
              removeRow = 4;
            else
              removeRow = 5;
            Fields.update({"board": startDoc.board, column: destDoc.column, row: removeRow}, {$set: {piece: 'empty', colour: 'empty'}});
          }
        } // if en passant field is destination
        // check whether en passant capture is possible in next move
        if ((startDoc.colour === 'white') && (startDoc.row === 2) && (destDoc.row === 4))
          enPassantData = {column: startDoc.column, row: 3};
        else if ((startDoc.colour === 'black') && (startDoc.row === 7) && (destDoc.row === 5))
          enPassantData = {column: startDoc.column, row: 6};
      }// if pawn
      // -- check for castling move
      if (startDoc.piece === 'king')
      {
        if ((startDoc.colour === 'white') && (startDoc.column === 'e') && (startDoc.row === 1))
        {
          if ((destDoc.column === 'c') && (destDoc.row === 1) && (destDoc.piece === 'empty'))
          {
            // white queenside castling
            // King was already moved, we just have to move the rook here.
            Fields.update({"board": startDoc.board, column: 'a', row: 1}, {$set: {piece: 'empty', colour: 'empty'}})
            Fields.update({"board": startDoc.board, column: 'd', row: 1}, {$set: {piece: 'rook', colour: 'white'}})
          }
          if ((destDoc.column === 'g') && (destDoc.row === 1) && (destDoc.piece === 'empty'))
          {
            // white kingside castling
            // King was already moved, we just have to move the rook here.
            Fields.update({"board": startDoc.board, column: 'h', row: 1}, {$set: {piece: 'empty', colour: 'empty'}})
            Fields.update({"board": startDoc.board, column: 'f', row: 1}, {$set: {piece: 'rook', colour: 'white'}})
          }
        } // if white king at initial position
        else if ((startDoc.colour === 'black') && (startDoc.column === 'e') && (startDoc.row === 8))
        {
          if ((destDoc.column === 'c') && (destDoc.row === 8) && (destDoc.piece === 'empty'))
          {
            // black queenside castling
            // King was already moved, we just have to move the rook here.
            Fields.update({"board": startDoc.board, column: 'a', row: 8}, {$set: {piece: 'empty', colour: 'empty'}})
            Fields.update({"board": startDoc.board, column: 'd', row: 8}, {$set: {piece: 'rook', colour: 'black'}})
          }
          if ((destDoc.column === 'g') && (destDoc.row === 8) && (destDoc.piece === 'empty'))
          {
            // black kingside castling
            // King was already moved, we just have to move the rook here.
            Fields.update({"board": startDoc.board, column: 'h', row: 8}, {$set: {piece: 'empty', colour: 'empty'}})
            Fields.update({"board": startDoc.board, column: 'f', row: 8}, {$set: {piece: 'rook', colour: 'black'}})
          }
        }// if black king at initial position
      } // if king may be castling
      // -- castling update
      if (startDoc.piece === 'king')
      {
        if (startDoc.colour === 'black')
          Boards.update({_id: board._id}, {$set: {"castling.black.kingside": false, "castling.black.queenside": false}});
        else
          Boards.update({_id: board._id}, {$set: {"castling.white.kingside": false, "castling.white.queenside": false}});
      } // if king
      else if (startDoc.piece === 'rook')
      {
        if (startDoc.colour === 'black')
        {
          if ((startDoc.row === 8) && (startDoc.column === 'a'))
            Boards.update({_id: board._id}, {$set: {"castling.black.queenside": false}});
          else if ((startDoc.row === 8) && (startDoc.column === 'h'))
            Boards.update({_id: board._id}, {$set: {"castling.black.kingside": false}});
        } // if black rook moved
        else if (startDoc.colour === 'white')
        {
          if ((startDoc.row === 1) && (startDoc.column === 'a'))
            Boards.update({_id: board._id}, {$set: {"castling.white.queenside": false}});
          else if ((startDoc.row === 1) && (startDoc.column === 'h'))
            Boards.update({_id: board._id}, {$set: {"castling.white.kingside": false}});
        } // if white rook moved
      } // if rook
      // -- update en passant data
      Boards.update({_id: board._id}, {$set: {"enPassant": enPassantData}});
      // -- determine whether anyone is in check
      let whiteCheck = Rules.isInCheck('white', board._id);
      if (whiteCheck && board.check.white)
        Boards.update({_id: board._id}, {$set: {winner: 'black'}});
      Boards.update({_id: board._id}, {$set: {"check.white": whiteCheck}});
      let blackCheck = Rules.isInCheck('black', board._id);
      if (blackCheck && board.check.black)
        Boards.update({_id: board._id}, {$set: {winner: 'white'}});
      Boards.update({_id: board._id}, {$set: {"check.black": blackCheck}});
      // -- update colour that is to move
      if (board.toMove === 'white')
        Boards.update({_id: board._id}, {$set: {toMove: 'black'}});
      else
        Boards.update({_id: board._id}, {$set: {toMove: 'white'}});
      return true;
    }
  }
});
