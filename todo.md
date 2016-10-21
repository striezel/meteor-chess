# To do list for Meteor Chess

A few game-related rules are not completely implemented yet. These are:

* detect win / loss

Additionally, there are some "nice to have" features that I like to implement:

* record all moves on a board to allow later replay
* display time that is required for current move
* possibility to move finished matches / boards into an "archive" where they
  are not directly accessible and are not synchronized to the clients (in order
  to reduce data traffic between clients and servers and to speed up MongoDB
  queries)
