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
  }

  post {
    always {
      echo "Listing workspace..."
      sh 'ls -la'

      junit allowEmptyResults: true, testResults: '**/junit.xml, **/test-results/**/*.xml'

      archiveArtifacts allowEmptyArchive: true, artifacts: '**/coverage/**, **/*.log'
    }
  }
}