Template.board.created = function() {
  this.subscribe('boards');
};

Template.board.helpers({
  rows: function(){
    var res = [];
    var i = 8;
    for (i = 8; i>= 1; --i)
    {
      let data = Boards.find({row: i}, {sort: {column: 1}});
      let f = data.fetch();
      res.push({fields: f});
    } //for

    var light = true;
    for(i=0; i<8; ++i)
    {
      var j;
      for (j=0; j<res[i].fields.length; ++j)
      {
        if (light)
        {
          res[i].fields[j].background = '#cccccc';
        }
        else
        {
          res[i].fields[j].background = '#999999';
        }
        light = !light;
        //change rook to tower, because that is the name of the glyphicon
        if (res[i].fields[j].piece == 'rook')
        {
          res[i].fields[j].piece = 'tower';
        }
      } //for j
      light = !light;
    } //for i

    return res;
  }
});
