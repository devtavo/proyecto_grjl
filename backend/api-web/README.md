# API para plataforma

Gestionar consultas de la plataforma de transporte público

## Instalación

Ir al directorio api-web e instalar las dependencias

```bash
 cd backend/api-web
 npm install
```

## Crear archivo .ENV con la siguiente estructura

```
#APP
APP_PORT=3501

#BD
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=sasa
PG_NAME=giz

#JWT
SECRET=api_giz_2021$$
```

## Desarrollo

```bash
 cd backend/api-web
 npm run dev
```

## Producción

```bash
 cd backend/api-web
 pm2 start handler.js
```
