#!groovy
// Run docker build
properties([disableConcurrentBuilds()])

pipeline {
    agent {
        label 'master'
        }
    triggers { pollSCM('* * * * *') }
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
        timestamps()
    }
    stages {
        stage("create docker image") {
            steps {
                echo " ============== start building image =================="
                sh 'docker build -t express:latest . '
            }
        }
        stage("stop containers") {
            steps {
                echo " ============== stop containers =================="
                sh 'docker stop $(docker ps -a -q)'
            }
        }
        stage("run image") {
            steps {
                echo " ============== run image =================="
                sh 'docker run -d -p 3000:3000 express:latest'
            }
        }
    }
}
