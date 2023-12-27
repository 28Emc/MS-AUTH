pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {        
        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner'
            }

            steps {
                echo '*** Analysis step started'
                withSonarQubeEnv('SonarQube') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
                }
                echo '*** Analysis step done'
            }
        }

        stage('Test') {
            steps {
                echo '*** Test step started'
                sh '''
                npm install
                npm run test
                '''
                echo '*** Testing step done'
            }
        }

        stage('Build') {
            steps {
                echo '*** Build step started'
                sh 'npm run build'
                echo '*** Build step done'
            }
        }

        stage('Deploy') {
            environment {
                GCP_VERSION = '20231227'
            }
            steps {
                echo '*** Deploy step started'
                //sh 'gcloud app deploy -v=$GCP_VERSION'
                echo '*** Deploy step done'
            }
        }
    }

    post {
        echo '*** Post clean up workspace started'
        always {
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true,
                    patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
                               [pattern: '.propsfile', type: 'EXCLUDE']])
        }
        echo '*** Post clean up workspace done'
    }
}
