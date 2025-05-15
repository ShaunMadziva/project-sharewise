pipeline {
    agent {
        docker {
            image 'docker:20.10.24-dind' 
            args '--privileged'
            }
        }
    }

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