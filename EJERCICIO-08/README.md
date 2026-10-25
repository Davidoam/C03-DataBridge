# EJERCICIO-08 · My Playlists

Aplicación independiente para practicar relaciones `OneToMany`/`ManyToOne` con NestJS, TypeORM, PostgreSQL y React Native.

## Requisitos

- Node.js y npm.
- Nest CLI.
- PostgreSQL ejecutándose.
- Expo Go o un emulador.
- Git.

```powershell
node --version
npm --version
nest --version
psql --version
git --version
```

## 1. Base de datos y backend

Crear la base de datos en `psql` o pgAdmin:

```sql
CREATE DATABASE databridge_e08;
```

En `backend`, copia `.env.example` como `.env`, configura la contraseña local e instala las dependencias:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run start:dev
```

La API escucha en `http://localhost:3000` y en `0.0.0.0` para aceptar conexiones desde un móvil.

Al iniciar, TypeORM crea las tablas `playlists` y `canciones`. Si no hay playlists, se crea `Entrenamiento` con `Run Boy Run` de Woodkid. Reiniciar NestJS no duplica los datos iniciales.

## 2. Probar la relación

Leer la playlist con sus canciones:

```powershell
curl.exe -i http://localhost:3000/playlists/1
```

La respuesta esperada incluye:

```json
{
  "id": 1,
  "nombre": "Entrenamiento",
  "canciones": [
    {
      "id": 1,
      "titulo": "Run Boy Run",
      "artista": "Woodkid"
    }
  ]
}
```

Añadir una canción a la playlist 1:

```powershell
curl.exe -i -X POST http://localhost:3000/canciones -H "Content-Type: application/json" -d "{\"titulo\":\"Midnight City\",\"artista\":\"M83\",\"playlistId\":1}"
```

El endpoint busca primero la playlist, asocia la nueva canción mediante `cancion.playlist = playlist`, la guarda y devuelve la playlist con las canciones relacionadas.

Una playlist inexistente devuelve 404:

```powershell
curl.exe -i http://localhost:3000/playlists/999
curl.exe -i -X POST http://localhost:3000/canciones -H "Content-Type: application/json" -d "{\"titulo\":\"Tema\",\"artista\":\"Artista\",\"playlistId\":999}"
```

## 3. Comprobar PostgreSQL

```powershell
psql -U postgres -d databridge_e08
```

```sql
\dt
SELECT * FROM playlists;
SELECT * FROM canciones;
SELECT id, titulo, artista, playlist_id FROM canciones ORDER BY id;
\q
```

La columna `canciones.playlist_id` es la clave foránea que apunta a `playlists.id`. La canción `Midnight City` debe quedar asociada a la playlist `Entrenamiento`.

Reinicia NestJS y repite las consultas: la relación debe permanecer y no deben aparecer filas iniciales duplicadas.

## 4. Frontend Expo

En otra terminal:

```powershell
cd frontend
npm install
npm start
```

En `frontend/App.tsx`, sustituye `TU_IP_LOCAL` por la IPv4 del ordenador:

```ts
const API_URL = 'http://192.168.1.37:3000';
```

El ordenador y el móvil deben estar en la misma red. Si Windows pregunta por el firewall de Node.js, permite el acceso en la red privada.

La app carga `GET /playlists/1`, muestra las canciones y envía el formulario a `POST /canciones`. Tras recibir una respuesta correcta vacía los campos y vuelve a cargar la playlist para mostrar la nueva canción.

## Conceptos

`Playlist` tiene una relación `@OneToMany` porque una playlist puede contener muchas canciones. `Cancion` tiene una relación `@ManyToOne` porque cada canción pertenece a una playlist.

El lado `ManyToOne` mantiene la clave foránea mediante:

```ts
@JoinColumn({ name: 'playlist_id' })
playlist: Playlist;
```

La consulta usa:

```ts
relations: { canciones: true }
```

para pedir a TypeORM que incluya las canciones relacionadas en el JSON. El dato recorre este camino:

`TextInput` → `fetch` → `CreateCancionDto` → búsqueda de `Playlist` → `cancion.playlist` → `repository.save` → `playlist_id` en PostgreSQL → playlist recargada con `relations`.

## Resultado de MODIFÍCALO

La solución base permitía leer una playlist y sus canciones. La modificación añade el formulario móvil, el DTO con `playlistId`, la creación de una canción asociada y la recarga de la playlist para mostrar `Midnight City · M83`.

## Checkpoints

- [x] Base de datos `databridge_e08` documentada.
- [x] Relación `Playlist 1:N Cancion`.
- [x] Clave foránea `playlist_id`.
- [x] `GET /playlists/:id` devuelve canciones relacionadas.
- [x] `POST /canciones` crea una canción asociada.
- [x] 404 para playlist inexistente.
- [x] Seed inicial sin duplicados.
- [x] Frontend recarga la playlist tras crear una canción.
- [x] No se incluyen `node_modules`, `.env` ni credenciales.

## Entrega Git

Desde la raíz del repositorio:

```powershell
git status
git add EJERCICIO-08
git commit -m "Ejercicio 08 - My Playlists"
git push
```

Estos comandos son orientativos y no se ejecutan automáticamente.

