/* Make sure that method calls work. */
describe('Forsyth-Edwards Notation tests', function () {
  afterEach(function() {
    //clear Boards collection after each test
    Boards.remove({});
    //clear fields collection after each test
    Fields.remove({});
  });

  it("FEN.toBoard('<starting position>')", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
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
    //check white pieces
    fields = Fields.find({board: boardID, colour: 'white', row: 1}, {sort: {column: 1}});
    expect(fields.count()).to.equal(8);
    fields = fields.fetch();
    expect(fields[0].piece).to.equal('rook');
    expect(fields[1].piece).to.equal('knight');
    expect(fields[2].piece).to.equal('bishop');
    expect(fields[3].piece).to.equal('queen');
    expect(fields[4].piece).to.equal('king');
    expect(fields[5].piece).to.equal('bishop');
    expect(fields[6].piece).to.equal('knight');
    expect(fields[7].piece).to.equal('rook');
    //check black pieces
    fields = Fields.find({board: boardID, colour: 'black', row: 8}, {sort: {column: 1}});
    expect(fields.count()).to.equal(8);
    fields = fields.fetch();
    expect(fields[0].piece).to.equal('rook');
    expect(fields[1].piece).to.equal('knight');
    expect(fields[2].piece).to.equal('bishop');
    expect(fields[3].piece).to.equal('queen');
    expect(fields[4].piece).to.equal('king');
    expect(fields[5].piece).to.equal('bishop');
    expect(fields[6].piece).to.equal('knight');
    expect(fields[7].piece).to.equal('rook');
  });
});