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
  }
});
