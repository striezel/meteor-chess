/* Test whether move-related method calls work as expected. */
describe('server method tests: perform moves', function () {
  afterEach(function() {
    //clear Boards collection after each test
    Boards.remove({});
    //clear fields collection after each test
    Fields.remove({});
  });


  it("performMove(...) default", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = Meteor.call('boardInit');
    //ID should be a string
    expect(boardID).to.exist;
    expect(boardID).to.be.a('string');
    //perform move e2-e4
    let e2 = Fields.findOne({board: boardID, column: 'e', row: 2});
    let e4 = Fields.findOne({board: boardID, column: 'e', row: 4});
    let result = Meteor.call('performMove', e2._id, e4._id, 'queen');
    //move shall be allowed
    expect(result).to.equal(true);
    //e2 shall be empty
    let e2AfterMove = Fields.findOne({board: boardID, column: 'e', row: 2});
    expect(e2AfterMove.piece).to.equal('empty');
    expect(e2AfterMove.colour).to.equal('empty');
    //e4 shall have a white pawn
    let e4AfterMove = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(e4AfterMove.piece).to.equal('pawn');
    expect(e4AfterMove.colour).to.equal('white');
  });

  it("performMove(non-existent field ID,...) should throw", function () {
    var wrapper = function() {
      return Meteor.call('performMove', 'NotAnId', 'NotAnIdEither', 'queen');
    };
    //"perform" move
    expect(wrapper).to.throw(Meteor.Error);
    expect(wrapper).to.throw(Meteor.Error, /entity\-not\-found/);
  });

  it("performMove(...) between different boards should throw", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert boards with synchronous call
    var boardIdOne = Meteor.call('boardInit');
    var boardIdTwo = Meteor.call('boardInit');
    //IDs should be two different strings
    expect(boardIdOne).to.be.a('string');
    expect(boardIdTwo).to.be.a('string');
    expect(boardIdOne).not.to.equal(boardIdTwo);
    //perform move e2-e4
    let e2 = Fields.findOne({board: boardIdOne, column: 'e', row: 2});
    let e4 = Fields.findOne({board: boardIdTwo, column: 'e', row: 4});
    var wrapper = function() {
      return Meteor.call('performMove', e2._id, e4._id, 'queen');
    };
    //"perform" move
    expect(wrapper).to.throw(Meteor.Error);
    expect(wrapper).to.throw(Meteor.Error, /boards\-mismatch/);
  });

  it("performMove(...) with white pawn promotion to queen", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardId = FEN.toBoard('8/P7/8/8/8/8/8/8');
    //perform move a7-a8
    let a7 = Fields.findOne({board: boardId, column: 'a', row: 7});
    let a8 = Fields.findOne({board: boardId, column: 'a', row: 8});
    let result = Meteor.call('performMove', a7._id, a8._id, 'queen');
    expect(result).to.equal(true);
    //a7 shall be empty
    let a7AfterMove = Fields.findOne({board: boardId, column: 'a', row: 7});
    expect(a7AfterMove.piece).to.equal('empty');
    expect(a7AfterMove.colour).to.equal('empty');
    //a8 shall have a white queen
    let a8AfterMove = Fields.findOne({board: boardId, column: 'a', row: 8});
    expect(a8AfterMove.piece).to.equal('queen');
    expect(a8AfterMove.colour).to.equal('white');
  });

  it("performMove(...) with white pawn promotion to knight", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardId = FEN.toBoard('8/P7/8/8/8/8/8/8');
    //perform move a7-a8
    let a7 = Fields.findOne({board: boardId, column: 'a', row: 7});
    let a8 = Fields.findOne({board: boardId, column: 'a', row: 8});
    let result = Meteor.call('performMove', a7._id, a8._id, 'knight');
    expect(result).to.equal(true);
    //a7 shall be empty
    let a7AfterMove = Fields.findOne({board: boardId, column: 'a', row: 7});
    expect(a7AfterMove.piece).to.equal('empty');
    expect(a7AfterMove.colour).to.equal('empty');
    //a8 shall have a white knight
    let a8AfterMove = Fields.findOne({board: boardId, column: 'a', row: 8});
    expect(a8AfterMove.piece).to.equal('knight');
    expect(a8AfterMove.colour).to.equal('white');
  });

  it("performMove(...) with en passant capture of white pawn", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('k6K/8/8/8/4Pp2/8/8/8 b - e3');
    //get field with white pawn
    let whitePawnDoc = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(whitePawnDoc).to.exist;
    expect(whitePawnDoc.piece).to.equal('pawn');
    expect(whitePawnDoc.colour).to.equal('white');
    //get field with black pawn
    let blackPawnDoc = Fields.findOne({board: boardID, column: 'f', row: 4});
    expect(blackPawnDoc).to.exist;
    expect(blackPawnDoc.piece).to.equal('pawn');
    expect(blackPawnDoc.colour).to.equal('black');
    //get e3
    let e3 = Fields.findOne({board: boardID, column: 'e', row: 3});
    //en passant move should be performed
    let result = Meteor.call('performMove', blackPawnDoc._id, e3._id, 'queen');
    expect(result).to.equal(true);
    //e4 should not contain white pawn anymore
    let e4 = Fields.findOne({board: boardID, column: 'e', row: 4});
    expect(e4).to.exist;
    expect(e4.piece).to.equal('empty');
    expect(e4.colour).to.equal('empty');
  });

  it("performMove(...) with black pawn promotion to queen", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardId = FEN.toBoard('8/8/8/8/8/8/p7/8 b');
    //perform move a2-a1
    let a2 = Fields.findOne({board: boardId, column: 'a', row: 2});
    let a1 = Fields.findOne({board: boardId, column: 'a', row: 1});
    let result = Meteor.call('performMove', a2._id, a1._id, 'queen');
    expect(result).to.equal(true);
    //a2 shall be empty
    let a2AfterMove = Fields.findOne({board: boardId, column: 'a', row: 2});
    expect(a2AfterMove.piece).to.equal('empty');
    expect(a2AfterMove.colour).to.equal('empty');
    //a1 shall have a black queen
    let a1AfterMove = Fields.findOne({board: boardId, column: 'a', row: 1});
    expect(a1AfterMove.piece).to.equal('queen');
    expect(a1AfterMove.colour).to.equal('black');
  });

  it("performMove(...) with black pawn promotion to knight", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardId = FEN.toBoard('8/8/8/8/8/8/p7/8 b');
    //perform move a2-a1
    let a2 = Fields.findOne({board: boardId, column: 'a', row: 2});
    let a1 = Fields.findOne({board: boardId, column: 'a', row: 1});
    let result = Meteor.call('performMove', a2._id, a1._id, 'knight');
    expect(result).to.equal(true);
    //a2 shall be empty
    let a2AfterMove = Fields.findOne({board: boardId, column: 'a', row: 2});
    expect(a2AfterMove.piece).to.equal('empty');
    expect(a2AfterMove.colour).to.equal('empty');
    //a1 shall have a black knight
    let a1AfterMove = Fields.findOne({board: boardId, column: 'a', row: 1});
    expect(a1AfterMove.piece).to.equal('knight');
    expect(a1AfterMove.colour).to.equal('black');
  });

  it("performMove(...) with en passant capture of black pawn", function () {
    //set timeout for this test to 5 seconds, because it might take a while
    this.timeout(5000);
    //insert board with synchronous call
    var boardID = FEN.toBoard('k6K/8/8/4pP2/8/8/8/8 w - e6');
    //get field with white pawn
    let whitePawnDoc = Fields.findOne({board: boardID, column: 'f', row: 5});
    expect(whitePawnDoc).to.exist;
    expect(whitePawnDoc.piece).to.equal('pawn');
    expect(whitePawnDoc.colour).to.equal('white');
    //get field with black pawn
    let blackPawnDoc = Fields.findOne({board: boardID, column: 'e', row: 5});
    expect(blackPawnDoc).to.exist;
    expect(blackPawnDoc.piece).to.equal('pawn');
    expect(blackPawnDoc.colour).to.equal('black');
    //get e6
    let e6 = Fields.findOne({board: boardID, column: 'e', row: 6});
    //en passant move should be performed
    let result = Meteor.call('performMove', whitePawnDoc._id, e6._id, 'queen');
    expect(result).to.equal(true);
    //e5 should not contain white pawn anymore
    let e5 = Fields.findOne({board: boardID, column: 'e', row: 5});
    expect(e5).to.exist;
    expect(e5.piece).to.equal('empty');
    expect(e5.colour).to.equal('empty');
  });
});