/* Check for compatibility of semantic versioning numbers */

SemVer = {
  /* Checks whether two versions are compatible according to semantic versioning.

     Parameters:
       required - (object) required version as object with members major, minor
                  and patch having the corresponding version numbers
       actual - (object) actual version as object with members major, minor and
                patch having the corresponding version numbers

     Returns:
       true if actual version is compatible to required version
  */
  compatible: function(required, actual) {
    if (null === required || undefined === required || null === actual
      || undefined === actual) {
        return false;
    }
    if ((typeof required.major !== 'number') || (typeof required.minor !== 'number')
      || (typeof required.patch !== 'number') || (typeof actual.major !== 'number')
      || (typeof actual.minor !== 'number') || (typeof actual.patch !== 'number'))
    {
      return false;
    }
    // Major version numbers must match.
    return ((required.major === actual.major)
      // Actual minor version number must be either greater than required ...
      && ((required.minor < actual.minor)
      // ... or minor numbers are equal and actual patch number is greater than
      // or equal to required patch number.
      || ((required.minor === actual.minor) && (required.patch <= actual.patch))));
  }
}
