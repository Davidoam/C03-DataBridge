# EJERCICIO 02 · CineBox

Aplicación independiente del cuaderno DataBridge que recupera una colección de películas desde PostgreSQL mediante NestJS, TypeORM y React Native/Expo.

## Estructura

```text
EJERCICIO-02/
├── backend/
├── frontend/
└── README.md
```

## Requisitos

- Node.js y npm.
- Nest CLI (`npm install -g @nestjs/cli`).
- PostgreSQL y `psql`.
- Expo Go si se prueba en un móvil físico.

## Base de datos

Desde `psql -U postgres`:

```sql
CREATE DATABASE databridge_e02;
```

La tabla `peliculas` se crea automáticamente en el primer arranque porque el backend usa `synchronize: true` para este ejercicio didáctico.

## Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
# Edita .env con la contraseña local de PostgreSQL
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.

Consulta la colección:

```powershell
curl.exe -i http://localhost:3000/peliculas
```

La respuesta está ordenada por `puntuacion` descendente e incluye `favorita`.

Comprobación directa en PostgreSQL:

```powershell
psql -U postgres -d databridge_e02
\dt
SELECT * FROM peliculas ORDER BY puntuacion DESC;
\q
```

## Frontend

En otra terminal:

```powershell
cd frontend
npm install
npx expo start
```

En un móvil físico, sustituye `TU_IP_LOCAL` en `frontend/App.tsx` por la IPv4 del ordenador, por ejemplo `192.168.1.37`, y conecta ambos dispositivos a la misma red.

## Recorrido del dato

React Native solicita `GET /peliculas`. `PeliculasController` recibe la petición y delega en `PeliculasService`. El servicio usa `Repository<Pelicula>` y `repository.find()` para recuperar la colección ordenada desde la tabla `peliculas`. La API devuelve cada entidad en JSON, incluida la propiedad persistente `favorita`, y `App.tsx` la representa como `♥` o `♡`.

`repository.find()` devuelve conceptualmente una colección de entidades, no una sola entidad, un componente React Native ni el texto de una consulta SQL.

## MODIFÍCALO

El campo `favorita` pertenece a la entidad y se guarda en PostgreSQL. `Interstellar` se carga como favorita y aparece con `♥`; `Coco` se carga como no favorita y aparece con `♡`.

## Checkpoints

- [ ] NestJS arranca y conecta con PostgreSQL.
- [ ] `GET /peliculas` devuelve un array ordenado.
- [ ] Comprendo qué devuelve `repository.find()`.
- [ ] `favorita` llega desde PostgreSQL.
- [ ] Puedo explicar el recorrido del dato sin mirar el código.
- [ ] Reiniciar el backend no duplica los datos iniciales.

## Entrega

Desde la raíz del repositorio:

```powershell
git status
git add EJERCICIO-02
git commit -m "Ejercicio 02 - CineBox"
git push
```

