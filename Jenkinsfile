pipeline {
    agent any

    stages {
        stage('Clonar repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/analuisaabarbosa/automocaoTeste_apiServeRest.git'
            }
        }
        stage('Instalar dependências') {
            steps {
                sh 'npm install'
            }
        }
        stage('Executar testes') {
            steps {
                sh 'export NO_COLOR =1 npm run start-and-test'
            }
        }
    }

    post {
        always {
            echo 'Pipeline concluído.'
        }
    }
}
