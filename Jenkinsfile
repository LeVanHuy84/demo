pipeline {
  agent {
    docker {
      image 'node:20'
      args '-u root'
    }
  }

  stages {
    stage('Debug') {
      steps {
        sh '''
          node -v
          npm -v
        '''
      }
    }

    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/LeVanHuy84/demo.git'
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test:ci'
      }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: '**/*.xml'
      archiveArtifacts allowEmptyArchive: true, artifacts: '**/*'
    }
  }
}