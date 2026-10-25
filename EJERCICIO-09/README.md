# EJERCICIO-09 · Event Radar

Aplicación independiente para practicar filtros opcionales con Query Params, NestJS, TypeORM, PostgreSQL y React Native.

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
CREATE DATABASE databridge_e09;
```

En `backend`, copia `.env.example` como `.env`, configura la contraseña local e instala las dependencias:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run start:dev
```

La API escucha en `http://localhost:3000` y en `0.0.0.0` para aceptar conexiones desde un móvil.

Al iniciar, TypeORM crea la tabla `eventos` y añade los tres eventos iniciales únicamente si está vacía. Reiniciar NestJS no duplica los datos.

## 2. Probar los filtros

Todos los eventos:

```powershell
curl.exe -i http://localhost:3000/eventos
```

Solo por ciudad:

```powershell
curl.exe -i "http://localhost:3000/eventos?ciudad=Zaragoza"
```

Solo por categoría:

```powershell
curl.exe -i "http://localhost:3000/eventos?categoria=Tecnolog%C3%ADa"
```

Combinando ciudad y categoría:

```powershell
curl.exe -i "http://localhost:3000/eventos?ciudad=Zaragoza&categoria=Tecnolog%C3%ADa"
```

El último filtro devuelve únicamente `Tech Meetup`.

## 3. Comprobar PostgreSQL

```powershell
psql -U postgres -d databridge_e09
```

```sql
\dt
SELECT id, nombre, ciudad, categoria, fecha FROM eventos ORDER BY fecha;
\q
```

La consulta SQL muestra todas las filas. El endpoint aplica los filtros en la consulta de TypeORM mediante `repository.find({ where, order })`.

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

La app permite escribir ciudad y categoría. Al pulsar `Filtrar eventos`, genera únicamente los Query Params que tengan contenido. Para consultar sin filtros se vacían ambos campos y se vuelve a pulsar el botón.

## Conceptos

`@Query` lee los parámetros opcionales que aparecen después de `?` en la URL. El servicio crea un `FindOptionsWhere<Evento>` vacío y solo añade `ciudad` o `categoria` cuando llegan valores no vacíos.

El recorrido del dato es:

`TextInput` → URL con Query Params → `@Query` del Controller → objeto `where` del Service → `repository.find` → PostgreSQL → JSON → lista React Native.

Cuando llegan ambos parámetros, TypeORM aplica las dos condiciones conjuntamente, es decir, una condición `AND`. Cuando falta uno, no se añade esa propiedad al filtro y no se restringen los resultados por accidente.

## Resultado de MODIFÍCALO

La solución base filtraba por ciudad. La modificación añade el filtro opcional `categoria`, permite combinarlo con `ciudad` y construye la URL desde los campos editables de React Native.

## Checkpoints

- [x] Base de datos `databridge_e09` documentada.
- [x] `GET /eventos` sin filtros.
- [x] Filtro por ciudad.
- [x] Filtro por categoría.
- [x] Filtro combinado con ambas condiciones.
- [x] Orden ascendente por fecha.
- [x] Estado vacío y mensaje de error en la app.
- [x] Parámetros codificados correctamente en la URL.
- [x] Seed inicial sin duplicados.
- [x] No se incluyen `node_modules`, `.env` ni credenciales.

## Entrega Git

Desde la raíz del repositorio:

```powershell
git status
git add EJERCICIO-09
git commit -m "Ejercicio 09 - Event Radar"
git push
```

Estos comandos son orientativos y no se ejecutan automáticamente.

