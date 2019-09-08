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
        stage("clone repositories") {
            steps {
                echo " ============== clone repositories =================="
                sh 'git clone https://github.com/liveloper/express.git'
            }
        }
        stage("install dependencies") {
            steps {
                echo " ============== install dependencies =================="
                sh 'cd express && yarn'
            }
        }
        stage("run app") {
            steps {
                echo " ============== run app =================="
                sh 'npm run serve'
            }
        }
    }
}
