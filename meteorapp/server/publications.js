Meteor.publish('boards', function(){
  return Boards.find({}, {sort: {created: -1}});
});

Meteor.publish('fields', function(){
  return Fields.find({}, {sort: {row: -1, column: 1}});
});

Meteor.publish('info', function(){
  return Info.find({});
});

Meteor.publish('executables', function(){
  // Publish executables collection, sorted by version number in descending order.
  return Executables.find({},
    {sort: {"version.major": -1, "version.minor": -1, "version.patch": -1}}
  );
});
