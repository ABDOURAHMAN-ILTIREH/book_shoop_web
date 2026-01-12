# 1️⃣ Image de base
FROM node:20-alpine

# 2️⃣ Créer un utilisateur non-root "appuser" et un groupe "appgroup"
RUN addgroup appgroup && \
    adduser -G appgroup -s /bin/sh -D abdourahman

# 3️⃣ Définir le répertoire de travail et donner les droits à l'utilisateur
WORKDIR /app
RUN chown abdourahman:appgroup /app
# 4️⃣ Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# 5️⃣ Copier tout le code
COPY . .

# 6️⃣ Générer Prisma et build l'app
RUN npx prisma generate
RUN npm run build

# 7️⃣ Passer à l'utilisateur non-root
USER abdourahman

# 8️⃣ Exposer le port
EXPOSE 5000

# 9️⃣ Lancer l'application
CMD ["npm", "run", "start"]
