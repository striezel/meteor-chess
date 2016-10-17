#!/bin/bash

# Bash script to run the Mocha / Chai tests
# (C) 2016  Dirk Stolle

# get directory of this script
THIS_DIR="${BASH_SOURCE%/*}"
# get current directory
OLD_WORKING_DIRECTORY="$(pwd)"

# change to this directory, because that is where meteor is
cd "$THIS_DIR"
if [[ $? -ne 0 ]]
then
  echo "Could not change to meteor application directory!"
  exit 1
fi

# Tests will be run on port 3333 instead of 3000 to make sure that any
# potential users on port 3000 will not see the tests.
meteor test --driver-package dispatch:mocha-phantomjs --once --full-app \
 --port 3333
EXITCODE_METEOR_TEST=$?

# change back to previous directory
cd "$OLD_WORKING_DIRECTORY"
if [[ $? -ne 0 ]]
then
  echo "Could not change back to old working directory!"
  exit 1
fi

# Return a proper exit code from the meteor test command.
exit $EXITCODE_METEOR_TEST
