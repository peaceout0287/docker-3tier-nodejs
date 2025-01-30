this is a simple project using docker contianers with node.js and mysql
steps to implement
clone the repository in your local machine $ git clone <project-name.git>
change directory to cloned repo
run a docker command to implement the project
$ docker-compose up --build -d
verify the logs of each contianer whether the contianers are running or not
$ docker-compose logs app
$ dokcer-compose logs mysql
to test the on web browser
http://localhost:80/users/
