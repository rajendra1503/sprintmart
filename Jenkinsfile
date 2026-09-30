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
                sh 'npm install'
            }
        }

        stage('Install Playwright browsers') {
            steps {
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('Run automated tests') {
            steps {
                // playwright.config.js seeds the database and starts the app
                // itself before running any test - nothing to start manually.
                sh 'npx playwright test'
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
    }
}
