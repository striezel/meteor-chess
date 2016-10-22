describe('Moves tests', function () {
  afterEach(function() {
    //clear Boards collection after each test
    Boards.remove({});
    //clear fields collection after each test
    Fields.remove({});
  });

  it("moves of king", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/4K3/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with king
    let kingDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(kingDoc).to.exist;
    expect(kingDoc.piece).to.equal('king');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['d3', 'd4', 'd5', 'e3', 'e5', 'f3', 'f4', 'f5'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(kingDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });
});