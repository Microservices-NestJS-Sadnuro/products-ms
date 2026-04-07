FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN if [ -d "prisma" ]; then npx prisma generate; fi
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Copiamos el prisma origin para asegurarnos de poder generar el cliente
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
RUN if [ -d "prisma" ]; then npx prisma generate; fi

COPY --from=builder /app/dist ./dist

# Variables de entorno
ENV NODE_ENV=production

# Instala la CLI de prisma y tsx globalmente (necesario para ejecutar el seed manualmente)
RUN npm install -g prisma tsx

# Ejecuta migraciones ANTES de iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
