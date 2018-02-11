Template.information.created = function() {
  this.subscribe('info');
};

Template.information.events({
  'click [id="tryconnect"], touchend [id="tryconnect"]': function(event, template){
    // try reconnect
    Meteor.reconnect();
  }
});

Template.information.helpers({
  connection: function() {
    var status = Meteor.status();
    var conn = {connected: status.connected, status: status.status};
    switch (status.status)
    {
      case "connected":
           conn.description = 'connected';
           break;
      case "failed":
           conn.description = 'connection failed';
      case "connecting":
           conn.description = 'Attempting reconnect...';
           break;
      case "waiting":
           var next = moment(new Date(Meteor.status().retryTime));
           conn.description = 'Waiting for next connection attempt ('
                            + status.retryCount + ' attempts so far, '
                            + 'next attempt at ' + next.format('HH:mm:ss')
                            + ')';
           break;
      case "offline":
           conn.description = 'disconnected by user';
           break;
      default:
           conn.description = "unknown ('" + status.status + "')";
           break;
    } // switch
    return conn;
  },
  meteorRelease: function() {
    /* Get Meteor release version and make it lower case, because a typical
       output is "METEOR@1.3.5.1", but we want a nicer version ("Meteor@...").
    */
    return Meteor.release.substring(0,1)
         + Meteor.release.substring(1).toLowerCase();
  },
  meteorStatus: function() {
    return JSON.stringify(Meteor.status(), null, 4);
  },
  meteorDevelopment: function() {
    if (Meteor.isDevelopment)
      return 'yes';
    return 'no';
  },
  meteorProduction: function() {
    if (Meteor.isProduction)
      return 'yes';
    return 'no';
  },
  meteorStartup: function() {
    var start = Info.findOne({name: 'startupTime'});
    if (!start)
      return "unknown";
    return moment(start.value).format();
  },
  meteorUptime: function() {
    var start = Info.findOne({name: 'startupTime'});
    if (!start)
      return "unknown";
    return moment.duration(moment()-moment(start.value)).humanize();
  },
  npmMongoModuleVersion: function() {
    // get value from collection for status
    var ver = Info.findOne({name: 'npmMongoModuleVersion'});
    if (!ver)
      return "Error while querying version";
    return ver.value;
  },
  mongoHost: function() {
    // get value from status collection
    var host = Info.findOne({name: 'mongoHost'});
    if (!host)
      return "Error while querying the host";
    return host.value;
  },
  mongoVersion: function() {
    // get value from status collection
    var mVer = Info.findOne({name: 'mongoVersion'});
    if (!mVer)
      return "Error while querying MongoDB version";
    return mVer.value;
  },
  mongoEngine: function() {
    // get value from status collection
    var eng = Info.findOne({name: 'mongoEngine'});
    if (!eng)
      return "Error while querying the storage engine";
    return eng.value;
  },
  gitInfo: function() {
    // get value from collection for status
    var git = Info.findOne({name: 'gitInfo'});
    if (!git)
      return {branch: 'unknown', description: 'unknown',
              commitDate: 'unknown',
              hashLong: 'unknown', hashShort: 'unknown'};
    if (undefined === git.value.commitDate)
      git.value.commitDate = 'unknown';
    return git.value;
  }
});
