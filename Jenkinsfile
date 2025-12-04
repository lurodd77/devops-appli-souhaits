pipeline {
    agent any

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['DEV', 'PROD'], description: 'Environnement')
        booleanParam(name: 'LANCER_TESTS', defaultValue: true, description: 'Lancer les tests ?')
    }

    stages {
        stage('Installation') {
            steps {
                echo "📦 Installation des dépendances..."
                bat 'cd devops-wish && npm install'
            }
        }

        stage('Tests Applicatifs') {
            steps {
                echo "🧪 Exécution des tests User1 et Tatouage..."
                bat 'cd devops-wish && npm run test'
            }
        }

        stage('Vérification de la Date') {
            steps {
                script {
                    // On récupère la date actuelle
                    def dateDuJour = new Date()
                    // On extrait le numéro du jour (ex: 4)
                    def jour = dateDuJour.format("d").toInteger()
                    
                    echo "📅 Nous sommes le : ${dateDuJour.format('dd/MM/yyyy')}"

                    // Logique : Avant le 15 vs Après le 15
                    if (jour < 15) {
                        echo "🔵 MESSAGE DU JOUR : Penser à renseigner vos voeux"
                    } else {
                        echo "🟠 MESSAGE DU JOUR : Penser à valider vos voeux"
                    }
                }
            }
        }
    }
}