# EJERCICIO-05 · Travel Book

Aplicación independiente para practicar la actualización parcial de un registro con `PATCH`, NestJS, TypeORM, PostgreSQL y React Native.

## Requisitos

- Node.js y npm.
- PostgreSQL ejecutándose.
- Expo Go en el móvil o un emulador.
- Git.

Comprobación rápida:

```powershell
node -v
npm -v
psql --version
git --version
```

## 1. Crear la base de datos

En `psql` o en pgAdmin:

```sql
CREATE DATABASE databridge_e05;
```

En `backend`, copia `.env.example` como `.env` y configura la contraseña local. El archivo `.env` está ignorado por Git.

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run start:dev
```

La API escucha en `http://localhost:3000` y en todas las interfaces de red para poder probarla desde el móvil.

Al iniciar, TypeORM crea la tabla `viajes` y se inserta Tokio una sola vez si la tabla está vacía. Reiniciar NestJS no crea duplicados.

## 2. Probar el endpoint

Actualizar únicamente el estado:

```powershell
curl.exe -X PATCH http://localhost:3000/viajes/1 -H "Content-Type: application/json" -d "{\"estado\":\"REALIZADO\"}"
```

Actualizar únicamente la fecha:

```powershell
curl.exe -X PATCH http://localhost:3000/viajes/1 -H "Content-Type: application/json" -d "{\"fecha\":\"2027-04-10\"}"
```

Actualizar ambos campos, como en `MODIFÍCALO`:

```powershell
curl.exe -X PATCH http://localhost:3000/viajes/1 -H "Content-Type: application/json" -d "{\"estado\":\"RESERVADO\",\"fecha\":\"2027-04-10\"}"
```

El resultado esperado conserva destino y país:

```json
{
  "id": 1,
  "destino": "Tokio",
  "pais": "Japón",
  "estado": "RESERVADO",
  "fecha": "2027-04-10"
}
```

Un viaje inexistente devuelve 404:

```powershell
curl.exe -i -X PATCH http://localhost:3000/viajes/999 -H "Content-Type: application/json" -d "{\"estado\":\"REALIZADO\"}"
```

Un id no numérico devuelve 400 gracias a `ParseIntPipe`:

```powershell
curl.exe -i -X PATCH http://localhost:3000/viajes/abc -H "Content-Type: application/json" -d "{\"estado\":\"REALIZADO\"}"
```

Consulta antes y después en PostgreSQL:

```sql
SELECT id, destino, pais, estado, fecha FROM viajes;
```

Detén y vuelve a iniciar NestJS y repite el `SELECT`: la fecha actualizada permanece y no aparece otra fila.

## 3. Frontend Expo

En otra terminal:

```powershell
cd frontend
npm install
npm start
```

En `frontend/App.tsx`, sustituye `TU_IP_LOCAL` por la IPv4 del ordenador, por ejemplo:

```ts
const API_URL = 'http://192.168.1.50:3000';
```

El móvil y el ordenador deben estar en la misma red. La app envía solamente `{ estado, fecha }` mediante `PATCH /viajes/1`, recibe el viaje completo y muestra la fecha como `DD/MM/YYYY`.

## Recorrido del dato

`TextInput` de React Native → `fetch` con método `PATCH` → `@Patch(':id')` del controlador → `@Param` y `ParseIntPipe` → `ViajesService.update` → `repository.findOneBy({ id })` → `repository.merge(viaje, dto)` → `repository.save(viaje)` → columna `fecha` de PostgreSQL.

`PATCH` expresa una modificación parcial. A diferencia de `POST`, no crea un recurso nuevo. Como las propiedades de `UpdateViajeDto` son opcionales, los campos omitidos conservan su valor. `merge` copia los cambios sobre la entidad encontrada y `save` los persiste.

La entidad representa la tabla y usa `@Column('date')` para almacenar una fecha sin hora. El DTO describe la entrada HTTP y no sustituye a la entidad. `repository.findOneBy` localiza el viaje; si no existe, `NotFoundException` produce una respuesta 404.

## Checkpoints

- [x] Base de datos `databridge_e05` documentada.
- [x] Entidad `Viaje` con `fecha` tipo PostgreSQL `date`.
- [x] DTO parcial `UpdateViajeDto`.
- [x] `PATCH /viajes/:id` con `ParseIntPipe`.
- [x] Actualización de estado, fecha o ambos campos.
- [x] 404 para viaje inexistente y 400 para id no numérico.
- [x] Seed inicial sin duplicados al reiniciar.
- [x] Frontend Expo con formulario y mensaje `✓ Actualizado`.
- [x] La fecha se muestra como `DD/MM/YYYY`.
- [x] No se incluyen `node_modules`, `.env` ni credenciales.

## Entrega Git

Desde la raíz del repositorio:

```powershell
git status
git add EJERCICIO-05
git commit -m "Completa ejercicio 05 Travel Book"
git push
```

Estos comandos son orientativos y no se ejecutan automáticamente.

