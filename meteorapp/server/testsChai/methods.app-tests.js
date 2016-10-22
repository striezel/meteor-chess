/* Test whether method calls work as expected. */
describe('server method tests: board management', function () {
  afterEach(function() {
    //clear Boards collection after each test
    Boards.remove({});
    //clear fields collection after each test
    Fields.remove({});
  });


  it("boardInit", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = Meteor.call('boardInit');
    //ID should be a string
    expect(boardID).to.exist;
    expect(boardID).to.be.a('string');
    // there should be a board with the given ID
    let boardDoc = Boards.findOne({_id: boardID});
    expect(boardDoc).to.exist;
    // ... and white player has to move next
    expect(boardDoc.toMove).to.equal('white');
    // ... and castling is allowed
    expect(boardDoc.castling.white.kingside).to.equal(true);
    expect(boardDoc.castling.white.queenside).to.equal(true);
    expect(boardDoc.castling.black.kingside).to.equal(true);
    expect(boardDoc.castling.black.queenside).to.equal(true);
    // ... and there is no winner yet
    expect(boardDoc.winner).to.equal(null);
    // ... and no checks either
    expect(boardDoc.check.white).to.equal(false);
    expect(boardDoc.check.black).to.equal(false);
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


  it("boardDelete", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = Meteor.call('boardInit');
    //ID should be a string
    expect(boardID).to.exist;
    expect(boardID).to.be.a('string');
    // there should be a board with the given ID
    let boardDoc = Boards.findOne({_id: boardID});
    expect(boardDoc).to.exist;
    //delete board
    let result = Meteor.call('boardDelete', boardID);
    expect(result).to.equal(true);
    //there should be no more board with the board ID
    boardDoc = Boards.findOne({_id: boardID});
    expect(boardDoc).not.to.exist;
  });

  it("boardDelete with non-existent board ID should throw", function () {
    var deleteWrapper = function() {
      return Meteor.call('boardDelete', 'ThisBoardIdDoesNotExist');
    };
    //delete board
    expect(deleteWrapper).to.throw(Meteor.Error);
    expect(deleteWrapper).to.throw(Meteor.Error, /entity\-not\-found/);
  });
});