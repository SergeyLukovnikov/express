#!groovy
// Run docker build
properties([disableConcurrentBuilds()])

pipeline {
    agent {
        label 'master'
        }
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
        timestamps()
    }
    stages {
        stage("clone repositories") {
            steps {
                echo " ============== start building image =================="
                sh 'git clone https://github.com/liveloper/express.git'
            }
        }
    }
}
