Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {name: 'board'});

Router.route('/settings', {name: 'settings'});

Router.route('/info', {name: 'information'});
