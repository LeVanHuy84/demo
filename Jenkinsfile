pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Debug') {
      steps {
        sh '''
          echo "Node version:"
          node -v
          echo "NPM version:"
          npm -v
        '''
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh '''
          npm run test:ci || true
        '''
      }
    }

    stage('Generate Allure Report') {
      steps {
        sh '''
          echo "Checking allure-results folder..."
          ls -la allure-results/ || echo "No allure-results folder"
          
          echo "Generating Allure Report..."
          allure generate allure-results --clean -o allure-report || true
          
          echo "Allure report generated at allure-report/"
        '''
      }
    }

  }

  post {
    always {
      echo "=== Collecting Test Results ==="
      
      junit allowEmptyResults: true, testResults: '**/junit.xml, **/test-results/**/*.xml'

      archiveArtifacts allowEmptyArchive: true, artifacts: '**/coverage/**, **/*.log, allure-results/**, allure-report/**'
      
      // Publish Allure Report as HTML
      publishHTML([
        reportDir: 'allure-report',
        reportFiles: 'index.html',
        reportName: 'Allure Report',
        keepAll: true,
        alwaysLinkToLastBuild: true
      ])
      
      script {
        echo "=== Build Complete ===:"
        echo "✓ Test Results: Available in build page"
        echo "✓ Allure Report: Click 'Allure Report' link above"
      }
    }
  }
}