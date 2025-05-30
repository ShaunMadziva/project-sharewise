pipeline {
    agent any

    environment {
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
                        echo "Listing running Docker containers:"
                        docker ps
                        docker build -t ${IMAGE_NAME}-client:${BUILD_NUMBER} -f ./Client/Dockerfile .
                        docker build --build-arg SECRET_TOKEN=${secret} -t ${IMAGE_NAME}-api:${BUILD_NUMBER} ./sharewise-api
                        docker build --build-arg SECRET_TOKEN=${secret} -t ${IMAGE_NAME}-db:${BUILD_NUMBER} -f ./sharewise-db/Dockerfile ./sharewise-db
                    '''
                }
            }
        }

        stage ('Push to Docker hub') {
            steps {
                script {
                    sh '''
                        #!/bin/bash
                        echo "$dockerPassword" | docker login -u "$dockerUsername" --password-stdin
                        docker tag hlyztrk/project-sharewise-db:${BUILD_NUMBER} hlyztrk/project-sharewise-db:latest
                        docker push ${IMAGE_NAME}-db:latest
                        docker tag hlyztrk/project-sharewise-api:${BUILD_NUMBER} hlyztrk/project-sharewise-api:latest
                        docker push ${IMAGE_NAME}-api:latest
                        docker logout
                    '''
                }
            }
        }
    }
}