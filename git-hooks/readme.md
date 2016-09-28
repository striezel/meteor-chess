# Git hooks

Git provides the possibility to run scripts at certain points, e.g. before or
after a commit. These scripts are called Git hooks. The hooks are not part of
the Git repository itself, but have to be copied to .git/hooks/ manually. This
directory contains a post-commit hook script.

* **post-commit** - post commit hook script that generates some Git information
  and writes it into a JSON file, which can be used by the server side of the
  Meteor application to provide some Git information.

* **post-checkout** - symbolic link to post-commit, because post-checkout
  shall do the same thing as post-commit: update the Git information in JSON
