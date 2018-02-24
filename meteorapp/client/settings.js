Template.settings.helpers({
  settings_size: function() {
    if (Session.equals('settings_size', undefined))
      return 48;
    return Session.get('settings_size');
  },
  settings_em: function() {
    if (Session.equals('settings_em', undefined))
      return 2;
    return Session.get('settings_em');
  },
  promotion: function() {
    if (Session.equals('promotion', undefined))
      return 'queen';
    if (Session.equals('promotion', 'rook'))
      return 'tower';
    return Session.get('promotion');
  },
  exec_path: function() {
    if (Session.equals('executable', undefined))
      return '';
    return Session.get('executable').path;
  },
  exec_version: function() {
    if (Session.equals('executable', undefined))
      return null;
    const v = Session.get('executable').version;
    return v.major + '.' + v.minor + '.' + v.patch;
  }
});

Template.settings.events({
  'click a': function(event) {
    let id = event.currentTarget.id;
    switch (id)
    {
      // size-related settings
      case 'xl':
           Session.set('settings_size', 72);
           Session.set('settings_em', 3);
           break;
      case 'lg':
           Session.set('settings_size', 60);
           Session.set('settings_em', 2.5);
           break;
      case 'md':
           Session.set('settings_size', 48);
           Session.set('settings_em', 2);
           break;
      case 'sm':
           Session.set('settings_size', 36);
           Session.set('settings_em', 1.5);
           break;
      case 'xs':
           Session.set('settings_size', 24);
           Session.set('settings_em', 1);
           break;
      // promotion-related settings
      case 'queen':
      case 'knight':
      case 'rook':
      case 'bishop':
           Session.set('promotion', id);
           break;
    } // switch
  },
  'click button': function(event) {
    let id = event.currentTarget.id;
    console.log("Button click, id is " + id + ".");
    if (id === 'execpath')
    {
      var path = $('#pathinput').val();
      Meteor.call('checkExecutablePath', path, function(err, result) {
        if (err)
        {
          alert('Path is invalid: ' + err.reason);
        }
        else if (result)
        {
          Session.set('executable', {version: result, path: path});
        }
      });
    } // switch
  }
});
