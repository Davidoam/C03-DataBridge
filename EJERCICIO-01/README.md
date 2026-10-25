# EJERCICIO 01 · Game Vault

Aplicación independiente del cuaderno DataBridge para leer una colección de videojuegos desde PostgreSQL mediante NestJS, TypeORM y React Native/Expo.

## Estructura

```text
EJERCICIO-01/
├── backend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── App.tsx
│   └── package.json
└── README.md
```

## Requisitos

- Node.js y npm.
- PostgreSQL iniciado.
- Expo/React Native para ejecutar la interfaz.
- Una base de datos llamada `databridge_e01`.

Comprobación rápida:

```powershell
node -v
npm -v
psql --version
```

Crear la base de datos desde `psql`:

```sql
CREATE DATABASE databridge_e01;
```

## Backend

Entrar en la carpeta e instalar dependencias:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Editar `.env` y poner la contraseña local de PostgreSQL. Este archivo no se debe subir a Git.

Arrancar en desarrollo:

```powershell
npm run start:dev
```

La API escucha en `http://localhost:3000` y habilita CORS. Probar:

```powershell
curl http://localhost:3000/videojuegos
```

La respuesta es una colección ordenada por puntuación descendente e incluye `id`, `titulo`, `plataforma`, `genero` y `puntuacion`.

## Frontend

En otra terminal:

```powershell
cd frontend
npm install
npm run typecheck
npm start
```

Para usar un móvil físico, sustituir `TU_IP_LOCAL` en `App.tsx` por la IPv4 del ordenador, por ejemplo `192.168.1.25`:

```ts
const API_URL = 'http://192.168.1.25:3000';
```

El ordenador y el móvil deben estar en la misma red y el firewall debe permitir el puerto 3000.

## Recorrido del dato

1. React Native solicita `GET /videojuegos`.
2. `VideojuegosController` recibe la petición.
3. `VideojuegosService` usa el repositorio TypeORM.
4. `repository.find({ order: { puntuacion: 'DESC' } })` consulta PostgreSQL.
5. La API devuelve JSON.
6. React Native representa cada videojuego, incluyendo su género.

La entidad `Videojuego` representa la tabla `videojuegos`. TypeORM crea o adapta la tabla durante este ejercicio mediante `synchronize: true`; en una aplicación real se recomienda utilizar migraciones.

## MODIFÍCALO

Se añadió `genero` como campo persistente. El valor se incluye en la entidad, en los datos iniciales, en el JSON de `GET /videojuegos` y en las tarjetas de React Native.

## Checkpoint

- [ ] PostgreSQL está iniciado.
- [ ] Existe `databridge_e01`.
- [ ] `.env` contiene las credenciales locales y no se entrega.
- [ ] `npm run build` y `npm test` del backend terminan correctamente.
- [ ] `GET /videojuegos` devuelve los videojuegos.
- [ ] La respuesta contiene `genero`.
- [ ] El frontend muestra título, plataforma, género y puntuación.
- [ ] En móvil físico se ha sustituido `TU_IP_LOCAL`.
- [ ] No se incluye `node_modules`, `dist` ni credenciales.

## Entrega Git

Desde la raíz del repositorio único, los comandos serán:

```powershell
git add EJERCICIO-01
git commit -m "Completa ejercicio 1 con genero y configuracion segura"
git push origin main
```

No ejecutar estos comandos hasta revisar la entrega completa.
