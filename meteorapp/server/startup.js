//server startup: get information for information template + initialize board
if (Meteor.isServer)
{
  Meteor.startup(function() {
    //clear status table
    Status.remove({});
    //fill status with NPM mongo module version
    Status.insert({name: 'npmMongoModuleVersion',
                   value: MongoInternals.NpmModules.mongodb.version});
    //get git-info.json, if it exists
    Assets.getText('git-info.json', function(err, result) {
      if (!err)
      {
        var gitInfo = JSON.parse(result);
        Status.insert({name: 'gitInfo', value: gitInfo});
      } //if
      else
      {
        console.error('Server startup: Could not get asset git-info.json');
        Status.insert({name: 'gitInfo',
                       value: {branch:      'Git information was not found',
                               commitDate:  'Git information was not found',
                               description: 'Git information was not found',
                               hashShort:   'Git information was not found',
                               hashLong:    'Git information was not found'}
                     });
      } //else
    });
    //try to get MongoDB server status via raw database
    var rawDB = Status.rawDatabase();
    rawDB.eval('db.serverStatus()', Meteor.bindEnvironment(function(err, result){
      if (!err)
      {
        Status.insert({name: 'mongoHost', value: result.host});
        Status.insert({name: 'mongoVersion', value: result.version});
        Status.insert({name: 'mongoEngine', value: result.storageEngine.name});
      }
    }));

    //add server startup time
    Status.insert({name: 'startupTime',
                   value: new Date()});

    //initialize board
    Meteor.call('boardInit');
  });
}
