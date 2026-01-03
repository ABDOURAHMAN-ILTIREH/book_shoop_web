📚 Book Shop

Book Shop est une application web permettant de gérer et de vendre des livres en ligne. Elle offre une interface utilisateur conviviale pour la consultation, l’ajout, la modification et la suppression de livres, ainsi que la gestion des commandes et des utilisateurs.

🚀 Fonctionnalités principales

Gestion des livres : Ajouter, modifier, supprimer et lister les livres.

Catégorisation : Filtrer les livres par catégorie.

Recherche : Rechercher des livres par titre ou auteur.

Pagination : Affichage paginé des livres pour une meilleure navigation.

Interface administrateur : Gestion complète des livres et des utilisateurs.

Interface utilisateur : Consultation et ajout au panier pour les utilisateurs.

Notifications et confirmations : Messages pour les actions importantes (ajout, suppression, modification).

(À adapter selon ton projet réel : panier, commandes, login, etc.)

💻 Technologies utilisées

Front-end : React, TypeScript, Tailwind CSS, Framer Motion

Back-end : Node.js, Express.js

Base de données : MySQL 

Autres outils : JWT pour l’authentification, Fetch pour les appels API

⚙️ Installation et lancement

Cloner le projet

git clone https://github.com/abdourahman-iltireh/book_shop.git
cd book_shop


Installer les dépendances

# Front-end
cd client
npm install

# Back-end
cd ../server
npm install


Configurer la base de données

Créer une base de données et mettre à jour les informations dans le fichier .env :

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=motdepasse
DB_NAME=book_shop
PORT=5000


Lancer l’application

# Back-end
cd server
npm run dev

# Front-end
cd ../client
npm start


L’application sera accessible sur http://localhost:3000.

📝 Structure du projet
book_shop/
├─ client/        # Front-end React
├─ server/        # Back-end Express
├─ README.md
└─ package.json

🤝 Contribution

Les contributions sont les bienvenues !

Fork le projet

Crée une branche pour ta fonctionnalité (git checkout -b feature/ma-fonctionnalité)

Commit tes changements (git commit -m 'Ajout de ma fonctionnalité')

Push sur ta branche (git push origin feature/ma-fonctionnalité)

Ouvre une Pull Request

