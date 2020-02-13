## start database

`docker run --name mariadb -p 3306:3306 -v /root/database:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=secret --restart always -d mariadb`
