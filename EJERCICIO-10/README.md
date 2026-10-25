# EJERCICIO-10 · Wander

Aplicación independiente para integrar un CRUD completo con una mejora propia persistente: `visitado`.

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
CREATE DATABASE databridge_e10;
```

En `backend`, copia `.env.example` como `.env`, configura la contraseña local e instala las dependencias:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run start:dev
```

La API escucha en `http://localhost:3000` y en `0.0.0.0` para aceptar conexiones desde el móvil.

Al iniciar, TypeORM crea la tabla `destinos` y añade Reikiavik y Lisboa solo cuando está vacía. Reiniciar NestJS no duplica los destinos.

## 2. Probar el CRUD

Crear un destino:

```powershell
curl.exe -i -X POST http://localhost:3000/destinos -H "Content-Type: application/json" -d "{\"ciudad\":\"Tokio\",\"pais\":\"Japón\",\"descripcion\":\"Nuevo destino\",\"visitado\":false}"
```

Listar destinos:

```powershell
curl.exe -i http://localhost:3000/destinos
```

Consultar Reikiavik:

```powershell
curl.exe -i http://localhost:3000/destinos/1
```

Actualizar la descripción:

```powershell
curl.exe -i -X PATCH http://localhost:3000/destinos/1 -H "Content-Type: application/json" -d "{\"descripcion\":\"Auroras y termas\"}"
```

Marcar como visitado:

```powershell
curl.exe -i -X PATCH http://localhost:3000/destinos/1 -H "Content-Type: application/json" -d "{\"visitado\":true}"
```

Eliminar un destino:

```powershell
curl.exe -i -X DELETE http://localhost:3000/destinos/1
```

Los ids inexistentes devuelven 404 y los ids no numéricos devuelven 400 mediante `ParseIntPipe`.

## 3. Comprobar PostgreSQL

```powershell
psql -U postgres -d databridge_e10
```

```sql
\dt
SELECT id, ciudad, pais, descripcion, visitado FROM destinos ORDER BY id;
\q
```

El campo `visitado` debe aparecer como booleano. PostgreSQL guarda `true` o `false`; nunca se guarda el texto `Visitado ✓`.

Reinicia NestJS y repite el `SELECT` para comprobar que los datos permanecen y que el seed no se duplica.

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

La app carga los destinos con `GET`, crea con `POST`, edita y marca como visitado con `PATCH`, y elimina con `DELETE`. Después de cada operación vuelve a ejecutar `GET /destinos` para sincronizar la interfaz con PostgreSQL.

## Mejora propia: visitado

`visitado` es un dato real de dominio que viaja por todo el sistema:

`React Native` → `fetch` → `DestinosController` → `DestinosService` → `Repository` → `Destino` → PostgreSQL.

La API devuelve un booleano. React Native lo representa como `Visitado ✓` o `Pendiente`. La etiqueta visual es derivada y no sustituye al dato persistente.

## Resultado de MODIFÍCALO

La solución base ofrecía el CRUD de destinos. La mejora añade `visitado` en la entidad y en los DTO, permite modificarlo mediante `PATCH`, lo muestra en las tarjetas y añade la acción `Marcar visitado` desde el móvil.

## Checkpoints

- [x] Base de datos `databridge_e10` documentada.
- [x] CRUD completo de destinos.
- [x] Campo persistente booleano `visitado`.
- [x] Reikiavik inicia como pendiente.
- [x] Lisboa inicia como visitado.
- [x] La interfaz muestra `Visitado ✓` o `Pendiente`.
- [x] La mejora se puede modificar desde React Native.
- [x] 404 para ids inexistentes y 400 para ids no numéricos.
- [x] Seed inicial sin duplicados.
- [x] No se incluyen `node_modules`, `.env` ni credenciales.

## Entrega Git

Desde la raíz del repositorio:

```powershell
git status
git add EJERCICIO-10
git commit -m "Ejercicio 10 - Wander"
git push
```

Estos comandos son orientativos y no se ejecutan automáticamente.

