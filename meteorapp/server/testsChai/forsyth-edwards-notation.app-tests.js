/* Make sure that method calls work. */
describe('Forsyth-Edwards Notation tests', function () {
  afterEach(function() {
    // clear Boards collection after each test
    Boards.remove({});
    // clear fields collection after each test
    Fields.remove({});
  });

  it("FEN.toBoard('<starting position>')", function () {
    // Set timeout for this test to 5 seconds, because it might take a while.
    this.timeout(5000);
    // insert board with synchronous call
    var boardID = FEN.toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    // ID should be a string.
    expect(boardID).to.exist;
    expect(boardID).to.be.a('string');
    // There should be a board with the given ID ...
    let boardDoc = Boards.findOne({_id: boardID});
    expect(boardDoc).to.exist;
    // ... and white player has to move next
    expect(boardDoc.toMove).to.equal('white');
    // ... and en passant field is not set
    expect(boardDoc.enPassant.row).to.equal(null);
    expect(boardDoc.enPassant.column).to.equal(null);
    // ... and half moves under 50 move rule are zero
    expect(boardDoc.halfmovesFifty).to.equal(0);
    // There should be 64 fields for the board.
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    // There should be 32 empty fields in rows 3 to 6.
    let fields = Fields.find({board: boardID, colour: 'empty', row: {$in: [3,4,5,6]}});
    expect(fields.count()).to.equal(32);
    // There should be 8 white pawns in row 2, ...
    fields = Fields.find({board: boardID, colour: 'white', piece: 'pawn', row: 2});
    expect(fields.count()).to.equal(8);
    // ... and 8 black pawns in row 7.
    fields = Fields.find({board: boardID, colour: 'black', piece: 'pawn', row: 7});
    expect(fields.count()).to.equal(8);
    // check white pieces
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
    // check black pieces
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

  it("FEN.toBoard('<position with halfmove counter>')", function () {
    // Set timeout for this test to 5 seconds, because it might take a while.
    this.timeout(5000);
    // insert board with synchronous call
    var boardID = FEN.toBoard('3R4/5ppk/p7/1pB2r1p/1P2R2P/P7/6P1/6K1 w - - 42');
    // ID should be a string.
    expect(boardID).to.exist;
    expect(boardID).to.be.a('string');
    // There should be a board with the given ID ...
    let boardDoc = Boards.findOne({_id: boardID});
    expect(boardDoc).to.exist;
    // ... and white player has to move next
    expect(boardDoc.toMove).to.equal('white');
    // ... and en passant field is not set
    expect(boardDoc.enPassant.row).to.equal(null);
    expect(boardDoc.enPassant.column).to.equal(null);
    // ... and half moves under 50 move rule are 42
    expect(boardDoc.halfmovesFifty).to.equal(42);
    // There should be 64 fields for the board.
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    // There should be 49 empty fields on the board.
    let fields = Fields.find({board: boardID, colour: 'empty'});
    expect(fields.count()).to.equal(49);
    // check white pieces
    // There should be a white king on g1.
    fields = Fields.find({board: boardID, colour: 'white', piece: 'king'});
    expect(fields.count()).to.equal(1);
    fields = fields.fetch();
    expect(fields[0].column).to.equal('g');
    expect(fields[0].row).to.equal(1);
    // There should be white pawns on g2, a3, b4 and h4.
    fields = Fields.find({board: boardID, colour: 'white', piece: 'pawn'}, {sort: {row: 1, column: 1}});
    expect(fields.count()).to.equal(4);
    fields = fields.fetch();
    expect(fields[0].column).to.equal('g');
    expect(fields[0].row).to.equal(2);
    expect(fields[1].column).to.equal('a');
    expect(fields[1].row).to.equal(3);
    expect(fields[2].column).to.equal('b');
    expect(fields[2].row).to.equal(4);
    expect(fields[3].column).to.equal('h');
    expect(fields[3].row).to.equal(4);
    // There should be a white bishop on c5.
    fields = Fields.find({board: boardID, colour: 'white', piece: 'bishop'});
    expect(fields.count()).to.equal(1);
    fields = fields.fetch();
    expect(fields[0].column).to.equal('c');
    expect(fields[0].row).to.equal(5);
    // There should be white rooks on e4 and d8.
    fields = Fields.find({board: boardID, colour: 'white', piece: 'rook'}, {sort: {row: 1, column: 1}});
    expect(fields.count()).to.equal(2);
    fields = fields.fetch();
    expect(fields[0].column).to.equal('e');
    expect(fields[0].row).to.equal(4);
    expect(fields[1].column).to.equal('d');
    expect(fields[1].row).to.equal(8);
    // check black pieces
    // There should be a black king on h7.
    fields = Fields.find({board: boardID, colour: 'black', piece: 'king'});
    expect(fields.count()).to.equal(1);
    fields = fields.fetch();
    expect(fields[0].column).to.equal('h');
    expect(fields[0].row).to.equal(7);
    // There should be a black rook on f5.
    fields = Fields.find({board: boardID, colour: 'black', piece: 'rook'});
    expect(fields.count()).to.equal(1);
    fields = fields.fetch();
    expect(fields[0].column).to.equal('f');
    expect(fields[0].row).to.equal(5);
    // There should be black pawns on b5, h5, a6, f7 and g7.
    fields = Fields.find({board: boardID, colour: 'black', piece: 'pawn'}, {sort: {row: 1, column: 1}});
    expect(fields.count()).to.equal(5);
    fields = fields.fetch();
    expect(fields[0].column).to.equal('b');
    expect(fields[0].row).to.equal(5);
    expect(fields[1].column).to.equal('h');
    expect(fields[1].row).to.equal(5);
    expect(fields[2].column).to.equal('a');
    expect(fields[2].row).to.equal(6);
    expect(fields[3].column).to.equal('f');
    expect(fields[3].row).to.equal(7);
    expect(fields[4].column).to.equal('g');
    expect(fields[4].row).to.equal(7);
  });
});
