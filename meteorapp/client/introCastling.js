function castlingAnimInterval()
{
  if (Session.equals('step', undefined))
    Session.set('step', 0);
  else
    Session.set('step', Session.get('step') + 1);
}

var castlingIntroId = null;

Template.introCastling.created = function () {
  // set interval for animation
  castlingIntroId = Meteor.setInterval(castlingAnimInterval, 1250);
};

Template.introCastling.destroyed = function () {
  // clear interval
  Meteor.clearInterval(castlingIntroId);
};

Template.introCastling.helpers({
  fields: function(){
    let castlingSteps = [
      // default position
      [
        {piece: 'tower', colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'king',  colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'tower', colour: 'white', background: '#cccccc'}
      ],
      // default position, king selected
      [
        {piece: 'tower', colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'king',  colour: 'white', background: '#5cb85c'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'tower', colour: 'white', background: '#cccccc'}
      ],
      // default position, king + target selected
      [
        {piece: 'tower', colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#5cb85c'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'king',  colour: 'white', background: '#5cb85c'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'tower', colour: 'white', background: '#cccccc'}
      ],
      // position after queenside castling
      [
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'king',  colour: 'white', background: '#999999'},
        {piece: 'tower', colour: 'white', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'tower', colour: 'white', background: '#cccccc'}
      ],
      // default position
      [
        {piece: 'tower', colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'king',  colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'tower', colour: 'white', background: '#cccccc'}
      ],
      // default position, king selected
      [
        {piece: 'tower', colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'king',  colour: 'white', background: '#5cb85c'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'tower', colour: 'white', background: '#cccccc'}
      ],
      // default position, king + target selected
      [
        {piece: 'tower', colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'king',  colour: 'white', background: '#5cb85c'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#5cb85c'},
        {piece: 'tower', colour: 'white', background: '#cccccc'}
      ],
      // position after kingside castling
      [
        {piece: 'tower', colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'},
        {piece: 'empty', colour: 'empty', background: '#999999'},
        {piece: 'tower', colour: 'white', background: '#cccccc'},
        {piece: 'king',  colour: 'white', background: '#999999'},
        {piece: 'empty', colour: 'empty', background: '#cccccc'}
      ]
    ];

    if (Session.equals('step', undefined)
      || (Session.get('step') >= castlingSteps.length) || (Session.get('step') < 0))
      Session.set('step', 0);
    return castlingSteps[Session.get('step')];
  },
  settings_size: function() {
    if (Session.equals('settings_size', undefined))
      return 48;
    return Session.get('settings_size');
  },
  settings_em: function() {
    if (Session.equals('settings_em', undefined))
      return 2;
    return Session.get('settings_em');
  }
});
