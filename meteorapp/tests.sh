#!/bin/bash

# Bash script to run the Mocha / Chai tests
# (C) 2016, 2017  Dirk Stolle

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

# get meteor executable
METEOR=meteor
if [[ ! -x $METEOR ]]
then
  METEOR=~/.meteor/meteor
  echo "Info: Global meteor executable was not found!"
  echo "Info: Using $METEOR instead."
  if [[ ! -x $METEOR ]]
  then
    echo "Error: $METEOR is not an executable file! Test run will be cancelled."
    echo "Please check that you have installed Meteor properly."
    echo -n "If you are sure that Meteor is installed, then make sure that the"
    echo -n " meteor executable is in your PATH environment variable or that"
    echo " $METEOR links to that executable."
    exit 1
  fi
fi

# Tests will be run on port 3333 instead of 3000 to make sure that any
# potential users on port 3000 will not see the tests.
$METEOR test --driver-package dispatch:mocha-phantomjs --once --full-app \
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
