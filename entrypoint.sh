#!/bin/sh
set -e

# --- Espera opcional a la base de datos (si se define WAIT_FOR_DB=true) ---
wait_for_db() {
  retries=20
  until nc -z workouthub-db 5432 || [ $retries -le 0 ]; do
    echo "⏳ Esperando a Postgres... reintentos restantes: $retries"
    retries=$((retries - 1))
    sleep 1
  done

  if [ $retries -le 0 ]; then
    echo "❌ No se pudo conectar a la base de datos (timeout)."
    exit 1
  fi
}

if [ "$WAIT_FOR_DB" = "true" ]; then
  wait_for_db
else
  echo "🔸 WAIT_FOR_DB desactivado, continuando sin esperar DB."
fi

# --- Aplicar migraciones (si PRISMA_MIGRATE=true) ---
if [ "$PRISMA_MIGRATE" = "true" ]; then
  echo "🚀 Ejecutando migraciones con Prisma..."
  npx prisma migrate deploy
  echo "✅ Migraciones aplicadas correctamente."
else
  echo "🔸 PRISMA_MIGRATE != true, saltando migraciones."
fi

# --- Ejecutar comando principal ---
echo "🏁 Iniciando aplicación..."
exec "$@"
