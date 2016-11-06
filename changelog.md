# Changelog of Meteor Chess

## Meteor Chess, version 0.14 (2016-11-06)

Add animation to introduction about castling.

## Meteor Chess, version 0.13 (2016-11-06)

The changelog was removed from the information page.

## Meteor Chess, version 0.12 (2016-11-06)

An introduction was added to the application to show new players the basics of
the application.

## Meteor Chess, version 0.11 (2016-11-06)

Pawns can now be captured en passant.

## Meteor Chess, version 0.10 (2016-10-22)

The application can now detect win / loss of a game.
To simplify the detection the application assumes loss of a game, if a player
has been in check for two halfmoves. This means if a player is in check and is
unable to break free from check with the next halfmove, that player loses the
game.

## Meteor Chess, version 0.9 (2016-10-22)

The application will now show a warning, if any player is in check.
However, it does not check (yet), whether the player does something about it.

## Meteor Chess, version 0.8 (2016-10-21)

Castling is no longer allowed, if there are pieces between king and rook.
(This rule had not been implemented before.)

## Meteor Chess, version 0.7.1 (2016-10-15)

This release brings some minor improvements:

- Status of connection with the server is shown. This is important, because the
  application will not work properly, if the client is disconnected from the
  server.
- fix an error in parsing Forsyth-Edwards notation

## Meteor Chess, version 0.7 (2016-10-05)

Consider this to be the first "release".
It is not fully feature-complete yet, but it provides everything that two
players need to start and play a match. Therefore, this is the first playable
release.
