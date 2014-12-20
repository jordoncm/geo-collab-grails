#!/bin/bash
# Setup a build environment.

sudo apt-get install -y default-jdk unzip
curl -s get.gvmtool.net | bash
source ".gvm/bin/gvm-init.sh"
gvm install groovy
gvm install grails
