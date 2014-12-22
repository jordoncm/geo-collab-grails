Realtime Spatial Collaboration
==============================

This project is a simple Grails based application that allows a user to create
and markup a simple map. All map are collaboratively editable in real time.

Setup the Development Environment
---------------------------------

The application is a simple Grails application. Follow the steps below to get
started.

### Using Vagrant (optional)

The easiest way to try out the application is to use Vagrant. Use `vagrant up`
after cloning the repository to download and create the base virtual machine.
To configure dependencies SSH into the virtual machine with `vagrant ssh` and
then `cd /vagrant`. Now the virtual machine is ready and you can continue
below.

### Setup Dependencies

Use `./setup-dev.sh` to install Groovy, Grails and all sub dependencies. The
script is designed for Debian (Ubuntu) systems. However it should easy to
modify for other platforms.

Running the Application
-----------------------

The application requires a working Grails application. To run the application:

    grails run-app

The application will startup up and be available at:
`http://localhost:8080/ocm/home/`.

Using the Application
---------------------

1. Create a map on the homepage by putting a name and description and clicking
   create (or choose an existing one).
2. Once the map loads, use the controls on the left of the map to create edit
   and delete features are desired.
3. At any time you can share the link to a map (or open it in a second
   browser) and edit the map collaboratively with more than one person.
