# This Dockerfile will set up a Debian 8-based container that is able to
# run the Meteor chess application.
#
# Version 0.02

FROM debian:8
MAINTAINER Dirk Stolle <striezel-dev@web.de>

# Packages should be up to date.
RUN apt-get update && apt-get upgrade -y

# install curl
RUN apt-get install -y curl

# install Meteor
RUN curl https://install.meteor.com/ | sh

# show Meteor help to make sure all initial package stuff gets loaded
RUN meteor help --allow-superuser

# Relevant files for Meteor are located in meteorapp - copy them.
COPY meteorapp /meteor/meteorapp
WORKDIR /meteor/meteorapp

# Some stuff in .meteor/local prevents a proper execution of Meteor later,
# maybe due to OS differences between the development system and the container.
# That's why this stuff gets deleted.
RUN rm -rf .meteor/local

# install node packages
RUN meteor npm install

# Expose port 3000 - that is the default port for Meteor applications.
EXPOSE 3000

# Start Meteor application.
CMD ["meteor", "run", "--allow-superuser"]
