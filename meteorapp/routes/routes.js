Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {name: 'boardSelection'});

Router.route('/board', {name: 'board'});
Router.route('/board/delete', {name: 'boardDelete'});

Router.route('/settings', {name: 'settings'});

Router.route('/info', {name: 'information'});
