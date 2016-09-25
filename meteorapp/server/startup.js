//server startup: initialize board

Meteor.startup(function(){
  Meteor.call('boardInit');
});
