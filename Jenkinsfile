pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {        
        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner';
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
                GOOGLE_PROJECT_ID = 'lustrous-bonito-409316';
                GCP_VERSION = '20231227';
            }
            steps {
                withCredentials([file(credentialsId: 'jenkins-secret-file', variable: 'GC_KEY')]) {
                    echo '*** Deploy step started'
                    sh '''#!/bin/bash
                    echo "this is the project id environment: ${GOOGLE_PROJECT_ID}";
                    curl -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-458.0.0-linux-x86_64.tar.gz;
                    tar -xvf /tmp/google-cloud-sdk.tar.gz -C /tmp/;
                    /tmp/google-cloud-sdk/install.sh -q;
                                    
                    source /tmp/google-cloud-sdk/path.bash.inc;
                        
                    gcloud auth activate-service-account --key-file=${GC_KEY};
                    gcloud config list;
                    gcloud config set project ${GOOGLE_PROJECT_ID};
                    gcloud app deploy -v=${GCP_VERSION}
                    '''         
                    echo '*** Deploy step done'
                }
            }
        }
    }

    post {
        always {
            echo '*** Post clean up workspace started'
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true,
                    patterns: [[pattern: '.gitignore', type: 'INCLUDE'],
                               [pattern: '.propsfile', type: 'EXCLUDE']])
            echo '*** Post clean up workspace done'
        }
    }
}
