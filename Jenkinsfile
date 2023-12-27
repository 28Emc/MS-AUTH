pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {
        //stage('GIT checkout from version control') {
        checkout scmGit(branches: [[name: '*/ci_cd']],extensions: [],userRemoteConfigs: [[credentialsId: 'jenkins-github-id', url: 'git@github.com:28Emc/MS-AUTH.git']])
        // }

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
