pipeline {
  agent {
    docker {
      image 'node:20'
      args '-u root'
      reuseNode true
    }
  }

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
          echo "Generating Allure report..."
          allure generate allure-results --clean -o allure-report || true
        '''
      }
    }
  }

  post {
    always {
      echo "=== Collecting Test Results ==="
      
      junit allowEmptyResults: true, testResults: '**/junit.xml, **/test-results/**/*.xml'

      archiveArtifacts allowEmptyArchive: true, artifacts: '**/coverage/**, **/*.log, allure-results/**, allure-report/**'

      script {
        try {
          allure()
        } catch (e) {
          echo "Allure report generation skipped: ${e.message}"
        }
      }
      
      script {
        echo "=== Build Summary ==="
        sh 'echo "allure-results contents:"; ls -la allure-results/ || echo "No allure-results folder"'
        sh 'echo "allure-report contents:"; ls -la allure-report/ || echo "No allure-report folder"'
      }
    }
  }
}