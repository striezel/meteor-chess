Template.boardDelete.created = function() {
  //If no board was selected yet, go back to board selection.
  if (Session.equals('board', undefined))
  {
    console.log('Board is not defined, switching to board selection.');
    Router.go('boardSelection');
  }
};

Template.boardDelete.events({
  'click [id="boarddeleteconfirm"]': function(event) {
    Meteor.call('boardDelete', Session.get('board'), function(err, result) {
      if (err)
        alert('Board was NOT deleted: ' +err.reason);
      else 
        Router.go('boardSelection');  
    });
  }
});
