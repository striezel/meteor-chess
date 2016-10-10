Template.board.created = function() {
  //If no board was selected yet, go back to board selection.
  if (Session.equals('board', undefined))
  {
    console.log('Board is not defined, switching to board selection.');
    Router.go('boardSelection');
    return;
  }
  this.subscribe('boards');
};

Template.board.helpers({
  toMove: function(){
    let bDoc = Boards.findOne({_id: Session.get('board')});
    if (bDoc)
    {
      return bDoc.toMove;
    }
    return null;
  }
});