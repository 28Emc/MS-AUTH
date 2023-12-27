pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {
        stage('Test') {
            steps {
                echo 'Testing the application...'
                sh 'npm run test'
            }
        }

        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner'
            }

            steps {
                echo 'Analyzing the application with SonarQube...'
                withSonarQubeEnv('SonarQube') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            environment {
                GCP_VERSION = '20231227'
            }
            steps {
                echo 'Deploying the application...'
                sh 'gcloud app deploy -v=$GCP_VERSION'
            }
        }
    }
}
