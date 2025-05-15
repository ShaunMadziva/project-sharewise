pipeline {
    agent any

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