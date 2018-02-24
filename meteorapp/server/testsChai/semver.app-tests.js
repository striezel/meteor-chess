/* Make sure semantic versioning compatibility checks work. */
describe('SemVer tests', function () {
  it("compatible SemVer cases", function () {
    const required = {major: 0, minor: 5, patch: 1};
    var actual;

    actual = {major: 0, minor: 5, patch: 1};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 5, patch: 2};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 5, patch: 3};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 6, patch: 0};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 6, patch: 1};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 6, patch: 2};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 7, patch: 0};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 7, patch: 1};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 7, patch: 2};
    expect(SemVer.compatible(required, actual)).to.equal(true);
    actual = {major: 0, minor: 42, patch: 0};
    expect(SemVer.compatible(required, actual)).to.equal(true);
  });

  it("incompatible SemVer cases", function () {
    const required = {major: 0, minor: 5, patch: 1};
    var actual;

    actual = {major: 0, minor: 3, patch: 1};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 0, minor: 4, patch: 2};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    // Version 0.5.0 is not compatible, although it would be by strict SemVer
    // rules. However I want to have at least the given version for version to
    // be compatible.
    actual = {major: 0, minor: 5, patch: 0};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 1, minor: 0, patch: 0};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 1, minor: 5, patch: 1};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 1, minor: 5, patch: 2};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 2, minor: 0, patch: 1};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 3, minor: 1, patch: 2};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 4, minor: 6, patch: 5};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 5, minor: 3, patch: 4};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 6, minor: 7, patch: 8};
    expect(SemVer.compatible(required, actual)).to.equal(false);
    actual = {major: 9001, minor: 0, patch: 1};
    expect(SemVer.compatible(required, actual)).to.equal(false);
  });

  it("messed-up types for SemVer", function () {
    const required = {major: 0, minor: 5, patch: 1};
    const actual = {major: 0, minor: 3, patch: 1};
    expect(SemVer.compatible(null, actual)).to.equal(false);
    expect(SemVer.compatible(undefined, actual)).to.equal(false);
    expect(SemVer.compatible('0.3.1', actual)).to.equal(false);
    expect(SemVer.compatible({}, actual)).to.equal(false);
    expect(SemVer.compatible(required, null)).to.equal(false);
    expect(SemVer.compatible(required, undefined)).to.equal(false);
    expect(SemVer.compatible(required, '0.5.1')).to.equal(false);
    expect(SemVer.compatible(function() {}, function() {})).to.equal(false);
  });

  it("missing info for SemVer", function () {
    const required = {major: 0, minor: 5, patch: 1};
    const actual = {major: 0, minor: 3, patch: 1};
    expect(SemVer.compatible(required, {minor: 0, patch: 1})).to.equal(false);
    expect(SemVer.compatible(required, {major: 0, patch: 1})).to.equal(false);
    expect(SemVer.compatible(required, {major: 0, minor: 5})).to.equal(false);
    expect(SemVer.compatible({minor: 3, patch: 1}, actual)).to.equal(false);
    expect(SemVer.compatible({major: 0, patch: 1}, actual)).to.equal(false);
    expect(SemVer.compatible({major: 0, minor: 3}, actual)).to.equal(false);
  });
});
