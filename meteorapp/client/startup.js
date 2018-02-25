// client startup: set executable information, if some information is available
if (Meteor.isClient)
{
  Meteor.startup(function() {
    // Try to set executable information.
    if (Session.equals('executable', undefined)) {
      var sub = Meteor.subscribe('executables', function() {
        // Subscription is ready, now we can get the data.
        const eDoc = Executables.findOne({});
        if (eDoc) {
          Session.set('executable', {id: eDoc._id, version: eDoc.version, path: eDoc.path});
        }
        // Stop subscription.
        this.stop();
      });
    }
  });
}
