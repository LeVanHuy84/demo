pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/LeVanHuy84/demo.git'
      }
    }

    stage('Prepare') {
      steps {
        sh 'ls -la'
      }
    }

    stage('Install dependencies') {
      steps {
        sh '''
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install
          fi
        '''
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm run test:ci'
      }
    }
  }

  post {
    always {
      // ✅ đảm bảo có workspace context
      script {
        sh 'ls -la'

        junit allowEmptyResults: true, testResults: 'junit/junit.xml'

        try {
          allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        } catch (Exception e) {
          echo 'Allure plugin not installed. Skipping.'
        }

        archiveArtifacts allowEmptyArchive: true, artifacts: 'allure-results/**,junit/**,coverage/**'
      }
    }
  }
}