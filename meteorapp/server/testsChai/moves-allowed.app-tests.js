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

  it("moves of queen", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/4Q3/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with queen
    let qDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(qDoc).to.exist;
    expect(qDoc.piece).to.equal('queen');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['e1', 'e2', 'e3', 'e5', 'e6', 'e7', 'e8',
                 'a4', 'b4', 'c4', 'd4', 'f4', 'g4', 'h4',
                 'b1', 'c2', 'd3', 'f5', 'g6', 'h7',
                 'a8', 'b7', 'c6', 'd5', 'f3', 'g2', 'h1'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(qDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of bishop", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/4B3/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with bishop
    let bishopDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(bishopDoc).to.exist;
    expect(bishopDoc.piece).to.equal('bishop');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['b1', 'c2', 'd3', 'f5', 'g6', 'h7',
                 'a8', 'b7', 'c6', 'd5', 'f3', 'g2', 'h1'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(bishopDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of knight", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/4N3/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with rook
    let kDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(kDoc).to.exist;
    expect(kDoc.piece).to.equal('knight');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['d2', 'f2', 'g3', 'g5', 'f6', 'd6', 'c5', 'c3'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(kDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of rook", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/4R3/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with rook
    let rDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(rDoc).to.exist;
    expect(rDoc.piece).to.equal('rook');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['e1', 'e2', 'e3', 'e5', 'e6', 'e7', 'e8',
                 'a4', 'b4', 'c4', 'd4', 'f4', 'g4', 'h4'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(rDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of white pawn", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/4P3/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with pawn
    let pawnDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(pawnDoc).to.exist;
    expect(pawnDoc.piece).to.equal('pawn');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['e5'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(pawnDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of white pawn on e2", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/8/8/4P3/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with pawn
    let pawnDoc = Fields.findOne({board: boardID, column: 'e', row: 2});
    expect(pawnDoc).to.exist;
    expect(pawnDoc.piece).to.equal('pawn');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['e3', 'e4'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(pawnDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of white pawn with captures", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/3n1n2/4P3/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with pawn
    let pawnDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(pawnDoc).to.exist;
    expect(pawnDoc.piece).to.equal('pawn');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['d5', 'e5', 'f5'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(pawnDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of black pawn", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/4p3/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with pawn
    let pawnDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(pawnDoc).to.exist;
    expect(pawnDoc.piece).to.equal('pawn');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['e3'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(pawnDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of black pawn on e7", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/4p3/8/8/8/8/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with pawn
    let pawnDoc = Fields.findOne({board: boardID, column: 'e', row: 7});
    expect(pawnDoc).to.exist;
    expect(pawnDoc.piece).to.equal('pawn');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['e6', 'e5'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(pawnDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });

  it("moves of black pawn with captures", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('8/8/8/8/4p3/3N1N2/8/8');
    //ID should be a string
    expect(boardID).to.be.a('string');
    //get field with pawn
    let pawnDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(pawnDoc).to.exist;
    expect(pawnDoc.piece).to.equal('pawn');
    //get all other fields
    let fieldArray = Fields.find({board: boardID}).fetch();
    expect(fieldArray).to.have.lengthOf(64);
    //list of fields with possible moves
    let moves = ['d3', 'e3', 'f3'];
    let i = 0;
    for (i = 0; i < 64; ++i)
    {
      expect(Moves.allowed(pawnDoc._id, fieldArray[i]._id, boardID)).to.equal(
        moves.indexOf(fieldArray[i].column+fieldArray[i].row) !== -1
      );
    } //for
  });
});