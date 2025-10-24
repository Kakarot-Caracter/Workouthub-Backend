# ---- BUILD STAGE ----
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias completas (dev + prod)
COPY package*.json ./
# Copiamos prisma schema antes para que prisma generate pueda correr
COPY prisma ./prisma

RUN npm ci

# Generar cliente Prisma (OUTPUT: node_modules/.prisma, @prisma/client, generated client si aplica)
RUN npx prisma generate

# Copiar el resto del código y compilar
COPY . .
RUN npm run build

# ---- PRODUCTION STAGE ----
FROM node:20-alpine
WORKDIR /app

# Copiamos package.json por claridad (no haremos npm ci en prod, tomamos node_modules del builder)
COPY package*.json ./

# Copiar node_modules desde builder (incluye prisma y @prisma/client y la CLI)
COPY --from=builder /app/node_modules ./node_modules

# Copiar artefactos compilados y archivos prisma/generados
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copiar script de arranque (entrypoint)
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001 \
    && chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001

# entrypoint maneja migraciones condicionales y arranque
ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/main.js"]
