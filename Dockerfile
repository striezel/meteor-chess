# This Dockerfile will set up a Debian 8-based container that is able to
# run the Meteor chess application.
#
# Version 0.05
#
# History
# -------
#
# version 0.05 - use debian:10-slim as base image
# version 0.04 - add bzip2 and tar packages for PhantomJS
# version 0.03 - fix locale setting problem with MongoDB
# version 0.02 - allow Meteor 1.4.2.1 and later to run as superuser in Docker
# version 0.01 - initial version

FROM debian:10-slim
MAINTAINER Dirk Stolle <striezel-dev@web.de>

# Packages should be up to date.
RUN apt-get update && apt-get upgrade -y && \
# install curl, locales, grep, git and bzip2
# - curl for Meteor download / installation
# - locales and grep for setting locale for MongoDB
# - bzip2 and tar for phantomjs test (dispatch:phantomjs-tests) extraction
    apt-get install -y bzip2 curl grep locales procps tar && \
    apt-get clean

# set locale: required for MongoDB
# -- enable generation of en_US and en_GB locales
RUN cat /usr/share/i18n/SUPPORTED | grep en_GB >> /etc/locale.gen
RUN cat /usr/share/i18n/SUPPORTED | grep en_US >> /etc/locale.gen
# -- run locale generation + list all locales
RUN locale-gen en_GB.UTF-8 en_US.UTF-8 && locale -a
# -- check whether there is an en_GB locale
RUN locale -a | grep en_GB
# -- set locale-related environment variables
RUN update-locale LC_ALL=en_GB.UTF-8 LANG=en_GB.UTF-8

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

# git for readable-stream NPM package
RUN apt-get install -y git && \
# install node packages
    meteor npm install && \
    apt-get purge -y git && apt-get autoremove -y && apt-get clean

# Expose port 3000 - that is the default port for Meteor applications.
EXPOSE 3000

# Start Meteor application.
CMD ["meteor", "run", "--allow-superuser"]
