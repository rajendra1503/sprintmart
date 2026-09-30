pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Install Playwright browsers') {
            steps {
                script {
                    // --with-deps installs OS-level packages Chromium needs
                    // on Linux; it's not applicable on Windows agents.
                    if (isUnix()) {
                        sh 'npx playwright install --with-deps chromium'
                    } else {
                        bat 'npx playwright install chromium'
                    }
                }
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t sprintmart:latest .'
                    } else {
                        bat 'docker build -t sprintmart:latest .'
                    }
                }
            }
        }

        stage('Deploy to staging') {
            steps {
                script {
                    // Replace whatever staging container is already running
                    // with a fresh one built from this commit. "|| true" /
                    // "|| exit 0" just means "it's fine if there was nothing
                    // to remove yet" (e.g. the very first build).
                    if (isUnix()) {
                        sh '''
                            docker rm -f sprintmart-staging || true
                            docker run -d --name sprintmart-staging -p 3001:3000 sprintmart:latest
                        '''
                    } else {
                        bat '''
                            docker rm -f sprintmart-staging || exit 0
                            docker run -d --name sprintmart-staging -p 3001:3000 sprintmart:latest
                        '''
                    }
                }
            }
        }

        stage('Wait for staging to be ready') {
            steps {
                script {
                    // The container seeds its database and starts the server
                    // on its own schedule - poll until it actually answers
                    // instead of guessing with a fixed sleep.
                    if (isUnix()) {
                        sh '''
                            for i in $(seq 1 30); do
                                if curl -sf http://localhost:3001/products > /dev/null; then
                                    echo "Staging is up."
                                    exit 0
                                fi
                                echo "Waiting for staging..."
                                sleep 2
                            done
                            echo "Staging never became ready."
                            exit 1
                        '''
                    } else {
                        // A "for /l" loop here would be simpler, but "exit /b"
                        // inside a parenthesized for-loop body doesn't reliably
                        // break out of the loop in Windows batch - it just
                        // keeps iterating. A goto-based loop avoids that trap.
                        bat '''
                            setlocal enabledelayedexpansion
                            set count=0
                            :waitloop
                            set /a count+=1
                            curl -sf http://localhost:3001/products >nul 2>&1
                            if !errorlevel! == 0 (
                                echo Staging is up.
                                goto :ready
                            )
                            if !count! geq 30 (
                                echo Staging never became ready.
                                exit /b 1
                            )
                            echo Waiting for staging...
                            timeout /t 2 >nul
                            goto :waitloop
                            :ready
                        '''
                    }
                }
            }
        }

        stage('Run automated tests') {
            steps {
                script {
                    // Point the suite at the persistent staging container
                    // instead of letting playwright.config.js start its own
                    // ephemeral copy - see playwright.config.js for how
                    // BASE_URL changes that behavior.
                    withEnv(['BASE_URL=http://localhost:3001']) {
                        if (isUnix()) {
                            sh 'npx playwright test'
                        } else {
                            bat 'npx playwright test'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            junit testResults: 'test-results/junit.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
        failure {
            echo 'Build failed - do not merge until the automated suite is green again.'
        }
        success {
            echo 'Staging is live at http://localhost:3001 - leave it running to poke around, the next deploy will replace it.'
        }
    }
}