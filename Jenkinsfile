pipeline {
    agent any

    tools { nodejs 'NodeJS' }

    stages {
        stage('Clone sources') {
            steps {
                // git branch: 'main', url: 'https://github.com/28Emc/MS-AUTH.git'
                checkout changelog: false,
                    scm: scmGit(userRemoteConfigs: [
                        [ credentialsId: 'jenkins',
                            url: 'git@github.com:28Emc/MS-AUTH.git' ]
                        ])
            }
        }

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
