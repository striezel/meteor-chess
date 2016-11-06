//server startup: get information for information template + initialize board
if (Meteor.isServer)
{
  Meteor.startup(function() {
    //clear status table
    Info.remove({});
    //fill status with NPM mongo module version
    Info.insert({name: 'npmMongoModuleVersion',
                   value: MongoInternals.NpmModules.mongodb.version});
    //get git-info.json, if it exists
    Assets.getText('git-info.json', function(err, result) {
      if (!err)
      {
        var gitInfo = JSON.parse(result);
        Info.insert({name: 'gitInfo', value: gitInfo});
      } //if
      else
      {
        console.error('Server startup: Could not get asset git-info.json');
        Info.insert({name: 'gitInfo',
                       value: {branch:      'Git information was not found.',
                               commitDate:  'Git information was not found.',
                               description: 'Git information was not found.',
                               hashShort:   'Git information was not found.',
                               hashLong:    'Git information was not found.'}
                     });
      } //else
    });
    //try to get MongoDB server status via raw database
    var rawDB = Info.rawDatabase();
    rawDB.eval('db.serverStatus()', Meteor.bindEnvironment(function(err, result){
      if (!err)
      {
        Info.insert({name: 'mongoHost', value: result.host});
        Info.insert({name: 'mongoVersion', value: result.version});
        Info.insert({name: 'mongoEngine', value: result.storageEngine.name});
      }
    }));

    //add server startup time
    Info.insert({name: 'startupTime',
                   value: new Date()});

    //initialize board, if there is none
    let boardDoc = Boards.findOne({});
    if (!boardDoc)
    {
      Meteor.call('boardInit');
    }

    //indices for collections
    Boards._ensureIndex({"created": 1});
    Fields._ensureIndex({"board": 1});
  });
}
