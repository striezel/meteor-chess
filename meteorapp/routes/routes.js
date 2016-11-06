Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {name: 'intro'});
Router.route('/intro/move', {name: 'introMoving'});
Router.route('/intro/castling', {name: 'introCastling'});
Router.route('/select', {name: 'boardSelection'});
Router.route('/board', {name: 'board'});
Router.route('/board/delete', {name: 'boardDelete'});
Router.route('/settings', {name: 'settings'});
Router.route('/info', {name: 'information'});
