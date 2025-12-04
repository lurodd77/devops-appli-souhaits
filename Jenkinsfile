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
                    // --- SCÉNARIO 3 : Logique de date en Groovy ---
                    
                    // On récupère le jour actuel (format "d" donne le numéro du jour)
                    def dateDuJour = new Date()
                    def jour = dateDuJour.format("d").toInteger()
                    
                    echo "📅 Nous sommes le : ${dateDuJour.format('dd/MM/yyyy')}"

                    if (jour < 15) {
                        [cite_start]// Source PDF : Avant le 15, on est en phase de réalisation [cite: 71, 72]
                        echo "🔵 MESSAGE DU JOUR : Penser à renseigner vos voeux"
                    } else {
                        [cite_start]// Source PDF : Après le 15, il faut finaliser [cite: 74, 76]
                        echo "🟠 MESSAGE DU JOUR : Penser à valider vos voeux"
                    }
                }
            }
        }
    }
}