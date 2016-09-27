Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {name: 'board'});

Router.route('/settings', {name: 'settings'});
