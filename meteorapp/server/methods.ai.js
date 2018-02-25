/* Server side methods for handling the "AI" part of meteor-chess */

Meteor.methods({
  /* checkExecutablePath: method to check the executable path of meteor-chess-client

     parameters:
       path - (string) path to the executable file on the server

     return value:
       id of the MongoDB id for the corresponding entry in the Executables
       collection
  */
  checkExecutablePath: function(path) {
    console.log('Info: Setting new executable path...');
    if (typeof path !== 'string') {
      throw new Meteor.Error('invalid-type', "Path is not a string!");
    }
    if (path === '') {
      throw new Meteor.Error('invalid-value', "Empty path is not allowed!");
    }

    const { execFileSync } = require('child_process');

    var rawOut = null;
    try {
      rawOut = execFileSync(path, ['--json', '--version'], {timeout: 2000, killSignal: 'SIGKILL'});
    } catch (e) {
      throw new Meteor.Error('exec-fail', "File could not be executed!");
    }
    var info = null;
    try {
      info = JSON.parse(rawOut);
    } catch (e) {
      throw new Meteor.Error('json-parse-fail', "Output data of executable is not valid JSON!");
    }
    if (!info.version || !info.version.fullText || (typeof info.version.fullText !== 'string')
        || (typeof info.version.major !== 'number')
        || (typeof info.version.minor !== 'number')
        || (typeof info.version.patch !== 'number')) {
      // invalid or missing output
      throw new Meteor.Error('missing-info', "Could not get version information!");
    }
    console.log("Found meteor-chess-client: " + info.version.fullText);
    // Minimum required version is 0.5.1.
    const required = {major: 0, minor: 5, patch: 1};
    var compatible = SemVer.compatible(required, info.version);
    if (!compatible) {
      throw new Meteor.Error('incompatible-version',
        "The version of meteor-chess-client is not compatible with the current "
        + "requirements! Required version is " + required.major + '.'
        + required.minor + '.' + required.patch + ', but version ' + actual.major
        + '.' + actual.minor + '.' + actual.patch + ' was found.');
    }
    // Version of executable is compatible. Insert or update MongoDB.
    const found = Executables.findOne({path: path});
    if (!found) {
      return Executables.insert({path: path, version: info.version});
    }
    // Update existing entry.
    Executables.update({_id: found._id}, {$set: {version: info.version}});
    return found._id;
  },

  /* Purges all missing executables and updates all outdated executables.

     Parameters:
       none

     Returns:
       number of purged executable entries
  */
  purgeExecutables: function() {
    const { execFileSync } = require('child_process');

    let removed = 0;
    const execs = Executables.find({}).fetch();
    for (let ex of execs)
    {
      try {
        const id = Meteor.call('checkExecutablePath', ex.path);
      } catch (e) {
        // Execution failed, remove it.
        Executables.remove({_id: ex._id});
        ++removed;
      }
    } // for
    return removed;
  }
});
