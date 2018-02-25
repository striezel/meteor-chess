/* Test whether AI-related method calls work as expected. */
describe('server method tests: AI management', function () {
  beforeEach(function() {
    //clear Executables collection before each test
    Executables.remove({});
  });

  afterEach(function() {
    //clear Executables collection after each test
    Executables.remove({});
  });

  it("checkExecutablePath with non-existent executable should throw", function () {
    var methodCallWrapper = function() {
      return Meteor.call('checkExecutablePath', '/this/file/does/not/exist');
    };
    // check whether it throws
    expect(methodCallWrapper).to.throw(Meteor.Error);
    expect(methodCallWrapper).to.throw(Meteor.Error, /exec\-fail/);
  });

  it("checkExecutablePath (default)", function () {
    // Construct path to executable.
    const path = require('path');
    const os = require('os');
    const execPath = path.join(os.homedir(), 'simple-chess', 'b',
      'meteor-chess-client', 'meteor-chess-client');
    console.log('execPath is ' + execPath);
    var execId = Meteor.call('checkExecutablePath', execPath);
    // ID should be a string.
    expect(execId).to.exist;
    expect(execId).to.be.a('string');
    // There should be an executable with the given ID.
    let execDoc = Executables.findOne({_id: execId});
    expect(execDoc).to.exist;
    // ... and path of that executable should be the given path.
    expect(execDoc.path).to.equal(execPath);
    // ... and version should be set.
    expect(execDoc.version).to.exist;
    expect(execDoc.version.major).to.be.a('number');
    expect(execDoc.version.minor).to.be.a('number');
    expect(execDoc.version.patch).to.be.a('number');
  });

  it("checkExecutablePath update", function () {
    // Construct path to executable.
    const path = require('path');
    const os = require('os');
    const execPath = path.join(os.homedir(), 'simple-chess', 'b',
      'meteor-chess-client', 'meteor-chess-client');
    var execId = Meteor.call('checkExecutablePath', execPath);
    // ID should be a string.
    expect(execId).to.exist;
    expect(execId).to.be.a('string');
    // Second call should give same result.
    var execId2 = Meteor.call('checkExecutablePath', execPath);
    expect(execId2).to.exist;
    expect(execId2).to.be.a('string');
    expect(execId2).to.equal(execId);
    // There should be an executable with the given ID.
    let execDoc = Executables.findOne({_id: execId2});
    expect(execDoc).to.exist;
    // ... and path of that executable should be the given path.
    expect(execDoc.path).to.equal(execPath);
    // ... and version should be set.
    expect(execDoc.version).to.exist;
    expect(execDoc.version.major).to.be.a('number');
    expect(execDoc.version.minor).to.be.a('number');
    expect(execDoc.version.patch).to.be.a('number');
    // There should only be one entry, not two.
    const count = Executables.find({}).count();
    expect(count).to.equal(1);
  });


  it("purgeExecutables with non-existent executables should remove them", function () {
    // Insert some bogus executable data.
    Executables.insert({path: '/this/file/does/not/exist', version: {major: 0, minor: 5, patch: 1}});
    Executables.insert({path: '/this/file/does/not/exist.either', version: {major: 0, minor: 0, patch: 0}});
    const purged = Meteor.call('purgeExecutables');
    // Both entries should be purged.
    expect(purged).to.equal(2);
    // Collection should now be empty.
    const count = Executables.find({}).count();
    expect(count).to.equal(0);
  });

  it("purgeExecutables should keep existing files", function () {
    // Construct path to executable.
    const path = require('path');
    const os = require('os');
    const execPath = path.join(os.homedir(), 'simple-chess', 'b',
      'meteor-chess-client', 'meteor-chess-client');
    // Insert data for existing executable.
    const id = Executables.insert({path: execPath, version: {major: 0, minor: 0, patch: 0}});
    const purged = Meteor.call('purgeExecutables');
    // No entries should be purged.
    expect(purged).to.equal(0);
    // Collection should contain one entry.
    const count = Executables.find({}).count();
    expect(count).to.equal(1);
    // Version should be updated.
    const doc = Executables.findOne({_id: id});
    expect(doc.path).to.equal(execPath);
    const versionString = doc.version.major + '.' + doc.version.minor + '.' + doc.version.patch;
    expect(versionString).to.not.equal('0.0.0');
    expect(versionString > '0.0.0').to.be.true;
  });
});
