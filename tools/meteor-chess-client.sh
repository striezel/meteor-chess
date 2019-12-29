#!/bin/bash
#
# This is an utility script for automatic play by the simple-chess engine.
# (C) 2018, 2019  Dirk Stolle

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# Options:
# BOARD_ID - id of the board as seen in MongoDB, e.g. FRFMDcwEMxFEK5SwJ
BOARD_ID=insert-id-here

# CLIENT_EXECUTABLE - path to the meteor-chess-client executable
CLIENT_EXECUTABLE=/path/to/meteor-chess-client

while true
do
  "$CLIENT_EXECUTABLE" --move --board "$BOARD_ID"
  if [ $? -ne 0 ]
  then
    echo "meteor-chess-client exited with error."
    exit 1
  fi
  sleep 1
done

exit 0
