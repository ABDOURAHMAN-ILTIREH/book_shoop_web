
# 1️⃣ Utiliser l'image Node officielle Alpine
FROM node:20-alpine

# 2️⃣ Créer un super utilisateur non-root

RUN addgroup appgroup && \
    adduser -G appgroup -s /bin/sh -D abdourahman

# 3️⃣ Créer le répertoire de travail et changer le propriétaire
WORKDIR /app
RUN chown abdourahman:appgroup /app
# 4️⃣ Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# 5️⃣ Copier le reste des fichiers
COPY . .

# 6️⃣ Construire l'application pour la production
RUN npm run build

# 7️⃣ Changer l'utilisateur pour le super user créé
USER abdourahman

# 8️⃣ Exposer le port
EXPOSE 5173

# 9️⃣ Commande par défaut
CMD ["npm", "run", "dev"]

