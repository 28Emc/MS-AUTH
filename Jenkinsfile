pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {
        stage('GIT checkout from version control') {
            environment {
                GIT_BRANCH_NAME = '*/ci_cd',
                GIT_CREDENTIALS_ID = 'jenkins-github-id',
                GIT_PRIVATE_URL = 'git@github.com:28Emc/MS-AUTH.git',
            }
            checkout scmGit(branches: [[name: '$GIT_BRANCH_NAME']],extensions: [],userRemoteConfigs: [[credentialsId: '$GIT_CREDENTIALS_ID', url: '$GIT_PRIVATE_URL']])
        }

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
}
