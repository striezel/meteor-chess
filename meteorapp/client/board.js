Template.board.created = function() {
  this.subscribe('boards');
  this.subscribe('fields');
  if (Session.equals('board', undefined))
  {
    let newestBoard = Boards.findOne({}, {sort: {created: -1}})
    if (newestBoard)
      Session.set('board', newestBoard._id);
  }
};

Template.board.events({
  'click td, touchstart td': function(event) {
    if (event.currentTarget.id.startsWith('field_'))
    {
      let fieldID = event.currentTarget.id.substr(6);
      //If user clicked start field, set start field ID.
      if (Session.equals('start', undefined))
      {
        let dbField = Fields.findOne({_id: fieldID, board: Session.get('board')});
        if (dbField && dbField.piece !== 'empty')
          Session.set('start', fieldID);
      }
      //If user clicked start field again, reset start field.
      else if (Session.equals('start', fieldID))
      {
        Session.set('start', undefined);
        //... and reset end field, too.
        Session.set('end', undefined);
      }
      //If user clicked end field again, reset end field.
      else if (Session.equals('end', fieldID))
      {
        Session.set('end', undefined);
      }
      //Otherwise field must be end field.
      else if (!Session.equals('start', undefined))
      {
        Session.set('end', fieldID);
        //try to perform move
        Meteor.call('performMove', Session.get('start'), Session.get('end'), Session.get('promotion'), function(err, result){
          if (err)
          {
            alert('Move could not be performed: ' + err.reason);
          }
          else if (result)
          {
            //reset start + end to allow next move
            Session.set('end', undefined);
            Session.set('start', undefined);
          }
          else
          {
            alert('Move could not be performed, because it is against the rules.');
          }
        });
      } //else (end field)
    } //if
  }
});

Template.board.helpers({
  rows: function(){
    var res = [];
    var i = 8;
    for (i = 8; i>= 1; --i)
    {
      let data = Fields.find({row: i, board: Session.get('board')}, {sort: {column: 1}});
      let f = data.fetch();
      res.push({fields: f});
    } //for

    var light = true;
    for(i=0; i<8; ++i)
    {
      var j;
      for (j=0; j<res[i].fields.length; ++j)
      {
        //determine background colour of field
        if (light)
        {
          res[i].fields[j].background = '#cccccc';
        }
        else
        {
          res[i].fields[j].background = '#999999';
        }
        light = !light;
        //check whether field is start or end field
        if (Session.equals('start', res[i].fields[j]._id) || Session.equals('end', res[i].fields[j]._id))
        {
          //some kind of green
          res[i].fields[j].background = '#5cb85c';
        }
        //change rook to tower, because that is the name of the glyphicon
        if (res[i].fields[j].piece == 'rook')
        {
          res[i].fields[j].piece = 'tower';
        }
      } //for j
      light = !light;
    } //for i

    return res;
  },
  settings_size: function() {
    if (Session.equals('settings_size', undefined))
      return 48;
    return Session.get('settings_size');
  },
  settings_em: function() {
    if (Session.equals('settings_em', undefined))
      return 2;
    return Session.get('settings_em');
  }
});
