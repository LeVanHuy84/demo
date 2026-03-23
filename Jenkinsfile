pipeline {
  agent any

  options {
    timestamps()
    skipDefaultCheckout(true)
  }

  environment {
    NODE_ENV = 'test'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup Node') {
      steps {
        sh '''
          echo "Node version:"
          node -v
          echo "NPM version:"
          npm -v
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        sh '''
          npm ci
        '''
      }
    }

    stage('Run Tests') {
      steps {
        sh '''
          mkdir -p test-results
          mkdir -p allure-results

          npm run test:ci || true
        '''
      }
    }

    stage('Generate Allure Report') {
      steps {
        sh '''
          if [ -d "allure-results" ]; then
            echo "Generating Allure Report..."
            allure generate allure-results --clean -o allure-report || true
          else
            echo "No allure-results found, skipping report generation"
          fi
        '''
      }
    }

  }

  post {
    always {
      echo "=== Collecting Test Results ==="

      // JUnit
      junit allowEmptyResults: true, testResults: '**/junit.xml, **/test-results/**/*.xml'

      // Artifacts
      archiveArtifacts allowEmptyArchive: true, artifacts: '''
        **/coverage/**
        **/*.log
        allure-results/**
        allure-report/**
      '''

      // HTML Report (fix lỗi allowMissing)
      publishHTML([
        reportDir: 'allure-report',
        reportFiles: 'index.html',
        reportName: 'Allure Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])

      echo "=== Build Complete ==="
    }

    success {
      echo "✅ SUCCESS: Build passed"
    }

    unstable {
      echo "⚠️ UNSTABLE: Tests failed but pipeline continued"
    }

    failure {
      echo "❌ FAILURE: Something broke"
    }
  }
}