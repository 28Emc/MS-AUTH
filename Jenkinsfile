pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {
        /* stage('Clone sources') {
            steps {
                echo 'Cloning skipped'
            }
        } */

        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner'
            }

            steps {
                withSonarQubeEnv('SonarQube') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
                }
            }
        }
    }
}
