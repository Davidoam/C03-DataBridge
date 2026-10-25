# EJERCICIO-07 · Sneaker Vault

Aplicación independiente para practicar un CRUD completo con NestJS, TypeORM, PostgreSQL y React Native.

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
CREATE DATABASE databridge_e07;
```

En `backend`, copia `.env.example` como `.env`, configura la contraseña local e instala las dependencias:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run start:dev
```

La API escucha en `http://localhost:3000` y en `0.0.0.0` para aceptar conexiones desde un móvil.

Al iniciar, TypeORM crea la tabla `sneakers` y añade Air Max 1 y Forum Low solamente si la tabla está vacía. Reiniciar NestJS no duplica ni borra los registros.

## 2. Probar el CRUD

Crear una sneaker:

```powershell
curl.exe -i -X POST http://localhost:3000/sneakers -H "Content-Type: application/json" -d "{\"marca\":\"Nike\",\"modelo\":\"Air Max 1\",\"precio\":149.99,\"talla\":42,\"stock\":4}"
```

Listar el inventario:

```powershell
curl.exe -i http://localhost:3000/sneakers
```

Consultar una sneaker concreta:

```powershell
curl.exe -i http://localhost:3000/sneakers/1
```

Actualizar precio:

```powershell
curl.exe -i -X PATCH http://localhost:3000/sneakers/1 -H "Content-Type: application/json" -d "{\"precio\":139.99}"
```

Actualizar stock:

```powershell
curl.exe -i -X PATCH http://localhost:3000/sneakers/1 -H "Content-Type: application/json" -d "{\"stock\":0}"
```

Eliminar una sneaker:

```powershell
curl.exe -i -X DELETE http://localhost:3000/sneakers/1
```

Los ids inexistentes devuelven 404:

```powershell
curl.exe -i http://localhost:3000/sneakers/999
curl.exe -i -X PATCH http://localhost:3000/sneakers/999 -H "Content-Type: application/json" -d "{\"stock\":0}"
curl.exe -i -X DELETE http://localhost:3000/sneakers/999
```

Los ids no numéricos devuelven 400 mediante `ParseIntPipe`.

## 3. Comprobar PostgreSQL

```powershell
psql -U postgres -d databridge_e07
```

```sql
\dt
SELECT id, marca, modelo, precio, talla, stock FROM sneakers ORDER BY id;
\q
```

Comprueba la tabla después de `POST`, `PATCH` y `DELETE`. El dato `stock` debe ser numérico. La interfaz muestra `AGOTADO` cuando `stock` vale `0`, pero esa palabra nunca se guarda en PostgreSQL.

Reinicia NestJS y repite el `SELECT`: los cambios deben permanecer y el seed no debe crear duplicados.

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

La app ejecuta `GET` al cargar. `Nueva` usa `POST`, `Rebajar` usa `PATCH` y `Eliminar` usa `DELETE`. Después de cada operación vuelve a ejecutar `GET /sneakers`, por lo que la interfaz se resincroniza con PostgreSQL.

## Conceptos

CRUD significa Create, Read, Update y Delete:

- `POST` crea una entidad con `repository.create` y `repository.save`.
- `GET` lee una colección o un registro concreto.
- `PATCH` actualiza parcialmente mediante `repository.merge` y `repository.save`.
- `DELETE` elimina una entidad cargada mediante `repository.remove`.

El campo `stock` viaja desde el JSON de React Native al DTO, al servicio, a la entidad TypeORM y finalmente a la columna PostgreSQL. En la interfaz se deriva el estado visual con `stock === 0 ? 'AGOTADO' : 'Stock ' + stock`.

## Resultado de MODIFÍCALO

La solución base ya realizaba el CRUD. La modificación añade `stock` a la entidad y a los DTO, lo acepta en `POST` y `PATCH`, lo devuelve en `GET` y representa `stock: 0` como `AGOTADO` sin almacenar esa etiqueta.

## Checkpoints

- [x] Base de datos `databridge_e07` documentada.
- [x] CRUD completo en `/sneakers`.
- [x] Entidad y DTOs incluyen `stock`.
- [x] Seed inicial sin duplicados.
- [x] `stock > 0` muestra unidades.
- [x] `stock === 0` muestra `AGOTADO`.
- [x] La interfaz se resincroniza después de POST, PATCH y DELETE.
- [x] 404 para ids inexistentes y 400 para ids no numéricos.
- [x] No se incluyen `node_modules`, `.env` ni credenciales.

## Entrega Git

Desde la raíz del repositorio:

```powershell
git status
git add EJERCICIO-07
git commit -m "Ejercicio 07 - Sneaker Vault"
git push
```

Estos comandos son orientativos y no se ejecutan automáticamente.

