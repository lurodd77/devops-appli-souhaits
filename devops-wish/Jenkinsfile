pipeline {
    agent any

    // C'est ici qu'on répond à l'exigence "parameters" 
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['DEV', 'PROD'], description: 'Sur quel environnement déployer ?')
        booleanParam(name: 'LANCER_TESTS', defaultValue: true, description: 'Voulez-vous lancer les tests ?')
    }

    stages {
        stage('Installation') {
            steps {
                echo "Installation des dépendances sur Windows..."
                // Rappel : on utilise bat pour Windows
                bat 'cd devops-wish && npm install'
            }
        }

        stage('Build') {
            steps {
                echo "Construction de l'application..."
                bat 'cd devops-wish && npm run build'
            }
        }

        stage('Tests') {
            when {
                // Ce stage ne se lance que si l'utilisateur a coché "TRUE" dans les paramètres
                expression { params.LANCER_TESTS == true }
            }
            steps {
                echo "Lancement des tests..."
                bat 'cd devops-wish && npm run test'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    if (params.ENVIRONMENT == 'PROD') {
                        echo "⚠️ DÉPLOIEMENT EN PRODUCTION EN COURS..."
                        // Ici tu mettrais tes commandes de déploiement réel
                    } else {
                        echo "Déploiement en environnement de TEST (Dev)."
                    }
                }
            }
        }
    }
}