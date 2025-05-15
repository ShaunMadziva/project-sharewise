pipeline {
    agent any

    environment {
        secret = credentials('secret_token')

    }

    stages {
        stage('Build Docker images') {
            steps {
                script {

                    sh '''
                        #!/bin/bash
                        echo "Building docker image"
                        docker build --build-arg SECRET_TOKEN=${secret} -t hlyztrk/project-sharewise:${GIT_COMMIT} -f ./sharewise-api/Dockerfile .
                    '''
                }
            }
        }
    }
}