pipeline {
    agent any

    stages {
        stage('Build Docker images') {
            steps {
                script {
                    def secret = credentials('secret_token')

                    sh '''
                        #!/bin/bash
                        echo "Building docker image"
                        docker build --build-arg SECRET_TOKEN=${secret} -t hlyztrk/project-sharewise:${GIT_COMMIT} .
                    '''
                }
            }
        }
    }
}