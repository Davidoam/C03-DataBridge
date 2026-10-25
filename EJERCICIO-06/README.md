# EJERCICIO-06 · My Library

Aplicación independiente para practicar `GET`, `DELETE`, `PATCH` y la sincronización entre PostgreSQL y el estado de React Native.

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
CREATE DATABASE databridge_e06;
```

En `backend`, copia `.env.example` como `.env` y configura la contraseña local:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run start:dev
```

La API queda disponible en `http://localhost:3000`. Escucha en `0.0.0.0` para aceptar conexiones desde un móvil.

Al iniciar, TypeORM crea la tabla `libros` y añade `1984` y `Dune` solamente si la tabla está vacía. Reiniciar NestJS no duplica ni borra los libros.

## 2. Probar la API

Listar la colección:

```powershell
curl.exe -i http://localhost:3000/libros
```

Marcar Dune como leído:

```powershell
curl.exe -i -X PATCH http://localhost:3000/libros/2 -H "Content-Type: application/json" -d "{\"leido\":true}"
```

La respuesta conserva el libro y devuelve `leido: true`.

Eliminar 1984:

```powershell
curl.exe -i -X DELETE http://localhost:3000/libros/1
```

Un libro inexistente devuelve 404:

```powershell
curl.exe -i -X DELETE http://localhost:3000/libros/999
curl.exe -i -X PATCH http://localhost:3000/libros/999 -H "Content-Type: application/json" -d "{\"leido\":true}"
```

Un id no numérico devuelve 400 por `ParseIntPipe`:

```powershell
curl.exe -i -X DELETE http://localhost:3000/libros/abc
```

## 3. Comprobar PostgreSQL

Consulta antes y después de las operaciones:

```powershell
psql -U postgres -d databridge_e06
```

```sql
\dt
SELECT id, titulo, autor, genero, leido FROM libros ORDER BY id;
\q
```

Después de `DELETE /libros/1`, la fila de `1984` desaparece. Después de `PATCH /libros/2`, Dune sigue existiendo y `leido` vale `true`. Reinicia NestJS y repite el `SELECT` para comprobar la persistencia.

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

El móvil y el ordenador deben estar en la misma red. Si Windows pregunta por el firewall de Node.js, permite el acceso en la red privada.

La app carga la lista con `GET`. Antes de borrar muestra `Alert.alert`; tras `DELETE` vuelve a pedir la lista para que la tarjeta desaparezca. Al marcar como leído usa `PATCH` con `{ leido: true }` y vuelve a cargar la colección para mostrar `Leído ✓`.

## Recorrido del dato

React Native → `fetch` → Controller → Service → Repository → Entity → PostgreSQL.

`@Delete(':id')` elimina el recurso concreto. `repository.remove(libro)` elimina la entidad ya cargada. `@Patch(':id')` modifica parcialmente el recurso; `repository.merge` aplica el DTO y `repository.save` persiste el nuevo valor.

PostgreSQL y el estado de React son memorias distintas: borrar una fila no cambia automáticamente el array que ya está en memoria. Por eso la app vuelve a ejecutar `GET /libros` después de `DELETE` y `PATCH`. Así la interfaz queda sincronizada con la base de datos.

## Resultado de MODIFÍCALO

La solución base eliminaba libros. La modificación añade `leido` en la entidad, el DTO y el endpoint `PATCH /libros/:id`. La tarjeta de un libro pendiente muestra `Marcar como leído`; al pulsarlo, el libro permanece en la biblioteca y pasa a mostrar `Leído ✓`.

## Checkpoints

- [x] Base de datos `databridge_e06` documentada.
- [x] Tabla `libros` con dos registros iniciales.
- [x] `GET /libros` devuelve la colección.
- [x] `DELETE /libros/:id` elimina una fila.
- [x] `PATCH /libros/:id` modifica `leido`.
- [x] 404 para libros inexistentes y 400 para ids no numéricos.
- [x] La interfaz confirma antes de borrar.
- [x] La interfaz se sincroniza después de borrar o marcar como leído.
- [x] No se incluyen `node_modules`, `.env` ni credenciales.

## Entrega Git

Desde la raíz del repositorio:

```powershell
git status
git add EJERCICIO-06
git commit -m "Ejercicio 06 - My Library"
git push
```

Estos comandos son orientativos y no se ejecutan automáticamente.

