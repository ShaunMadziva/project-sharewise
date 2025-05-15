pipeline {
    agent {
        docker {
            image 'docker:latest'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        IMAGE_NAME = 'shaunmadziva/sharewise-db'
        secret = credentials('secret_token')
        dockerUsername = credentials('dockerhub_username')
        dockerPassword = credentials('dockerhub_password')
    }

    stages {
        stage('Build Docker images') {
            steps {
                script {
                    sh '''
                        #!/bin/bash
                        echo "Building docker image"
                        docker build --build-arg SECRET_TOKEN=${secret} -t ${IMAGE_NAME}:${BUILD_NUMBER} -f ./sharewise-db/Dockerfile .
                    '''
                }
            }
        }

        stage('Push to Docker hub') {
            steps {
                script {
                    sh '''
                        #!/bin/bash
                        echo "$dockerPassword" | docker login -u "$dockerUsername" --password-stdin
                        docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                        docker logout
                    '''
                }
            }
        }
    }
}