/* Make sure that method calls work. */
describe('Forsyth-Edwards Notation tests', function () {
  afterEach(function() {
    //clear Boards collection after each test
    Boards.remove({});
    //clear fields collection after each test
    Fields.remove({});
  });
  /*
  beforeEach(function() {
    //clear Boards collection after each test
    Boards.remove({});
    //clear fields collection after each test
    Fields.remove({});
  });
  */

  it("FEN.toBoard('<starting position>')", function () {
    //insert WWTP with synchronous call
    var boardID = FEN.toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    //ID should be a string
    expect(boardID).to.exist;
    expect(boardID).to.be.a('string');
    // there should be a board with the given ID
    let boardDoc = Boards.findOne({_id: boardID});
    expect(boardDoc).to.exist;
    // ... and white player has to move next
    expect(boardDoc.toMove).to.equal('white');
    //There should be 64 fields for the board.
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //There should be 32 empty fields in rows 3 to 6.
    let fields = Fields.find({board: boardID, colour: 'empty', row: {$in: [3,4,5,6]}});
    expect(fields.count()).to.equal(32);
    //There should be 8 white pawns in row 2, ...
    fields = Fields.find({board: boardID, colour: 'white', piece: 'pawn', row: 2});
    expect(fields.count()).to.equal(8);
    // ... and 8 black pawns in row 7.
    fields = Fields.find({board: boardID, colour: 'black', piece: 'pawn', row: 7});
    expect(fields.count()).to.equal(8);
  });
});