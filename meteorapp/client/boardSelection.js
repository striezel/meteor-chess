Template.boardSelection.created = function() {
  this.subscribe('boards');
};

Template.boardSelection.events({
  'click li, touchstart li': function(event) {
    if ((event.currentTarget.id !== null) && (event.currentTarget.id !== undefined))
    {
      let boardID = event.currentTarget.id;
      Session.set('board', boardID);
      Router.go('board');
    } // if
  },
  'click #new, touchstart #new': function(event) {
    Meteor.call('boardInit', function(err, result) {
      if (!err)
      {
        // set board ID and go to new board
        Session.set('board', result);
        Router.go('board');
      }
    });
  }
});

Template.boardSelection.helpers({
  boards: function(){
    var icons = ['king', 'queen', 'bishop', 'knight', 'tower', 'pawn'];
    var result = Boards.find({}, {sort: {created: -1}}).fetch();
    var i = 0;
    for (i = 0; i < result.length; ++i)
    {
      // add some random chess figure
      result[i].icon = icons[Math.floor(Math.random()*icons.length)];
      // number
      result[i].number = result.length - i;
      result[i].creation = moment(result[i].created).format("dddd, MMMM Do YYYY, HH:mm:ss");
    } // for i
    return result;
  },
  empty: function(){
    let bDoc = Boards.findOne({});
    if (!bDoc)
      return true;
    else
      return false;
  }
});
