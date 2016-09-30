Meteor.publish('boards', function(){
  return Boards.find({}, {sort: {row: -1, column: 1}});
});

Meteor.publish('info', function(){
  return Info.find({});
});
