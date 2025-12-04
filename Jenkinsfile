pipeline {
    agent any

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['DEV', 'PROD'], description: 'Environnement')
    }

    stages {
        stage('Installation') {
            steps {
                echo "📦 Installation..."
                // On installe les dépendances (nécessaire pour Jest)
                bat 'cd devops-wish && npm install'
            }
        }

        stage('Tests Applicatifs (User & Voeux)') {
            steps {
                echo "🧪 Lancement des tests User1 et Tatouage..."
                // Cela va lancer features.test.js qu'on vient de créer
                bat 'cd devops-wish && npm run test'
            }
        }

stage('Vérification de la Date') {
            steps {
                script {
                    // Récupération de la date actuelle
                    def dateDuJour = new Date()
                    // On récupère le jour du mois (ex: 4, 15, 20...)
                    def jour = dateDuJour.format("d").toInteger()
                    
                    echo "📅 Nous sommes le : ${dateDuJour.format('dd/MM/yyyy')}"

                    // Logique conditionnelle demandée
                    if (jour < 15) {
                        [cite_start]// Si on est avant le 15 (ex: le 4) [cite: 23]
                        echo "🔵 MESSAGE DU JOUR : Penser à renseigner vos voeux"
                    } else {
                        [cite_start]// Si on est après le 15 [cite: 26]
                        echo "🟠 MESSAGE DU JOUR : Penser à valider vos voeux"
                    }
                }
            }
        }
    }
}