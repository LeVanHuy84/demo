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
      
      script {
        echo "=== Publishing Allure Report ==="
        sh 'echo "Allure report contents:"; ls -la allure-report/ 2>/dev/null || echo "No allure-report folder generated yet"'
      }

      // Publish Allure Report
      publishHTML([
        reportDir: 'allure-report',
        reportFiles: 'index.html',
        reportName: 'Allure Report'
      ])
    }
  }
}