# 🐳 Docker Setup para TODO API

## Requisitos Previos

- Docker Engine 20.10.0+ 
- Docker Compose 2.0+
- Git

## Estructura de Docker

```
├── docker-compose.yml          # Configuración principal
├── .env                       # Variables de entorno
└── docker/                   # Configuraciones adicionales (opcional)
    └── postgres/
        ├── postgresql.conf    # Configuración personalizada de PostgreSQL
        └── init/             # Scripts de inicialización
```

## 🚀 Comandos Rápidos

### Iniciar la base de datos
```bash
# Solo PostgreSQL
docker-compose up postgres -d

# PostgreSQL + pgAdmin (administrador web)
docker-compose --profile admin up -d
```

### Verificar servicios
```bash
# Ver logs
docker-compose logs postgres
docker-compose logs pgadmin

# Ver estado
docker-compose ps

# Verificar salud de la base de datos
docker-compose exec postgres pg_isready -U todo_user -d todo_api_db
```

### Gestión de datos
```bash
# Hacer backup
docker-compose exec postgres pg_dump -U todo_user todo_api_db > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U todo_user todo_api_db < backup.sql

# Conectar a la base de datos
docker-compose exec postgres psql -U todo_user -d todo_api_db
```

### Limpiar y reiniciar
```bash
# Parar servicios
docker-compose down

# Parar y eliminar volúmenes (¡CUIDADO! Se pierden datos)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache
```

## 🔧 Configuración

### Variables de Entorno (.env)
El Docker Compose lee automáticamente las variables del archivo `.env`:

```bash
# Variables principales de PostgreSQL
POSTGRES_DB=todo_api_db
POSTGRES_USER=todo_user  
POSTGRES_PASSWORD=todo_password_secure_2024

# Variables de pgAdmin
PGADMIN_DEFAULT_EMAIL=admin@todoapi.local
PGADMIN_DEFAULT_PASSWORD=admin_password_2024

# String de conexión para Prisma (usa las variables anteriores)
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"
```

**⚠️ Importante**: Copia `.env.example` como `.env` y ajusta las credenciales antes de usar Docker.

### Puertos Expuestos
- **5432**: PostgreSQL (base de datos)
- **8080**: pgAdmin (solo con `--profile admin`)

### Volúmenes Persistentes
- `postgres_data`: Datos de PostgreSQL
- `pgadmin_data`: Configuración de pgAdmin

## 🔍 Acceso a Servicios

### PostgreSQL
```bash
# Conexión desde la aplicación (automática con .env)
Host: localhost
Port: 5432
Database: ${POSTGRES_DB}
User: ${POSTGRES_USER}
Password: ${POSTGRES_PASSWORD}
```

### pgAdmin (Administrador Web)
```
URL: http://localhost:8080
Email: ${PGADMIN_DEFAULT_EMAIL}
Password: ${PGADMIN_DEFAULT_PASSWORD}
```

## 🧪 Integración con Prisma

### Después de iniciar PostgreSQL:
```bash
# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar datos de prueba (si existe seed)
npm run db:seed

# Abrir Prisma Studio
npm run prisma:studio
```

### String de conexión automática:
El archivo `.env` ya está configurado para conectar con el contenedor Docker.

## 🐛 Troubleshooting

### PostgreSQL no inicia
```bash
# Verificar logs
docker-compose logs postgres

# Verificar puerto disponible
lsof -i :5432

# Recrear contenedor
docker-compose down postgres
docker-compose up postgres -d
```

### Problemas de conexión
```bash
# Verificar red
docker network ls
docker network inspect todo-api-network

# Probar conexión directa
docker-compose exec postgres psql -U todo_user -d todo_api_db -c "SELECT version();"
```

### Limpiar todo y empezar de nuevo
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d
```

## 📝 Notas de Producción

Para producción, considera:
- Cambiar contraseñas por defecto
- Usar Docker Secrets para credenciales
- Configurar backups automáticos
- Monitoreo con health checks
- Configurar límites de recursos
- Usar redes seguras
