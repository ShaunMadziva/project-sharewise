pipeline {
    agent {
        docker {
            image 'docker:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage('Build Docker images') {
            steps {
                script {

                    sh '''
                        #!/bin/bash
                        echo "Building docker image"
                        docker build -t shaunmadziva/project-sharewise:0.0.1.RELEASE -f ./sharewise-db/Dockerfile .
                    '''
                }
            }
        }
    }
}